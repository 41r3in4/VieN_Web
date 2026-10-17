'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import {
  X,
  Send,
  Heart,
  Image as ImageIcon,
  Sparkles,
  Check
} from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';

const SAMPLE_EXPEDITION_PHOTOS = [
  {
    title: 'Cổng Tam Quan',
    url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Động Huyền Không',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Tháp Xá Lợi',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80'
  }
];

export const LiveChatModal: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatMessages, sendChatMessage, likeChatMessage } = useHeritage();
  const [inputText, setInputText] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showPhotoPicker, setShowPhotoPicker] = useState<boolean>(false);

  if (!isChatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedPhoto) return;

    sendChatMessage(inputText.trim(), selectedPhoto || undefined);
    setInputText('');
    setSelectedPhoto(null);
    setShowPhotoPicker(false);
  };

  const handleSelectPhoto = (url: string) => {
    heritageAudio.playClick();
    setSelectedPhoto(selectedPhoto === url ? null : url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl border border-[#D4AF37]/50 shadow-2xl flex flex-col h-[85vh] sm:h-[720px] overflow-hidden">
        {/* Header */}
        <div className="p-3.5 bg-[#1A1615] text-[#FAF7F2] flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="font-serif font-bold text-sm text-stone-100">
                Cộng Đồng Du Khách Di Sản
              </h3>
              <p className="text-[10px] text-stone-400">
                28 thành viên đang trực tuyến tại Đà Nẵng
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF7F2]">
          <div className="text-center">
            <span className="text-[10px] text-stone-500 bg-stone-200/70 px-3 py-1 rounded-full font-medium">
              Hôm nay · Kênh chia sẻ kinh nghiệm & ảnh thực địa
            </span>
          </div>

          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.isSelf ? 'flex-row-reverse' : ''}`}
            >
              <img
                src={msg.avatar}
                alt={msg.sender}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-300 shrink-0 mt-0.5"
              />

              <div className={`max-w-[80%] ${msg.isSelf ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[11px] font-bold text-stone-900">
                    {msg.sender}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-medium">
                    {msg.role}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.isSelf
                      ? 'bg-[#C83C23] text-white rounded-tr-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                  }`}
                >
                  {msg.text && <p>{msg.text}</p>}

                  {msg.photoUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-black/10">
                      <img
                        src={msg.photoUrl}
                        alt="Check-in di tích"
                        className="w-full max-h-40 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Bottom message meta & like */}
                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-stone-400">
                  <span>{msg.timestamp}</span>
                  <button
                    onClick={() => likeChatMessage(msg.id)}
                    className={`flex items-center gap-1 transition ${
                      msg.hasLiked ? 'text-red-500 font-bold' : 'hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${msg.hasLiked ? 'fill-red-500' : ''}`} />
                    <span>{msg.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Picker Simulator Tray */}
        {showPhotoPicker && (
          <div className="p-3 bg-stone-100 border-t border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Đính kèm ảnh khảo sát thực địa:</span>
              <button
                onClick={() => setShowPhotoPicker(false)}
                className="text-[11px] text-stone-400 hover:text-stone-700"
              >
                Đóng
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_EXPEDITION_PHOTOS.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectPhoto(photo.url)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition h-16 ${
                    selectedPhoto === photo.url
                      ? 'border-[#C83C23] ring-2 ring-[#C83C23]/30'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center">
                    <span className="text-[10px] text-white font-medium leading-none">
                      {photo.title}
                    </span>
                  </div>
                  {selectedPhoto === photo.url && (
                    <div className="absolute top-1 right-1 p-0.5 rounded-full bg-[#C83C23] text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setShowPhotoPicker(!showPhotoPicker)}
            className={`p-2 rounded-full border transition ${
              selectedPhoto
                ? 'bg-[#C83C23] text-white border-[#C83C23]'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-200'
            }`}
            title="Đính kèm ảnh check-in"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={selectedPhoto ? 'Nhập ghi chú cho ảnh...' : 'Nhập tin nhắn thảo luận di tích...'}
            className="flex-1 py-2 px-3.5 rounded-full bg-stone-100 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C83C23]/30"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !selectedPhoto}
            className="p-2 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white transition disabled:opacity-40 disabled:hover:bg-[#C83C23]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
