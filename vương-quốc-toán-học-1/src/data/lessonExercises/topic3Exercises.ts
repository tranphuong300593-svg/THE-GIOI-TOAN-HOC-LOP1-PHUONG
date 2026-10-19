import { ExerciseItem } from '../../types';

export const topic3Exercises: Record<string, ExerciseItem[]> = {
  bai_10: [
    {
      id: 'b10_ex_1',
      lessonId: 'bai_10',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Bé hãy tính kết quả của phép cộng: 3 + 2 = ?',
      illustration: { type: 'fruits', count: 3, secondaryCount: 2, itemType: 'apple' },
      options: ['4', '5', '6', '7'],
      correctAnswer: '5',
      explanation: '3 cộng 2 bằng 5 (3 gộp với 2 được 5).',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 66 }
    },
    {
      id: 'b10_ex_2',
      lessonId: 'bai_10',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Khi cộng một số bất kì với số 0 thì kết quả bằng bao nhiêu? (Ví dụ: 6 + 0 = ?)',
      options: ['Bằng chính số đó (bằng 6)', 'Bằng 0', 'Bằng 7', 'Bằng 1'],
      correctAnswer: 'Bằng chính số đó (bằng 6)',
      explanation: 'Bất kì số nào cộng với 0 cũng bằng chính số đó.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 67 }
    },
    {
      id: 'b10_ex_3',
      lessonId: 'bai_10',
      questionNumber: 3,
      type: 'count_items',
      level: 'Thực hành',
      question: 'Có 4 quả táo đỏ và thêm 3 quả táo xanh. Có tất cả bao nhiêu quả táo?',
      illustration: { type: 'fruits', count: 4, secondaryCount: 3, itemType: 'apple' },
      options: ['6', '7', '8', '9'],
      correctAnswer: '7',
      explanation: 'Thực hiện phép tính: 4 + 3 = 7 quả táo.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 68 }
    },
    {
      id: 'b10_ex_4',
      lessonId: 'bai_10',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Tìm kết quả của phép tính: 6 + 4 = ?',
      options: ['8', '9', '10', '7'],
      correctAnswer: '10',
      explanation: '6 + 4 = 10.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 69 }
    },
    {
      id: 'b10_ex_5',
      lessonId: 'bai_10',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Trên cành cây có 5 chú chim đang hót, có thêm 2 chú chim bay tới đậu cùng. Hỏi lúc này có tất cả bao nhiêu chú chim?',
      illustration: { type: 'animals', count: 5, secondaryCount: 2, itemType: 'chick' },
      options: ['6 chú chim', '7 chú chim', '8 chú chim', '9 chú chim'],
      correctAnswer: '7 chú chim',
      explanation: 'Phép tính: 5 + 2 = 7 chú chim.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 70 }
    },
    {
      id: 'b10_ex_6',
      lessonId: 'bai_10',
      questionNumber: 6,
      type: 'fill_blank',
      level: 'Thử thách',
      question: 'Tìm số thích hợp điền vào dấu chấm: 5 + ... = 9',
      options: ['3', '4', '5', '2'],
      correctAnswer: '4',
      explanation: 'Vì 5 + 4 = 9 nên số cần điền là 4.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 71 }
    }
  ],

  bai_11: [
    {
      id: 'b11_ex_1',
      lessonId: 'bai_11',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Bé hãy tính kết quả của phép trừ: 6 - 2 = ?',
      illustration: { type: 'fruits', count: 6, secondaryCount: 2, itemType: 'tomato' },
      options: ['3', '4', '5', '2'],
      correctAnswer: '4',
      explanation: '6 bớt 2 còn 4 (6 - 2 = 4).',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 73 }
    },
    {
      id: 'b11_ex_2',
      lessonId: 'bai_11',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Khi lấy một số trừ đi chính nó thì kết quả luôn bằng bao nhiêu? (Ví dụ: 5 - 5 = ?)',
      options: ['0', '1', '5', '10'],
      correctAnswer: '0',
      explanation: 'Một số trừ đi chính số đó luôn bằng 0.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 74 }
    },
    {
      id: 'b11_ex_3',
      lessonId: 'bai_11',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Có 8 chú cá bơi trong bể, bạn Nam vớt ra 3 chú cá sang bể khác. Hỏi trong bể còn lại mấy chú cá?',
      illustration: { type: 'sea_creatures', count: 8, secondaryCount: 3, itemType: 'fish' },
      options: ['4 chú cá', '5 chú cá', '6 chú cá', '3 chú cá'],
      correctAnswer: '5 chú cá',
      explanation: 'Phép tính: 8 - 3 = 5 chú cá.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 75 }
    },
    {
      id: 'b11_ex_4',
      lessonId: 'bai_11',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Tính kết quả: 10 - 4 = ?',
      options: ['5', '6', '7', '8'],
      correctAnswer: '6',
      explanation: '10 - 4 = 6.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 76 }
    },
    {
      id: 'b11_ex_5',
      lessonId: 'bai_11',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Mẹ mua về 9 quả cam, cả nhà ăn tráng miệng hết 4 quả cam. Hỏi mẹ còn lại bao nhiêu quả cam?',
      illustration: { type: 'fruits', count: 9, secondaryCount: 4, itemType: 'orange' },
      options: ['4 quả', '5 quả', '6 quả', '3 quả'],
      correctAnswer: '5 quả',
      explanation: 'Phép tính: 9 - 4 = 5 quả cam.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 77 }
    },
    {
      id: 'b11_ex_6',
      lessonId: 'bai_11',
      questionNumber: 6,
      type: 'fill_blank',
      level: 'Thử thách',
      question: 'Tìm số thích hợp điền vào chỗ chấm: 8 - ... = 3',
      options: ['4', '5', '6', '3'],
      correctAnswer: '5',
      explanation: 'Vì 8 - 5 = 3 nên số cần điền là 5.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 77 }
    }
  ],

  bai_12: [
    {
      id: 'b12_ex_1',
      lessonId: 'bai_12',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Trong bảng cộng phạm vi 10: 4 + 4 = ?',
      options: ['7', '8', '9', '6'],
      correctAnswer: '8',
      explanation: '4 + 4 = 8.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 79 }
    },
    {
      id: 'b12_ex_2',
      lessonId: 'bai_12',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Biết rằng 3 + 5 = 8. Hỏi 8 - 3 bằng bao nhiêu?',
      options: ['4', '5', '6', '3'],
      correctAnswer: '5',
      explanation: 'Phép trừ là phép tính ngược của phép cộng: 3 + 5 = 8 thì 8 - 3 = 5.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 80 }
    },
    {
      id: 'b12_ex_3',
      lessonId: 'bai_12',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính kết quả: 10 - 7 = ?',
      options: ['2', '3', '4', '5'],
      correctAnswer: '3',
      explanation: '10 - 7 = 3.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 81 }
    },
    {
      id: 'b12_ex_4',
      lessonId: 'bai_12',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Phép tính nào sau đây có kết quả bằng 9?',
      options: ['5 + 4', '3 + 5', '6 + 2', '10 - 2'],
      correctAnswer: '5 + 4',
      explanation: '5 + 4 = 9 (các phép tính còn lại: 3+5=8, 6+2=8, 10-2=8).',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 82 }
    },
    {
      id: 'b12_ex_5',
      lessonId: 'bai_12',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bạn Mai có 10 viên kẹo, Mai chia cho bạn Lan 4 viên kẹo. Hỏi Mai còn lại bao nhiêu viên kẹo?',
      options: ['5 viên', '6 viên', '7 viên', '4 viên'],
      correctAnswer: '6 viên',
      explanation: '10 - 4 = 6 viên kẹo.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 83 }
    },
    {
      id: 'b12_ex_6',
      lessonId: 'bai_12',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Thực hiện dãy tính liên tiếp: 3 + 4 - 2 = ?',
      options: ['4', '5', '6', '7'],
      correctAnswer: '5',
      explanation: '3 + 4 = 7; sau đó 7 - 2 = 5.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 83 }
    }
  ],

  bai_13: [
    {
      id: 'b13_ex_1',
      lessonId: 'bai_13',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 7 + 3 = ?',
      options: ['9', '10', '8', '6'],
      correctAnswer: '10',
      explanation: '7 + 3 = 10.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 85 }
    },
    {
      id: 'b13_ex_2',
      lessonId: 'bai_13',
      questionNumber: 2,
      type: 'compare',
      level: 'Cơ bản',
      question: 'Chọn dấu thích hợp so sánh hai vế: 5 + 2 ... 8 - 1',
      options: ['=', '<', '>', '+'],
      correctAnswer: '=',
      explanation: 'Vì 5 + 2 = 7 và 8 - 1 = 7, nên 5 + 2 = 8 - 1.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 86 }
    },
    {
      id: 'b13_ex_3',
      lessonId: 'bai_13',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính kết quả: 9 - 6 = ?',
      options: ['2', '3', '4', '5'],
      correctAnswer: '3',
      explanation: '9 - 6 = 3.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 87 }
    },
    {
      id: 'b13_ex_4',
      lessonId: 'bai_13',
      questionNumber: 4,
      type: 'fill_blank',
      level: 'Luyện tập',
      question: 'Điền số thích hợp vào chỗ chấm: ... + 2 = 8',
      options: ['5', '6', '7', '4'],
      correctAnswer: '6',
      explanation: 'Vì 6 + 2 = 8 nên số cần điền là 6.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 88 }
    },
    {
      id: 'b13_ex_5',
      lessonId: 'bai_13',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Trong rổ có 6 củ cà rốt, thỏ nhổ thêm 3 củ nữa rồi ăn mất 1 củ. Hỏi trong rổ còn lại mấy củ cà rốt?',
      options: ['7 củ', '8 củ', '9 củ', '6 củ'],
      correctAnswer: '8 củ',
      explanation: '6 + 3 = 9 củ; 9 - 1 = 8 củ cà rốt.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 89 }
    },
    {
      id: 'b13_ex_6',
      lessonId: 'bai_13',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Tính nhanh kết quả dãy tính: 10 - 5 + 3 = ?',
      options: ['7', '8', '9', '6'],
      correctAnswer: '8',
      explanation: '10 - 5 = 5; 5 + 3 = 8.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 89 }
    }
  ]
};
