/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Topic, StudentProfile, LanguageMode, Lesson } from '../../types';
import { TOPICS, LESSONS } from '../../data/curriculumData';
import { soundService } from '../../services/audioService';
import { Layers, ArrowRight, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface TopicListViewProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onSelectLesson: (lesson: Lesson) => void;
}

export const TopicListView: React.FC<TopicListViewProps> = ({
  student,
  langMode,
  onSelectLesson,
}) => {
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);

  const activeTopic = TOPICS.find((t) => t.id === activeTopicId);
  const activeTopicLessons = LESSONS.filter((l) => l.topicId === activeTopicId);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative z-10 space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-teal-100">
            <Layers className="w-3.5 h-3.5" /> Bản Đồ Tri Thức Toán Học
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-heading drop-shadow">
            HỌC THEO CHỦ ĐỀ – 10 CHỦ ĐỀ TOÁN LỚP 1
          </h2>
          <p className="text-xs md:text-sm text-emerald-100 font-medium max-w-xl">
            Toàn bộ 10 chủ đề của SGK Toán 1 Tập 1 và Tập 2. Khám phá từng hòn đảo tri thức theo tiến trình vững chắc!
          </p>
        </div>

        <div className="relative z-10 bg-white/90 backdrop-blur-xs text-slate-800 p-4 rounded-2xl shadow-sm text-center">
          <div className="text-xs text-slate-500 font-bold">10 Chủ đề lớn</div>
          <div className="text-2xl font-black text-teal-600">SGK Kết Nối</div>
          <div className="text-[10px] text-amber-600 font-black mt-0.5">🌟 Song ngữ Anh - Việt</div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TOPICS.map((topic) => {
          const topicLessons = LESSONS.filter((l) => l.topicId === topic.id);
          const isSelected = activeTopicId === topic.id;

          return (
            <div
              key={topic.id}
              className={`bg-white rounded-3xl border-2 transition-all overflow-hidden shadow-xs hover:shadow-lg ${
                isSelected ? 'border-teal-500 ring-4 ring-teal-200' : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className={`p-5 bg-gradient-to-r ${topic.color} text-white flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow">{topic.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white/80 uppercase">
                      Chủ đề {topic.id} · Tập {topic.volume}
                    </div>
                    <h3 className="text-lg font-black font-heading drop-shadow-xs">
                      {topic.name}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-bold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-white">
                  {topicLessons.length} Bài học
                </span>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs md:text-sm text-slate-600 font-medium">
                  {topic.description}
                </p>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Các bài học trong chủ đề:
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {topicLessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          soundService.playClick();
                          onSelectLesson(lesson);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 flex items-center justify-between text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center">
                            {lesson.id}
                          </span>
                          <span className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-sky-700">
                            {lesson.title.replace(/^Bài \d+\.\s*/, '')}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
