import { ExerciseItem } from '../../types';

export const topic8Exercises: Record<string, ExerciseItem[]> = {
  bai_29: [
    {
      id: 'b29_ex_1',
      lessonId: 'bai_29',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 24 + 3 = ?',
      options: ['26', '27', '28', '54'],
      correctAnswer: '27',
      explanation: '4 cộng 3 bằng 7; viết 2 ở hàng chục, được 27.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 58 }
    },
    {
      id: 'b29_ex_2',
      lessonId: 'bai_29',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Khi đặt tính phép cộng 35 + 2 theo cột dọc, chữ số 2 phải thẳng cột với chữ số nào?',
      options: ['Chữ số 5 (hàng đơn vị)', 'Chữ số 3 (hàng chục)', 'Đặt ở vị trí nào cũng được', 'Giữa số 3 và số 5'],
      correctAnswer: 'Chữ số 5 (hàng đơn vị)',
      explanation: 'Các chữ số ở cùng một hàng đơn vị phải đặt thẳng cột với nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 59 }
    },
    {
      id: 'b29_ex_3',
      lessonId: 'bai_29',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính kết quả: 41 + 6 = ?',
      options: ['46', '47', '48', '57'],
      correctAnswer: '47',
      explanation: '1 + 6 = 7, giữ nguyên 4 chục được 47.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 60 }
    },
    {
      id: 'b29_ex_4',
      lessonId: 'bai_29',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Tính kết quả: 50 + 8 = ?',
      options: ['57', '58', '59', '68'],
      correctAnswer: '58',
      explanation: '50 + 8 = 58.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 61 }
    },
    {
      id: 'b29_ex_5',
      lessonId: 'bai_29',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Lớp 1B có 32 học sinh, hôm nay có thêm 3 bạn mới chuyển vào lớp. Hỏi lớp 1B hiện tại có bao nhiêu bạn?',
      options: ['34 bạn', '35 bạn', '36 bạn', '33 bạn'],
      correctAnswer: '35 bạn',
      explanation: '32 + 3 = 35 học sinh.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 62 }
    },
    {
      id: 'b29_ex_6',
      lessonId: 'bai_29',
      questionNumber: 6,
      type: 'fill_blank',
      level: 'Thử thách',
      question: 'Tìm số thích hợp điền vào chỗ chấm: 63 + ... = 67',
      options: ['3', '4', '5', '2'],
      correctAnswer: '4',
      explanation: 'Vì 3 + 4 = 7 nên 63 + 4 = 67. Số cần điền là 4.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 62 }
    }
  ],

  bai_30: [
    {
      id: 'b30_ex_1',
      lessonId: 'bai_30',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 23 + 15 = ?',
      options: ['37', '38', '39', '48'],
      correctAnswer: '38',
      explanation: '3 + 5 = 8; 2 + 1 = 3. Kết quả là 38.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 64 }
    },
    {
      id: 'b30_ex_2',
      lessonId: 'bai_30',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Cộng hai số tròn chục: 40 + 30 = ?',
      options: ['60', '70', '80', '50'],
      correctAnswer: '70',
      explanation: '4 chục + 3 chục = 7 chục (70).',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 65 }
    },
    {
      id: 'b30_ex_3',
      lessonId: 'bai_30',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính kết quả: 52 + 26 = ?',
      options: ['77', '78', '79', '68'],
      correctAnswer: '78',
      explanation: '2 + 6 = 8; 5 + 2 = 7. Kết quả là 78.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 66 }
    },
    {
      id: 'b30_ex_4',
      lessonId: 'bai_30',
      questionNumber: 4,
      type: 'compare',
      level: 'Luyện tập',
      question: 'Chọn dấu so sánh đúng: 34 + 12 ... 45',
      options: ['>', '<', '=', '+'],
      correctAnswer: '>',
      explanation: 'Vì 34 + 12 = 46 mà 46 > 45 nên điền dấu >.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 67 }
    },
    {
      id: 'b30_ex_5',
      lessonId: 'bai_30',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Trang trại nuôi 25 con gà mái và 14 con gà trống. Hỏi đàn gà có tất cả bao nhiêu con?',
      options: ['38 con', '39 con', '40 con', '29 con'],
      correctAnswer: '39 con',
      explanation: '25 + 14 = 39 con gà.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 68 }
    },
    {
      id: 'b30_ex_6',
      lessonId: 'bai_30',
      questionNumber: 6,
      type: 'fill_blank',
      level: 'Thử thách',
      question: 'Tìm số tròn chục thích hợp: 30 + ... = 50',
      options: ['10', '20', '30', '40'],
      correctAnswer: '20',
      explanation: '3 chục + 2 chục = 5 chục (30 + 20 = 50). Số cần điền là 20.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 68 }
    }
  ],

  bai_31: [
    {
      id: 'b31_ex_1',
      lessonId: 'bai_31',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 48 - 5 = ?',
      options: ['42', '43', '44', '33'],
      correctAnswer: '43',
      explanation: '8 - 5 = 3, giữ nguyên 4 chục được 43.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 70 }
    },
    {
      id: 'b31_ex_2',
      lessonId: 'bai_31',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Khi thực hiện phép tính 67 - 4, ta lấy chữ số nào trừ đi 4?',
      options: ['Lấy chữ số 7 trừ đi 4', 'Lấy chữ số 6 trừ đi 4', 'Lấy 67 cộng 4', 'Lấy 60 trừ đi 4'],
      correctAnswer: 'Lấy chữ số 7 trừ đi 4',
      explanation: 'Trừ chữ số ở hàng đơn vị trước: 7 - 4 = 3, hạ 6 chục được 63.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 71 }
    },
    {
      id: 'b31_ex_3',
      lessonId: 'bai_31',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính kết quả: 89 - 7 = ?',
      options: ['81', '82', '83', '92'],
      correctAnswer: '82',
      explanation: '9 - 7 = 2, giữ nguyên 8 chục được 82.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 72 }
    },
    {
      id: 'b31_ex_4',
      lessonId: 'bai_31',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Tính kết quả: 76 - 6 = ?',
      options: ['60', '70', '76', '82'],
      correctAnswer: '70',
      explanation: '6 - 6 = 0, giữ nguyên 7 chục được 70.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 73 }
    },
    {
      id: 'b31_ex_5',
      lessonId: 'bai_31',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bác thợ may có cuộn ruy băng dài 58 cm, bác đã cắt 5 cm làm nơ cài áo. Cuộn ruy băng còn lại dài bao nhiêu cm?',
      options: ['52 cm', '53 cm', '54 cm', '55 cm'],
      correctAnswer: '53 cm',
      explanation: '58 cm - 5 cm = 53 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 74 }
    },
    {
      id: 'b31_ex_6',
      lessonId: 'bai_31',
      questionNumber: 6,
      type: 'fill_blank',
      level: 'Thử thách',
      question: 'Tìm số thích hợp điền vào chỗ chấm: 39 - ... = 35',
      options: ['3', '4', '5', '2'],
      correctAnswer: '4',
      explanation: 'Vì 9 - 4 = 5 nên 39 - 4 = 35. Số cần điền là 4.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 74 }
    }
  ],

  bai_32: [
    {
      id: 'b32_ex_1',
      lessonId: 'bai_32',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 57 - 24 = ?',
      options: ['32', '33', '34', '43'],
      correctAnswer: '33',
      explanation: '7 - 4 = 3; 5 - 2 = 3. Kết quả là 33.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 76 }
    },
    {
      id: 'b32_ex_2',
      lessonId: 'bai_32',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Trừ hai số tròn chục: 70 - 30 = ?',
      options: ['30', '40', '50', '20'],
      correctAnswer: '40',
      explanation: '7 chục - 3 chục = 4 chục (40).',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 77 }
    },
    {
      id: 'b32_ex_3',
      lessonId: 'bai_32',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính kết quả: 86 - 42 = ?',
      options: ['43', '44', '45', '54'],
      correctAnswer: '44',
      explanation: '6 - 2 = 4; 8 - 4 = 4. Kết quả là 44.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 78 }
    },
    {
      id: 'b32_ex_4',
      lessonId: 'bai_32',
      questionNumber: 4,
      type: 'compare',
      level: 'Luyện tập',
      question: 'Chọn dấu so sánh đúng: 65 - 23 ... 40',
      options: ['>', '<', '=', '+'],
      correctAnswer: '>',
      explanation: 'Vì 65 - 23 = 42 mà 42 > 40 nên điền dấu >.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 79 }
    },
    {
      id: 'b32_ex_5',
      lessonId: 'bai_32',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Xe buýt chở 45 hành khách, đến trạm dừng có 12 hành khách xuống xe. Hỏi trên xe buýt còn lại bao nhiêu hành khách?',
      options: ['32 người', '33 người', '34 người', '23 người'],
      correctAnswer: '33 người',
      explanation: '45 - 12 = 33 hành khách.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 80 }
    },
    {
      id: 'b32_ex_6',
      lessonId: 'bai_32',
      questionNumber: 6,
      type: 'fill_blank',
      level: 'Thử thách',
      question: 'Tìm số thích hợp điền vào ô trống: 95 - ... = 45',
      options: ['40', '50', '60', '30'],
      correctAnswer: '50',
      explanation: '95 - 50 = 45. Số cần điền là 50.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 80 }
    }
  ],

  bai_33: [
    {
      id: 'b33_ex_1',
      lessonId: 'bai_33',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 32 + 25 = ?',
      options: ['56', '57', '58', '47'],
      correctAnswer: '57',
      explanation: '2 + 5 = 7; 3 + 2 = 5. Kết quả là 57.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 82 }
    },
    {
      id: 'b33_ex_2',
      lessonId: 'bai_33',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 68 - 16 = ?',
      options: ['51', '52', '53', '42'],
      correctAnswer: '52',
      explanation: '8 - 6 = 2; 6 - 1 = 5. Kết quả là 52.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 83 }
    },
    {
      id: 'b33_ex_3',
      lessonId: 'bai_33',
      questionNumber: 3,
      type: 'compare',
      level: 'Thực hành',
      question: 'Chọn dấu so sánh đúng: 30 + 20 ... 60 - 10',
      options: ['=', '<', '>', '+'],
      correctAnswer: '=',
      explanation: '30 + 20 = 50 và 60 - 10 = 50 nên 30 + 20 = 60 - 10.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 84 }
    },
    {
      id: 'b33_ex_4',
      lessonId: 'bai_33',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Tính kết quả dãy tính: 45 + 4 - 3 = ?',
      options: ['45', '46', '47', '48'],
      correctAnswer: '46',
      explanation: '45 + 4 = 49; sau đó 49 - 3 = 46.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 85 }
    },
    {
      id: 'b33_ex_5',
      lessonId: 'bai_33',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Khối lớp Một có 54 bạn nam và 42 bạn nữ. Hỏi khối lớp Một có tất cả bao nhiêu bạn học sinh?',
      options: ['95 bạn', '96 bạn', '97 bạn', '86 bạn'],
      correctAnswer: '96 bạn',
      explanation: '54 + 42 = 96 học sinh.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 86 }
    },
    {
      id: 'b33_ex_6',
      lessonId: 'bai_33',
      questionNumber: 6,
      type: 'fill_blank',
      level: 'Thử thách',
      question: 'Tìm số tròn chục thích hợp: 20 + 30 + ... = 80',
      options: ['20', '30', '40', '10'],
      correctAnswer: '30',
      explanation: '20 + 30 = 50; 50 + 30 = 80. Số cần điền là 30.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 86 }
    }
  ]
};
