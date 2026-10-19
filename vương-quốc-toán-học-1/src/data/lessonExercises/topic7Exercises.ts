import { ExerciseItem } from '../../types';

export const topic7Exercises: Record<string, ExerciseItem[]> = {
  bai_25: [
    {
      id: 'b25_ex_1',
      lessonId: 'bai_25',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Đặt hai chiếc bút chì cạnh nhau có một đầu bằng nhau: chiếc bút A dài hơn chiếc bút B. Vậy chiếc bút B như thế nào so với bút A?',
      options: ['Bút B ngắn hơn', 'Bút B dài hơn', 'Bút B bằng bút A', 'Không biết được'],
      correctAnswer: 'Bút B ngắn hơn',
      explanation: 'Nếu bút A dài hơn bút B thì ngược lại bút B ngắn hơn bút A.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 34 }
    },
    {
      id: 'b25_ex_2',
      lessonId: 'bai_25',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Thước kẻ của cô giáo dài hơn thước kẻ của học sinh, vậy thước kẻ của học sinh:',
      options: ['Ngắn hơn', 'Dài hơn', 'Bằng nhau', 'Rộng hơn'],
      correctAnswer: 'Ngắn hơn',
      explanation: 'Thước của cô dài hơn thì thước học sinh ngắn hơn thước cô.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 35 }
    },
    {
      id: 'b25_ex_3',
      lessonId: 'bai_25',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Dùng gang tay đo: Chiếc bàn dài khoảng 5 gang tay, hộp bút dài khoảng 1 gang tay. Đồ vật nào dài hơn?',
      options: ['Chiếc bàn', 'Hộp bút', 'Hai vật bằng nhau', 'Không so sánh được'],
      correctAnswer: 'Chiếc bàn',
      explanation: '5 gang tay nhiều hơn 1 gang tay nên chiếc bàn dài hơn hộp bút.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 36 }
    },
    {
      id: 'b25_ex_4',
      lessonId: 'bai_25',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Dải lụa đỏ dài 8 bước chân, dải lụa xanh dài 6 bước chân. Dải lụa nào ngắn hơn?',
      options: ['Dải lụa xanh', 'Dải lụa đỏ', 'Hai dải bằng nhau', 'Không so sánh được'],
      correctAnswer: 'Dải lụa xanh',
      explanation: '6 bước chân ít hơn 8 bước chân nên dải lụa xanh ngắn hơn.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 37 }
    },
    {
      id: 'b25_ex_5',
      lessonId: 'bai_25',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bạn Hùng cao hơn bạn Dũng, bạn Dũng cao hơn bạn Lan. Ai là bạn cao nhất trong ba bạn?',
      options: ['Bạn Hùng', 'Bạn Dũng', 'Bạn Lan', 'Ba bạn cao bằng nhau'],
      correctAnswer: 'Bạn Hùng',
      explanation: 'Hùng cao hơn Dũng và Dũng cao hơn Lan nên bạn Hùng cao nhất.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 38 }
    },
    {
      id: 'b25_ex_6',
      lessonId: 'bai_25',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Hai chiếc bút chì đặt một đầu thẳng hàng: bút chì vàng nhô ra xa hơn bút chì tím. Khẳng định nào đúng?',
      options: ['Bút chì vàng dài hơn', 'Bút chì tím dài hơn', 'Hai bút bằng nhau', 'Bút chì vàng ngắn hơn'],
      correctAnswer: 'Bút chì vàng dài hơn',
      explanation: 'Khi đặt chung điểm đầu thẳng hàng, bút nào nhô ra xa hơn thì dài hơn.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 38 }
    }
  ],

  bai_26: [
    {
      id: 'b26_ex_1',
      lessonId: 'bai_26',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Đơn vị đo độ dài xăng-ti-mét được viết tắt là gì?',
      options: ['cm', 'm', 'km', 'kg'],
      correctAnswer: 'cm',
      explanation: 'Xăng-ti-mét viết tắt là cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 40 }
    },
    {
      id: 'b26_ex_2',
      lessonId: 'bai_26',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Khi đo độ dài bằng thước kẻ chia xăng-ti-mét, em phải đặt đầu trái của vật trùng với vạch số mấy?',
      options: ['Vạch số 0', 'Vạch số 1', 'Mép ngoài của thước', 'Vạch số bất kì'],
      correctAnswer: 'Vạch số 0',
      explanation: 'Luôn đặt điểm đầu của vật trùng chính xác với vạch số 0 trên thước.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 41 }
    },
    {
      id: 'b26_ex_3',
      lessonId: 'bai_26',
      questionNumber: 3,
      type: 'geometry',
      level: 'Thực hành',
      question: 'Quan sát hình vẽ. Đầu trái bút chì đặt đúng vạch số 0, đầu nhọn chạm đúng vạch số 7 cm. Bút chì dài bao nhiêu xăng-ti-mét?',
      illustration: { type: 'ruler_cm', data: { lengthCm: 7, item: 'pencil' } },
      options: ['5 cm', '6 cm', '7 cm', '8 cm'],
      correctAnswer: '7 cm',
      explanation: 'Đầu trái ở vạch 0, đầu nhọn ở vạch 7 nên bút chì dài đúng 7 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 42 }
    },
    {
      id: 'b26_ex_4',
      lessonId: 'bai_26',
      questionNumber: 4,
      type: 'geometry',
      level: 'Luyện tập',
      question: 'Quan sát thước đo: Cục tẩy đặt từ vạch số 0 đến vạch số 3 cm. Cục tẩy dài bao nhiêu?',
      illustration: { type: 'ruler_cm', data: { lengthCm: 3, item: 'eraser' } },
      options: ['2 cm', '3 cm', '4 cm', '5 cm'],
      correctAnswer: '3 cm',
      explanation: 'Từ vạch 0 đến vạch 3 cm dài 3 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 43 }
    },
    {
      id: 'b26_ex_5',
      lessonId: 'bai_26',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bút sáp màu dài 8 cm, que tính dài 10 cm. Hỏi que tính dài hơn bút sáp bao nhiêu xăng-ti-mét?',
      options: ['1 cm', '2 cm', '3 cm', '4 cm'],
      correctAnswer: '2 cm',
      explanation: '10 cm - 8 cm = 2 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 44 }
    },
    {
      id: 'b26_ex_6',
      lessonId: 'bai_26',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Thực hiện phép tính kèm đơn vị: 5 cm + 4 cm = ?',
      options: ['8 cm', '9 cm', '10 cm', '9'],
      correctAnswer: '9 cm',
      explanation: '5 + 4 = 9, viết thêm đơn vị cm vào sau kết quả là 9 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 44 }
    }
  ],

  bai_27: [
    {
      id: 'b27_ex_1',
      lessonId: 'bai_27',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Để đo chính xác độ dài hộp bút của em, dụng cụ thích hợp nhất là gì?',
      options: ['Thước thẳng có chia cm', 'Sợi dây chun', 'Một chiếc lá', 'Một bước chân'],
      correctAnswer: 'Thước thẳng có chia cm',
      explanation: 'Thước thẳng có vạch chia xăng-ti-mét giúp đo độ dài chính xác.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 46 }
    },
    {
      id: 'b27_ex_2',
      lessonId: 'bai_27',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Ước lượng chiều dài một chiếc bút mực viết bài khoảng bao nhiêu xăng-ti-mét?',
      options: ['Khoảng 14 cm', 'Khoảng 1 cm', 'Khoảng 100 cm', 'Khoảng 50 cm'],
      correctAnswer: 'Khoảng 14 cm',
      explanation: 'Chiếc bút mực thường dài khoảng 14 cm đến 15 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 47 }
    },
    {
      id: 'b27_ex_3',
      lessonId: 'bai_27',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Băng giấy màu xanh dài 12 cm, em dùng kéo cắt bớt đi 2 cm. Băng giấy còn lại dài bao nhiêu cm?',
      options: ['9 cm', '10 cm', '11 cm', '14 cm'],
      correctAnswer: '10 cm',
      explanation: '12 cm - 2 cm = 10 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 48 }
    },
    {
      id: 'b27_ex_4',
      lessonId: 'bai_27',
      questionNumber: 4,
      type: 'geometry',
      level: 'Luyện tập',
      question: 'Quan sát thước đo: Chiếc kẹp ghim đặt từ vạch số 0 đến vạch số 2 cm. Chiếc kẹp ghim dài bao nhiêu?',
      illustration: { type: 'ruler_cm', data: { lengthCm: 2, item: 'clip' } },
      options: ['1 cm', '2 cm', '3 cm', '4 cm'],
      correctAnswer: '2 cm',
      explanation: 'Từ vạch 0 đến vạch 2 cm dài đúng 2 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 49 }
    },
    {
      id: 'b27_ex_5',
      lessonId: 'bai_27',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bạn Mai dùng gang tay đo chiều rộng mặt bàn được khoảng 3 gang tay. Biết mỗi gang tay của Mai dài khoảng 10 cm. Chiều rộng mặt bàn khoảng bao nhiêu cm?',
      options: ['Khoảng 20 cm', 'Khoảng 30 cm', 'Khoảng 40 cm', 'Khoảng 13 cm'],
      correctAnswer: 'Khoảng 30 cm',
      explanation: '3 gang tay, mỗi gang tay 10 cm: 10 + 10 + 10 = 30 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 50 }
    },
    {
      id: 'b27_ex_6',
      lessonId: 'bai_27',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Tính kết quả: 18 cm - 8 cm = ?',
      options: ['9 cm', '10 cm', '11 cm', '8 cm'],
      correctAnswer: '10 cm',
      explanation: '18 cm - 8 cm = 10 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 50 }
    }
  ],

  bai_28: [
    {
      id: 'b28_ex_1',
      lessonId: 'bai_28',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính: 6 cm + 3 cm = ?',
      options: ['8 cm', '9 cm', '10 cm', '7 cm'],
      correctAnswer: '9 cm',
      explanation: '6 cm + 3 cm = 9 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 52 }
    },
    {
      id: 'b28_ex_2',
      lessonId: 'bai_28',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Tính: 15 cm - 5 cm = ?',
      options: ['9 cm', '10 cm', '11 cm', '12 cm'],
      correctAnswer: '10 cm',
      explanation: '15 cm - 5 cm = 10 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 53 }
    },
    {
      id: 'b28_ex_3',
      lessonId: 'bai_28',
      questionNumber: 3,
      type: 'geometry',
      level: 'Thực hành',
      question: 'Một dải ruy băng được đo trên thước kẻ từ vạch số 0 đến đúng vạch số 9 cm. Dải ruy băng dài bao nhiêu cm?',
      illustration: { type: 'ruler_cm', data: { lengthCm: 9, item: 'ribbon' } },
      options: ['7 cm', '8 cm', '9 cm', '10 cm'],
      correctAnswer: '9 cm',
      explanation: 'Từ vạch số 0 đến vạch số 9 cm là 9 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 54 }
    },
    {
      id: 'b28_ex_4',
      lessonId: 'bai_28',
      questionNumber: 4,
      type: 'compare',
      level: 'Luyện tập',
      question: 'Điền dấu so sánh thích hợp: 8 cm ... 5 cm + 3 cm',
      options: ['=', '<', '>', '+'],
      correctAnswer: '=',
      explanation: 'Vì 5 cm + 3 cm = 8 cm nên 8 cm = 5 cm + 3 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 55 }
    },
    {
      id: 'b28_ex_5',
      lessonId: 'bai_28',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Mặt bàn dài 60 cm, chiếc ghế rộng 30 cm. Đặt ghế cạnh bàn thì tổng chiều dài là bao nhiêu cm?',
      options: ['80 cm', '90 cm', '70 cm', '100 cm'],
      correctAnswer: '90 cm',
      explanation: '60 cm + 30 cm = 90 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 56 }
    },
    {
      id: 'b28_ex_6',
      lessonId: 'bai_28',
      questionNumber: 6,
      type: 'word_problem',
      level: 'Thử thách',
      question: 'Đoạn dây thứ nhất dài 10 cm, đoạn dây thứ hai dài hơn đoạn dây thứ nhất 4 cm. Hỏi đoạn dây thứ hai dài bao nhiêu cm?',
      options: ['12 cm', '14 cm', '16 cm', '6 cm'],
      correctAnswer: '14 cm',
      explanation: '10 cm + 4 cm = 14 cm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 56 }
    }
  ]
};
