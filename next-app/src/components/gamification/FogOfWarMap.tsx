'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { DESTINATIONS } from '@/data/destinations';
import { Checkpoint } from '@/types';
import { MapPin, Sparkles, QrCode, CheckCircle2, Lock, Eye } from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';

export const FogOfWarMap: React.FC = () => {
  const {
    completedCheckpointIds,
    startQuest,
    setIsScannerOpen,
    setSelectedDestinationId
  } = useHeritage();

  const [activePin, setActivePin] = useState<{
    destId: string;
    checkpoint: Checkpoint;
  } | null>(null);

  // Flatten checkpoints from all destinations
  const allPins = DESTINATIONS.flatMap((dest) =>
    dest.checkpoints.map((cp) => ({
      destId: dest.id,
      destName: dest.name,
      checkpoint: cp
    }))
  );

  const totalPoints = allPins.length;
  const discoveredPoints = allPins.filter((p) =>
    completedCheckpointIds.includes(p.checkpoint.id)
  ).length;
  const fogClearPercentage = Math.round((discoveredPoints / totalPoints) * 100);

  const handlePinClick = (destId: string, cp: Checkpoint) => {
    heritageAudio.playClick();
    setActivePin({ destId, checkpoint: cp });
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-xl bg-stone-900">
      {/* Map Header Status */}
      <div className="p-3 bg-gradient-to-r from-[#1A1615] to-stone-900 text-white flex items-center justify-between border-b border-stone-800 z-20 relative">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-stone-200">
            Bản Đồ Sương Mù Di Sản (Fog of War)
          </span>
        </div>
        <div className="text-[11px] font-mono font-bold text-[#D4AF37]">
          Hé lộ: {fogClearPercentage}%
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden select-none bg-[#231F1D]">
        {/* Stylized Antique Heritage Map Vector Backdrop */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
          preserveAspectRatio="none"
        >
          {/* River Han curve */}
          <path
            d="M 20,0 Q 30,30 25,60 T 35,100"
            fill="none"
            stroke="#1E3A5F"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Coastline */}
          <path
            d="M 60,0 Q 75,40 70,80 T 85,100"
            fill="none"
            stroke="#2B4C6F"
            strokeWidth="12"
          />
          {/* Mountain contours */}
          <circle cx="70" cy="50" r="14" fill="#3A332C" opacity="0.5" />
          <circle cx="75" cy="55" r="9" fill="#4A4238" opacity="0.7" />
          <circle cx="30" cy="40" r="10" fill="#3D352E" opacity="0.4" />
        </svg>

        {/* Dynamic Fog of War Mist Layers */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background:
              fogClearPercentage >= 100
                ? 'transparent'
                : `radial-gradient(circle at 30% 40%, transparent 20%, rgba(26,22,21,${0.9 - fogClearPercentage * 0.006}) 70%)`
          }}
        />

        {/* Floating clouds / fog patches */}
        {fogClearPercentage < 90 && (
          <>
            <div className="absolute top-4 right-10 w-36 h-24 bg-stone-800/70 rounded-full blur-2xl fog-cloud pointer-events-none" />
            <div className="absolute bottom-6 left-12 w-44 h-28 bg-stone-800/80 rounded-full blur-2xl fog-cloud pointer-events-none" />
          </>
        )}

        {/* Checkpoint Pins */}
        {allPins.map(({ destId, destName, checkpoint }) => {
          const isDone = completedCheckpointIds.includes(checkpoint.id);
          const isSelected = activePin?.checkpoint.id === checkpoint.id;

          return (
            <div
              key={checkpoint.id}
              onClick={() => handlePinClick(destId, checkpoint)}
              style={{
                top: `${checkpoint.coords.y}%`,
                left: `${checkpoint.coords.x}%`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30 transition-transform duration-200 hover:scale-125"
            >
              {/* Outer Ring Animation */}
              {isDone ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 ring-2 ring-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              ) : (
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-[#C83C23] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#D4AF37] shadow-lg animate-bounce">
                    {checkpoint.order}
                  </div>
                  <div className="absolute -inset-1 rounded-full border border-amber-400/40 animate-ping" />
                </div>
              )}

              {/* Pin tooltip label */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-0.5 rounded bg-black/85 text-white text-[9px] font-semibold whitespace-nowrap pointer-events-none border border-stone-700 shadow-md transition ${
                  isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {checkpoint.name.slice(0, 18)}...
              </div>
            </div>
          );
        })}

        {/* Map Legend */}
        <div className="absolute bottom-2 left-2 z-20 p-2 rounded-xl bg-black/75 backdrop-blur-md border border-stone-800 text-[10px] text-stone-300 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Đã mở khóa & giải mã</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C83C23] inline-block" />
            <span>Trạm sẵn sàng quét QR</span>
          </div>
        </div>

        {/* Quick QR Scan Launcher inside Map */}
        <button
          onClick={() => setIsScannerOpen(true)}
          className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C83C23] text-white text-xs font-bold shadow-lg hover:bg-[#a62f1a] transition"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Quét Trạm Nhanh</span>
        </button>
      </div>

      {/* Selected Pin Bottom Drawer Preview */}
      {activePin && (
        <div className="p-3.5 bg-stone-900 border-t border-stone-800 text-white flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <div className="pr-2">
            <div className="flex items-center gap-1.5 text-[11px] text-[#D4AF37] font-semibold">
              <MapPin className="w-3 h-3 text-[#C83C23]" />
              <span>
                {DESTINATIONS.find((d) => d.id === activePin.destId)?.name}
              </span>
            </div>
            <h4 className="text-xs font-bold text-stone-100 line-clamp-1 mt-0.5">
              {activePin.checkpoint.name}
            </h4>
            <p className="text-[10px] text-stone-400 line-clamp-1">
              +{activePin.checkpoint.expReward} EXP · {activePin.checkpoint.culturalEra}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedDestinationId(activePin.destId)}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              title="Xem di tích"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => startQuest(activePin.destId, activePin.checkpoint.id)}
              className="py-1.5 px-3.5 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white text-xs font-bold shadow transition"
            >
              {completedCheckpointIds.includes(activePin.checkpoint.id)
                ? 'Khảo sát lại'
                : 'Tiến Vào Trạm'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
