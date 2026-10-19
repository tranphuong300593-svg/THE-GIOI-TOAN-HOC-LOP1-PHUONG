import { ExerciseItem } from '../../types';

export const topic9Exercises: Record<string, ExerciseItem[]> = {
  bai_34: [
    {
      id: 'b34_ex_1',
      lessonId: 'bai_34',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Quan sát đồng hồ: Kim dài chỉ số 12, kim ngắn chỉ số 7. Đồng hồ đang chỉ mấy giờ?',
      illustration: { type: 'clock_face', data: { hour: 7, minute: 0 } },
      options: ['6 giờ', '7 giờ', '8 giờ', '12 giờ'],
      correctAnswer: '7 giờ',
      explanation: 'Kim phút chỉ số 12, kim giờ chỉ số 7 là đúng 7 giờ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 88 }
    },
    {
      id: 'b34_ex_2',
      lessonId: 'bai_34',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Trên mặt đồng hồ tròn có kim ngắn và kim dài. Chức năng của mỗi kim là gì?',
      options: [
        'Kim ngắn chỉ giờ, kim dài chỉ phút',
        'Kim ngắn chỉ phút, kim dài chỉ giờ',
        'Cả hai kim đều chỉ giờ',
        'Cả hai kim đều chỉ phút'
      ],
      correctAnswer: 'Kim ngắn chỉ giờ, kim dài chỉ phút',
      explanation: 'Kim ngắn chỉ giờ (chạy chậm), kim dài chỉ phút (chạy nhanh).',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 89 }
    },
    {
      id: 'b34_ex_3',
      lessonId: 'bai_34',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Quan sát đồng hồ: Kim dài chỉ số 12, kim ngắn chỉ số 9. Lúc này là mấy giờ?',
      illustration: { type: 'clock_face', data: { hour: 9, minute: 0 } },
      options: ['8 giờ', '9 giờ', '10 giờ', '12 giờ'],
      correctAnswer: '9 giờ',
      explanation: 'Kim dài chỉ số 12, kim ngắn chỉ số 9 là 9 giờ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 90 }
    },
    {
      id: 'b34_ex_4',
      lessonId: 'bai_34',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Quan sát đồng hồ: Kim dài chỉ số 12, kim ngắn chỉ số 2. Lúc này là mấy giờ?',
      illustration: { type: 'clock_face', data: { hour: 2, minute: 0 } },
      options: ['1 giờ', '2 giờ', '3 giờ', '12 giờ'],
      correctAnswer: '2 giờ',
      explanation: 'Kim dài chỉ số 12, kim ngắn chỉ số 2 là 2 giờ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 91 }
    },
    {
      id: 'b34_ex_5',
      lessonId: 'bai_34',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Mỗi buổi sáng em vào lớp học lúc 8 giờ đúng. Lúc đó kim ngắn của đồng hồ chỉ số mấy?',
      options: ['Số 8', 'Số 12', 'Số 7', 'Số 6'],
      correctAnswer: 'Số 8',
      explanation: '8 giờ đúng thì kim ngắn (kim giờ) chỉ đúng số 8.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 92 }
    },
    {
      id: 'b34_ex_6',
      lessonId: 'bai_34',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Bây giờ đồng hồ chỉ 8 giờ đúng. Hỏi 2 giờ nữa đồng hồ sẽ chỉ mấy giờ?',
      options: ['9 giờ', '10 giờ', '11 giờ', '12 giờ'],
      correctAnswer: '10 giờ',
      explanation: '8 + 2 = 10 giờ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 92 }
    }
  ],

  bai_35: [
    {
      id: 'b35_ex_1',
      lessonId: 'bai_35',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Một tuần lễ có tất cả bao nhiêu ngày?',
      options: ['5 ngày', '6 ngày', '7 ngày', '8 ngày'],
      correctAnswer: '7 ngày',
      explanation: 'Một tuần lễ luôn có đúng 7 ngày.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 94 }
    },
    {
      id: 'b35_ex_2',
      lessonId: 'bai_35',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Ngày đầu tiên mở đầu cho một tuần lễ mới là thứ mấy?',
      options: ['Thứ Hai', 'Thứ Ba', 'Chủ nhật', 'Thứ Bảy'],
      correctAnswer: 'Thứ Hai',
      explanation: 'Thứ Hai là ngày đầu tiên của tuần lễ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 95 }
    },
    {
      id: 'b35_ex_3',
      lessonId: 'bai_35',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Nếu hôm nay là Thứ Ba thì ngày mai sẽ là thứ mấy?',
      options: ['Thứ Tư', 'Thứ Năm', 'Thứ Hai', 'Thứ Sáu'],
      correctAnswer: 'Thứ Tư',
      explanation: 'Sau Thứ Ba là Thứ Tư.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 96 }
    },
    {
      id: 'b35_ex_4',
      lessonId: 'bai_35',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Hai ngày nghỉ cuối tuần thường dành để nghỉ ngơi cùng gia đình là những ngày nào?',
      options: ['Thứ Bảy và Chủ nhật', 'Thứ Sáu và Thứ Bảy', 'Chủ nhật và Thứ Hai', 'Thứ Năm và Thứ Sáu'],
      correctAnswer: 'Thứ Bảy và Chủ nhật',
      explanation: 'Thứ Bảy và Chủ nhật là hai ngày cuối tuần.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 97 }
    },
    {
      id: 'b35_ex_5',
      lessonId: 'bai_35',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Hôm nay là Thứ Sáu. Hỏi ngày hôm qua là thứ mấy?',
      options: ['Thứ Năm', 'Thứ Bảy', 'Thứ Tư', 'Chủ nhật'],
      correctAnswer: 'Thứ Năm',
      explanation: 'Ngày liền trước Thứ Sáu là Thứ Năm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 98 }
    },
    {
      id: 'b35_ex_6',
      lessonId: 'bai_35',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Bạn An đi học từ Thứ Hai đến Thứ Sáu trong tuần. Hỏi trong một tuần lễ An được nghỉ học mấy ngày?',
      options: ['2 ngày', '3 ngày', '1 ngày', '5 ngày'],
      correctAnswer: '2 ngày',
      explanation: 'Một tuần có 7 ngày, An đi học 5 ngày thì được nghỉ 2 ngày (7 - 5 = 2).',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 98 }
    }
  ],

  bai_36: [
    {
      id: 'b36_ex_1',
      lessonId: 'bai_36',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tờ lịch bóc tường ghi: "Thứ Năm, Ngày 15". Số 15 biểu thị điều gì?',
      illustration: { type: 'calendar_page', data: { dayOfWeek: 'Thứ Năm', day: 15, month: 4 } },
      options: ['Ngày trong tháng', 'Thứ trong tuần', 'Tháng trong năm', 'Số giờ'],
      correctAnswer: 'Ngày trong tháng',
      explanation: 'Số 15 là ngày 15 trong tháng.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 100 }
    },
    {
      id: 'b36_ex_2',
      lessonId: 'bai_36',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Đồng hồ chỉ 10 giờ đêm, lúc này là thời gian thích hợp cho hoạt động nào?',
      illustration: { type: 'clock_face', data: { hour: 10, minute: 0 } },
      options: ['Bé đi ngủ để giữ gìn sức khỏe', 'Bé đi học ở trường', 'Bé tập thể dục ngoài trời', 'Bé ăn cơm trưa'],
      correctAnswer: 'Bé đi ngủ để giữ gìn sức khỏe',
      explanation: '10 giờ đêm là giờ ngủ lý tưởng của học sinh tiểu học.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 101 }
    },
    {
      id: 'b36_ex_3',
      lessonId: 'bai_36',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Quan sát tờ lịch: Ngày 20 là Thứ Bảy. Hỏi ngày 21 liền sau là thứ mấy?',
      illustration: { type: 'calendar_page', data: { dayOfWeek: 'Thứ Bảy', day: 20, month: 5 } },
      options: ['Chủ nhật', 'Thứ Hai', 'Thứ Sáu', 'Thứ Năm'],
      correctAnswer: 'Chủ nhật',
      explanation: 'Sau Thứ Bảy là ngày Chủ nhật.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 102 }
    },
    {
      id: 'b36_ex_4',
      lessonId: 'bai_36',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Đồng hồ chỉ kim dài vào số 12 và kim ngắn vào số 11. Lúc này là mấy giờ?',
      illustration: { type: 'clock_face', data: { hour: 11, minute: 0 } },
      options: ['11 giờ', '12 giờ', '10 giờ', '1 giờ'],
      correctAnswer: '11 giờ',
      explanation: 'Kim dài chỉ 12, kim ngắn chỉ 11 là 11 giờ đúng.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 103 }
    },
    {
      id: 'b36_ex_5',
      lessonId: 'bai_36',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Buổi chiều em tan học lúc 4 giờ, em về đến nhà lúc 5 giờ. Em đi từ trường về nhà mất bao nhiêu giờ?',
      options: ['1 giờ', '2 giờ', '3 giờ', '4 giờ'],
      correctAnswer: '1 giờ',
      explanation: '5 - 4 = 1 giờ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 104 }
    },
    {
      id: 'b36_ex_6',
      lessonId: 'bai_36',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Nếu ngày 1 của tháng rơi vào Thứ Hai, hỏi ngày 8 của tháng đó là thứ mấy?',
      options: ['Thứ Hai', 'Thứ Ba', 'Chủ nhật', 'Thứ Bảy'],
      correctAnswer: 'Thứ Hai',
      explanation: 'Một tuần có 7 ngày: 1 + 7 = 8, nên ngày 8 cũng là Thứ Hai.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 104 }
    }
  ],

  bai_37: [
    {
      id: 'b37_ex_1',
      lessonId: 'bai_37',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Khi kim phút chỉ đúng số 12 và kim giờ chỉ số 6 thì đồng hồ chỉ mấy giờ?',
      illustration: { type: 'clock_face', data: { hour: 6, minute: 0 } },
      options: ['6 giờ', '12 giờ', '5 giờ', '7 giờ'],
      correctAnswer: '6 giờ',
      explanation: 'Kim giờ chỉ số 6, kim phút chỉ số 12 là 6 giờ đúng.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 106 }
    },
    {
      id: 'b37_ex_2',
      lessonId: 'bai_37',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Một tuần lễ gồm các ngày theo thứ tự: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy và:',
      options: ['Chủ nhật', 'Thứ Tám', 'Thứ Chín', 'Thứ Mười'],
      correctAnswer: 'Chủ nhật',
      explanation: 'Ngày cuối cùng của tuần lễ là Chủ nhật.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 107 }
    },
    {
      id: 'b37_ex_3',
      lessonId: 'bai_37',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Đồng hồ đang chỉ đúng 3 giờ. Kim ngắn của đồng hồ chỉ vào số mấy?',
      illustration: { type: 'clock_face', data: { hour: 3, minute: 0 } },
      options: ['Số 3', 'Số 12', 'Số 6', 'Số 9'],
      correctAnswer: 'Số 3',
      explanation: '3 giờ thì kim ngắn chỉ số 3, kim dài chỉ số 12.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 108 }
    },
    {
      id: 'b37_ex_4',
      lessonId: 'bai_37',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Hôm nay là Thứ Tư ngày 10. Thứ Tư tuần sau sẽ là ngày bao nhiêu?',
      options: ['Ngày 17', 'Ngày 16', 'Ngày 18', 'Ngày 15'],
      correctAnswer: 'Ngày 17',
      explanation: 'Thứ Tư tuần sau cách 7 ngày: 10 + 7 = 17.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 109 }
    },
    {
      id: 'b37_ex_5',
      lessonId: 'bai_37',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bạn An bắt đầu vẽ tranh lúc 8 giờ và vẽ xong lúc 10 giờ. Hỏi An đã vẽ bức tranh đó trong mấy giờ?',
      options: ['2 giờ', '3 giờ', '1 giờ', '4 giờ'],
      correctAnswer: '2 giờ',
      explanation: '10 - 8 = 2 giờ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 110 }
    },
    {
      id: 'b37_ex_6',
      lessonId: 'bai_37',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Nếu hôm qua là ngày Chủ nhật thì ngày mai sẽ là thứ mấy?',
      options: ['Thứ Ba', 'Thứ Hai', 'Thứ Tư', 'Thứ Bảy'],
      correctAnswer: 'Thứ Ba',
      explanation: 'Hôm qua là Chủ nhật -> Hôm nay là Thứ Hai -> Ngày mai là Thứ Ba.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 110 }
    }
  ]
};
