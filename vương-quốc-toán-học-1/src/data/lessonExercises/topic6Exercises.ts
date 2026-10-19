import { ExerciseItem } from '../../types';

export const topic6Exercises: Record<string, ExerciseItem[]> = {
  bai_21: [
    {
      id: 'b21_ex_1',
      lessonId: 'bai_21',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số gồm 3 chục và 5 đơn vị được viết là số nào?',
      options: ['35', '53', '305', '8'],
      correctAnswer: '35',
      explanation: '3 chục và 5 đơn vị viết là 35.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 8 }
    },
    {
      id: 'b21_ex_2',
      lessonId: 'bai_21',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số 48 gồm có mấy chục và mấy đơn vị?',
      options: ['4 chục và 8 đơn vị', '8 chục và 4 đơn vị', '40 chục và 8 đơn vị', '12 đơn vị'],
      correctAnswer: '4 chục và 8 đơn vị',
      explanation: 'Chữ số 4 ở hàng chục (4 chục), chữ số 8 ở hàng đơn vị (8 đơn vị).',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 9 }
    },
    {
      id: 'b21_ex_3',
      lessonId: 'bai_21',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Số 21 được đọc đúng là gì?',
      options: ['Hai mươi mốt', 'Hai mươi một', 'Hai một', 'Mười hai'],
      correctAnswer: 'Hai mươi mốt',
      explanation: 'Các số có chữ số tận cùng là 1 từ 21 trở đi đọc là "mốt": Hai mươi mốt.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 10 }
    },
    {
      id: 'b21_ex_4',
      lessonId: 'bai_21',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Số bé nhất có hai chữ số là số nào?',
      options: ['10', '11', '01', '00'],
      correctAnswer: '10',
      explanation: 'Số 10 là số bé nhất có hai chữ số.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 11 }
    },
    {
      id: 'b21_ex_5',
      lessonId: 'bai_21',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bác nông dân bó được 4 bó rau cải, mỗi bó có 10 cây, và thêm 6 cây lẻ. Bác có tất cả bao nhiêu cây rau?',
      options: ['46 cây', '64 cây', '40 cây', '16 cây'],
      correctAnswer: '46 cây',
      explanation: '4 bó rau là 4 chục (40 cây), thêm 6 cây là 46 cây rau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 12 }
    },
    {
      id: 'b21_ex_6',
      lessonId: 'bai_21',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Số tròn chục đứng liền trước số 50 là số nào?',
      options: ['40', '49', '60', '30'],
      correctAnswer: '40',
      explanation: 'Dãy số tròn chục: 10, 20, 30, 40, 50... Số tròn chục liền trước 50 là 40.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 13 }
    }
  ],

  bai_22: [
    {
      id: 'b22_ex_1',
      lessonId: 'bai_22',
      questionNumber: 1,
      type: 'compare',
      level: 'Cơ bản',
      question: 'Điền dấu so sánh thích hợp vào chỗ chấm: 45 ... 54',
      options: ['<', '>', '=', '+'],
      correctAnswer: '<',
      explanation: 'So sánh hàng chục: 4 chục bé hơn 5 chục nên 45 < 54.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 15 }
    },
    {
      id: 'b22_ex_2',
      lessonId: 'bai_22',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Khi so sánh hai số có hai chữ số, trước hết ta so sánh các chữ số ở hàng nào?',
      options: ['Hàng chục', 'Hàng đơn vị', 'Hàng nào trước cũng được', 'Hàng trăm'],
      correctAnswer: 'Hàng chục',
      explanation: 'So sánh hàng chục trước: số nào có chữ số hàng chục lớn hơn thì số đó lớn hơn.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 16 }
    },
    {
      id: 'b22_ex_3',
      lessonId: 'bai_22',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Trong các số: 34, 43, 29, 51, số nào là số lớn nhất?',
      options: ['51', '43', '34', '29'],
      correctAnswer: '51',
      explanation: 'Chữ số hàng chục của 51 là 5, lớn nhất trong các số.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 17 }
    },
    {
      id: 'b22_ex_4',
      lessonId: 'bai_22',
      questionNumber: 4,
      type: 'sort_numbers',
      level: 'Luyện tập',
      question: 'Sắp xếp các số sau theo thứ tự từ bé đến lớn: 25, 82, 47, 19',
      options: ['19, 25, 47, 82', '82, 47, 25, 19', '19, 47, 25, 82', '25, 19, 47, 82'],
      correctAnswer: '19, 25, 47, 82',
      explanation: 'Thứ tự từ bé đến lớn: 19 < 25 < 47 < 82.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 18 }
    },
    {
      id: 'b22_ex_5',
      lessonId: 'bai_22',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bạn Mai sưu tầm được 38 con tem, bạn Lan sưu tầm được 42 con tem. Hỏi bạn nào sưu tầm được nhiều con tem hơn?',
      options: ['Bạn Lan', 'Bạn Mai', 'Hai bạn bằng nhau', 'Không so sánh được'],
      correctAnswer: 'Bạn Lan',
      explanation: '42 > 38 nên bạn Lan sưu tầm được nhiều con tem hơn.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 19 }
    },
    {
      id: 'b22_ex_6',
      lessonId: 'bai_22',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Số tròn chục nào vừa lớn hơn 60 lại vừa bé hơn 80?',
      options: ['70', '65', '75', '80'],
      correctAnswer: '70',
      explanation: 'Số tròn chục ở giữa 60 và 80 là 70 (60 < 70 < 80).',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 19 }
    }
  ],

  bai_23: [
    {
      id: 'b23_ex_1',
      lessonId: 'bai_23',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Trong bảng các số từ 1 đến 100, số lớn nhất là số nào?',
      options: ['99', '100', '90', '10'],
      correctAnswer: '100',
      explanation: 'Số 100 là số lớn nhất trong bảng các số từ 1 đến 100.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 21 }
    },
    {
      id: 'b23_ex_2',
      lessonId: 'bai_23',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số liền trước của số 70 là số nào?',
      options: ['69', '71', '60', '80'],
      correctAnswer: '69',
      explanation: 'Số đứng ngay trước 70 là 69.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 22 }
    },
    {
      id: 'b23_ex_3',
      lessonId: 'bai_23',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Số liền sau của số 99 là số nào?',
      options: ['98', '100', '90', '101'],
      correctAnswer: '100',
      explanation: 'Số đứng ngay sau 99 là 100.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 23 }
    },
    {
      id: 'b23_ex_4',
      lessonId: 'bai_23',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Số lớn nhất có hai chữ số là số nào?',
      options: ['99', '100', '90', '89'],
      correctAnswer: '99',
      explanation: 'Số 99 là số lớn nhất có hai chữ số (100 là số có 3 chữ số).',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 24 }
    },
    {
      id: 'b23_ex_5',
      lessonId: 'bai_23',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Một đoàn tàu có 100 toa. Toa chạy ngay sau toa số 89 là toa số mấy?',
      options: ['Toa 90', 'Toa 88', 'Toa 91', 'Toa 100'],
      correctAnswer: 'Toa 90',
      explanation: 'Toa liền sau toa 89 là toa số 90.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 25 }
    },
    {
      id: 'b23_ex_6',
      lessonId: 'bai_23',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Trong bảng các số từ 1 đến 100, có tất cả bao nhiêu số tròn chục?',
      options: ['10 số', '9 số', '8 số', '11 số'],
      correctAnswer: '10 số',
      explanation: 'Gồm 10 số tròn chục: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 25 }
    }
  ],

  bai_24: [
    {
      id: 'b24_ex_1',
      lessonId: 'bai_24',
      questionNumber: 1,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số gồm 8 chục và 0 đơn vị viết là số nào?',
      options: ['80', '8', '800', '18'],
      correctAnswer: '80',
      explanation: '8 chục và 0 đơn vị viết là 80.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 27 }
    },
    {
      id: 'b24_ex_2',
      lessonId: 'bai_24',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số 75 đọc đúng là gì?',
      options: ['Bảy mươi lăm', 'Bảy mươi năm', 'Bảy lăm', 'Năm mươi bảy'],
      correctAnswer: 'Bảy mươi lăm',
      explanation: 'Chữ số 5 ở hàng đơn vị khi đứng sau chữ số hàng chục từ 1 đến 9 đọc là "lăm": Bảy mươi lăm.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 28 }
    },
    {
      id: 'b24_ex_3',
      lessonId: 'bai_24',
      questionNumber: 3,
      type: 'compare',
      level: 'Thực hành',
      question: 'Chọn dấu so sánh đúng: 68 ... 68',
      options: ['=', '<', '>', '+'],
      correctAnswer: '=',
      explanation: 'Hai số giống nhau có giá trị bằng nhau nên 68 = 68.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 29 }
    },
    {
      id: 'b24_ex_4',
      lessonId: 'bai_24',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Tìm số bé nhất trong các số: 72, 69, 81, 75',
      options: ['69', '72', '75', '81'],
      correctAnswer: '69',
      explanation: 'Số 69 có chữ số hàng chục là 6, nhỏ nhất trong các số.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 30 }
    },
    {
      id: 'b24_ex_5',
      lessonId: 'bai_24',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Vườn cây nhà bà có 5 chục cây xoài và 8 cây cam. Hỏi vườn nhà bà có bao nhiêu cây xoài?',
      options: ['50 cây', '5 cây', '58 cây', '8 cây'],
      correctAnswer: '50 cây',
      explanation: '5 chục cây xoài chính là 50 cây xoài.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 31 }
    },
    {
      id: 'b24_ex_6',
      lessonId: 'bai_24',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Có bao nhiêu số có hai chữ số giống nhau (như 11, 22, 33...)?',
      options: ['9 số', '10 số', '8 số', '7 số'],
      correctAnswer: '9 số',
      explanation: 'Có 9 số: 11, 22, 33, 44, 55, 66, 77, 88, 99.',
      sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 31 }
    }
  ]
};
