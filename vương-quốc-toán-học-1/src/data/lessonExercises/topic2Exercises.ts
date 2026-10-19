import { ExerciseItem } from '../../types';

export const topic2Exercises: Record<string, ExerciseItem[]> = {
  bai_7: [
    {
      id: 'b7_ex_1',
      lessonId: 'bai_7',
      questionNumber: 1,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Hình có bốn cạnh dài bằng nhau và bốn góc bằng nhau là hình gì?',
      illustration: { type: 'flat_shapes', shape: 'square' },
      options: ['Hình vuông', 'Hình tròn', 'Hình tam giác', 'Hình chữ nhật'],
      correctAnswer: 'Hình vuông',
      explanation: 'Hình vuông có 4 cạnh dài bằng nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 46 }
    },
    {
      id: 'b7_ex_2',
      lessonId: 'bai_7',
      questionNumber: 2,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Hình tam giác có tất cả bao nhiêu cạnh?',
      illustration: { type: 'flat_shapes', shape: 'triangle' },
      options: ['2 cạnh', '3 cạnh', '4 cạnh', '5 cạnh'],
      correctAnswer: '3 cạnh',
      explanation: 'Hình tam giác có đúng 3 cạnh và 3 đỉnh.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 47 }
    },
    {
      id: 'b7_ex_3',
      lessonId: 'bai_7',
      questionNumber: 3,
      type: 'geometry',
      level: 'Thực hành',
      question: 'Mặt đồng hồ tròn xoe trên tường có dạng hình gì?',
      illustration: { type: 'flat_shapes', shape: 'circle' },
      options: ['Hình vuông', 'Hình tròn', 'Hình chữ nhật', 'Hình tam giác'],
      correctAnswer: 'Hình tròn',
      explanation: 'Mặt đồng hồ tròn xoe có dạng hình tròn.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 48 }
    },
    {
      id: 'b7_ex_4',
      lessonId: 'bai_7',
      questionNumber: 4,
      type: 'geometry',
      level: 'Luyện tập',
      question: 'Bìa cuốn sách giáo khoa Toán 1 có dạng hình phẳng nào?',
      illustration: { type: 'flat_shapes', shape: 'rectangle' },
      options: ['Hình chữ nhật', 'Hình tròn', 'Hình tam giác', 'Hình vuông'],
      correctAnswer: 'Hình chữ nhật',
      explanation: 'Bìa sách giáo khoa có 2 cạnh dài và 2 cạnh ngắn, đó là hình chữ nhật.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 49 }
    },
    {
      id: 'b7_ex_5',
      lessonId: 'bai_7',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Chiếc biển báo giao thông hình tam giác cảnh báo người đi bộ. Biển báo đó có mấy đỉnh?',
      options: ['2 đỉnh', '3 đỉnh', '4 đỉnh', '0 đỉnh'],
      correctAnswer: '3 đỉnh',
      explanation: 'Hình tam giác luôn có 3 cạnh và 3 đỉnh.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 50 }
    },
    {
      id: 'b7_ex_6',
      lessonId: 'bai_7',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Hình nào dưới đây có đường bao quanh cong tròn, không có góc nào?',
      options: ['Hình tròn', 'Hình vuông', 'Hình chữ nhật', 'Hình tam giác'],
      correctAnswer: 'Hình tròn',
      explanation: 'Hình tròn có đường cong khép kín tròn trịa, không có cạnh thẳng và không có góc.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 51 }
    }
  ],

  bai_8: [
    {
      id: 'b8_ex_1',
      lessonId: 'bai_8',
      questionNumber: 1,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Bé dùng 4 que tính dài bằng nhau xếp nối tiếp kín thì được hình gì?',
      illustration: { type: 'flat_shapes', shape: 'square' },
      options: ['Hình vuông', 'Hình tròn', 'Hình tam giác', 'Hình chữ nhật'],
      correctAnswer: 'Hình vuông',
      explanation: '4 que tính dài bằng nhau xếp lại tạo thành hình vuông.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 53 }
    },
    {
      id: 'b8_ex_2',
      lessonId: 'bai_8',
      questionNumber: 2,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Muốn ghép một hình tam giác kín, bé cần ít nhất bao nhiêu que tính thẳng?',
      illustration: { type: 'flat_shapes', shape: 'triangle' },
      options: ['2 que', '3 que', '4 que', '5 que'],
      correctAnswer: '3 que',
      explanation: 'Cần ít nhất 3 que tính thẳng để ghép thành 3 cạnh của hình tam giác.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 54 }
    },
    {
      id: 'b8_ex_3',
      lessonId: 'bai_8',
      questionNumber: 3,
      type: 'geometry',
      level: 'Thực hành',
      question: 'Bé xếp một ngôi nhà gồm mái nhà hình tam giác và thân nhà hình gì dưới đây?',
      illustration: { type: 'shapes_composition', data: { roof: 'triangle', body: 'square' } },
      options: ['Hình vuông', 'Hình tròn', 'Hình thoi', 'Hình oval'],
      correctAnswer: 'Hình vuông',
      explanation: 'Thân nhà thường được ghép từ một hình vuông (hoặc hình chữ nhật).',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 55 }
    },
    {
      id: 'b8_ex_4',
      lessonId: 'bai_8',
      questionNumber: 4,
      type: 'geometry',
      level: 'Luyện tập',
      question: 'Ghép 2 hình vuông bằng nhau liền kề nhau ta sẽ được hình gì?',
      illustration: { type: 'flat_shapes', shape: 'rectangle' },
      options: ['Hình chữ nhật', 'Hình tam giác', 'Hình tròn', 'Hình vuông nhỏ hơn'],
      correctAnswer: 'Hình chữ nhật',
      explanation: 'Hai hình vuông đặt sát nhau tạo thành một hình chữ nhật.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 56 }
    },
    {
      id: 'b8_ex_5',
      lessonId: 'bai_8',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bạn Nam xếp một chiếc thuyền buồm trên mặt bàn. Cánh buồm có dạng hình phẳng nào?',
      illustration: { type: 'flat_shapes', shape: 'triangle' },
      options: ['Hình tam giác', 'Hình tròn', 'Hình chữ nhật', 'Hình vuông'],
      correctAnswer: 'Hình tam giác',
      explanation: 'Cánh buồm đón gió thường có dạng hình tam giác.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 57 }
    },
    {
      id: 'b8_ex_6',
      lessonId: 'bai_8',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Từ 2 hình tam giác vuông bằng nhau, bé có thể ghép lại được hình nào sau đây?',
      options: ['Hình chữ nhật (hoặc hình vuông)', 'Hình tròn', 'Hình lục giác', 'Hình tròn méo'],
      correctAnswer: 'Hình chữ nhật (hoặc hình vuông)',
      explanation: 'Ghép 2 hình tam giác vuông bằng nhau có thể tạo thành hình chữ nhật hoặc hình vuông.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 57 }
    }
  ],

  bai_9: [
    {
      id: 'b9_ex_1',
      lessonId: 'bai_9',
      questionNumber: 1,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Bánh xe đạp lăn bon bon trên đường có dạng hình gì?',
      illustration: { type: 'flat_shapes', shape: 'circle' },
      options: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'],
      correctAnswer: 'Hình tròn',
      explanation: 'Bánh xe đạp hình tròn giúp xe lăn dễ dàng.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 59 }
    },
    {
      id: 'b9_ex_2',
      lessonId: 'bai_9',
      questionNumber: 2,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Khăn quàng đỏ đội viên có dạng hình học nào dưới đây?',
      illustration: { type: 'flat_shapes', shape: 'triangle' },
      options: ['Hình tam giác', 'Hình vuông', 'Hình tròn', 'Hình chữ nhật'],
      correctAnswer: 'Hình tam giác',
      explanation: 'Khăn quàng đỏ có dạng hình tam giác cân.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 60 }
    },
    {
      id: 'b9_ex_3',
      lessonId: 'bai_9',
      questionNumber: 3,
      type: 'geometry',
      level: 'Thực hành',
      question: 'Chiếc bảng lớp màu xanh viết phấn có dạng hình gì?',
      illustration: { type: 'flat_shapes', shape: 'rectangle' },
      options: ['Hình chữ nhật', 'Hình vuông', 'Hình tròn', 'Hình tam giác'],
      correctAnswer: 'Hình chữ nhật',
      explanation: 'Bảng lớp thường có dạng hình chữ nhật dài.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 61 }
    },
    {
      id: 'b9_ex_4',
      lessonId: 'bai_9',
      questionNumber: 4,
      type: 'geometry',
      level: 'Luyện tập',
      question: 'Viên gạch men lát nền nhà có bốn cạnh bằng nhau là hình gì?',
      illustration: { type: 'flat_shapes', shape: 'square' },
      options: ['Hình vuông', 'Hình chữ nhật', 'Hình tam giác', 'Hình tròn'],
      correctAnswer: 'Hình vuông',
      explanation: 'Viên gạch men vuông vức có 4 cạnh bằng nhau là hình vuông.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 62 }
    },
    {
      id: 'b9_ex_5',
      lessonId: 'bai_9',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Trong giờ thể dục, thầy giáo cho các bạn xếp thành vòng tròn để chơi trò chơi. Vòng tròn đó gợi cho em hình gì?',
      options: ['Hình tròn', 'Hình tam giác', 'Hình vuông', 'Hình chữ nhật'],
      correctAnswer: 'Hình tròn',
      explanation: 'Vòng tròn trò chơi gợi nhớ đến hình tròn trong toán học.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 63 }
    },
    {
      id: 'b9_ex_6',
      lessonId: 'bai_9',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Hình nào dưới đây có đúng bốn đỉnh?',
      options: ['Hình vuông và hình chữ nhật', 'Hình tam giác', 'Hình tròn', 'Chỉ có hình tam giác'],
      correctAnswer: 'Hình vuông và hình chữ nhật',
      explanation: 'Cả hình vuông và hình chữ nhật đều có 4 cạnh và 4 đỉnh.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 63 }
    }
  ]
};
