import React, { useState } from 'react';
import { Lesson, Topic, Student } from '../types';
import { soundManager } from '../utils/audio';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';

interface Props {
  topics: Topic[];
  allLessons: Lesson[];
  activeStudent: Student | null;
  onSelectLesson: (lesson: Lesson) => void;
}

export const LessonsList: React.FC<Props> = ({
  topics,
  allLessons,
  activeStudent,
  onSelectLesson
}) => {
  const [selectedSemester, setSelectedSemester] = useState<'all' | 1 | 2>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const completedLessonIds = new Set(activeStudent?.completedLessons || []);

  const filteredLessons = allLessons.filter(l => {
    if (selectedSemester !== 'all' && l.semester !== selectedSemester) return false;
    if (!searchQuery) return true;
    return (
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(l.lessonNumber).includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="text-xs font-black tracking-wider uppercase bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block mb-3">
            Học Bài Tương Tác Chuẩn GDPT 2018
          </span>
          <h2 className="text-2xl md:text-3xl font-black mb-2">
            DANH SÁCH BÀI HỌC TOÁN LỚP 1
          </h2>
          <p className="text-sky-100 text-sm md:text-base leading-relaxed">
            Chọn bài học để bắt đầu khám phá kiến thức trọng tâm, xem ví dụ sinh động và làm bài tập tương tác có chấm điểm tức thì!
          </p>
        </div>

        <div className="absolute right-4 bottom-2 text-7xl md:text-8xl opacity-20 pointer-events-none select-none">
          ✏️
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
        {/* Semester Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSelectedSemester('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedSemester === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({allLessons.length})
          </button>
          <button
            onClick={() => setSelectedSemester(1)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedSemester === 1
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Học kỳ 1
          </button>
          <button
            onClick={() => setSelectedSemester(2)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedSemester === 2
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Học kỳ 2
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm bài học, chủ đề..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson) => {
          const isDone = completedLessonIds.has(lesson.id);

          return (
            <div
              key={lesson.id}
              onClick={() => {
                soundManager.playPop();
                onSelectLesson(lesson);
              }}
              className="p-5 rounded-3xl bg-white border border-sky-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      Bài {lesson.lessonNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      HK{lesson.semester}
                    </span>
                  </div>

                  {isDone ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Đã hoàn thành
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Chưa học
                    </span>
                  )}
                </div>

                <h4 className="font-black text-base text-slate-900 mb-1 group-hover:text-sky-600 transition-colors line-clamp-1">
                  {lesson.title}
                </h4>
                <span className="text-xs font-semibold text-amber-600 block mb-2">
                  {lesson.topicName}
                </span>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {lesson.coreKnowledge}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">
                  {lesson.exercises.length} câu bài tập
                </span>
                <button className="px-3.5 py-1.5 rounded-xl bg-sky-500 group-hover:bg-sky-600 text-white font-extrabold flex items-center gap-1 shadow-sm transition-colors">
                  Vào học <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
