import { ExerciseItem } from '../../types';

export const topic5Exercises: Record<string, ExerciseItem[]> = {
  bai_17: [
    {
      id: 'b17_ex_1',
      lessonId: 'bai_17',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Trong các số từ 0 đến 10, số nào là số lớn nhất?',
      options: ['8', '9', '10', '7'],
      correctAnswer: '10',
      explanation: 'Số 10 là số lớn nhất trong phạm vi từ 0 đến 10.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 110 }
    },
    {
      id: 'b17_ex_2',
      lessonId: 'bai_17',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số bé nhất trong dãy số tự nhiên từ 0 đến 10 là số nào?',
      options: ['0', '1', '2', '3'],
      correctAnswer: '0',
      explanation: 'Số 0 là số bé nhất trong dãy số tự nhiên.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 111 }
    },
    {
      id: 'b17_ex_3',
      lessonId: 'bai_17',
      questionNumber: 3,
      type: 'count_items',
      level: 'Thực hành',
      question: 'Bé đếm xem có tất cả bao nhiêu quả cà chua chín đỏ trong vườn?',
      illustration: { type: 'fruits', count: 9, itemType: 'tomato' },
      options: ['7', '8', '9', '10'],
      correctAnswer: '9',
      explanation: 'Đếm lần lượt có đúng 9 quả cà chua chín đỏ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 112 }
    },
    {
      id: 'b17_ex_4',
      lessonId: 'bai_17',
      questionNumber: 4,
      type: 'sort_numbers',
      level: 'Luyện tập',
      question: 'Sắp xếp các số sau theo thứ tự từ bé đến lớn: 4, 1, 9, 6',
      options: ['1, 4, 6, 9', '9, 6, 4, 1', '1, 6, 4, 9', '4, 1, 6, 9'],
      correctAnswer: '1, 4, 6, 9',
      explanation: 'Từ bé đến lớn: 1 < 4 < 6 < 9.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 113 }
    },
    {
      id: 'b17_ex_5',
      lessonId: 'bai_17',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Mỗi tuần em đi học từ thứ Hai đến thứ Sáu. Hỏi em đi học bao nhiêu ngày trong tuần?',
      options: ['4 ngày', '5 ngày', '6 ngày', '7 ngày'],
      correctAnswer: '5 ngày',
      explanation: 'Đếm: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu là 5 ngày.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 114 }
    },
    {
      id: 'b17_ex_6',
      lessonId: 'bai_17',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Tìm số thích hợp điền vào chỗ chấm: 3 < ... < 5',
      options: ['2', '3', '4', '6'],
      correctAnswer: '4',
      explanation: 'Số đứng giữa 3 và 5 là số 4 (3 < 4 < 5).',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 114 }
    }
  ],

  bai_18: [
    {
      id: 'b18_ex_1',
      lessonId: 'bai_18',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 5 + 4 = ?',
      options: ['8', '9', '10', '7'],
      correctAnswer: '9',
      explanation: '5 + 4 = 9.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 115 }
    },
    {
      id: 'b18_ex_2',
      lessonId: 'bai_18',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 8 - 0 = ?',
      options: ['8', '0', '7', '9'],
      correctAnswer: '8',
      explanation: 'Bất kì số nào trừ đi 0 cũng bằng chính số đó.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 115 }
    },
    {
      id: 'b18_ex_3',
      lessonId: 'bai_18',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính kết quả: 10 - 6 = ?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      explanation: '10 - 6 = 4.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 116 }
    },
    {
      id: 'b18_ex_4',
      lessonId: 'bai_18',
      questionNumber: 4,
      type: 'compare',
      level: 'Luyện tập',
      question: 'Chọn dấu thích hợp so sánh: 4 + 3 ... 8',
      options: ['<', '>', '=', '+'],
      correctAnswer: '<',
      explanation: 'Vì 4 + 3 = 7 mà 7 < 8 nên ta điền dấu <.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 116 }
    },
    {
      id: 'b18_ex_5',
      lessonId: 'bai_18',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Đàn gà nhà bạn An có tất cả 10 con, trong chuồng có 7 con. Hỏi ngoài sân có mấy con gà?',
      options: ['2 con', '3 con', '4 con', '5 con'],
      correctAnswer: '3 con',
      explanation: '10 - 7 = 3 con gà.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 117 }
    },
    {
      id: 'b18_ex_6',
      lessonId: 'bai_18',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Tính kết quả dãy tính: 2 + 5 + 3 = ?',
      options: ['9', '10', '8', '7'],
      correctAnswer: '10',
      explanation: '2 + 5 = 7; sau đó 7 + 3 = 10.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 117 }
    }
  ],

  bai_19: [
    {
      id: 'b19_ex_1',
      lessonId: 'bai_19',
      questionNumber: 1,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Hình phẳng nào có đúng 3 cạnh và 3 góc?',
      illustration: { type: 'flat_shapes', shape: 'triangle' },
      options: ['Hình tam giác', 'Hình vuông', 'Hình chữ nhật', 'Hình tròn'],
      correctAnswer: 'Hình tam giác',
      explanation: 'Hình tam giác có 3 cạnh và 3 góc.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 118 }
    },
    {
      id: 'b19_ex_2',
      lessonId: 'bai_19',
      questionNumber: 2,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Hình khối nào có 6 mặt đều là các hình vuông bằng nhau?',
      illustration: { type: 'solids_3d', shape: 'cube' },
      options: ['Khối lập phương', 'Khối hộp chữ nhật', 'Hình vuông', 'Khối trụ'],
      correctAnswer: 'Khối lập phương',
      explanation: 'Khối lập phương có 6 mặt vuông bằng nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 118 }
    },
    {
      id: 'b19_ex_3',
      lessonId: 'bai_19',
      questionNumber: 3,
      type: 'geometry',
      level: 'Thực hành',
      question: 'Mặt bàn học sinh thường có dạng hình học nào dưới đây?',
      illustration: { type: 'flat_shapes', shape: 'rectangle' },
      options: ['Hình chữ nhật', 'Hình tròn', 'Hình tam giác', 'Hình thoi'],
      correctAnswer: 'Hình chữ nhật',
      explanation: 'Mặt bàn học sinh thường là hình chữ nhật rộng rãi.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 119 }
    },
    {
      id: 'b19_ex_4',
      lessonId: 'bai_19',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Đồ vật nào dưới đây có dạng khối hộp chữ nhật?',
      illustration: { type: 'solids_3d', shape: 'cuboid' },
      options: ['Hộp phấn viết bảng', 'Quả bóng đá', 'Chiếc nón lá', 'Bánh xe'],
      correctAnswer: 'Hộp phấn viết bảng',
      explanation: 'Hộp phấn viết bảng có dạng khối hộp chữ nhật.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 119 }
    },
    {
      id: 'b19_ex_5',
      lessonId: 'bai_19',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Khi ngồi viết bài bằng tay phải, em nên đặt đèn bàn ở phía nào để tránh bóng của bàn tay che chữ?',
      options: ['Bên trái', 'Bên phải', 'Phía sau lưng', 'Dưới gầm bàn'],
      correctAnswer: 'Bên trái',
      explanation: 'Đặt đèn phía bên trái chiếu sang để không bị bóng tay phải che khuất khi viết.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 120 }
    },
    {
      id: 'b19_ex_6',
      lessonId: 'bai_19',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Cắt đôi một hình vuông bằng một đường chéo từ góc này sang góc kia, ta nhận được 2 hình gì?',
      options: ['2 hình tam giác', '2 hình vuông nhỏ', '2 hình chữ nhật', '2 hình tròn'],
      correctAnswer: '2 hình tam giác',
      explanation: 'Đường chéo chia hình vuông thành 2 hình tam giác bằng nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 120 }
    }
  ],

  bai_20: [
    {
      id: 'b20_ex_1',
      lessonId: 'bai_20',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính kết quả: 9 - 5 = ?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      explanation: '9 - 5 = 4.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 121 }
    },
    {
      id: 'b20_ex_2',
      lessonId: 'bai_20',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số liền sau của số 7 là số nào?',
      options: ['6', '7', '8', '9'],
      correctAnswer: '8',
      explanation: 'Số liền sau số 7 là số 8.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 121 }
    },
    {
      id: 'b20_ex_3',
      lessonId: 'bai_20',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Tính: 3 + 7 = ?',
      options: ['9', '10', '8', '7'],
      correctAnswer: '10',
      explanation: '3 + 7 = 10.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 122 }
    },
    {
      id: 'b20_ex_4',
      lessonId: 'bai_20',
      questionNumber: 4,
      type: 'compare',
      level: 'Luyện tập',
      question: 'Chọn dấu so sánh đúng: 10 - 2 ... 3 + 5',
      options: ['=', '<', '>', '+'],
      correctAnswer: '=',
      explanation: 'Vì 10 - 2 = 8 và 3 + 5 = 8 nên 10 - 2 = 3 + 5.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 122 }
    },
    {
      id: 'b20_ex_5',
      lessonId: 'bai_20',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Mẹ mua 10 quả trứng gà. Mẹ dùng 3 quả làm bánh và 2 quả rán ăn sáng. Hỏi mẹ còn lại bao nhiêu quả trứng?',
      options: ['4 quả', '5 quả', '6 quả', '3 quả'],
      correctAnswer: '5 quả',
      explanation: 'Mẹ đã dùng: 3 + 2 = 5 quả. Còn lại: 10 - 5 = 5 quả trứng.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 123 }
    },
    {
      id: 'b20_ex_6',
      lessonId: 'bai_20',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Tính kết quả dãy tính: 10 - 4 + 3 = ?',
      options: ['8', '9', '10', '7'],
      correctAnswer: '9',
      explanation: '10 - 4 = 6; 6 + 3 = 9.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 123 }
    }
  ]
};
