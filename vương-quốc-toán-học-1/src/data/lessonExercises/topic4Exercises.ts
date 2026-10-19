import { ExerciseItem } from '../../types';

export const topic4Exercises: Record<string, ExerciseItem[]> = {
  bai_14: [
    {
      id: 'b14_ex_1',
      lessonId: 'bai_14',
      questionNumber: 1,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Con xúc xắc đồ chơi có sáu mặt đều là hình vuông là hình khối gì?',
      illustration: { type: 'solids_3d', shape: 'cube' },
      options: ['Khối lập phương', 'Khối hộp chữ nhật', 'Hình vuông', 'Hình tròn'],
      correctAnswer: 'Khối lập phương',
      explanation: 'Khối lập phương có 6 mặt đều là các hình vuông bằng nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 92 }
    },
    {
      id: 'b14_ex_2',
      lessonId: 'bai_14',
      questionNumber: 2,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Hộp sữa tươi giấy bé uống hằng ngày có dạng hình khối nào?',
      illustration: { type: 'solids_3d', shape: 'cuboid' },
      options: ['Khối hộp chữ nhật', 'Khối lập phương', 'Khối cầu', 'Hình tam giác'],
      correctAnswer: 'Khối hộp chữ nhật',
      explanation: 'Hộp sữa tươi thường có dạng khối hộp chữ nhật.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 93 }
    },
    {
      id: 'b14_ex_3',
      lessonId: 'bai_14',
      questionNumber: 3,
      type: 'geometry',
      level: 'Thực hành',
      question: 'Khối lập phương có tất cả bao nhiêu mặt phẳng?',
      illustration: { type: 'solids_3d', shape: 'cube' },
      options: ['4 mặt', '5 mặt', '6 mặt', '8 mặt'],
      correctAnswer: '6 mặt',
      explanation: 'Khối lập phương có đúng 6 mặt vuông bằng nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 94 }
    },
    {
      id: 'b14_ex_4',
      lessonId: 'bai_14',
      questionNumber: 4,
      type: 'geometry',
      level: 'Luyện tập',
      question: 'Bao diêm hoặc viên gạch xây nhà thường có dạng khối gì?',
      illustration: { type: 'solids_3d', shape: 'cuboid' },
      options: ['Khối hộp chữ nhật', 'Khối lập phương', 'Khối tròn', 'Khối trụ'],
      correctAnswer: 'Khối hộp chữ nhật',
      explanation: 'Viên gạch xây tường và bao diêm có dạng khối hộp chữ nhật.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 95 }
    },
    {
      id: 'b14_ex_5',
      lessonId: 'bai_14',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Chiếc tủ lạnh đứng ở góc bếp gia đình thường mang hình khối nào?',
      options: ['Khối hộp chữ nhật', 'Khối lập phương', 'Hình tròn', 'Hình tam giác'],
      correctAnswer: 'Khối hộp chữ nhật',
      explanation: 'Tủ lạnh gia đình có dạng khối hộp chữ nhật đứng.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 96 }
    },
    {
      id: 'b14_ex_6',
      lessonId: 'bai_14',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Đặc điểm nào dưới đây là của khối lập phương?',
      options: [
        'Cả 6 mặt đều là hình vuông bằng nhau',
        'Có 2 mặt hình tròn',
        'Có 3 mặt hình tam giác',
        'Chỉ có 4 mặt hình chữ nhật'
      ],
      correctAnswer: 'Cả 6 mặt đều là hình vuông bằng nhau',
      explanation: 'Khối lập phương có 6 mặt đều là hình vuông bằng nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 96 }
    }
  ],

  bai_15: [
    {
      id: 'b15_ex_1',
      lessonId: 'bai_15',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Lọ hoa đặt trên mặt bàn, vậy lọ hoa ở vị trí nào so với mặt bàn?',
      illustration: { type: 'spatial_positions', data: { position: 'on_top' } },
      options: ['Ở trên', 'Ở dưới', 'Ở trong', 'Ở sau'],
      correctAnswer: 'Ở trên',
      explanation: 'Lọ hoa đặt trên mặt bàn là ở vị trí ở trên.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 98 }
    },
    {
      id: 'b15_ex_2',
      lessonId: 'bai_15',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tay cầm bút viết bài hằng ngày của đa số học sinh là tay nào?',
      options: ['Tay phải', 'Tay trái', 'Cả hai tay', 'Không phân biệt'],
      correctAnswer: 'Tay phải',
      explanation: 'Học sinh thường cầm bút bằng tay phải.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 99 }
    },
    {
      id: 'b15_ex_3',
      lessonId: 'bai_15',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Chú mèo con chui vào nằm ngủ dưới gầm giường. Vị trí của chú mèo là:',
      options: ['Ở dưới', 'Ở trên', 'Ở ngoài', 'Ở trên nóc'],
      correctAnswer: 'Ở dưới',
      explanation: 'Nằm trong gầm giường là ở vị trí phía dưới.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 100 }
    },
    {
      id: 'b15_ex_4',
      lessonId: 'bai_15',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Theo luật an toàn giao thông, khi đi bộ trên đường em cần đi về phía bên nào?',
      options: ['Bên phải', 'Bên trái', 'Đi giữa lòng đường', 'Đi tùy ý'],
      correctAnswer: 'Bên phải',
      explanation: 'Mọi người tham gia giao thông luôn đi về phía bên phải.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 101 }
    },
    {
      id: 'b15_ex_5',
      lessonId: 'bai_15',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bạn An ngồi giữa bạn Bình và bạn Chi. Bạn Chi ngồi bên phải bạn An, hỏi bạn Bình ngồi bên nào của bạn An?',
      options: ['Bên trái', 'Bên phải', 'Phía trước', 'Phía sau'],
      correctAnswer: 'Bên trái',
      explanation: 'An ngồi ở giữa, Chi bên phải thì Bình ngồi bên trái của An.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 102 }
    },
    {
      id: 'b15_ex_6',
      lessonId: 'bai_15',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Trên nóc tủ có một quả bóng, dưới sàn nhà có một đôi dép. Đồ vật ở vị trí cao hơn là:',
      options: ['Quả bóng', 'Đôi dép', 'Hai vật ngang nhau', 'Không xác định'],
      correctAnswer: 'Quả bóng',
      explanation: 'Trên nóc tủ ở vị trí cao hơn so với đôi dép ở dưới sàn nhà.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 102 }
    }
  ],

  bai_16: [
    {
      id: 'b16_ex_1',
      lessonId: 'bai_16',
      questionNumber: 1,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Khối rubik đồ chơi xoay đa màu sắc có dạng hình khối nào?',
      illustration: { type: 'solids_3d', shape: 'cube' },
      options: ['Khối lập phương', 'Khối hộp chữ nhật', 'Hình vuông', 'Hình tròn'],
      correctAnswer: 'Khối lập phương',
      explanation: 'Khối rubik có 6 mặt vuông bằng nhau, đó là khối lập phương.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 104 }
    },
    {
      id: 'b16_ex_2',
      lessonId: 'bai_16',
      questionNumber: 2,
      type: 'geometry',
      level: 'Cơ bản',
      question: 'Hộp bánh bích quy dạng dài, có các mặt đối diện bằng nhau là hình khối gì?',
      illustration: { type: 'solids_3d', shape: 'cuboid' },
      options: ['Khối hộp chữ nhật', 'Khối lập phương', 'Hình chữ nhật', 'Hình cầu'],
      correctAnswer: 'Khối hộp chữ nhật',
      explanation: 'Hộp bánh có dạng khối hộp chữ nhật.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 105 }
    },
    {
      id: 'b16_ex_3',
      lessonId: 'bai_16',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Hộp bút đặt ở bên phải cuốn vở, vậy cuốn vở nằm ở bên nào so với hộp bút?',
      options: ['Bên trái', 'Bên phải', 'Ở trên', 'Ở dưới'],
      correctAnswer: 'Bên trái',
      explanation: 'Hộp bút ở bên phải thì cuốn vở ở bên trái của hộp bút.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 106 }
    },
    {
      id: 'b16_ex_4',
      lessonId: 'bai_16',
      questionNumber: 4,
      type: 'geometry',
      level: 'Luyện tập',
      question: 'Đồ vật nào dưới đây thường có dạng khối lập phương?',
      options: ['Hộp quà vuông vức các mặt bằng nhau', 'Hộp sữa tươi dài', 'Bút chì', 'Cái bàn học'],
      correctAnswer: 'Hộp quà vuông vức các mặt bằng nhau',
      explanation: 'Hộp quà có 6 mặt vuông bằng nhau là khối lập phương.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 107 }
    },
    {
      id: 'b16_ex_5',
      lessonId: 'bai_16',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Khi xếp hàng ra chơi, bạn Nam đứng ngay trước bạn Mai. Vậy bạn Mai đứng ở đâu so với bạn Nam?',
      options: ['Ở phía sau', 'Ở phía trước', 'Ở bên trái', 'Ở bên phải'],
      correctAnswer: 'Ở phía sau',
      explanation: 'Nam đứng trước Mai nên Mai đứng ở phía sau Nam.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 108 }
    },
    {
      id: 'b16_ex_6',
      lessonId: 'bai_16',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Cần ghép bao nhiêu khối lập phương nhỏ bằng nhau để được một khối lập phương lớn hơn?',
      options: ['8 khối', '4 khối', '6 khối', '2 khối'],
      correctAnswer: '8 khối',
      explanation: 'Ghép 8 khối lập phương nhỏ (2 x 2 x 2) tạo thành một khối lập phương lớn.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 108 }
    }
  ]
};
