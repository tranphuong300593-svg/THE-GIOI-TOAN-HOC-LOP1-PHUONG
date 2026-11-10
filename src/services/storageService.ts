/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentProfile, ActivityRecord, GradeClass, LessonCertificate } from '../types';

const PROFILES_KEY = 'math_adventure_profiles_v1';
const CURRENT_STUDENT_KEY = 'math_adventure_current_student_id';
const RECORDS_KEY = 'math_adventure_records_v1';
const CERTIFICATES_KEY = 'math_adventure_certificates_v1';

export class StorageService {
  // Generate random internal UUID
  private static generateId(): string {
    return 'st_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
  }

  // Get all registered profiles
  public static getProfiles(): StudentProfile[] {
    try {
      const data = localStorage.getItem(PROFILES_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Save all profiles
  public static saveProfiles(profiles: StudentProfile[]): void {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch {
      // ignore
    }
  }

  // Get currently active profile
  public static getCurrentStudent(): StudentProfile | null {
    const currentId = localStorage.getItem(CURRENT_STUDENT_KEY);
    if (!currentId) return null;
    const profiles = this.getProfiles();
    return profiles.find((p) => p.id === currentId) || null;
  }

  // Set active student
  public static setCurrentStudent(student: StudentProfile): void {
    localStorage.setItem(CURRENT_STUDENT_KEY, student.id);
  }

  // Clear current active student (log out)
  public static logout(): void {
    localStorage.removeItem(CURRENT_STUDENT_KEY);
  }

  // Login or register student
  public static loginOrRegister(fullName: string, className: GradeClass, avatar?: string): StudentProfile {
    const cleanName = fullName.trim();
    const profiles = this.getProfiles();

    // Check if an existing profile matches this name & class
    let profile = profiles.find(
      (p) => p.fullName.toLowerCase() === cleanName.toLowerCase() && p.className === className
    );

    if (profile) {
      profile.lastLoginAt = new Date().toISOString();
      if (avatar) profile.avatar = avatar;
    } else {
      profile = {
        id: this.generateId(),
        fullName: cleanName,
        className,
        avatar: avatar || '🤖',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        totalStars: 10, // Welcome gift of 10 stars!
        badges: ['Chào Bạn Mới'],
        collectedCarrots: 0,
        collectedCups: 0,
        collectedFish: 0,
        collectedChests: 0,
      };
      profiles.push(profile);
    }

    this.saveProfiles(profiles);
    this.setCurrentStudent(profile);
    return profile;
  }

  // Update student stats after activity
  public static recordActivity(
    studentId: string,
    activity: Omit<ActivityRecord, 'id' | 'studentId' | 'completedAt'>
  ): ActivityRecord {
    const record: ActivityRecord = {
      ...activity,
      id: 'rec_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      studentId,
      completedAt: new Date().toISOString(),
    };

    // Save record
    try {
      const records = this.getAllRecords();
      records.unshift(record);
      // Keep up to 200 recent records
      if (records.length > 200) records.length = 200;
      localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }

    // Update student profile totals
    const profiles = this.getProfiles();
    const student = profiles.find((p) => p.id === studentId);
    if (student) {
      student.totalStars += record.starsEarned;

      // Badges check
      const newBadges: string[] = [];
      if (student.totalStars >= 50 && !student.badges.includes('Ngôi Sao Sáng')) {
        newBadges.push('Ngôi Sao Sáng');
      }
      if (student.totalStars >= 100 && !student.badges.includes('Nhà Thông Thái')) {
        newBadges.push('Nhà Thông Thái');
      }
      if (student.totalStars >= 200 && !student.badges.includes('Vua Toán Học')) {
        newBadges.push('Vua Toán Học');
      }

      if (record.type === 'game') {
        if (record.targetId === 'rabbit-river') {
          student.collectedCarrots += 3;
          if (!student.badges.includes('Thỏ Con Nhanh Trí')) newBadges.push('Thỏ Con Nhanh Trí');
        } else if (record.targetId === 'math-racing') {
          student.collectedCups += 1;
          if (!student.badges.includes('Tay Đua Cự Phách')) newBadges.push('Tay Đua Cự Phách');
        } else if (record.targetId === 'penguin-fishing') {
          student.collectedFish += record.score;
          if (!student.badges.includes('Vua Câu Cá')) newBadges.push('Vua Câu Cá');
        } else if (record.targetId === 'treasure-island') {
          student.collectedChests += 1;
          if (!student.badges.includes('Thợ Săn Kho Báu')) newBadges.push('Thợ Săn Kho Báu');
        } else if (record.targetId === 'number-train') {
          if (!student.badges.includes('Number Train Master')) newBadges.push('Number Train Master');
        } else if (record.targetId === 'shape-builder') {
          if (!student.badges.includes('Kiến Trúc Sư Nhí')) newBadges.push('Kiến Trúc Sư Nhí');
        } else if (record.targetId === 'magic-clock') {
          if (!student.badges.includes('Chủ Nhân Thời Gian')) newBadges.push('Chủ Nhân Thời Gian');
        } else if (record.targetId === 'math-supermarket') {
          if (!student.badges.includes('Khách Hàng Thông Thái')) newBadges.push('Khách Hàng Thông Thái');
        } else if (record.targetId === 'robot-rescue') {
          if (!student.badges.includes('Hiệp Sĩ Giải Cứu')) newBadges.push('Hiệp Sĩ Giải Cứu');
        } else if (record.targetId === 'bridge-builder') {
          if (!student.badges.includes('Kỹ Sư Xây Cầu')) newBadges.push('Kỹ Sư Xây Cầu');
        } else if (record.targetId === 'magic-time-train') {
          if (!student.badges.includes('Bác Lái Tàu Thời Gian')) newBadges.push('Bác Lái Tàu Thời Gian');
        } else if (record.targetId === 'giant-turnip-farm') {
          if (!student.badges.includes('Nông Dân Thu Hoạch Giỏi')) newBadges.push('Nông Dân Thu Hoạch Giỏi');
        }
      }

      student.badges = Array.from(new Set([...student.badges, ...newBadges]));
      this.saveProfiles(profiles);

      const current = this.getCurrentStudent();
      if (current && current.id === student.id) {
        this.setCurrentStudent(student);
      }
    }

    return record;
  }

  public static getAllRecords(): ActivityRecord[] {
    try {
      const data = localStorage.getItem(RECORDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static getStudentRecords(studentId: string): ActivityRecord[] {
    return this.getAllRecords().filter((r) => r.studentId === studentId);
  }

  // Teacher analytics
  public static getClassStudents(className: GradeClass): StudentProfile[] {
    return this.getProfiles().filter((p) => p.className === className);
  }

  public static exportClassToCSV(className: GradeClass): string {
    const students = this.getClassStudents(className);
    const allRecords = this.getAllRecords();

    const headers = ['Mã HS', 'Họ Và Tên', 'Lớp', 'Tổng Số Sao', 'Số Huy Hiệu', 'Số Bài Học Đã Làm', 'Số Trò Chơi Đã Chơi', 'Điểm Trung Bình (%)', 'Lần Đăng Nhập Cuối'];
    const rows = students.map((s) => {
      const sRecords = allRecords.filter((r) => r.studentId === s.id);
      const lessonCount = sRecords.filter((r) => r.type === 'lesson').length;
      const gameCount = sRecords.filter((r) => r.type === 'game').length;
      const avgScore = sRecords.length > 0
        ? Math.round((sRecords.reduce((acc, r) => acc + (r.score / Math.max(1, r.totalQuestions)), 0) / sRecords.length) * 100)
        : 0;

      return [
        s.id,
        `"${s.fullName}"`,
        s.className,
        s.totalStars,
        s.badges.length,
        lessonCount,
        gameCount,
        `${avgScore}%`,
        s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleDateString('vi-VN') : 'Chưa có',
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  // --- CERTIFICATE & 1-STAR LESSON REWARD SYSTEM ---
  public static getAllCertificates(): LessonCertificate[] {
    try {
      const data = localStorage.getItem(CERTIFICATES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveAllCertificates(certs: LessonCertificate[]): void {
    try {
      localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(certs));
    } catch {
      // ignore
    }
  }

  public static getLessonCertificates(studentId: string): LessonCertificate[] {
    const allCerts = this.getAllCertificates();
    const studentCerts = allCerts.filter((c) => c.studentId === studentId);

    // Auto-migrate from any historical lesson records if needed
    const studentRecords = this.getStudentRecords(studentId).filter((r) => r.type === 'lesson');
    let hasNewMigration = false;
    const profiles = this.getProfiles();
    const student = profiles.find((p) => p.id === studentId);

    studentRecords.forEach((rec) => {
      const numLessonId = Number(rec.targetId);
      if (!isNaN(numLessonId) && !allCerts.some((c) => c.studentId === studentId && Number(c.lessonId) === numLessonId)) {
        const d = new Date(rec.completedAt);
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Ho_Chi_Minh',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(d);

        const cert: LessonCertificate = {
          id: `cert_${studentId}_${numLessonId}`,
          studentId,
          studentName: student ? student.fullName : 'Bé',
          className: student ? student.className : '1/1',
          lessonId: numLessonId,
          lessonTitle: rec.targetName,
          completedAt: rec.completedAt,
          formattedDate,
          starCount: 1,
        };
        allCerts.push(cert);
        studentCerts.push(cert);
        hasNewMigration = true;
      }
    });

    if (hasNewMigration) {
      this.saveAllCertificates(allCerts);
    }

    return studentCerts.sort((a, b) => a.lessonId - b.lessonId);
  }

  public static hasLessonCertificate(studentId: string, lessonId: number): boolean {
    return this.getAllCertificates().some(
      (c) => c.studentId === studentId && Number(c.lessonId) === Number(lessonId)
    );
  }

  public static awardLessonCertificate(
    studentId: string,
    studentName: string,
    className: string,
    lessonId: number,
    lessonTitle: string
  ): { certificate: LessonCertificate; isNew: boolean; updatedStudent: StudentProfile | null } {
    const allCerts = this.getAllCertificates();
    const existing = allCerts.find(
      (c) => c.studentId === studentId && Number(c.lessonId) === Number(lessonId)
    );

    const profiles = this.getProfiles();
    const student = profiles.find((p) => p.id === studentId);

    if (existing) {
      return {
        certificate: existing,
        isNew: false,
        updatedStudent: student || null,
      };
    }

    // Vietnam format date dd/mm/yyyy
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(now);

    const newCert: LessonCertificate = {
      id: `cert_${studentId}_${lessonId}`,
      studentId,
      studentName,
      className,
      lessonId,
      lessonTitle,
      completedAt: now.toISOString(),
      formattedDate,
      starCount: 1,
    };

    allCerts.push(newCert);
    this.saveAllCertificates(allCerts);

    // Strictly 1 star awarded on first completion
    if (student) {
      student.totalStars += 1;
      this.saveProfiles(profiles);

      const current = this.getCurrentStudent();
      if (current && current.id === student.id) {
        this.setCurrentStudent(student);
      }
    }

    return {
      certificate: newCert,
      isNew: true,
      updatedStudent: student || null,
    };
  }
}
