import React, { useState } from 'react';
import { HomeworkTask, UserProfile } from '../../types/starosta';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HomeworkTabProps {
  homework: HomeworkTask[];
  currentUser: UserProfile;
  users: UserProfile[];
  onAddHomework: (task: HomeworkTask) => void;
  onToggleComplete: (taskId: string, userId: string) => void;
}

export const HomeworkTab: React.FC<HomeworkTabProps> = ({
  homework,
  currentUser,
  users,
  onAddHomework,
  onToggleComplete,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-11-10');
  const [priority, setPriority] = useState<'normal' | 'important' | 'exam'>('normal');

  const filteredTasks = homework.filter((t) => {
    const isCompletedByMe = t.completedByUserIds.includes(currentUser.id);
    if (filter === 'pending') return !isCompletedByMe;
    if (filter === 'completed') return isCompletedByMe;
    return true;
  });

  const handleToggle = (task: HomeworkTask) => {
    const isCompleted = task.completedByUserIds.includes(currentUser.id);
    if (!isCompleted) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // ignore
      }
    }
    onToggleComplete(task.id, currentUser.id);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;

    const newTask: HomeworkTask = {
      id: `hw-${Date.now()}`,
      subject: subject.trim(),
      title: title.trim(),
      description: description.trim(),
      deadline,
      priority,
      authorId: currentUser.id,
      completedByUserIds: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddHomework(newTask);
    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const getPriorityInfo = (p: string) => {
    switch (p) {
      case 'exam':
        return { label: 'К зачету / Экзамену', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
      case 'important':
        return { label: 'Важно (жесткий срок)', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      default:
        return { label: 'Обычное ДЗ', bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30' };
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto pb-8">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800/90 rounded-3xl p-4 border border-slate-700/60 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-500/15 rounded-xl text-sky-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Домашние задания и дедлайны</h2>
              <p className="text-[11px] text-slate-400">
                Контроль сдачи лабораторных и практических работ
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить ДЗ</span>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
              filter === 'all' ? 'bg-slate-800 text-sky-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Все ({homework.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
              filter === 'pending'
                ? 'bg-slate-800 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Надо сдать ({homework.filter((t) => !t.completedByUserIds.includes(currentUser.id)).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
              filter === 'completed'
                ? 'bg-slate-800 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Сдано ({homework.filter((t) => t.completedByUserIds.includes(currentUser.id)).length})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = task.completedByUserIds.includes(currentUser.id);
          const author = users.find((u) => u.id === task.authorId);
          const completedCount = task.completedByUserIds.length;
          const priorityInfo = getPriorityInfo(task.priority);

          return (
            <div
              key={task.id}
              className={`bg-slate-900/90 border rounded-2xl p-4 shadow-sm transition space-y-3 ${
                isDone ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header: Subject + Priority + Deadline */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-800/40">
                    {task.subject}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${priorityInfo.bg}`}
                  >
                    {priorityInfo.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Дедлайн: {task.deadline}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3
                  className={`text-sm font-bold text-white tracking-tight leading-snug ${
                    isDone ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Author & Submit status toggle button */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 flex-wrap">
                <div className="text-[11px] text-slate-400">
                  {author ? `Добавил(а): ${author.name}` : 'Задание старостата'}
                </div>

                <button
                  onClick={() => handleToggle(task)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${isDone ? 'text-white' : 'text-slate-500'}`}
                  />
                  <span>{isDone ? 'Сдано ✅' : 'Отметить сданным'}</span>
                </button>
              </div>

              {/* Group completion stats */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">
                  Сдали в группе: <strong className="text-white">{completedCount}</strong> из {users.filter(u => u.role !== 'curator').length} чел.
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Homework Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Добавить новое задание</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs text-slate-300">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Предмет
                </label>
                <input
                  type="text"
                  required
                  placeholder="Базы данных, Веб-разработка..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Название задания
                </label>
                <input
                  type="text"
                  required
                  placeholder="Лабораторная №4: Транзакции"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Описание и требования
                </label>
                <textarea
                  rows={3}
                  placeholder="Опишите требования, варианты или прикрепите ссылки..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Дедлайн
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Приоритет
                  </label>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as 'normal' | 'important' | 'exam')
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="normal">Обычное ДЗ</option>
                    <option value="important">Важно (дедлайн)</option>
                    <option value="exam">К зачету / экзамену</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95"
                >
                  Опубликовать задание
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
