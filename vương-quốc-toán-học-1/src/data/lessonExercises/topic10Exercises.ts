import { ExerciseItem } from '../../types';

export const topic10Exercises: Record<string, ExerciseItem[]> = {
  bai_38: [
    {
      id: 'b38_ex_1',
      lessonId: 'bai_38',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 6 + 4 = ?',
      options: ['9', '10', '8', '7'],
      correctAnswer: '10',
      explanation: '6 + 4 = 10.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 112 }
    },
    {
      id: 'b38_ex_2',
      lessonId: 'bai_38',
      questionNumber: 2,
      type: 'fill_blank',
      level: 'Cơ bản',
      question: '10 gồm 3 và mấy?',
      illustration: { type: 'number_igloo', data: { total: 10, partA: 3, partB: '?' } },
      options: ['6', '7', '8', '5'],
      correctAnswer: '7',
      explanation: '10 gồm 3 và 7 (3 + 7 = 10).',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 113 }
    },
    {
      id: 'b38_ex_3',
      lessonId: 'bai_38',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính kết quả: 9 - 3 = ?',
      options: ['5', '6', '7', '8'],
      correctAnswer: '6',
      explanation: '9 - 3 = 6.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 114 }
    },
    {
      id: 'b38_ex_4',
      lessonId: 'bai_38',
      questionNumber: 4,
      type: 'compare',
      level: 'Luyện tập',
      question: 'Điền dấu thích hợp: 7 - 2 ... 5',
      options: ['=', '<', '>', '+'],
      correctAnswer: '=',
      explanation: 'Vì 7 - 2 = 5 nên 7 - 2 = 5.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 115 }
    },
    {
      id: 'b38_ex_5',
      lessonId: 'bai_38',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Có 8 chú vịt đang bơi dưới ao, 3 chú vịt leo lên bờ sưởi nắng. Hỏi dưới ao còn lại bao nhiêu chú vịt?',
      options: ['4 chú', '5 chú', '6 chú', '3 chú'],
      correctAnswer: '5 chú',
      explanation: '8 - 3 = 5 chú vịt.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 116 }
    },
    {
      id: 'b38_ex_6',
      lessonId: 'bai_38',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Tính kết quả dãy tính: 10 - 2 - 3 = ?',
      options: ['4', '5', '6', '7'],
      correctAnswer: '5',
      explanation: '10 - 2 = 8; sau đó 8 - 3 = 5.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 116 }
    }
  ],

  bai_39: [
    {
      id: 'b39_ex_1',
      lessonId: 'bai_39',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số gồm 9 chục và 9 đơn vị viết là số nào?',
      options: ['99', '909', '19', '90'],
      correctAnswer: '99',
      explanation: '9 chục và 9 đơn vị viết là 99.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 117 }
    },
    {
      id: 'b39_ex_2',
      lessonId: 'bai_39',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 45 + 3 = ?',
      options: ['47', '48', '49', '58'],
      correctAnswer: '48',
      explanation: '5 + 3 = 8; giữ nguyên 4 chục được 48.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 118 }
    },
    {
      id: 'b39_ex_3',
      lessonId: 'bai_39',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính kết quả: 78 - 25 = ?',
      options: ['52', '53', '54', '63'],
      correctAnswer: '53',
      explanation: '8 - 5 = 3; 7 - 2 = 5. Kết quả là 53.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 119 }
    },
    {
      id: 'b39_ex_4',
      lessonId: 'bai_39',
      questionNumber: 4,
      type: 'compare',
      level: 'Luyện tập',
      question: 'Chọn dấu so sánh đúng: 54 + 20 ... 70',
      options: ['>', '<', '=', '+'],
      correctAnswer: '>',
      explanation: 'Vì 54 + 20 = 74 mà 74 > 70 nên điền dấu >.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 120 }
    },
    {
      id: 'b39_ex_5',
      lessonId: 'bai_39',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Lớp 1A có 35 học sinh, lớp 1B có 34 học sinh. Hỏi cả hai lớp có tất cả bao nhiêu bạn học sinh?',
      options: ['68 bạn', '69 bạn', '70 bạn', '59 bạn'],
      correctAnswer: '69 bạn',
      explanation: '35 + 34 = 69 học sinh.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 121 }
    },
    {
      id: 'b39_ex_6',
      lessonId: 'bai_39',
      questionNumber: 6,
      type: 'fill_blank',
      level: 'Thử thách',
      question: 'Tìm số tròn chục thích hợp: 90 - ... = 40',
      options: ['40', '50', '60', '30'],
      correctAnswer: '50',
      explanation: '9 chục - 5 chục = 4 chục (90 - 50 = 40). Số cần điền là 50.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 121 }
    }
  ],

  bai_40: [
    {
      id: 'b40_ex_1',
      lessonId: 'bai_40',
      questionNumber: 1,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Hình phẳng có bốn cạnh dài bằng nhau là hình gì?',
      illustration: { type: 'flat_shapes', shape: 'square' },
      options: ['Hình vuông', 'Hình tròn', 'Hình tam giác', 'Hình chữ nhật'],
      correctAnswer: 'Hình vuông',
      explanation: 'Hình vuông có 4 cạnh dài bằng nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 122 }
    },
    {
      id: 'b40_ex_2',
      lessonId: 'bai_40',
      questionNumber: 2,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Quan sát hình vẽ. Đầu trái bút chì trùng đúng vạch số 0, đầu nhọn chạm đúng vạch số 7 cm. Bút chì dài bao nhiêu xăng-ti-mét?',
      illustration: { type: 'ruler_cm', data: { lengthCm: 7, item: 'pencil' } },
      options: ['5 cm', '6 cm', '7 cm', '8 cm'],
      correctAnswer: '7 cm',
      explanation: 'Đầu trái ở vạch 0, đầu nhọn ở vạch 7 nên bút chì dài đúng 7 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 123 }
    },
    {
      id: 'b40_ex_3',
      lessonId: 'bai_40',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Quan sát đồng hồ: Kim dài chỉ số 12, kim ngắn chỉ số 4. Đồng hồ chỉ mấy giờ?',
      illustration: { type: 'clock_face', data: { hour: 4, minute: 0 } },
      options: ['3 giờ', '4 giờ', '5 giờ', '12 giờ'],
      correctAnswer: '4 giờ',
      explanation: 'Kim dài chỉ 12, kim ngắn chỉ 4 là 4 giờ đúng.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 124 }
    },
    {
      id: 'b40_ex_4',
      lessonId: 'bai_40',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Tính: 12 cm + 5 cm = ?',
      options: ['16 cm', '17 cm', '18 cm', '15 cm'],
      correctAnswer: '17 cm',
      explanation: '12 cm + 5 cm = 17 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 125 }
    },
    {
      id: 'b40_ex_5',
      lessonId: 'bai_40',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Một tuần lễ có 7 ngày. Bạn Lan đi học 5 ngày, còn lại nghỉ ở nhà giúp mẹ. Hỏi Lan nghỉ mấy ngày trong tuần?',
      options: ['1 ngày', '2 ngày', '3 ngày', '4 ngày'],
      correctAnswer: '2 ngày',
      explanation: '7 - 5 = 2 ngày nghỉ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 126 }
    },
    {
      id: 'b40_ex_6',
      lessonId: 'bai_40',
      questionNumber: 6,
      type: 'geometry',
      level: 'Thử thách',
      question: 'Khối hình nào có đúng sáu mặt và các mặt đều là hình vuông bằng nhau?',
      illustration: { type: 'solids_3d', shape: 'cube' },
      options: ['Khối lập phương', 'Khối hộp chữ nhật', 'Hình vuông', 'Khối cầu'],
      correctAnswer: 'Khối lập phương',
      explanation: 'Khối lập phương có 6 mặt đều là hình vuông bằng nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 126 }
    }
  ],

  bai_41: [
    {
      id: 'b41_ex_1',
      lessonId: 'bai_41',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số liền trước của số 100 là số nào?',
      options: ['98', '99', '90', '101'],
      correctAnswer: '99',
      explanation: 'Số đứng ngay trước số 100 là số 99.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 127 }
    },
    {
      id: 'b41_ex_2',
      lessonId: 'bai_41',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính phép cộng tròn chục: 30 + 50 = ?',
      options: ['70', '80', '90', '60'],
      correctAnswer: '80',
      explanation: '3 chục + 5 chục = 8 chục (80).',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 127 }
    },
    {
      id: 'b41_ex_3',
      lessonId: 'bai_41',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính kết quả: 67 - 23 = ?',
      options: ['43', '44', '45', '54'],
      correctAnswer: '44',
      explanation: '7 - 3 = 4; 6 - 2 = 4. Kết quả là 44.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 128 }
    },
    {
      id: 'b41_ex_4',
      lessonId: 'bai_41',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Đoạn thẳng AB dài 8 cm, đoạn thẳng BC dài 10 cm. Đoạn thẳng nào dài hơn?',
      options: ['Đoạn thẳng BC', 'Đoạn thẳng AB', 'Hai đoạn bằng nhau', 'Không so sánh được'],
      correctAnswer: 'Đoạn thẳng BC',
      explanation: '10 cm > 8 cm nên đoạn thẳng BC dài hơn.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 128 }
    },
    {
      id: 'b41_ex_5',
      lessonId: 'bai_41',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bác nông dân thu hoạch được 45 bắp ngô nếp và 32 bắp ngô ngọt. Hỏi bác đã thu hoạch được tất cả bao nhiêu bắp ngô?',
      options: ['76 bắp', '77 bắp', '78 bắp', '67 bắp'],
      correctAnswer: '77 bắp',
      explanation: '45 + 32 = 77 bắp ngô.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 129 }
    },
    {
      id: 'b41_ex_6',
      lessonId: 'bai_41',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Tính nhanh kết quả dãy tính: 80 - 30 + 15 = ?',
      options: ['60', '65', '70', '55'],
      correctAnswer: '65',
      explanation: '80 - 30 = 50; 50 + 15 = 65.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 129 }
    }
  ]
};
