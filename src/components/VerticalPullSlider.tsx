import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  Send,
  Download,
  Smartphone,
  Monitor,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
} from 'lucide-react';

interface VerticalPullSliderProps {
  appScale: number;
  onScaleChange: (scale: number) => void;
  onOpenRucSync?: () => void;
  onOpenTelegramModal?: () => void;
  onOpenDownloadApk?: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  lastSyncedAt?: string;
  portalUrl?: string;
}

export const VerticalPullSlider: React.FC<VerticalPullSliderProps> = ({
  appScale,
  onScaleChange,
  onOpenRucSync,
  onOpenTelegramModal,
  onOpenDownloadApk,
  isPhoneFrame,
  onTogglePhoneFrame,
  lastSyncedAt,
  portalUrl = 'https://schedule.ruc.su/?ysclid=mw43l57l8d43423857',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  const handleSync = () => {
    if (onOpenRucSync) {
      setIsSyncing(true);
      onOpenRucSync();
      setTimeout(() => {
        setIsSyncing(false);
        setJustSynced(true);
        setTimeout(() => setJustSynced(false), 2500);
      }, 700);
    }
  };

  return (
    <div className="w-full select-none z-30">
      {/* Draggable Pull Handle (Ползунок вверх / вниз) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-900/95 hover:bg-slate-850 border-t border-slate-800 py-1.5 px-3 flex flex-col items-center justify-center cursor-pointer transition active:scale-99 shadow-md group"
        title={isOpen ? 'Сдвинуть ползунок вниз' : 'Потянуть ползунок вверх'}
      >
        {/* Physical slider handle (язычок ползунка) */}
        <div className="w-12 h-1 bg-slate-600 group-hover:bg-sky-400 group-hover:w-16 rounded-full transition-all duration-200 mb-1" />

        <div className="flex items-center justify-between w-full max-w-md px-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <SlidersHorizontal className="w-3 h-3 text-sky-400" />
            <span>Ползунок панели {isOpen ? '(вниз)' : '(вверх)'}</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="font-mono text-sky-400 font-bold bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
              {appScale}%
            </span>
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" />
            )}
          </div>
        </div>
      </div>

      {/* Sliding Content Drawer (выезжает вверх и уезжает вниз) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-slate-950 border-t border-slate-800 shadow-2xl"
          >
            <div className="p-3.5 space-y-3 max-w-md mx-auto text-xs">
              {/* 1. Вертикальный слайдер масштаба вверх/вниз */}
              <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                    <span>Вертикальный ползунок размера</span>
                  </span>
                  <span className="font-mono text-sky-400 font-bold text-xs bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                    {appScale}%
                  </span>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <span className="text-[10px] text-slate-400">Меньше</span>
                  {/* Range slider */}
                  <div className="flex-1 flex items-center gap-2">
                    <ZoomOut className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="range"
                      min="70"
                      max="115"
                      step="5"
                      value={appScale}
                      onChange={(e) => onScaleChange(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <ZoomIn className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                  <span className="text-[10px] text-slate-400">Больше</span>
                </div>

                {/* Quick preset buttons */}
                <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500">Пресеты:</span>
                  <div className="flex items-center gap-1">
                    {[75, 85, 90, 100, 110].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => onScaleChange(preset)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition ${
                          appScale === preset
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                    <button
                      onClick={() => onScaleChange(90)}
                      className="p-1 rounded text-slate-400 hover:text-white bg-slate-950 border border-slate-800 transition"
                      title="Сбросить на 90%"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Быстрые рабочие ссылки и синхронизации */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Sync RUC schedule */}
                <button
                  onClick={handleSync}
                  className="p-2.5 bg-teal-950/40 hover:bg-teal-950/70 border border-teal-500/30 rounded-xl text-left transition active:scale-95 flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-300 text-[11px]">Синхронизация</span>
                    <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isSyncing ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    {justSynced ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Обновлено!
                      </span>
                    ) : (
                      'schedule.ruc.su'
                    )}
                  </div>
                </button>

                {/* Open schedule.ruc.su portal link */}
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/40 rounded-xl text-left transition active:scale-95 flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-400 text-[11px]">Открыть портал РУК</span>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    schedule.ruc.su ↗
                  </div>
                </a>

                {/* Telegram Bot */}
                <button
                  onClick={onOpenTelegramModal}
                  className="p-2.5 bg-sky-950/40 hover:bg-sky-950/70 border border-sky-500/30 rounded-xl text-left transition active:scale-95 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300 text-[11px]">Telegram-бот</span>
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    @Starosta24_bot
                  </div>
                </button>

                {/* Download APK / Netlify */}
                <button
                  onClick={onOpenDownloadApk}
                  className="p-2.5 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 rounded-xl text-left transition active:scale-95 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 text-[11px]">Скачать / Netlify</span>
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    APK & zip архивы
                  </div>
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-[11px] font-semibold transition"
              >
                Свернуть ползунок вниз ↓
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
