import { ExerciseItem } from '../../types';

export const topic1Exercises: Record<string, ExerciseItem[]> = {
  bai_1: [
    {
      id: 'b1_ex_1',
      lessonId: 'bai_1',
      questionNumber: 1,
      type: 'count_items',
      level: 'Cơ bản',
      question: 'Bé hãy đếm xem có bao nhiêu quả táo đỏ trong đĩa?',
      illustration: { type: 'fruits', count: 4, itemType: 'apple' },
      options: ['2', '3', '4', '5'],
      correctAnswer: '4',
      explanation: 'Đếm lần lượt: 1, 2, 3, 4 quả táo đỏ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 9 }
    },
    {
      id: 'b1_ex_2',
      lessonId: 'bai_1',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số nào dùng để chỉ một chiếc đĩa hoàn toàn không có đồ vật nào?',
      illustration: { type: 'fruits', count: 0, itemType: 'apple' },
      options: ['0', '1', '2', '3'],
      correctAnswer: '0',
      explanation: 'Số 0 dùng để chỉ nhóm không có đồ vật nào.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 9 }
    },
    {
      id: 'b1_ex_3',
      lessonId: 'bai_1',
      questionNumber: 3,
      type: 'fill_blank',
      level: 'Luyện tập',
      question: 'Tìm số thích hợp điền vào dấu ? trên toa tàu: 1, 2, ?, 4, 5',
      illustration: { type: 'train_cars', data: { sequence: [1, 2, '?', 4, 5] } },
      options: ['0', '3', '5', '6'],
      correctAnswer: '3',
      explanation: 'Dãy số đếm từ 1 đến 5: 1, 2, 3, 4, 5. Số đứng giữa 2 và 4 là số 3.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 10 }
    },
    {
      id: 'b1_ex_4',
      lessonId: 'bai_1',
      questionNumber: 4,
      type: 'count_items',
      level: 'Luyện tập',
      question: 'Quan sát hình vẽ. Có bao nhiêu chú cá đang bơi dưới nước?',
      illustration: { type: 'sea_creatures', count: 5, itemType: 'fish' },
      options: ['3', '4', '5', '2'],
      correctAnswer: '5',
      explanation: 'Đếm từ trái sang phải có đúng 5 chú cá.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 11 }
    },
    {
      id: 'b1_ex_5',
      lessonId: 'bai_1',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bé xòe một bàn tay của mình ra. Bàn tay của bé có bao nhiêu ngón tay?',
      options: ['3 ngón', '4 ngón', '5 ngón', '6 ngón'],
      correctAnswer: '5 ngón',
      explanation: 'Mỗi bàn tay của chúng mình có đúng 5 ngón tay.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 12 }
    },
    {
      id: 'b1_ex_6',
      lessonId: 'bai_1',
      questionNumber: 6,
      type: 'sort_numbers',
      level: 'Thử thách',
      question: 'Đếm lùi từ 5 về 0: 5, 4, 3, 2, ?, 0. Số còn thiếu là số mấy?',
      illustration: { type: 'train_cars', data: { sequence: [5, 4, 3, 2, '?', 0] } },
      options: ['1', '0', '3', '6'],
      correctAnswer: '1',
      explanation: 'Thứ tự đếm lùi: 5, 4, 3, 2, 1, 0. Số còn thiếu là số 1.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 13 }
    }
  ],

  bai_2: [
    {
      id: 'b2_ex_1',
      lessonId: 'bai_2',
      questionNumber: 1,
      type: 'count_items',
      level: 'Cơ bản',
      question: 'Bé hãy đếm xem có bao nhiêu chú gà con trong đàn?',
      illustration: { type: 'animals', count: 8, itemType: 'chick' },
      options: ['6', '7', '8', '9'],
      correctAnswer: '8',
      explanation: 'Đếm lần lượt từng chú gà: có tất cả 8 chú gà con.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 15 }
    },
    {
      id: 'b2_ex_2',
      lessonId: 'bai_2',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số liền sau của số 9 trong dãy số tự nhiên là số nào?',
      options: ['8', '9', '10', '7'],
      correctAnswer: '10',
      explanation: 'Đếm: 8, 9 rồi đến 10. Số liền sau số 9 là số 10.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 16 }
    },
    {
      id: 'b2_ex_3',
      lessonId: 'bai_2',
      questionNumber: 3,
      type: 'count_items',
      level: 'Luyện tập',
      question: 'Bé hãy đếm xem có bao nhiêu củ cà rốt màu cam dưới đây?',
      illustration: { type: 'fruits', count: 7, itemType: 'carrot' },
      options: ['6', '7', '8', '9'],
      correctAnswer: '7',
      explanation: 'Đếm lần lượt từ trái sang phải có đúng 7 củ cà rốt.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 16 }
    },
    {
      id: 'b2_ex_4',
      lessonId: 'bai_2',
      questionNumber: 4,
      type: 'fill_blank',
      level: 'Luyện tập',
      question: 'Tìm số thích hợp điền vào dấu ? trên toa tàu: 6, 7, 8, ?, 10',
      illustration: { type: 'train_cars', data: { sequence: [6, 7, 8, '?', 10] } },
      options: ['7', '8', '9', '10'],
      correctAnswer: '9',
      explanation: 'Dãy số đếm từ 6 đến 10: 6, 7, 8, 9, 10. Số đứng sau 8 và trước 10 là 9.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 17 }
    },
    {
      id: 'b2_ex_5',
      lessonId: 'bai_2',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bạn An có một chục que tính. Hỏi bạn An có bao nhiêu que tính?',
      options: ['1 que', '8 que', '10 que', '12 que'],
      correctAnswer: '10 que',
      explanation: 'Một chục que tính chính là 10 que tính.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 18 }
    },
    {
      id: 'b2_ex_6',
      lessonId: 'bai_2',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Trong các số 6, 8, 10, 7, 9, số lớn nhất có một chữ số là số nào?',
      options: ['8', '9', '10', '7'],
      correctAnswer: '9',
      explanation: 'Số 9 là số lớn nhất có một chữ số (số 10 là số có hai chữ số).',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 19 }
    }
  ],

  bai_3: [
    {
      id: 'b3_ex_1',
      lessonId: 'bai_3',
      questionNumber: 1,
      type: 'compare',
      level: 'Cơ bản',
      question: 'Nhóm 1 có 5 quả táo, nhóm 2 có 3 quả cam. Nhóm nào có số lượng nhiều hơn?',
      illustration: {
        type: 'compare_groups',
        count: 5,
        secondaryCount: 3,
        itemType: 'apple',
        data: {
          leftLabel: 'Nhóm 1: Quả táo',
          rightLabel: 'Nhóm 2: Quả cam',
          rightKind: 'orange'
        }
      },
      options: ['Nhóm 1 (Táo)', 'Nhóm 2 (Cam)', 'Hai nhóm bằng nhau', 'Không so sánh được'],
      correctAnswer: 'Nhóm 1 (Táo)',
      explanation: 'Nhóm 1 có 5 quả táo, nhóm 2 có 3 quả cam. Vì 5 nhiều hơn 3 nên Nhóm 1 (Táo) có số lượng nhiều hơn.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 20 }
    },
    {
      id: 'b3_ex_2',
      lessonId: 'bai_3',
      questionNumber: 2,
      type: 'compare',
      level: 'Cơ bản',
      question: 'Nhóm 1 có 2 chú thỏ, nhóm 2 có 4 củ cà rốt. Nhóm nào có số lượng ít hơn?',
      illustration: {
        type: 'compare_groups',
        count: 2,
        secondaryCount: 4,
        itemType: 'rabbit',
        data: {
          leftLabel: 'Nhóm 1: Chú thỏ',
          rightLabel: 'Nhóm 2: Củ cà rốt',
          rightKind: 'carrot'
        }
      },
      options: ['Nhóm 1: Chú thỏ', 'Nhóm 2: Củ cà rốt', 'Hai nhóm bằng nhau', 'Không so sánh được'],
      correctAnswer: 'Nhóm 1: Chú thỏ',
      explanation: 'Có 2 chú thỏ và 4 củ cà rốt. Vì 2 ít hơn 4 nên số chú thỏ ít hơn số củ cà rốt.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 21 }
    },
    {
      id: 'b3_ex_3',
      lessonId: 'bai_3',
      questionNumber: 3,
      type: 'compare',
      level: 'Thực hành',
      question: 'Có 4 bông hoa và 4 chú bướm. Số hoa và số bướm như thế nào với nhau?',
      illustration: {
        type: 'compare_groups',
        count: 4,
        secondaryCount: 4,
        itemType: 'flower',
        data: {
          leftLabel: 'Số bông hoa',
          rightLabel: 'Số chú bướm',
          rightKind: 'butterfly'
        }
      },
      options: ['Số hoa nhiều hơn', 'Số hoa ít hơn', 'Hai nhóm bằng nhau', 'Không so sánh được'],
      correctAnswer: 'Hai nhóm bằng nhau',
      explanation: 'Có 4 bông hoa và 4 chú bướm. Ghép đôi mỗi bông hoa với 1 chú bướm vừa vặn nên số hoa và số bướm bằng nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 22 }
    },
    {
      id: 'b3_ex_4',
      lessonId: 'bai_3',
      questionNumber: 4,
      type: 'compare',
      level: 'Luyện tập',
      question: 'Đĩa A có 3 quả cà chua, đĩa B có 5 quả cà chua. Đĩa nào có ít quả hơn?',
      illustration: {
        type: 'compare_groups',
        count: 3,
        secondaryCount: 5,
        itemType: 'tomato',
        data: {
          leftLabel: 'Đĩa A',
          rightLabel: 'Đĩa B',
          rightKind: 'tomato'
        }
      },
      options: ['Đĩa A', 'Đĩa B', 'Hai đĩa bằng nhau', 'Không so sánh được'],
      correctAnswer: 'Đĩa A',
      explanation: 'Đĩa A có 3 quả cà chua, đĩa B có 5 quả cà chua. Vì 3 ít hơn 5 nên đĩa A có ít quả hơn.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 23 }
    },
    {
      id: 'b3_ex_5',
      lessonId: 'bai_3',
      questionNumber: 5,
      type: 'multiple_choice',
      level: 'Vận dụng',
      question: 'Bình thứ nhất có 6 viên bi, bình thứ hai có 6 viên bi. Nhận xét nào sau đây là đúng?',
      illustration: {
        type: 'compare_groups',
        count: 6,
        secondaryCount: 6,
        itemType: 'marble',
        data: {
          leftLabel: 'Bình thứ nhất',
          rightLabel: 'Bình thứ hai',
          rightKind: 'marble'
        }
      },
      options: ['Bình một nhiều hơn', 'Bình hai nhiều hơn', 'Hai bình có số bi bằng nhau', 'Bình một ít hơn'],
      correctAnswer: 'Hai bình có số bi bằng nhau',
      explanation: 'Cả hai bình đều có 6 viên bi nên số bi ở hai bình bằng nhau.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 24 }
    },
    {
      id: 'b3_ex_6',
      lessonId: 'bai_3',
      questionNumber: 6,
      type: 'word_problem',
      level: 'Thử thách',
      question: 'Có 5 bạn nhỏ và 4 chiếc ghế ngồi. Hỏi số ghế như thế nào so với số bạn nhỏ?',
      illustration: {
        type: 'compare_groups',
        count: 5,
        secondaryCount: 4,
        itemType: 'child',
        data: {
          leftLabel: 'Số bạn nhỏ',
          rightLabel: 'Số chiếc ghế',
          rightKind: 'chair'
        }
      },
      options: ['Số ghế ít hơn (thiếu ghế)', 'Số ghế nhiều hơn (thừa ghế)', 'Số ghế bằng số bạn', 'Không so sánh được'],
      correctAnswer: 'Số ghế ít hơn (thiếu ghế)',
      explanation: 'Có 5 bạn nhỏ mà chỉ có 4 chiếc ghế. Khi mỗi bạn ngồi một ghế thì thiếu 1 ghế, nên số ghế ít hơn số bạn nhỏ.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 25 }
    }
  ],

  bai_4: [
    {
      id: 'b4_ex_1',
      lessonId: 'bai_4',
      questionNumber: 1,
      type: 'compare',
      level: 'Cơ bản',
      question: 'Điền dấu so sánh thích hợp vào chỗ chấm: 3 ... 5',
      options: ['<', '>', '=', '+'],
      correctAnswer: '<',
      explanation: 'Số 3 bé hơn số 5, ta viết 3 < 5.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 27 }
    },
    {
      id: 'b4_ex_2',
      lessonId: 'bai_4',
      questionNumber: 2,
      type: 'compare',
      level: 'Cơ bản',
      question: 'Điền dấu so sánh thích hợp vào chỗ chấm: 8 ... 6',
      options: ['>', '<', '=', '-'],
      correctAnswer: '>',
      explanation: 'Số 8 lớn hơn số 6, ta viết 8 > 6.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 28 }
    },
    {
      id: 'b4_ex_3',
      lessonId: 'bai_4',
      questionNumber: 3,
      type: 'multiple_choice',
      level: 'Thực hành',
      question: 'Trong các số: 3, 8, 5, 9, số nào là số lớn nhất?',
      options: ['3', '5', '8', '9'],
      correctAnswer: '9',
      explanation: 'So sánh các số: 3 < 5 < 8 < 9. Vậy số lớn nhất là số 9.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 29 }
    },
    {
      id: 'b4_ex_4',
      lessonId: 'bai_4',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Trong các số: 7, 2, 6, 4, số nào là số bé nhất?',
      options: ['7', '6', '4', '2'],
      correctAnswer: '2',
      explanation: 'So sánh: 2 < 4 < 6 < 7. Vậy số bé nhất là số 2.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 30 }
    },
    {
      id: 'b4_ex_5',
      lessonId: 'bai_4',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Bạn Lan 6 tuổi, bạn Mai 7 tuổi, bạn Nam 6 tuổi. Ai là bạn nhiều tuổi nhất?',
      options: ['Bạn Lan', 'Bạn Mai', 'Bạn Nam', 'Ba bạn bằng tuổi'],
      correctAnswer: 'Bạn Mai',
      explanation: '7 tuổi lớn hơn 6 tuổi, vậy bạn Mai nhiều tuổi nhất.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 31 }
    },
    {
      id: 'b4_ex_6',
      lessonId: 'bai_4',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Tìm số thích hợp điền vào ô trống để: 6 < ... < 8',
      options: ['5', '6', '7', '8'],
      correctAnswer: '7',
      explanation: 'Số vừa lớn hơn 6 vừa bé hơn 8 là số 7.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 31 }
    }
  ],

  bai_5: [
    {
      id: 'b5_ex_1',
      lessonId: 'bai_5',
      questionNumber: 1,
      type: 'fill_blank',
      level: 'Cơ bản',
      question: '5 gồm 3 và mấy?',
      illustration: { type: 'number_igloo', data: { total: 5, partA: 3, partB: '?' } },
      options: ['1', '2', '3', '4'],
      correctAnswer: '2',
      explanation: '5 tách thành 3 và 2 (vì 3 gộp với 2 được 5).',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 33 }
    },
    {
      id: 'b5_ex_2',
      lessonId: 'bai_5',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Gộp 2 và 2 được mấy?',
      illustration: { type: 'number_igloo', data: { total: '?', partA: 2, partB: 2 } },
      options: ['3', '4', '5', '2'],
      correctAnswer: '4',
      explanation: '2 gộp với 2 được 4.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 34 }
    },
    {
      id: 'b5_ex_3',
      lessonId: 'bai_5',
      questionNumber: 3,
      type: 'fill_blank',
      level: 'Thực hành',
      question: '6 gồm 5 và mấy?',
      illustration: { type: 'number_igloo', data: { total: 6, partA: 5, partB: '?' } },
      options: ['1', '2', '3', '0'],
      correctAnswer: '1',
      explanation: '6 gồm 5 và 1.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 35 }
    },
    {
      id: 'b5_ex_4',
      lessonId: 'bai_5',
      questionNumber: 4,
      type: 'multiple_choice',
      level: 'Luyện tập',
      question: 'Tách 4 quả cam vào hai đĩa, cách tách nào sau đây là đúng?',
      options: ['Gồm 1 và 3', 'Gồm 2 và 3', 'Gồm 1 và 2', 'Gồm 0 và 5'],
      correctAnswer: 'Gồm 1 và 3',
      explanation: '4 gồm 1 và 3 (hoặc 2 và 2).',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 36 }
    },
    {
      id: 'b5_ex_5',
      lessonId: 'bai_5',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Có 5 chú chim đậu trên cành cây, 2 chú chim bay đi. Còn lại mấy chú chim?',
      options: ['2 chú', '3 chú', '4 chú', '1 chú'],
      correctAnswer: '3 chú',
      explanation: '5 gồm 2 và 3, bay đi 2 chú thì còn lại 3 chú chim.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 37 }
    },
    {
      id: 'b5_ex_6',
      lessonId: 'bai_5',
      questionNumber: 6,
      type: 'fill_blank',
      level: 'Thử thách',
      question: '10 gồm 7 và mấy?',
      illustration: { type: 'number_igloo', data: { total: 10, partA: 7, partB: '?' } },
      options: ['2', '3', '4', '5'],
      correctAnswer: '3',
      explanation: '10 gồm 7 và 3 (7 gộp với 3 được 10).',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 37 }
    }
  ],

  bai_6: [
    {
      id: 'b6_ex_1',
      lessonId: 'bai_6',
      questionNumber: 1,
      type: 'count_items',
      level: 'Cơ bản',
      question: 'Bé hãy đếm xem có bao nhiêu ngôi sao vàng may mắn dưới đây?',
      illustration: { type: 'fruits', count: 6, itemType: 'apple' },
      options: ['5', '6', '7', '8'],
      correctAnswer: '6',
      explanation: 'Đếm từ 1 đến 6: có tất cả 6 đối tượng.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 39 }
    },
    {
      id: 'b6_ex_2',
      lessonId: 'bai_6',
      questionNumber: 2,
      type: 'multiple_choice',
      level: 'Cơ bản',
      question: 'Số liền trước của số 8 là số nào?',
      options: ['6', '7', '8', '9'],
      correctAnswer: '7',
      explanation: 'Số liền trước số 8 là số 7 (7 đứng ngay trước 8).',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 40 }
    },
    {
      id: 'b6_ex_3',
      lessonId: 'bai_6',
      questionNumber: 3,
      type: 'sort_numbers',
      level: 'Thực hành',
      question: 'Sắp xếp các số sau theo thứ tự từ lớn đến bé: 8, 3, 10, 5',
      options: ['10, 8, 5, 3', '3, 5, 8, 10', '10, 5, 8, 3', '8, 10, 5, 3'],
      correctAnswer: '10, 8, 5, 3',
      explanation: 'Thứ tự từ lớn đến bé: 10 > 8 > 5 > 3.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 41 }
    },
    {
      id: 'b6_ex_4',
      lessonId: 'bai_6',
      questionNumber: 4,
      type: 'compare',
      level: 'Luyện tập',
      question: 'Chọn dấu thích hợp điền vào chỗ chấm: 9 ... 10',
      options: ['<', '>', '=', '+'],
      correctAnswer: '<',
      explanation: '9 bé hơn 10 nên ta viết 9 < 10.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 41 }
    },
    {
      id: 'b6_ex_5',
      lessonId: 'bai_6',
      questionNumber: 5,
      type: 'word_problem',
      level: 'Vận dụng',
      question: 'Lớp 1A có 8 bạn đi thi vẽ tranh, trong đó có 5 bạn nữ. Hỏi có mấy bạn nam?',
      options: ['2 bạn', '3 bạn', '4 bạn', '5 bạn'],
      correctAnswer: '3 bạn',
      explanation: '8 gồm 5 và 3. Vậy có 3 bạn nam.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 42 }
    },
    {
      id: 'b6_ex_6',
      lessonId: 'bai_6',
      questionNumber: 6,
      type: 'multiple_choice',
      level: 'Thử thách',
      question: 'Số nào lớn hơn 6 và bé hơn 8?',
      options: ['5', '6', '7', '9'],
      correctAnswer: '7',
      explanation: 'Vì 6 < 7 < 8 nên số đó là 7.',
      sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 43 }
    }
  ]
};
