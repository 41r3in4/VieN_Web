'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { DESTINATIONS } from '@/data/destinations';
import { FogOfWarMap } from '@/components/gamification/FogOfWarMap';
import {
  Search,
  Filter,
  QrCode,
  MapPin,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  MountainSnow
} from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';

export const ExploreView: React.FC = () => {
  const {
    setSelectedDestinationId,
    setIsScannerOpen,
    startQuest,
    completedCheckpointIds,
    getDestinationProgress
  } = useHeritage();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredDestinations = DESTINATIONS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.era.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'temple') return matchesSearch && d.id.includes('hai-chau');
    if (selectedFilter === 'cave') return matchesSearch && d.id.includes('ngu-hanh');
    return matchesSearch;
  });

  return (
    <div className="space-y-4 p-3.5 pb-24 parchment-texture">
      {/* Search & Scan Action Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm di tích, văn bia, hang động..."
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white border border-stone-200 text-xs text-stone-900 placeholder-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C83C23]/30"
          />
        </div>

        <button
          onClick={() => {
            heritageAudio.playClick();
            setIsScannerOpen(true);
          }}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white text-xs font-bold shadow-md transition"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">Quét QR/NFC</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'Tất cả di tích' },
          { id: 'temple', label: 'Đình làng & Sắc phong' },
          { id: 'cave', label: 'Danh thắng & Hang động' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              heritageAudio.playClick();
              setSelectedFilter(f.id);
            }}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition font-medium ${
              selectedFilter === f.id
                ? 'bg-[#1A1615] text-[#FAF7F2] font-bold shadow'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* FOG OF WAR INTERACTIVE MAP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-[#1A1615]">
            Bản Đồ Di Tích Sương Mù
          </h3>
          <span className="text-[11px] text-stone-500">
            Khảo sát thực địa để xua tan sương mù
          </span>
        </div>
        <FogOfWarMap />
      </div>

      {/* DESTINATION SELECTION & CHECKPOINT ACCORDIONS */}
      <div className="space-y-3 pt-2">
        <h3 className="font-serif font-bold text-sm text-[#1A1615]">
          Danh Sách Trạm Thám Hiểm
        </h3>

        {filteredDestinations.map((dest) => {
          const { completedCount, totalCount, percentage, isFullyCompleted } =
            getDestinationProgress(dest.id);

          return (
            <div
              key={dest.id}
              className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden"
            >
              {/* Destination Header Banner */}
              <div className="p-3.5 bg-gradient-to-r from-stone-50 to-amber-50/40 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0">
                    <img src={dest.coverImage} alt={dest.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900">
                      {dest.name}
                    </h4>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C83C23]" />
                      {dest.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    heritageAudio.playClick();
                    setSelectedDestinationId(dest.id);
                  }}
                  className="text-xs font-bold text-[#C83C23] hover:underline px-2.5 py-1 rounded-full bg-white border border-stone-200 shadow-sm"
                >
                  Chi tiết
                </button>
              </div>

              {/* Progress bar inside card */}
              <div className="px-3.5 pt-2 flex items-center justify-between text-[11px] font-semibold text-stone-600">
                <span>Hoàn thành: {completedCount}/{totalCount} trạm</span>
                <span className={isFullyCompleted ? 'text-emerald-700' : 'text-[#C83C23]'}>
                  {percentage}%
                </span>
              </div>
              <div className="mx-3.5 h-1 bg-stone-100 rounded-full overflow-hidden mt-1 mb-2">
                <div
                  className="h-full bg-gradient-to-r from-[#C83C23] to-[#D4AF37]"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Checkpoints List */}
              <div className="p-3.5 pt-0 space-y-2">
                {dest.checkpoints.map((cp) => {
                  const isDone = completedCheckpointIds.includes(cp.id);

                  return (
                    <div
                      key={cp.id}
                      className={`p-2.5 rounded-2xl border transition flex items-center justify-between gap-2.5 ${
                        isDone
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-stone-50/70 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : cp.order}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-stone-800 line-clamp-1">
                            {cp.name}
                          </h5>
                          <p className="text-[10px] text-stone-500 line-clamp-1">
                            +{cp.expReward} EXP · {cp.culturalEra}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => startQuest(dest.id, cp.id)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full transition shrink-0 ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-[#C83C23] text-white hover:bg-[#a62f1a]'
                        }`}
                      >
                        {isDone ? 'Làm lại' : 'Vào trạm'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
