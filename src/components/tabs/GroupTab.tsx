import React, { useState } from 'react';
import { UserProfile, Poll, GroupMeta } from '../../types/starosta';
import {
  Users,
  Search,
  Plus,
  Vote,
  Phone,
  Send,
  CheckCircle2,
  X,
  UserPlus,
  ExternalLink,
} from 'lucide-react';

interface GroupTabProps {
  users: UserProfile[];
  currentUser: UserProfile;
  polls: Poll[];
  groupMeta: GroupMeta;
  onVotePoll: (pollId: string, optionId: string, userId: string) => void;
  onAddPoll: (poll: Poll) => void;
  onAddNewStudent: (student: UserProfile) => void;
}

export const GroupTab: React.FC<GroupTabProps> = ({
  users,
  currentUser,
  polls,
  groupMeta,
  onVotePoll,
  onAddPoll,
  onAddNewStudent,
}) => {
  const [activeSection, setActiveSection] = useState<'roster' | 'polls'>('roster');
  const [subgroupFilter, setSubgroupFilter] = useState<'all' | '1' | '2' | 'activ'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddPollModal, setShowAddPollModal] = useState(false);

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentBio, setNewStudentBio] = useState('');
  const [newStudentSubgroup, setNewStudentSubgroup] = useState<1 | 2>(1);
  const [newStudentRole, setNewStudentRole] = useState<'student' | 'deputy' | 'proforg'>('student');

  // New Poll Form State
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');
  const [pollOption3, setPollOption3] = useState('');

  // Filter students
  const filteredUsers = users.filter((u) => {
    if (subgroupFilter === '1' && u.subgroup !== 1) return false;
    if (subgroupFilter === '2' && u.subgroup !== 2) return false;
    if (subgroupFilter === 'activ' && u.role === 'student') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    let uname = newStudentUsername.trim();
    if (uname && !uname.startsWith('@')) {
      uname = `@${uname}`;
    }

    const newStudent: UserProfile = {
      id: `user-${Date.now()}`,
      name: newStudentName.trim(),
      username: uname || `@student_${Math.floor(Math.random() * 900 + 100)}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
      bio: newStudentBio.trim() || 'Студент группы ' + groupMeta.code,
      role: newStudentRole,
      roleTitle: newStudentRole === 'deputy' ? 'Зам. старосты' : newStudentRole === 'proforg' ? 'Профорг' : 'Студент',
      subgroup: newStudentSubgroup,
      attendanceRate: 100,
      attendedClasses: 0,
      missedClasses: 0,
      homeworkCompleted: 0,
      badges: ['🎓 Студент'],
      status: 'online',
      statusText: 'Студент группы',
    };

    onAddNewStudent(newStudent);
    setNewStudentName('');
    setNewStudentUsername('');
    setNewStudentBio('');
    setShowAddStudentModal(false);
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim() || !pollOption1.trim() || !pollOption2.trim()) return;

    const options = [
      { id: `opt-${Date.now()}-1`, text: pollOption1.trim(), votedUserIds: [] },
      { id: `opt-${Date.now()}-2`, text: pollOption2.trim(), votedUserIds: [] },
    ];
    if (pollOption3.trim()) {
      options.push({ id: `opt-${Date.now()}-3`, text: pollOption3.trim(), votedUserIds: [] });
    }

    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      authorId: currentUser.id,
      question: pollQuestion.trim(),
      options,
      isMultiple: false,
      isClosed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddPoll(newPoll);
    setPollQuestion('');
    setPollOption1('');
    setPollOption2('');
    setPollOption3('');
    setShowAddPollModal(false);
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800/90 rounded-3xl p-4 border border-slate-700/60 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-500/15 rounded-xl text-sky-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Список группы БИ(ЭБ) 1/2</h2>
              <p className="text-[11px] text-slate-400">
                Краснодарский кооперативный институт РУК • 2026 г.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {activeSection === 'roster' ? (
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Добавить</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddPollModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Опрос</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Tabs: Roster vs Polls */}
        <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSection('roster')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeSection === 'roster'
                ? 'bg-slate-800 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Списки студентов ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('polls')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeSection === 'polls'
                ? 'bg-slate-800 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            <span>Опросы группы ({polls.length})</span>
          </button>
        </div>
      </div>

      {activeSection === 'roster' ? (
        <div className="space-y-3">
          {/* Subgroup Filters */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setSubgroupFilter('all')}
              className={`flex-1 min-w-[70px] py-1 text-xs font-semibold rounded-lg transition ${
                subgroupFilter === 'all'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Все ({users.length})
            </button>
            <button
              onClick={() => setSubgroupFilter('1')}
              className={`flex-1 min-w-[80px] py-1 text-xs font-semibold rounded-lg transition ${
                subgroupFilter === '1'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1 п/гр (Дмитрий)
            </button>
            <button
              onClick={() => setSubgroupFilter('2')}
              className={`flex-1 min-w-[80px] py-1 text-xs font-semibold rounded-lg transition ${
                subgroupFilter === '2'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2 п/гр (Анна)
            </button>
            <button
              onClick={() => setSubgroupFilter('activ')}
              className={`flex-1 min-w-[75px] py-1 text-xs font-semibold rounded-lg transition ${
                subgroupFilter === 'activ'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⭐ Старостат
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Поиск по имени или контактам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Clean Student Cards List (no profile sheets) */}
          <div className="space-y-2">
            {filteredUsers.map((student) => {
              const tgHandle = (student.telegram || student.username || '').replace('@', '');

              return (
                <div
                  key={student.id}
                  className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3 shadow-sm hover:border-slate-700 transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-white truncate">
                          {student.name}
                        </span>
                        {student.role === 'starosta' && (
                          <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded shrink-0">
                            Староста {student.subgroup} п/гр
                          </span>
                        )}
                        {student.role === 'deputy' && (
                          <span className="text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.2 rounded shrink-0">
                            Зам. старосты
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                        <span className="text-slate-400 font-mono text-[11px]">
                          {student.subgroup}-я подгруппа
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-emerald-400 font-semibold text-[11px]">
                          {student.attendanceRate}% явка
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Links */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {tgHandle && (
                      <a
                        href={`https://t.me/${tgHandle}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 rounded-xl text-xs font-semibold transition"
                        title={`Написать @${tgHandle}`}
                      >
                        <Send className="w-3 h-3" />
                        <span>TG</span>
                      </a>
                    )}
                    {student.phone && (
                      <a
                        href={`tel:${student.phone}`}
                        className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-xl transition"
                        title="Позвонить"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Polls Section */
        <div className="space-y-4">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votedUserIds.length, 0);

            return (
              <div
                key={poll.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-sky-400">Опрос группы</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    Всего голосов: {totalVotes}
                  </span>
                </div>

                {/* Question */}
                <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                  {poll.question}
                </h3>

                {/* Options */}
                <div className="space-y-2">
                  {poll.options.map((option) => {
                    const isMyVote = option.votedUserIds.includes(currentUser.id);
                    const voteCount = option.votedUserIds.length;
                    const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

                    return (
                      <div key={option.id} className="space-y-1">
                        <button
                          onClick={() => onVotePoll(poll.id, option.id, currentUser.id)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition relative overflow-hidden flex items-center justify-between gap-3 ${
                            isMyVote
                              ? 'border-sky-500 bg-sky-950/40 text-white font-bold'
                              : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div
                            className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                              isMyVote ? 'bg-sky-500/20' : 'bg-slate-800/40'
                            }`}
                            style={{ width: `${percent}%` }}
                          />

                          <div className="relative z-10 flex items-center gap-2 truncate">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isMyVote ? 'border-sky-400 bg-sky-500 text-white' : 'border-slate-600'
                              }`}
                            >
                              {isMyVote && <CheckCircle2 className="w-3 h-3" />}
                            </span>
                            <span className="truncate">{option.text}</span>
                          </div>

                          <span className="relative z-10 font-mono text-[11px] shrink-0 text-slate-400">
                            {voteCount} ({percent}%)
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Добавить студента в группу</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs text-slate-300">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Имя и фамилия
                </label>
                <input
                  type="text"
                  required
                  placeholder="Иван Петров"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Telegram / Юзернейм
                </label>
                <input
                  type="text"
                  placeholder="@ivan_petrov"
                  value={newStudentUsername}
                  onChange={(e) => setNewStudentUsername(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Подгруппа
                  </label>
                  <select
                    value={newStudentSubgroup}
                    onChange={(e) => setNewStudentSubgroup(Number(e.target.value) as 1 | 2)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value={1}>1-я подгруппа (Дмитрий)</option>
                    <option value={2}>2-я подгруппа (Анна)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Роль в группе
                  </label>
                  <select
                    value={newStudentRole}
                    onChange={(e) =>
                      setNewStudentRole(e.target.value as 'student' | 'deputy' | 'proforg')
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="student">Студент</option>
                    <option value="deputy">Зам. старосты</option>
                    <option value="proforg">Профорг</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95"
                >
                  Добавить в список группы
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Poll Modal */}
      {showAddPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Создать опрос для группы</h3>
              <button
                onClick={() => setShowAddPollModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-3.5 text-xs text-slate-300">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Вопрос для голосования
                </label>
                <input
                  type="text"
                  required
                  placeholder="Перенос пары, тема проекта..."
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Вариант 1
                </label>
                <input
                  type="text"
                  required
                  placeholder="Да, переносим"
                  value={pollOption1}
                  onChange={(e) => setPollOption1(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Вариант 2
                </label>
                <input
                  type="text"
                  required
                  placeholder="Нет, оставляем по расписанию"
                  value={pollOption2}
                  onChange={(e) => setPollOption2(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95"
                >
                  Опубликовать опрос
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
