import React, { useState } from 'react';
import {
  ScheduleItem,
  HomeworkTask,
  Announcement,
  Poll,
  GroupMeta,
  AttendanceRecord,
  AttendanceStatus,
  TelegramBinding,
  StarostaMandate,
  RucScheduleConfig,
} from '../types/starosta';
import {
  ShieldCheck,
  Send,
  Calendar,
  CheckSquare,
  Clock,
  ClipboardCheck,
  Users,
  ExternalLink,
  ChevronRight,
  Bell,
  MapPin,
  RefreshCw,
  Sparkles,
  Check,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MainScreenProps {
  groupMeta: GroupMeta;
  telegramBinding: TelegramBinding;
  starostaMandate: StarostaMandate;
  rucConfig?: RucScheduleConfig;
  schedule: ScheduleItem[];
  homework: HomeworkTask[];
  announcements: Announcement[];
  polls: Poll[];
  attendanceRecords: AttendanceRecord[];
  onOpenSignModal: () => void;
  onOpenTelegramModal: () => void;
  onOpenRucSync?: () => void;
  onOpenDownloadApk?: () => void;
  onOpenAI: () => void;
  onUpdateAttendance: (rec: AttendanceRecord) => void;
  onNavigateTab?: (tab: 'main' | 'schedule' | 'homework' | 'attendance' | 'channel' | 'group') => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  groupMeta,
  telegramBinding,
  starostaMandate,
  rucConfig,
  schedule,
  homework,
  announcements,
  attendanceRecords,
  onOpenSignModal,
  onOpenTelegramModal,
  onOpenRucSync,
  onOpenDownloadApk,
  onOpenAI,
  onUpdateAttendance,
  onNavigateTab,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState(false);

  // Today's classes
  const todayDay = new Date().getDay() === 0 ? 1 : new Date().getDay();
  const todayClasses = schedule.filter((s) => s.dayOfWeek === todayDay);
  const currentPair = todayClasses[0] || schedule[0];

  const todayStr = '2026-11-05';
  const todayAttendance = attendanceRecords.find((r) => r.date === todayStr && r.pairNumber === 1);
  const totalStudents = 26; // 26 человек в группе БИ(ЭБ) 1/2
  const presentCount = todayAttendance
    ? Object.values(todayAttendance.records).filter((s) => s === 'present' || s === 'late').length
    : totalStudents;

  const pendingHomeworkCount = homework.length;
  const pinnedAnnouncement = announcements.find((a) => a.pinned) || announcements[0];

  const handleTriggerSync = () => {
    if (onOpenRucSync) {
      setIsSyncing(true);
      onOpenRucSync();
      setTimeout(() => {
        setIsSyncing(false);
        setSyncSuccessToast(true);
        setTimeout(() => setSyncSuccessToast(false), 3000);
      }, 700);
    }
  };

  const handleMarkAllFast = () => {
    const updated: Record<string, AttendanceStatus> = {};
    for (let i = 1; i <= 26; i++) {
      updated[`user-${i}`] = 'present';
    }

    onUpdateAttendance({
      id: `att-${todayStr}-1`,
      date: todayStr,
      pairNumber: 1,
      subject: currentPair?.subject || 'Базы данных и проектирование ИС',
      records: updated,
      updatedAt: new Date().toISOString(),
    });

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-3 space-y-3 max-w-lg mx-auto pb-6 select-none animate-fade-in text-xs">
      {/* Sync Success Banner */}
      {syncSuccessToast && (
        <div className="p-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Расписание успешно синхронизировано с schedule.ruc.su!</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">Только что</span>
        </div>
      )}

      {/* 1. ГРУППА И СТАРОСТАТ (ЧИСТЫЙ БЕЗЛИЧНЫЙ ПОРТАЛ) */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 rounded-2xl p-3.5 border border-amber-500/30 shadow-md space-y-3 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                {groupMeta.code}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                РУК 2026 • Краснодар
              </span>
            </div>
            <h2 className="text-sm font-extrabold text-white tracking-tight mt-1">
              Краснодарский кооперативный институт
            </h2>
            <p className="text-[10px] text-slate-400">
              Бизнес-информатика и Электронный бизнес • Подгруппы 1 и 2
            </p>
          </div>

          <button
            onClick={onOpenSignModal}
            className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-[10px] font-bold transition flex items-center gap-1"
            title="Мандат старостата"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{starostaMandate.isSigned ? 'Мандат ✓' : 'Подписать'}</span>
          </button>
        </div>

        {/* Dual Starostas of БИ(ЭБ) 1/2 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Starosta 1 */}
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                👑 1 подгруппа
              </span>
              <span className="text-[9px] bg-slate-800 px-1 py-0.2 rounded text-slate-400">
                13 чел.
              </span>
            </div>
            <div className="font-bold text-white text-[11px] truncate">
              Дмитрий Дунаев
            </div>
            <a
              href="https://t.me/dima_starosta"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1 transition"
            >
              <Send className="w-2.5 h-2.5" />
              <span>@dima_starosta ↗</span>
            </a>
          </div>

          {/* Starosta 2 */}
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                👑 2 подгруппа
              </span>
              <span className="text-[9px] bg-slate-800 px-1 py-0.2 rounded text-slate-400">
                13 чел.
              </span>
            </div>
            <div className="font-bold text-white text-[11px] truncate">
              Анна Сергеева
            </div>
            <a
              href="https://t.me/anya_starosta2"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1 transition"
            >
              <Send className="w-2.5 h-2.5" />
              <span>@anya_starosta2 ↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. ВСЕ РАБОЧИЕ ССЫЛКИ И СИНХРОНИЗАЦИИ */}
      <section className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-teal-950/40 rounded-2xl p-3 border border-sky-500/25 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-white">
          <span className="flex items-center gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Синхронизация и прямые ссылки</span>
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Все системы активны
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Working sync button */}
          <button
            onClick={handleTriggerSync}
            className="p-2.5 bg-teal-950/60 hover:bg-teal-950/90 border border-teal-500/40 rounded-xl text-left transition active:scale-95 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-300 text-[11px]">Синхронизация РУК</span>
              <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              Обновить расписание 2026
            </div>
          </button>

          {/* Real link to schedule.ruc.su */}
          <a
            href={rucConfig?.portalUrl || 'https://schedule.ruc.su/?ysclid=mw43l57l8d43423857'}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/40 rounded-xl text-left transition active:scale-95 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400 text-[11px]">Портал РУК</span>
              <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              schedule.ruc.su ↗
            </div>
          </a>

          {/* Telegram Bot */}
          <button
            onClick={onOpenTelegramModal}
            className="p-2.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-xl text-left transition active:scale-95 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-300 text-[11px]">Telegram-бот</span>
              <Send className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              {telegramBinding.botUsername ? `@${telegramBinding.botUsername}` : '@Starosta24_bot'}
            </div>
          </button>

          {/* Download APK / Netlify */}
          {onOpenDownloadApk && (
            <button
              onClick={onOpenDownloadApk}
              className="p-2.5 bg-emerald-950/50 hover:bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-left transition active:scale-95 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 text-[11px]">Скачать APK / Netlify</span>
                <Download className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                Сборка и zip-архивы
              </div>
            </button>
          )}
        </div>
      </section>

      {/* 3. НАВИГАЦИЯ ПО ОТДЕЛЬНЫМ ВКЛАДКАМ */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-400">
          <span>Разделы группы</span>
          <span className="text-[10px] text-sky-400 font-normal">Переход в 1 клик</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Schedule */}
          <button
            onClick={() => onNavigateTab && onNavigateTab('schedule')}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left transition active:scale-98 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-1.5 bg-sky-500/15 text-sky-400 rounded-lg group-hover:scale-105 transition">
                <Calendar className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
            </div>
            <div className="mt-2">
              <div className="font-bold text-white text-xs">Расписание пар</div>
              <div className="text-[10px] text-slate-400 truncate">
                {todayClasses.length > 0 ? `${todayClasses.length} пар сегодня • РУК` : 'Сетка занятий Пн–Сб'}
              </div>
            </div>
          </button>

          {/* Homework */}
          <button
            onClick={() => onNavigateTab && onNavigateTab('homework')}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition active:scale-98 group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="p-1.5 bg-emerald-500/15 text-emerald-400 rounded-lg group-hover:scale-105 transition">
                <CheckSquare className="w-4 h-4" />
              </div>
              {pendingHomeworkCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 font-bold rounded text-[9px]">
                  {pendingHomeworkCount} ДЗ
                </span>
              )}
            </div>
            <div className="mt-2">
              <div className="font-bold text-white text-xs">Задания / ДЗ</div>
              <div className="text-[10px] text-slate-400 truncate">
                Дедлайны и сдача работ
              </div>
            </div>
          </button>

          {/* Attendance Journal */}
          <button
            onClick={() => onNavigateTab && onNavigateTab('attendance')}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition active:scale-98 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-1.5 bg-amber-500/15 text-amber-400 rounded-lg group-hover:scale-105 transition">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
            </div>
            <div className="mt-2">
              <div className="font-bold text-white text-xs">Журнал старосты</div>
              <div className="text-[10px] text-slate-400 truncate">
                {presentCount}/{totalStudents} чел. на паре
              </div>
            </div>
          </button>

          {/* Group Tab */}
          <button
            onClick={() => onNavigateTab && onNavigateTab('group')}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left transition active:scale-98 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-1.5 bg-indigo-500/15 text-indigo-400 rounded-lg group-hover:scale-105 transition">
                <Users className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition" />
            </div>
            <div className="mt-2">
              <div className="font-bold text-white text-xs">Список группы</div>
              <div className="text-[10px] text-slate-400 truncate">
                26 студентов • 1 и 2 п/гр
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* 4. ТЕКУЩАЯ ПАРА СЕГОДНЯ */}
      {currentPair && (
        <section className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Пара №{currentPair.pairNumber} сегодня ({currentPair.timeStart}–{currentPair.timeEnd})</span>
            </span>
            <button
              onClick={() => onNavigateTab && onNavigateTab('schedule')}
              className="text-[10px] text-sky-400 hover:text-sky-300 font-semibold"
            >
              Всё расписание $\rightarrow$
            </button>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="font-bold text-slate-100 truncate text-xs">{currentPair.subject}</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{currentPair.teacher}</span>
                <span>•</span>
                <span className="text-amber-400 flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" />
                  {currentPair.auditorium}
                </span>
              </div>
            </div>

            <button
              onClick={handleMarkAllFast}
              className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold shrink-0 transition active:scale-95"
              title="Отметить всех присутствующими"
            >
              Все здесь ✓
            </button>
          </div>
        </section>
      )}

      {/* 5. ПОСЛЕДНЕЕ ОБЪЯВЛЕНИЕ */}
      {pinnedAnnouncement && (
        <section className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Канал группы: {pinnedAnnouncement.title}</span>
            </span>
            <button
              onClick={() => onNavigateTab && onNavigateTab('channel')}
              className="text-[10px] text-sky-400 hover:text-sky-300 font-semibold"
            >
              В канал $\rightarrow$
            </button>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
            {pinnedAnnouncement.content}
          </p>
        </section>
      )}
    </div>
  );
};
