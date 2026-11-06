import React, { useState, useEffect } from 'react';
import {
  Wifi,
  BatteryMedium,
  Signal,
  Sparkles,
  Smartphone,
  Download,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RefreshCw,
  Send,
} from 'lucide-react';

interface AndroidStatusBarProps {
  groupCode: string;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenDownloadApk?: () => void;
  onOpenRucSync?: () => void;
  onOpenTelegramModal?: () => void;
  onOpenAI: () => void;
  appScale?: number;
  onScaleChange?: (scale: number) => void;
  lastSyncedAt?: string;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  groupCode,
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenDownloadApk,
  onOpenRucSync,
  onOpenTelegramModal,
  onOpenAI,
  appScale = 90,
  onScaleChange,
  lastSyncedAt,
}) => {
  const [time, setTime] = useState('12:00');
  const [isScaleSliderOpen, setIsScaleSliderOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFastSync = () => {
    if (onOpenRucSync) {
      setIsSyncing(true);
      onOpenRucSync();
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 transition-all select-none">
      {/* Top Android System Status Bar */}
      <div className="px-4 pt-2 pb-1 flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300 font-semibold tracking-wide">
          <span>{time}</span>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] text-sky-400 bg-sky-950/80 px-1.5 py-0.2 rounded border border-sky-800/40">
            РУК Краснодар 2026
          </span>
        </div>

        {/* Center notch / hole punch simulator when in phone frame */}
        {isPhoneFrame && (
          <div className="hidden sm:flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-black rounded-full ring-1 ring-slate-800" />
          </div>
        )}

        {/* System Icons */}
        <div className="flex items-center gap-2 text-slate-300">
          <button
            onClick={onTogglePhoneFrame}
            title={isPhoneFrame ? 'Переключить в полный экран' : 'Включить рамку Android-смартфона'}
            className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-400 transition mr-2 bg-slate-800 px-2 py-0.5 rounded-md"
          >
            <Smartphone className="w-3 h-3" />
            <span>{isPhoneFrame ? 'Рамка' : 'Полный'}</span>
          </button>
          <Signal className="w-3.5 h-3.5 text-slate-400" />
          <Wifi className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-slate-400">100%</span>
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Clean App Header Bar with Group Info and Working Action Buttons */}
      <div className="px-3.5 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center shadow-md shadow-sky-500/20 text-white font-extrabold text-xs tracking-tight shrink-0">
            24
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-extrabold text-white tracking-tight leading-tight">
                Староста 24
              </h1>
              <span className="text-[10px] font-bold text-sky-400 bg-sky-950/70 px-1.5 py-0.2 rounded border border-sky-800/50 truncate">
                {groupCode}
              </span>
            </div>
            <div className="text-[9px] text-slate-400 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">schedule.ruc.su онлайн</span>
            </div>
          </div>
        </div>

        {/* Clean Action Buttons: Sync + Telegram + Scale Slider + APK + AI */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Working RUC schedule sync button */}
          {onOpenRucSync && (
            <button
              onClick={handleFastSync}
              className="flex items-center gap-1 py-1.5 px-2 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-300 hover:text-white text-xs font-bold transition active:scale-95"
              title="Синхронизация расписания с schedule.ruc.su"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline text-[11px]">Синхр</span>
            </button>
          )}

          {/* Telegram bot button */}
          {onOpenTelegramModal && (
            <button
              onClick={onOpenTelegramModal}
              className="flex items-center gap-1 py-1.5 px-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 hover:text-white text-xs font-bold transition active:scale-95"
              title="Telegram-бот старостата"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xs:inline text-[11px]">ТГ</span>
            </button>
          )}

          {/* Scale Slider button */}
          {onScaleChange && (
            <button
              onClick={() => setIsScaleSliderOpen(!isScaleSliderOpen)}
              className={`flex items-center gap-1 py-1.5 px-2 rounded-xl border text-xs font-bold transition active:scale-95 ${
                isScaleSliderOpen
                  ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-sky-400 border-slate-700/80'
              }`}
              title="Ползунок масштаба"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px]">{appScale}%</span>
            </button>
          )}

          {/* Download APK button */}
          {onOpenDownloadApk && (
            <button
              onClick={onOpenDownloadApk}
              className="flex items-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition active:scale-95"
              title="Скачать APK / Netlify"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">APK</span>
            </button>
          )}

          {/* AI Helper button */}
          <button
            onClick={onOpenAI}
            className="p-1.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-200 hover:text-white text-xs font-semibold shadow-sm transition active:scale-95"
            title="ИИ-помощник старосты"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          </button>
        </div>
      </div>

      {/* POPDOWN SCALE SLIDER PANEL (ПОЛЗУНОК МАСШТАБА) */}
      {isScaleSliderOpen && onScaleChange && (
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 space-y-2 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-sky-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Ползунок размера приложения</span>
            </span>
            <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700 text-[11px]">
              {appScale}%
            </span>
          </div>

          {/* Interactive Range Slider */}
          <div className="flex items-center gap-2.5">
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

          {/* Quick presets */}
          <div className="flex items-center justify-between gap-1 pt-0.5">
            <span className="text-[10px] text-slate-500">Пресеты:</span>
            <div className="flex items-center gap-1">
              {[75, 85, 90, 100, 110].map((preset) => (
                <button
                  key={preset}
                  onClick={() => onScaleChange(preset)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition ${
                    appScale === preset
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {preset}%
                </button>
              ))}
              <button
                onClick={() => onScaleChange(90)}
                className="p-1 rounded text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
                title="Сбросить на 90%"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
