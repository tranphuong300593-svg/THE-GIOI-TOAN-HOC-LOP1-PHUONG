import React, { useState } from 'react';
import { Classroom, Student, ExerciseAttempt, Lesson, TeacherCustomization } from '../types';
import { OFFICIAL_CLASSES } from '../data/curriculumData';
import { soundManager } from '../utils/audio';
import {
  Users,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Filter,
  Download,
  Upload,
  UserCheck,
  Search,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  School,
  Camera,
  Sparkles
} from 'lucide-react';

interface Props {
  classrooms: Classroom[];
  activeStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  onAddStudent: (classId: string, name: string, code: string) => void;
  onExportData: () => void;
  onImportData: (jsonString: string) => void;
  allLessons: Lesson[];
  teacherCustomization?: TeacherCustomization;
  onRefreshProfile?: () => void;
}

export const TeacherDashboard: React.FC<Props> = ({
  classrooms,
  activeStudent,
  onSelectStudent,
  onAddStudent,
  onExportData,
  onImportData,
  allLessons,
  teacherCustomization,
  onRefreshProfile
}) => {
  // Support 'all' or any specific class from 1/1 to 1/26
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [filterStudentId, setFilterStudentId] = useState<string>('all');
  const [filterSemester, setFilterSemester] = useState<'all' | 1 | 2>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Photo settings state (Section 5 requirement)
  const [photoStatus, setPhotoStatus] = useState<{
    exists: boolean;
    sizeBytes: number;
    hasRealPhoto: boolean;
    canonicalUrl: string;
    diskPath: string;
  } | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadMsg, setPhotoUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const dashboardFileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchPhotoStatus = () => {
    fetch('/api/teacher/photo-status')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPhotoStatus({
            exists: data.exists,
            sizeBytes: data.sizeBytes,
            hasRealPhoto: data.hasRealPhoto,
            canonicalUrl: data.canonicalUrl,
            diskPath: data.diskPath
          });
        }
      })
      .catch(err => console.warn('Could not check photo status', err));
  };

  React.useEffect(() => {
    fetchPhotoStatus();
  }, []);

  const handleDashboardPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setPhotoUploadMsg({ type: 'error', text: 'Vui lòng chọn tệp định dạng JPG, PNG hoặc WEBP.' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPhotoUploadMsg({ type: 'error', text: 'Dung lượng ảnh vượt quá 10MB.' });
      return;
    }

    setPhotoUploadMsg(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDashboardPhoto = async () => {
    if (!previewPhoto) return;
    setIsUploadingPhoto(true);
    setPhotoUploadMsg(null);

    try {
      const res = await fetch('/api/teacher/upload-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: previewPhoto, position: 'hero' })
      });
      const data = await res.json();
      if (data.success) {
        soundManager.playSuccess();
        setPhotoUploadMsg({
          type: 'success',
          text: `Đã lưu ảnh thật của Cô Phượng thành công vào ${data.profile?.heroPhoto || 'public/assets/co-phuong.webp'}! Ảnh sẽ tồn tại vĩnh viễn trên website.`
        });
        setPreviewPhoto(null);
        fetchPhotoStatus();
        if (onRefreshProfile) onRefreshProfile();
      } else {
        soundManager.playTryAgain();
        setPhotoUploadMsg({
          type: 'error',
          text: `Lưu thất bại: ${data.error || 'Lỗi ghi tệp lên máy chủ'}`
        });
      }
    } catch (err: any) {
      soundManager.playTryAgain();
      setPhotoUploadMsg({
        type: 'error',
        text: `Lưu thất bại: Không thể kết nối với máy chủ (${err.message})`
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Add student form modal
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentClass, setNewStudentClass] = useState<string>('1/1');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCode, setNewStudentCode] = useState('');

  // Derive students list based on selected class
  const students: Student[] = selectedClass === 'all'
    ? classrooms.flatMap(c => c.students)
    : (classrooms.find(c => c.name === `Lớp ${selectedClass}` || c.id === `lop_${selectedClass.replace('/', '_')}` || c.name.includes(selectedClass))?.students || []);

  // Filter students by search
  const filteredStudents = students.filter(s => {
    if (!searchQuery) return true;
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.classId.includes(searchQuery)
    );
  });

  // Aggregate all attempts across students or for filtered student
  const allAttempts: { student: Student; attempt: ExerciseAttempt }[] = [];
  students.forEach(s => {
    if (filterStudentId !== 'all' && s.id !== filterStudentId) return;
    (s.history || []).forEach(att => {
      // Check semester filter
      const matchLesson = allLessons.find(l => l.id === att.lessonId);
      if (filterSemester !== 'all' && matchLesson && matchLesson.semester !== filterSemester) return;
      if (filterTopic !== 'all' && att.topicName !== filterTopic) return;
      allAttempts.push({ student: s, attempt: att });
    });
  });

  // Metrics computation (genuine real metrics only)
  const totalAttempts = allAttempts.length;
  const correctAttempts = allAttempts.filter(a => a.attempt.isCorrect).length;
  const wrongAttempts = totalAttempts - correctAttempts;
  const accuracyRate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  // Analysis of topics
  const topicStats: Record<string, { total: number; correct: number }> = {};
  allAttempts.forEach(a => {
    const t = a.attempt.topicName || 'Chủ đề chung';
    if (!topicStats[t]) topicStats[t] = { total: 0, correct: 0 };
    topicStats[t].total += 1;
    if (a.attempt.isCorrect) topicStats[t].correct += 1;
  });

  const masteredTopics: string[] = [];
  const needsImprovementTopics: string[] = [];

  Object.entries(topicStats).forEach(([top, stats]) => {
    const acc = (stats.correct / stats.total) * 100;
    if (acc >= 75 && stats.total >= 2) {
      masteredTopics.push(top);
    } else if (acc < 60) {
      needsImprovementTopics.push(top);
    }
  });

  // Unique topics list for filtering
  const uniqueTopics = Array.from(new Set(allLessons.map(l => l.topicName)));

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const targetClass = newStudentClass || (selectedClass !== 'all' ? selectedClass : '1/1');
    const existingCount = classrooms.find(c => c.name === `Lớp ${targetClass}` || c.id === `lop_${targetClass.replace('/', '_')}`)?.students.length || 0;
    const defaultCode = `${targetClass}-${String(existingCount + 1).padStart(2, '0')}`;
    
    onAddStudent(targetClass, newStudentName.trim(), newStudentCode.trim() || defaultCode);
    setNewStudentName('');
    setNewStudentCode('');
    setIsAddingStudent(false);
    soundManager.playSuccess();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onImportData(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Dashboard Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
              Khu Vực Quản Lý Sư Phạm
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Năm học 2025 - 2026
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            LỚP HỌC CỦA EM & BÁO CÁO TIẾN ĐỘ
          </h2>
        </div>

        {/* Action buttons: Add student, Export/Import JSON */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setNewStudentClass(selectedClass !== 'all' ? selectedClass : '1/1');
              setIsAddingStudent(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm học sinh
          </button>
          <button
            onClick={onExportData}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Xuất dữ liệu JSON
          </button>
          <label className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" /> Nhập dữ liệu JSON
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* ========================================================
          CẤU HÌNH CỐ ĐỊNH HAI HÌNH ẢNH TRANG CHỦ (KHÔNG CẦN TẢI ẢNH TRÊN WEB)
         ======================================================== */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-3xl p-6 border-2 border-pink-200 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-pink-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center text-2xl shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">
                  Cấu hình hình ảnh cố định
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Trang chủ & Triển khai Vercel
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                HAI HÌNH ẢNH CỐ ĐỊNH CÔ PHƯỢNG TRÊN TRANG CHỦ
              </h3>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-pink-200 text-xs font-black text-pink-800 shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Đã tích hợp trực tiếp vào mã nguồn</span>
          </div>
        </div>

        {/* Thông tin chi tiết về 2 ảnh cố định */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Ảnh 1 - Đầu trang */}
          <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[11px]">
                ẢNH THỨ NHẤT · ĐẦU TRANG
              </span>
              <span className="text-xs font-bold text-emerald-600">Hiển thị cố định</span>
            </div>
            <h4 className="text-sm font-black text-slate-800">
              Banner chính: Cùng học Toán với cô Phượng
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vị trí: Ngay phần đầu trang chủ. Hiển thị nguyên vẹn thiết kế, giữ nguyên khuôn mặt thật và bố cục, đúng tỷ lệ, không bị kéo giãn hay làm méo ảnh.
            </p>
            <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-slate-500">
              Đường dẫn tệp: <code className="text-indigo-600 font-bold">public/assets/co-phuong-hero.*</code>
            </div>
          </div>

          {/* Ảnh 2 - Cuối trang */}
          <div className="p-4 bg-white rounded-2xl border border-rose-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-black text-[11px]">
                ẢNH THỨ HAI · CUỐI TRANG
              </span>
              <span className="text-xs font-bold text-emerald-600">Hiển thị cố định</span>
            </div>
            <h4 className="text-sm font-black text-slate-800">
              Khu vực tác giả: Cô giáo Trần Thị Phượng
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vị trí: Cuối trang chủ cùng dòng thông điệp tác giả sáng tạo ứng dụng. Hiển thị trọn vẹn, sắc nét, cân đối, chuẩn tỷ lệ nguyên gốc.
            </p>
            <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-slate-500">
              Đường dẫn tệp: <code className="text-indigo-600 font-bold">public/assets/co-phuong-footer.*</code>
            </div>
          </div>
        </div>

        {/* Lợi ích triển khai */}
        <div className="p-3.5 bg-white/80 rounded-2xl border border-purple-200 text-xs text-slate-700 leading-relaxed">
          💡 <strong>Không cần thao tác tải ảnh trên web:</strong> Hai hình ảnh được đóng gói sẵn trong mã nguồn dự án, triển khai trực tiếp cùng website lên Vercel. Dữ liệu luôn ổn định, sắc nét và không bao giờ bị lỗi kết nối hay mất ảnh.
        </div>
      </div>

      {/* Classroom Selection Bar (Strictly 1/1 to 1/26) */}
      <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-800">
              Chọn Lớp Học (Từ Lớp 1/1 đến Lớp 1/26):
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Đang xem: <strong className="text-indigo-700">{selectedClass === 'all' ? 'Tất cả các lớp (1/1 - 1/26)' : `Lớp ${selectedClass}`}</strong> ({students.length} học sinh)
          </span>
        </div>

        {/* Scrollable / Multi-row Class Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedClass('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              selectedClass === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả ({classrooms.reduce((acc, c) => acc + c.students.length, 0)})
          </button>

          {OFFICIAL_CLASSES.map((cls) => {
            const classObj = classrooms.find(c => c.name === `Lớp ${cls}` || c.id === `lop_${cls.replace('/', '_')}` || c.name.includes(cls));
            const count = classObj?.students.length || 0;
            const isSelected = selectedClass === cls;

            return (
              <button
                key={cls}
                onClick={() => {
                  soundManager.playPop();
                  setSelectedClass(cls);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200'
                    : count > 0
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cls}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/30 text-white' : count > 0 ? 'bg-indigo-200 text-indigo-900 font-extrabold' : 'bg-slate-200 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Information Notice (Prompt rule adherence) */}
      <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-sky-900 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong>Thông báo lưu trữ dữ liệu thực tế:</strong> Dữ liệu kết quả làm bài của học sinh được lưu trữ trực tiếp trên trình duyệt của máy bạn (Local Storage) mà không cần đăng ký tài khoản phức tạp. Bạn có thể sử dụng nút <em>Xuất dữ liệu JSON</em> để sao lưu hoặc chuyển đổi sang máy tính khác của giáo viên bất kỳ lúc nào.
        </div>
      </div>

      {/* Overview Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Sĩ số lớp</span>
          <p className="text-2xl md:text-3xl font-black text-slate-800 mt-1">{students.length} em</p>
          <span className="text-[11px] text-indigo-600 font-medium">
            {selectedClass === 'all' ? 'Tất cả các lớp (1/1 - 1/26)' : `Lớp ${selectedClass}`}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Số lượt bài đã làm</span>
          <p className="text-2xl md:text-3xl font-black text-sky-600 mt-1">{totalAttempts} câu</p>
          <span className="text-[11px] text-slate-400">Theo bộ lọc hiện tại</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Tỉ lệ trả lời đúng</span>
          <p className="text-2xl md:text-3xl font-black text-emerald-600 mt-1">
            {totalAttempts > 0 ? `${accuracyRate}%` : 'Chưa có'}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">{correctAttempts} câu đúng</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Đang chọn em</span>
          <p className="text-lg md:text-xl font-black text-amber-600 mt-1 truncate">
            {activeStudent?.name || 'Chưa chọn'}
          </p>
          <span className="text-[11px] text-amber-700 font-medium">{activeStudent?.stars || 0} sao tích lũy</span>
        </div>
      </div>

      {/* Pedagogical Insights: Mastered Topics vs Topics Needing Reinforcement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm">
          <h4 className="font-bold text-sm text-emerald-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Chủ đề học sinh đã nắm vững (≥ 75% đúng):
          </h4>
          {masteredTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {masteredTopics.map((top, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs rounded-xl">
                  {top}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              {totalAttempts === 0 ? 'Chưa có dữ liệu làm bài để đánh giá.' : 'Cần thêm lượt luyện tập để đánh giá mức độ thuần thục.'}
            </p>
          )}
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm">
          <h4 className="font-bold text-sm text-amber-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Chủ đề cần luyện thêm và củng cố:
          </h4>
          {needsImprovementTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {needsImprovementTopics.map((top, i) => (
                <span key={i} className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-xs rounded-xl">
                  {top}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              {totalAttempts === 0 ? 'Chưa có dữ liệu làm bài.' : 'Tất cả các chủ đề đã làm đều có kết quả tích cực!'}
            </p>
          )}
        </div>
      </div>

      {/* Student Roster Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
          <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Danh sách học sinh ({students.length} em)
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên hoặc mã học sinh..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredStudents.map((st) => {
            const isSelected = activeStudent?.id === st.id;
            return (
              <div
                key={st.id}
                onClick={() => {
                  soundManager.playPop();
                  onSelectStudent(st);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-500 shadow-md ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-inner">
                    {st.avatar}
                  </div>
                  <h4 className="font-black text-sm text-slate-800">{st.name}</h4>
                  <span className="text-[11px] text-slate-400 font-semibold block">{st.code}</span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 w-full flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>⭐ {st.stars} sao</span>
                  <span className="text-slate-400 text-[11px]">{st.completedLessons?.length || 0} bài</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters & Detailed Result History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
          <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" /> Bảng kết quả làm bài chi tiết
          </h3>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Student Filter */}
            <select
              value={filterStudentId}
              onChange={e => setFilterStudentId(e.target.value)}
              className="p-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">Tất cả học sinh</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>

            {/* Semester Filter */}
            <select
              value={filterSemester}
              onChange={e => setFilterSemester(e.target.value === 'all' ? 'all' : Number(e.target.value) as 1 | 2)}
              className="p-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">Cả 2 học kỳ</option>
              <option value="1">Học kỳ 1</option>
              <option value="2">Học kỳ 2</option>
            </select>

            {/* Topic Filter */}
            <select
              value={filterTopic}
              onChange={e => setFilterTopic(e.target.value)}
              className="p-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 max-w-[180px] truncate"
            >
              <option value="all">Tất cả chủ đề</option>
              {uniqueTopics.map((top, idx) => (
                <option key={idx} value={top}>{top}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Table */}
        {allAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-3">Học sinh</th>
                  <th className="py-3 px-3">Chủ đề & Câu hỏi</th>
                  <th className="py-3 px-3">Mức độ</th>
                  <th className="py-3 px-3">Bé chọn</th>
                  <th className="py-3 px-3">Đáp án đúng</th>
                  <th className="py-3 px-3">Kết quả</th>
                  <th className="py-3 px-3">Thời điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allAttempts.map(({ student, attempt }, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{student.name}</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-200">
                          Lớp {student.classId || '1/1'}
                        </span>
                      </div>
                      <span className="text-slate-400 font-normal text-[11px] block">{student.code}</span>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <span className="font-semibold text-slate-800 block line-clamp-1">{attempt.question}</span>
                      <span className="text-[11px] text-slate-400 block">{attempt.topicName}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        attempt.level === 'Cơ bản' ? 'bg-emerald-50 text-emerald-700' : attempt.level === 'Luyện tập' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {attempt.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{attempt.chosenAnswer}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{attempt.correctAnswer}</td>
                    <td className="py-3 px-3">
                      {attempt.isCorrect ? (
                        <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Đúng
                        </span>
                      ) : (
                        <span className="font-extrabold text-rose-600 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Sai
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {attempt.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-sm">Chưa có dữ liệu làm bài theo tiêu chí lọc này.</p>
            <p className="text-xs mt-1">Khi học sinh làm bài tập trong phần "Học Bài", kết quả thực tế sẽ được tự động hiển thị ở đây.</p>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {isAddingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-indigo-100 animate-in zoom-in-95">
            <h3 className="font-black text-lg text-slate-900 mb-1">Thêm học sinh mới</h3>
            <p className="text-xs text-slate-500 mb-4">Nhập thông tin học sinh vào lớp học tương ứng:</p>

            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chọn lớp học:</label>
                <select
                  value={newStudentClass}
                  onChange={e => setNewStudentClass(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {OFFICIAL_CLASSES.map(cls => (
                    <option key={cls} value={cls}>Lớp {cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên học sinh:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bé An, Bé Bình..."
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mã học sinh (tùy chọn):</label>
                <input
                  type="text"
                  placeholder={`Ví dụ: ${newStudentClass}-03`}
                  value={newStudentCode}
                  onChange={e => setNewStudentCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingStudent(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 cursor-pointer shadow-sm"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
