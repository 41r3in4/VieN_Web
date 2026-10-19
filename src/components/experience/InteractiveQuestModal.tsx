'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { DESTINATIONS } from '@/data/destinations';
import { PERSONAS } from '@/data/personas';
import {
  X,
  Sparkles,
  Volume2,
  ScrollText,
  Compass,
  Palette,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';
import confetti from 'canvas-confetti';
import { useModalDialog } from './useModalDialog';

export const InteractiveQuestModal: React.FC = () => {
  const {
    activeQuest,
    closeQuest,
    selectedPersona,
    completeCheckpoint,
    recordListening
  } = useHeritage();

  // Step state: 1 = Story Chapter, 2 = Physical Riddle, 3 = Heritage Quiz
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Audio guide state
  const [isPlayingAudioGuide, setIsPlayingAudioGuide] = useState<boolean>(false);
  const [audioError, setAudioError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const speech = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => () => {
    if (speech.current) {
      speech.current.onend = null;
      speech.current.onerror = null;
      window.speechSynthesis?.cancel();
    }
  }, []);

  // Riddle state
  const [selectedRiddleOption, setSelectedRiddleOption] = useState<string | null>(null);
  const [isRiddleSubmitted, setIsRiddleSubmitted] = useState<boolean>(false);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number>(0);

  const dialog = useModalDialog(!!activeQuest, closeQuest, 'Thử thách di sản');
  if (!activeQuest) return null;

  const destination = DESTINATIONS.find((d) => d.id === activeQuest.destinationId);
  const checkpoint = destination?.checkpoints.find((c) => c.id === activeQuest.checkpointId);

  if (!destination || !checkpoint) return null;

  const persona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];
  const personaClue = checkpoint.personaClues[selectedPersona] || checkpoint.personaClues.historian;
  const riddle = checkpoint.riddle;
  const quizzes = checkpoint.quizzes;

  const handleToggleAudioGuide = () => {
    heritageAudio.playClick();
    setAudioError('');
    if (!('speechSynthesis' in window)) { setAudioError('Trình duyệt chưa hỗ trợ đọc thuyết minh.'); return; }
    if (isPlayingAudioGuide) {
      if (speech.current) speech.current.onend = null;
      window.speechSynthesis.cancel();
      setIsPlayingAudioGuide(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(checkpoint.audioGuideText);
    utterance.lang = 'vi-VN';
    utterance.rate = .95;
    utterance.onend = () => { setIsPlayingAudioGuide(false); recordListening(checkpoint.id); };
    utterance.onerror = () => { setIsPlayingAudioGuide(false); setAudioError('Chưa phát được thuyết minh. Vui lòng thử lại.'); };
    speech.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudioGuide(true);
  };

  const handleSelectRiddle = (optionId: string) => {
    if (isRiddleSubmitted) return;
    heritageAudio.playClick();
    setSelectedRiddleOption(optionId);
  };

  const handleSubmitRiddle = () => {
    if (!selectedRiddleOption) return;
    setIsRiddleSubmitted(true);
    const chosen = riddle.options.find((o) => o.id === selectedRiddleOption);
    if (chosen?.isCorrect) {
      heritageAudio.playSuccessChime();
    }
  };

  const handleSelectQuizAnswer = (optionIdx: number) => {
    if (selectedQuizAnswers[currentQuizIndex] !== undefined) return;
    heritageAudio.playClick();

    const isCorrect = optionIdx === quizzes[currentQuizIndex].correctIndex;
    setSelectedQuizAnswers((prev) => ({ ...prev, [currentQuizIndex]: optionIdx }));

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      heritageAudio.playSuccessChime();
    }
  };

  const handleNextQuizOrFinish = async () => {
    if (saving) return;
    heritageAudio.playClick();
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setSaving(true);
      setSaveError('');
      const saved = await completeCheckpoint(
        destination.id,
        checkpoint.id,
        quizzes.map((_, index) => selectedQuizAnswers[index]),
        selectedRiddleOption ?? '',
        `Đã hoàn thành trạm "${checkpoint.name}" với vai ${persona.title}.`
      );
      setSaving(false);
      if (!saved) { setSaveError('Chưa lưu được kết quả. Kiểm tra kết nối rồi bấm hoàn thành để thử lại.'); return; }
      // Finished all quizzes! Trigger celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      closeQuest();
    }
  };

  const getPersonaIcon = () => {
    switch (selectedPersona) {
      case 'historian':
        return <ScrollText className="w-5 h-5 text-[#C83C23]" />;
      case 'explorer':
        return <Compass className="w-5 h-5 text-[#1E4D3B]" />;
      case 'artisan':
        return <Palette className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  return (
    <div {...dialog} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      {(audioError || saveError || saving) && <div className="quest-save-status" role="status">{saving ? 'Đang lưu kết quả…' : saveError || audioError}</div>}
      <div className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-[#D4AF37]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-3.5 bg-[#1A1615] text-[#FAF7F2] flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#C83C23] text-white text-[10px] font-bold uppercase">
              Trạm {checkpoint.order}/{destination.totalCheckpoints}
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-stone-100 line-clamp-1">
                {checkpoint.name}
              </h2>
              <span className="text-[10px] text-stone-400">{destination.name}</span>
            </div>
          </div>

          <button
            onClick={closeQuest}
            type="button" aria-label="Đóng thử thách" data-dialog-close
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-3 bg-stone-100 border-b border-stone-200 text-center text-xs font-semibold py-2 px-3">
          <div
            className={`flex items-center justify-center gap-1.5 ${
              currentStep === 1
                ? 'text-[#C83C23] font-bold border-b-2 border-[#C83C23] pb-1'
                : 'text-stone-400'
            }`}
          >
            <span>1. Khảo Sát</span>
          </div>
          <div
            className={`flex items-center justify-center gap-1.5 ${
              currentStep === 2
                ? 'text-[#C83C23] font-bold border-b-2 border-[#C83C23] pb-1'
                : 'text-stone-400'
            }`}
          >
            <span>2. Câu Đố</span>
          </div>
          <div
            className={`flex items-center justify-center gap-1.5 ${
              currentStep === 3
                ? 'text-[#C83C23] font-bold border-b-2 border-[#C83C23] pb-1'
                : 'text-stone-400'
            }`}
          >
            <span>3. Trắc Nghiệm</span>
          </div>
        </div>

        {/* Scrollable Step Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: VISUAL STORYTELLING CHAPTER */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Checkpoint Hero Banner */}
              <div className="relative h-44 rounded-2xl overflow-hidden shadow-md border border-stone-200">
                <img
                  src={checkpoint.historicalImage}
                  alt={checkpoint.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37] text-stone-900 font-bold uppercase tracking-wider">
                    {checkpoint.culturalEra}
                  </span>
                  <h3 className="font-serif text-base font-bold mt-1 text-[#FAF7F2]">
                    {checkpoint.name}
                  </h3>
                </div>
              </div>

              {/* Audio Guide Player Simulation */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleToggleAudioGuide}
                    className={`p-2.5 rounded-full transition ${
                      isPlayingAudioGuide
                        ? 'bg-[#C83C23] text-white animate-pulse'
                        : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      Nghe thuyết minh
                    </span>
                    <span className="text-[11px] text-amber-800">
                      {isPlayingAudioGuide ? 'Đang phát lời giảng di tích...' : 'Bấm để nghe thuyết minh'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-900">Nghe hết để ghi nhận</span>
              </div>

              {isPlayingAudioGuide && (
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs italic text-stone-700 leading-relaxed shadow-inner">
                  &ldquo;{checkpoint.audioGuideText}&rdquo;
                </div>
              )}

              {/* Illustrated Story Snippets */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#1A1615]">
                  Bối Cảnh Lịch Sử & Huyền Tích
                </h4>
                {checkpoint.storySnippet.map((paragraph, idx) => (
                  <p key={idx} className="text-xs text-stone-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Roleplay Persona Custom Clue Card */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-[#C83C23]/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                      {getPersonaIcon()}
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#C83C23]">
                        Góc Nhìn: {persona.title}
                      </span>
                      <h5 className="font-bold text-xs text-stone-900">
                        {personaClue.taskTitle}
                      </h5>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-700">
                  <span className="font-semibold text-stone-900">Manh mối chuyên biệt: </span>
                  {personaClue.clue}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-600 bg-amber-50/80 p-2 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Kích hoạt: <strong className="text-[#C83C23]">{persona.toolName}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PHYSICAL CHECKPOINT RIDDLE */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37] shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C83C23] mb-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>Câu Đố Khảo Sát Thực Địa</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1A1615] leading-snug">
                  {riddle.prompt}
                </h4>
                <p className="text-xs text-stone-600 italic mt-1">
                  {riddle.personaHint}
                </p>
              </div>

              {/* Riddle Options */}
              <div className="space-y-2">
                {riddle.options.map((opt) => {
                  const isSelected = selectedRiddleOption === opt.id;
                  let optStyle = 'border-stone-200 bg-white hover:border-stone-300';

                  if (isRiddleSubmitted) {
                    if (opt.isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200';
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'border-red-400 bg-red-50';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-[#C83C23] bg-orange-50/60 ring-2 ring-[#C83C23]/20';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectRiddle(opt.id)}
                      className={`p-3 rounded-2xl border-2 transition cursor-pointer ${optStyle}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-stone-800">
                          {opt.text}
                        </span>
                        {isRiddleSubmitted && opt.isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isRiddleSubmitted && isSelected && !opt.isCorrect && (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                      </div>

                      {isRiddleSubmitted && isSelected && (
                        <p className={`text-[11px] mt-2 pt-2 border-t ${opt.isCorrect ? 'text-emerald-700 border-emerald-200' : 'text-red-600 border-red-200'}`}>
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {!isRiddleSubmitted && (
                <button
                  disabled={!selectedRiddleOption}
                  onClick={handleSubmitRiddle}
                  className="w-full py-2.5 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  Xác Nhận Lời Giải
                </button>
              )}
            </div>
          )}

          {/* STEP 3: HERITAGE QUIZ (3-4 QUESTIONS) */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-bold text-[#C83C23]">
                  Câu hỏi {currentQuizIndex + 1}/{quizzes.length}
                </span>
                <span className="flex items-center gap-1 font-mono text-emerald-700 font-bold">
                  <Award className="w-3.5 h-3.5" />
                  Điểm: {quizScore}/{quizzes.length}
                </span>
              </div>

              {/* Quiz Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#1A1615] leading-snug">
                  {quizzes[currentQuizIndex].question}
                </h4>

                {/* Options */}
                <div className="space-y-2">
                  {quizzes[currentQuizIndex].options.map((optText, idx) => {
                    const answered = selectedQuizAnswers[currentQuizIndex] !== undefined;
                    const isSelected = selectedQuizAnswers[currentQuizIndex] === idx;
                    const isCorrect = idx === quizzes[currentQuizIndex].correctIndex;

                    let btnStyle = 'border-stone-200 bg-stone-50 hover:bg-stone-100';

                    if (answered) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'border-red-400 bg-red-50 text-red-900';
                      } else {
                        btnStyle = 'border-stone-200 bg-stone-50 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={answered}
                        onClick={() => handleSelectQuizAnswer(idx)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{optText}</span>
                        {answered && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {answered && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback & "Bạn có biết?" Insight */}
                {selectedQuizAnswers[currentQuizIndex] !== undefined && (
                  <div className="space-y-2 pt-2 border-t border-stone-100 animate-in fade-in">
                    <div className="text-xs text-stone-700">
                      <strong className="text-[#C83C23]">Giải thích: </strong>
                      {quizzes[currentQuizIndex].explanation}
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900">
                      <div className="flex items-center gap-1 font-bold text-amber-800 mb-0.5">
                        <Flame className="w-3.5 h-3.5 text-amber-600" />
                        <span>Bạn Có Biết? (Góc Nhìn Văn Hóa)</span>
                      </div>
                      <p>{quizzes[currentQuizIndex].culturalInsight}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
            <span>+{checkpoint.expReward} EXP</span>
          </div>

          <div className="flex items-center gap-2">
            {currentStep === 1 && (
              <button
                onClick={() => {
                  heritageAudio.playClick();
                  setCurrentStep(2);
                }}
                className="flex items-center gap-1.5 py-2.5 px-5 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white font-bold text-xs shadow-md transition"
              >
                <span>Vào Thử Thách Câu Đố</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 2 && isRiddleSubmitted && (
              <button
                onClick={() => {
                  heritageAudio.playClick();
                  setCurrentStep(3);
                }}
                className="flex items-center gap-1.5 py-2.5 px-5 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white font-bold text-xs shadow-md transition"
              >
                <span>Làm Bài Trắc Nghiệm Di Sản</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 3 && selectedQuizAnswers[currentQuizIndex] !== undefined && (
              <button
                onClick={handleNextQuizOrFinish}
                disabled={saving}
                className="flex items-center gap-1.5 py-2.5 px-5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
              >
                <span>
                  {currentQuizIndex < quizzes.length - 1 ? 'Câu Tiếp Theo' : 'Mở Khóa Huy Hiệu & Lưu Mạch Sử'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
