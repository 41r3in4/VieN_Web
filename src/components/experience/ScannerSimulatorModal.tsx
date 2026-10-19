'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { DESTINATIONS } from '@/data/destinations';
import { X, QrCode, Radio, Zap, CheckCircle, Sparkles, MapPin } from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';
import { useModalDialog } from './useModalDialog';

export const ScannerSimulatorModal: React.FC = () => {
  const {
    isScannerOpen,
    setIsScannerOpen,
    startQuest,
    selectedDestinationId
  } = useHeritage();

  const [scanMode, setScanMode] = useState<'qr' | 'nfc'>('qr');
  const [flashlight, setFlashlight] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedName, setScannedName] = useState<string | null>(null);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const dialog = useModalDialog(isScannerOpen, () => setIsScannerOpen(false), 'Quét mã di sản');
  if (!isScannerOpen) return null;

  // Gather available checkpoints from selected destination or all destinations
  const destinationsToPick = selectedDestinationId
    ? DESTINATIONS.filter((d) => d.id === selectedDestinationId)
    : DESTINATIONS;

  const handleSimulatedScan = (destId: string, cpId: string, cpName: string) => {
    if (isScanning || timer.current) return;
    setIsScanning(true);
    setScannedName(cpName);
    heritageAudio.playScanSuccess();

    timer.current = setTimeout(() => {
      timer.current = null;
      heritageAudio.playSuccessChime();
      setIsScanning(false);
      setIsScannerOpen(false);
      setScannedName(null);
      startQuest(destId, cpId);
    }, 1200);
  };

  return (
    <div {...dialog} className="fixed inset-0 z-50 bg-[#1A1615] flex flex-col justify-between text-white animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between bg-black/60 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#C83C23] text-white">
            {scanMode === 'qr' ? <QrCode className="w-4 h-4" /> : <Radio className="w-4 h-4 animate-pulse" />}
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">
              {scanMode === 'qr' ? 'Máy Quét Quang Học QR Cổ' : 'Bộ Đọc Chip Cảm Ứng Di Sản (NFC)'}
            </h2>
            <p className="text-[10px] text-stone-400">
              Căn chỉnh tâm ngắm hoặc áp sát điểm chạm trạm di tích
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsScannerOpen(false)}
          type="button" aria-label="Đóng máy quét" data-dialog-close
          className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Viewfinder / NFC Beacon */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
        {scanMode === 'qr' ? (
          /* QR Camera Viewfinder */
          <div className="relative w-64 h-64 border-2 border-dashed border-[#D4AF37]/70 rounded-3xl flex items-center justify-center overflow-hidden bg-black/40 shadow-[0_0_50px_rgba(200,60,35,0.2)]">
            {/* Viewfinder corner brackets */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#C83C23] rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#C83C23] rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#C83C23] rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#C83C23] rounded-br-lg" />

            {/* Scanning Laser Line */}
            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#C83C23] to-transparent shadow-[0_0_12px_#C83C23] animate-[bounce_2s_infinite]" />

            {/* Flashlight simulated glow */}
            {flashlight && (
              <div className="absolute inset-0 bg-white/20 pointer-events-none" />
            )}

            {isScanning ? (
              <div className="flex flex-col items-center gap-2 text-center p-3 z-10 bg-black/80 rounded-2xl border border-emerald-500">
                <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
                <span className="text-xs font-bold text-emerald-300">Đã nhận diện trạm!</span>
                <span className="text-[11px] text-stone-300 line-clamp-1">{scannedName}</span>
              </div>
            ) : (
              <div className="text-center p-4 text-xs text-stone-400 select-none">
                <QrCode className="w-10 h-10 mx-auto mb-2 text-stone-500 opacity-60" />
                <span>Hướng camera vào mã QR gắn trên bia đá, cột đình hoặc vách hang</span>
              </div>
            )}
          </div>
        ) : (
          /* NFC Tap Beacon */
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-stone-900/60 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              {/* Ripple circles */}
              <div className="absolute inset-0 rounded-full border border-[#D4AF37]/40 animate-ping opacity-40" />
              <div className="absolute -inset-6 rounded-full border border-[#C83C23]/30 animate-pulse" />

              <div className="flex flex-col items-center text-center p-4">
                <Radio className="w-12 h-12 text-[#D4AF37] mb-2 animate-bounce" />
                <span className="text-xs font-bold text-[#FAF7F2]">Chạm Thiết Bị</span>
                <span className="text-[10px] text-stone-400 mt-1">Cách biển đồng NFC 2-4cm</span>
              </div>
            </div>

            {isScanning && (
              <div className="mt-4 px-4 py-2 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Đang truyền nhận dữ liệu văn bia...</span>
              </div>
            )}
          </div>
        )}

        {/* Viewfinder Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => setScanMode(scanMode === 'qr' ? 'nfc' : 'qr')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition"
          >
            {scanMode === 'qr' ? <Radio className="w-3.5 h-3.5" /> : <QrCode className="w-3.5 h-3.5" />}
            <span>Đổi sang {scanMode === 'qr' ? 'Chạm NFC' : 'Quét QR'}</span>
          </button>

          <button
            onClick={() => setFlashlight(!flashlight)}
            className={`p-2 rounded-full border transition ${
              flashlight
                ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_#f59e0b]'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
            title="Đèn pin"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Checkpoint Simulation Stations (Click to simulate scanning at that location) */}
      <div className="p-4 bg-stone-900 border-t border-stone-800 max-h-56 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Mô phỏng trạm thực địa (Bấm để kích hoạt quét):</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {destinationsToPick.map((dest) => (
            <div key={dest.id} className="space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                {dest.name}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {dest.checkpoints.map((cp) => (
                  <button
                    key={cp.id}
                    disabled={isScanning}
                    onClick={() => handleSimulatedScan(dest.id, cp.id, cp.name)}
                    className="flex items-center justify-between p-2 rounded-xl bg-stone-800/80 hover:bg-[#C83C23]/30 hover:border-[#C83C23] border border-stone-700 text-left transition disabled:opacity-50"
                  >
                    <div className="pr-2">
                      <div className="text-xs font-semibold text-stone-200 line-clamp-1">
                        Trạm {cp.order}: {cp.name}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {scanMode === 'qr' ? cp.qrCode : cp.nfcCode}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#C83C23] text-white shrink-0 font-bold">
                      Quét
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
