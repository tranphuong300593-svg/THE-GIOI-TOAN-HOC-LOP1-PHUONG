import { BookDocument, Topic, Lesson } from '../types';
import { ALL_LESSON_EXERCISES } from './lessonExercises';

const RAW_BOOKS: BookDocument[] = [
  {
    id: 'sgk_toan_1_tap_1',
    title: 'Toán 1 - Tập một',
    publisher: 'Nhà xuất bản Giáo dục Việt Nam',
    authors: 'Hà Huy Khoái (Tổng Chủ biên), Lê Anh Vinh (Chủ biên), Nguyễn Áng, Vũ Văn Dương, Nguyễn Minh Hải, Bùi Bá Mạnh',
    semester: 1,
    pageCount: 118,
    uploadDate: '2026-10-16',
    status: 'analyzed',
    reviewNotes: 'Hoàn thiện 5 chủ đề và 20 bài học chuẩn GDPT 2018 Tập 1.',
    topics: [
      {
        id: 'chu_de_1',
        topicNumber: 1,
        name: 'Các số từ 0 đến 10',
        semester: 1,
        description: 'Đếm, đọc, viết, so sánh và tách gộp các số từ 0 đến 10.',
        iconName: 'Numbers',
        lessons: [
          {
            id: 'bai_1',
            lessonNumber: 1,
            title: 'Các số 0, 1, 2, 3, 4, 5',
            semester: 1,
            topicId: 'chu_de_1',
            topicName: 'Các số từ 0 đến 10',
            pageRange: 'Trang 8 - 13',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Nhận biết số lượng các nhóm đồ vật từ 0 đến 5',
              'Đọc và viết thành thạo các số 0, 1, 2, 3, 4, 5',
              'Nhận biết ý nghĩa của số 0 là không có vật nào'
            ],
            coreKnowledge: 'Các số 0, 1, 2, 3, 4, 5 dùng để chỉ số lượng. Số 0 chỉ nhóm không có đồ vật nào. Thứ tự các số từ bé đến lớn: 0, 1, 2, 3, 4, 5.',
            examples: [
              {
                title: 'Khám phá đếm cá trong bể',
                description: 'Bể có 3 con cá biểu thị bằng số 3. Bể không có con cá nào biểu thị bằng số 0.',
                calculationText: '0, 1, 2, 3, 4, 5',
                illustration: { type: 'sea_creatures', count: 3, itemType: 'fish' }
              }
            ],
            isTeacherVerified: true,
            exercises: [
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
                type: 'fill_blank',
                level: 'Luyện tập',
                question: 'Tìm số thích hợp điền vào dấu ? trên toa tàu: 1, 2, ?, 4, 5',
                illustration: { type: 'train_cars', data: { sequence: [1, 2, '?', 4, 5] } },
                options: ['0', '3', '5', '6'],
                correctAnswer: '3',
                explanation: 'Dãy số đếm từ 1 đến 5: 1, 2, 3, 4, 5. Số đứng giữa 2 và 4 là số 3.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 10 }
              }
            ]
          },
          {
            id: 'bai_2',
            lessonNumber: 2,
            title: 'Các số 6, 7, 8, 9, 10',
            semester: 1,
            topicId: 'chu_de_1',
            topicName: 'Các số từ 0 đến 10',
            pageRange: 'Trang 14 - 19',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Nhận biết và đếm số lượng các nhóm đồ vật từ 6 đến 10',
              'Đọc và viết đúng các số 6, 7, 8, 9, 10',
              'Nắm vững dãy số tự nhiên từ 0 đến 10 theo hai chiều'
            ],
            coreKnowledge: 'Thứ tự từ bé đến lớn: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Thứ tự từ lớn đến bé: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0.',
            examples: [
              {
                title: 'Đếm các chú gà',
                description: 'Đếm nhóm có 8 chú gà con.',
                calculationText: '6, 7, 8, 9, 10',
                illustration: { type: 'animals', count: 8, itemType: 'chick' }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b2_ex_1',
                lessonId: 'bai_2',
                questionNumber: 1,
                type: 'count_items',
                level: 'Cơ bản',
                question: 'Bé hãy đếm xem có bao nhiêu chú gà con đang vui chơi?',
                illustration: { type: 'animals', count: 8, itemType: 'chick' },
                options: ['6', '7', '8', '9'],
                correctAnswer: '8',
                explanation: 'Đếm lần lượt từng chú gà con: có tất cả 8 chú gà con.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 15 }
              },
              {
                id: 'b2_ex_2',
                lessonId: 'bai_2',
                questionNumber: 2,
                type: 'fill_blank',
                level: 'Luyện tập',
                question: 'Điền số còn thiếu vào toa tàu đếm ngược: 10, 9, ?, 7, 6',
                illustration: { type: 'train_cars', data: { sequence: [10, 9, '?', 7, 6] } },
                options: ['8', '5', '4', '7'],
                correctAnswer: '8',
                explanation: 'Đếm lùi từ 10: 10, 9, 8, 7, 6. Số còn thiếu là 8.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 17 }
              }
            ]
          },
          {
            id: 'bai_3',
            lessonNumber: 3,
            title: 'Nhiều hơn, ít hơn, bằng nhau',
            semester: 1,
            topicId: 'chu_de_1',
            topicName: 'Các số từ 0 đến 10',
            pageRange: 'Trang 20 - 23',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'So sánh số lượng hai nhóm đối tượng bằng cách ghép đôi 1-1',
              'Sử dụng chính xác các từ: nhiều hơn, ít hơn, bằng nhau'
            ],
            coreKnowledge: 'Ghép đôi từng vật của hai nhóm. Nhóm nào còn thừa là nhóm nhiều hơn, nhóm thiếu là ít hơn. Nếu vừa vặn thì hai nhóm bằng nhau.',
            examples: [
              {
                title: 'Dạng 1: Nhiều hơn (Táo và Cam)',
                description: 'Nhóm 1 có 5 quả táo, nhóm 2 có 3 quả cam. So sánh hai nhóm: Số quả táo nhiều hơn số quả cam (5 > 3).',
                calculationText: '5 quả táo nhiều hơn 3 quả cam',
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
                }
              },
              {
                title: 'Dạng 2: Ít hơn (Thỏ và Cà rốt)',
                description: 'Nhóm 1 có 2 chú thỏ, nhóm 2 có 4 củ cà rốt. So sánh hai nhóm: Số chú thỏ ít hơn số củ cà rốt (2 < 4).',
                calculationText: '2 chú thỏ ít hơn 4 củ cà rốt',
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
                }
              },
              {
                title: 'Dạng 3: Bằng nhau (Hoa và Bướm)',
                description: 'Có 4 bông hoa và 4 chú bướm. Ghép đôi mỗi bông hoa với một chú bướm vừa vặn: Số bông hoa bằng số chú bướm (4 = 4).',
                calculationText: '4 bông hoa bằng 4 chú bướm',
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
                }
              }
            ],
            isTeacherVerified: true,
            exercises: [
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
            ]
          },
          {
            id: 'bai_4',
            lessonNumber: 4,
            title: 'So sánh số',
            semester: 1,
            topicId: 'chu_de_1',
            topicName: 'Các số từ 0 đến 10',
            pageRange: 'Trang 24 - 31',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Nhận biết và viết đúng các dấu >, <, =',
              'So sánh thành thạo hai số trong phạm vi 10'
            ],
            coreKnowledge: 'Dấu > là dấu lớn hơn. Dấu < là dấu bé hơn. Dấu = là dấu bằng nhau. Ví dụ: 5 > 3; 2 < 4; 4 = 4.',
            examples: [
              {
                title: 'So sánh số lượng',
                description: '4 chú vịt và 3 chú vịt: 4 > 3.',
                calculationText: '4 > 3'
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b4_ex_1',
                lessonId: 'bai_4',
                questionNumber: 1,
                type: 'compare',
                level: 'Cơ bản',
                question: 'Chọn dấu thích hợp: 7 ? 4',
                options: ['>', '<', '='],
                correctAnswer: '>',
                explanation: 'Số 7 lớn hơn số 4 nên ta điền dấu lớn hơn (>): 7 > 4.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 25 }
              },
              {
                id: 'b4_ex_2',
                lessonId: 'bai_4',
                questionNumber: 2,
                type: 'compare',
                level: 'Luyện tập',
                question: 'Chọn dấu thích hợp: 3 ? 8',
                options: ['>', '<', '='],
                correctAnswer: '<',
                explanation: 'Số 3 bé hơn số 8 nên ta điền dấu bé hơn (<): 3 < 8.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 27 }
              }
            ]
          },
          {
            id: 'bai_5',
            lessonNumber: 5,
            title: 'Mấy và mấy',
            semester: 1,
            topicId: 'chu_de_1',
            topicName: 'Các số từ 0 đến 10',
            pageRange: 'Trang 32 - 37',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Hiểu sơ đồ tách - gộp số',
              'Biết 5 gồm 4 và 1; 5 gồm 3 và 2; 5 gồm 2 và 3; 5 gồm 1 và 4'
            ],
            coreKnowledge: 'Gộp 3 và 2 được 5. Tách 5 gồm 3 và 2 (hoặc 4 và 1).',
            examples: [
              {
                title: 'Tách bể cá',
                description: 'Có 5 con cá gồm 1 con cá to và 4 con cá nhỏ.',
                calculationText: '5 gồm 1 và 4'
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b5_ex_1',
                lessonId: 'bai_5',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Số 5 gồm 3 và mấy?',
                options: ['1', '2', '3', '4'],
                correctAnswer: '2',
                explanation: '5 gồm 3 và 2 (vì gộp 3 với 2 được 5).',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 35 }
              }
            ]
          },
          {
            id: 'bai_6',
            lessonNumber: 6,
            title: 'Luyện tập chung',
            semester: 1,
            topicId: 'chu_de_1',
            topicName: 'Các số từ 0 đến 10',
            pageRange: 'Trang 38 - 43',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Củng cố đếm, so sánh và sắp xếp thứ tự các số từ 0 đến 10',
              'Vận dụng vào các tình huống thực tế'
            ],
            coreKnowledge: 'Ôn tập đếm đồ vật, so sánh các cặp số, tìm số lớn nhất và số bé nhất.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b6_ex_1',
                lessonId: 'bai_6',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Trong các số 2, 9, 5, 7, số nào lớn nhất?',
                options: ['2', '5', '7', '9'],
                correctAnswer: '9',
                explanation: 'Số 9 là số lớn nhất trong dãy.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 39 }
              }
            ]
          }
        ]
      },
      {
        id: 'chu_de_2',
        topicNumber: 2,
        name: 'Làm quen với một số hình phẳng',
        semester: 1,
        description: 'Nhận biết hình vuông, hình tròn, hình tam giác, hình chữ nhật trong thực tế.',
        iconName: 'Shapes',
        lessons: [
          {
            id: 'bai_7',
            lessonNumber: 7,
            title: 'Hình vuông, hình tròn, hình tam giác, hình chữ nhật',
            semester: 1,
            topicId: 'chu_de_2',
            topicName: 'Làm quen với một số hình phẳng',
            pageRange: 'Trang 46 - 49',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Nhận biết và gọi đúng tên: hình vuông, hình tròn, hình tam giác, hình chữ nhật',
              'Phân biệt được các hình qua đặc điểm cạnh và đỉnh, không nhầm lẫn với hình khối'
            ],
            coreKnowledge: 'Hình vuông có 4 cạnh bằng nhau và 4 góc vuông. Hình chữ nhật có 2 cạnh dài và 2 cạnh ngắn. Hình tam giác có 3 cạnh và 3 đỉnh. Hình tròn có đường viền cong tròn đều khép kín.',
            examples: [
              {
                title: 'Khám phá 4 hình phẳng cơ bản',
                description: 'Hình vuông có 4 cạnh bằng nhau; Hình chữ nhật có 2 cạnh dài và 2 cạnh ngắn; Hình tam giác có 3 cạnh; Hình tròn viền cong khép kín.',
                illustration: {
                  type: 'flat_shapes',
                  data: {
                    shapesList: [
                      { shape: 'square', label: 'Hình vuông' },
                      { shape: 'circle', label: 'Hình tròn' },
                      { shape: 'triangle', label: 'Hình tam giác' },
                      { shape: 'rectangle', label: 'Hình chữ nhật' }
                    ]
                  }
                }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b7_ex_1',
                lessonId: 'bai_7',
                questionNumber: 1,
                type: 'geometry',
                level: 'Cơ bản',
                question: 'Hình vẽ dưới đây là hình gì?',
                illustration: { type: 'flat_shapes', shape: 'circle' },
                options: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'],
                correctAnswer: 'Hình tròn',
                explanation: 'Hình có đường cong tròn đều khép kín là hình tròn.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 46 }
              },
              {
                id: 'b7_ex_2',
                lessonId: 'bai_7',
                questionNumber: 2,
                type: 'geometry',
                level: 'Cơ bản',
                question: 'Hình nào có 3 cạnh thẳng và 3 góc nhọn?',
                illustration: { type: 'flat_shapes', shape: 'triangle' },
                options: ['Hình tam giác', 'Hình tròn', 'Hình vuông', 'Hình chữ nhật'],
                correctAnswer: 'Hình tam giác',
                explanation: 'Hình tam giác luôn có đúng 3 cạnh và 3 góc (3 đỉnh).',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 47 }
              },
              {
                id: 'b7_ex_3',
                lessonId: 'bai_7',
                questionNumber: 3,
                type: 'geometry',
                level: 'Luyện tập',
                question: 'Hình dưới đây có 4 cạnh bằng nhau, đó là hình gì?',
                illustration: { type: 'flat_shapes', shape: 'square' },
                options: ['Hình vuông', 'Hình chữ nhật', 'Hình tam giác', 'Hình tròn'],
                correctAnswer: 'Hình vuông',
                explanation: 'Hình vuông có 4 cạnh dài bằng nhau và 4 góc vuông.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 48 }
              },
              {
                id: 'b7_ex_4',
                lessonId: 'bai_7',
                questionNumber: 4,
                type: 'geometry',
                level: 'Luyện tập',
                question: 'Hình dưới đây có 2 cạnh dài bằng nhau và 2 cạnh ngắn bằng nhau, đó là hình gì?',
                illustration: { type: 'flat_shapes', shape: 'rectangle' },
                options: ['Hình chữ nhật', 'Hình vuông', 'Hình tam giác', 'Hình tròn'],
                correctAnswer: 'Hình chữ nhật',
                explanation: 'Hình chữ nhật có 2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau và 4 góc vuông.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 49 }
              }
            ]
          },
          {
            id: 'bai_8',
            lessonNumber: 8,
            title: 'Thực hành lắp ghép, xếp hình',
            semester: 1,
            topicId: 'chu_de_2',
            topicName: 'Làm quen với một số hình phẳng',
            pageRange: 'Trang 50 - 53',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Sử dụng các miếng bìa hình tam giác, hình vuông để ghép thành hình ngôi nhà, con thuyền',
              'Phát triển trí tưởng tượng không gian và tư duy hình học'
            ],
            coreKnowledge: 'Ghép hai hình tam giác vuông bằng nhau có thể tạo thành một hình vuông hoàn chỉnh.',
            examples: [
              {
                title: 'Ghép 2 hình tam giác thành 1 hình vuông',
                description: 'Khi đặt 2 miếng bìa hình tam giác vuông cân kề sát cạnh huyền, ta được một hình vuông hoàn chỉnh.',
                illustration: { type: 'shapes_composition', data: { mode: 'two_triangles_square' } }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b8_ex_1',
                lessonId: 'bai_8',
                questionNumber: 1,
                type: 'geometry',
                level: 'Luyện tập',
                question: 'Ghép 2 miếng bìa hình tam giác bằng nhau có thể tạo thành hình nào?',
                illustration: { type: 'shapes_composition', data: { mode: 'two_triangles_square' } },
                options: ['Hình vuông', 'Hình tròn', 'Hình khối cầu', 'Đường thẳng'],
                correctAnswer: 'Hình vuông',
                explanation: 'Khi ghép hai tam giác vuông cân vào nhau sẽ được một hình vuông hoàn chỉnh.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 51 }
              },
              {
                id: 'b8_ex_2',
                lessonId: 'bai_8',
                questionNumber: 2,
                type: 'geometry',
                level: 'Thử thách',
                question: 'Mái nhà trong bức tranh ghép hình thường được tạo bởi hình gì?',
                illustration: { type: 'shapes_composition', data: { mode: 'house' } },
                options: ['Hình tam giác', 'Hình tròn', 'Hình chữ nhật', 'Hình thoi'],
                correctAnswer: 'Hình tam giác',
                explanation: 'Mái nhà nhọn đón mưa nắng có dạng hình tam giác.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 52 }
              }
            ]
          },
          {
            id: 'bai_9',
            lessonNumber: 9,
            title: 'Luyện tập chung',
            semester: 1,
            topicId: 'chu_de_2',
            topicName: 'Làm quen với một số hình phẳng',
            pageRange: 'Trang 54 - 55',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Phân loại và đếm số lượng hình vuông, hình tròn, hình tam giác, hình chữ nhật trong thực tế'
            ],
            coreKnowledge: 'Nhận biết các hình hình học phẳng trong đồ vật quen thuộc: khung cửa sổ, biển báo, đĩa ăn, bánh xe.',
            examples: [
              {
                title: 'Hình phẳng trong đời sống',
                description: 'Khung ảnh treo tường có dạng hình chữ nhật; Mặt đĩa ăn có dạng hình tròn; Viên gạch hoa có dạng hình vuông.',
                illustration: { type: 'flat_shapes', shape: 'rectangle' }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b9_ex_1',
                lessonId: 'bai_9',
                questionNumber: 1,
                type: 'geometry',
                level: 'Cơ bản',
                question: 'Khung ảnh treo tường có 2 cạnh dài và 2 cạnh ngắn là dạng hình gì?',
                illustration: { type: 'flat_shapes', shape: 'rectangle' },
                options: ['Hình chữ nhật', 'Hình tam giác', 'Hình tròn', 'Hình bầu dục'],
                correctAnswer: 'Hình chữ nhật',
                explanation: 'Khung ảnh có 2 cạnh dài và 2 cạnh ngắn là hình chữ nhật.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 54 }
              },
              {
                id: 'b9_ex_2',
                lessonId: 'bai_9',
                questionNumber: 2,
                type: 'geometry',
                level: 'Luyện tập',
                question: 'Bánh xe đạp hoặc chiếc đĩa ăn thường có dạng hình gì?',
                illustration: { type: 'flat_shapes', shape: 'circle' },
                options: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'],
                correctAnswer: 'Hình tròn',
                explanation: 'Bánh xe và đĩa ăn có đường cong khép kín tròn xoe là hình tròn.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 55 }
              }
            ]
          }
        ]
      },
      {
        id: 'chu_de_3',
        topicNumber: 3,
        name: 'Phép cộng, phép trừ trong phạm vi 10',
        semester: 1,
        description: 'Ý nghĩa phép tính cộng (gộp vào) và phép trừ (bớt đi), bảng cộng trừ đến 10.',
        iconName: 'Calculator',
        lessons: [
          {
            id: 'bai_10',
            lessonNumber: 10,
            title: 'Phép cộng trong phạm vi 10',
            semester: 1,
            topicId: 'chu_de_3',
            topicName: 'Phép cộng, phép trừ trong phạm vi 10',
            pageRange: 'Trang 56 - 67',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Hiểu ý nghĩa của phép cộng là gộp lại',
              'Thực hiện thành thạo các phép tính cộng trong phạm vi 10'
            ],
            coreKnowledge: 'Gộp 3 quả bóng và 2 quả bóng được 5 quả bóng: 3 + 2 = 5.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b10_ex_1',
                lessonId: 'bai_10',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Tính: 3 + 2 = ?',
                illustration: { type: 'balance_tray', count: 3, secondaryCount: 2, itemType: 'apple' },
                options: ['4', '5', '6', '7'],
                correctAnswer: '5',
                explanation: '3 cộng thêm 2 bằng 5: 3 + 2 = 5.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 56 }
              },
              {
                id: 'b10_ex_2',
                lessonId: 'bai_10',
                questionNumber: 2,
                type: 'fill_blank',
                level: 'Luyện tập',
                question: 'Tính: 4 + 3 = ?',
                options: ['6', '7', '8', '9'],
                correctAnswer: '7',
                explanation: '4 + 3 = 7.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 58 }
              }
            ]
          },
          {
            id: 'bai_11',
            lessonNumber: 11,
            title: 'Phép trừ trong phạm vi 10',
            semester: 1,
            topicId: 'chu_de_3',
            topicName: 'Phép cộng, phép trừ trong phạm vi 10',
            pageRange: 'Trang 68 - 79',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Hiểu ý nghĩa của phép trừ là bớt đi, tách ra',
              'Thực hiện thành thạo các phép tính trừ trong phạm vi 10'
            ],
            coreKnowledge: 'Có 6 quả cam, bớt 1 quả còn lại 5 quả: 6 − 1 = 5.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b11_ex_1',
                lessonId: 'bai_11',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Tính: 6 − 2 = ?',
                options: ['3', '4', '5', '2'],
                correctAnswer: '4',
                explanation: '6 bớt đi 2 còn 4: 6 − 2 = 4.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 69 }
              }
            ]
          },
          {
            id: 'bai_12',
            lessonNumber: 12,
            title: 'Bảng cộng, bảng trừ trong phạm vi 10',
            semester: 1,
            topicId: 'chu_de_3',
            topicName: 'Phép cộng, phép trừ trong phạm vi 10',
            pageRange: 'Trang 80 - 85',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Học thuộc bảng cộng và bảng trừ trong phạm vi 10',
              'Tính nhẩm nhanh nhẹn, chính xác'
            ],
            coreKnowledge: 'Các cặp số có tổng bằng 10: 1+9, 2+8, 3+7, 4+6, 5+5. Quan hệ cộng trừ: nếu 7+3=10 thì 10−3=7 và 10−7=3.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b12_ex_1',
                lessonId: 'bai_12',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Luyện tập',
                question: 'Điền số thích hợp: 7 + ? = 10',
                options: ['2', '3', '4', '5'],
                correctAnswer: '3',
                explanation: '7 + 3 = 10.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 81 }
              }
            ]
          },
          {
            id: 'bai_13',
            lessonNumber: 13,
            title: 'Luyện tập chung',
            semester: 1,
            topicId: 'chu_de_3',
            topicName: 'Phép cộng, phép trừ trong phạm vi 10',
            pageRange: 'Trang 86 - 91',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Thực hiện dãy tính có hai dấu phép tính: 5 + 2 + 1 = 8'
            ],
            coreKnowledge: 'Thực hiện phép tính lần lượt từ trái sang phải: 3 + 1 + 2 = 4 + 2 = 6.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b13_ex_1',
                lessonId: 'bai_13',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Thử thách',
                question: 'Tính: 5 + 3 − 2 = ?',
                options: ['5', '6', '7', '8'],
                correctAnswer: '6',
                explanation: '5 + 3 = 8, rồi 8 − 2 = 6.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 87 }
              }
            ]
          }
        ]
      },
      {
        id: 'chu_de_4',
        topicNumber: 4,
        name: 'Làm quen với một số hình khối',
        semester: 1,
        description: 'Nhận dạng khối lập phương, khối hộp chữ nhật và vị trí định hướng.',
        iconName: 'Box',
        lessons: [
          {
            id: 'bai_14',
            lessonNumber: 14,
            title: 'Khối lập phương, khối hộp chữ nhật',
            semester: 1,
            topicId: 'chu_de_4',
            topicName: 'Làm quen với một số hình khối',
            pageRange: 'Trang 92 - 95',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Nhận biết khối lập phương và khối hộp chữ nhật',
              'Nhận dạng các đồ vật trong đời sống có dạng hai khối này',
              'Phân biệt rõ ràng hình phẳng (hình vuông, chữ nhật) và hình khối (lập phương, hộp chữ nhật)'
            ],
            coreKnowledge: 'Khối lập phương có đúng 6 mặt đều là hình vuông bằng nhau. Khối hộp chữ nhật có các mặt là hình chữ nhật.',
            examples: [
              {
                title: 'Khối lập phương và khối hộp chữ nhật',
                description: 'Con xúc xắc có 6 mặt vuông bằng nhau là khối lập phương. Hộp sữa tươi, bao diêm là khối hộp chữ nhật.',
                illustration: { type: 'solids_3d', shape: 'cube' }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b14_ex_1',
                lessonId: 'bai_14',
                questionNumber: 1,
                type: 'geometry',
                level: 'Cơ bản',
                question: 'Con xúc xắc đồ chơi có dạng hình khối nào dưới đây?',
                illustration: { type: 'solids_3d', shape: 'cube' },
                options: ['Khối lập phương', 'Khối hộp chữ nhật', 'Hình tròn', 'Hình tam giác'],
                correctAnswer: 'Khối lập phương',
                explanation: 'Con xúc xắc có 6 mặt vuông bằng nhau nên có dạng khối lập phương.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 92 }
              },
              {
                id: 'b14_ex_2',
                lessonId: 'bai_14',
                questionNumber: 2,
                type: 'geometry',
                level: 'Cơ bản',
                question: 'Hộp sữa tươi dài hoặc bao diêm có dạng hình khối nào?',
                illustration: { type: 'solids_3d', shape: 'cuboid' },
                options: ['Khối hộp chữ nhật', 'Khối lập phương', 'Hình vuông', 'Hình tròn'],
                correctAnswer: 'Khối hộp chữ nhật',
                explanation: 'Hộp sữa tươi và bao diêm có các mặt phẳng hình chữ nhật, đó là khối hộp chữ nhật.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 93 }
              },
              {
                id: 'b14_ex_3',
                lessonId: 'bai_14',
                questionNumber: 3,
                type: 'geometry',
                level: 'Luyện tập',
                question: 'Mỗi mặt của khối lập phương là hình gì?',
                options: ['Hình vuông', 'Hình chữ nhật', 'Hình tròn', 'Hình tam giác'],
                correctAnswer: 'Hình vuông',
                explanation: 'Khối lập phương có đúng 6 mặt đều là các hình vuông bằng nhau.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 94 }
              }
            ]
          },
          {
            id: 'bai_15',
            lessonNumber: 15,
            title: 'Vị trí, định hướng trong không gian',
            semester: 1,
            topicId: 'chu_de_4',
            topicName: 'Làm quen với một số hình khối',
            pageRange: 'Trang 96 - 99',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Xác định đúng các vị trí: trên - dưới, trước - sau, ở giữa, phải - trái với góc nhìn rõ ràng',
              'Vận dụng định hướng trong không gian lớp học và sinh hoạt thực tế'
            ],
            coreKnowledge: 'Phân biệt: Phía trên - phía dưới; Phía trước - phía sau; Bên phải - bên trái; Ở giữa.',
            examples: [
              {
                title: 'Đèn tín hiệu giao thông',
                description: 'Đèn đỏ ở trên cùng, đèn vàng ở giữa, đèn xanh ở dưới cùng.',
                illustration: { type: 'spatial_positions', data: { mode: 'traffic_light' } }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b15_ex_1',
                lessonId: 'bai_15',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Đèn tín hiệu giao thông có 3 màu: đỏ, vàng, xanh. Đèn trên cùng có màu gì?',
                illustration: { type: 'spatial_positions', data: { mode: 'traffic_light' } },
                options: ['Màu đỏ', 'Màu vàng', 'Màu xanh'],
                correctAnswer: 'Màu đỏ',
                explanation: 'Đèn giao thông trên cùng có màu đỏ, ở giữa màu vàng, dưới cùng màu xanh.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 96 }
              },
              {
                id: 'b15_ex_2',
                lessonId: 'bai_15',
                questionNumber: 2,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Quan sát bàn học: Trên mặt bàn có quả táo đỏ, dưới gầm bàn có quả bóng. Quả bóng ở vị trí nào so với chiếc bàn?',
                illustration: { type: 'spatial_positions', data: { mode: 'above_below' } },
                options: ['Ở dưới bàn', 'Ở trên bàn', 'Ở bên phải bàn', 'Ở đằng sau bàn'],
                correctAnswer: 'Ở dưới bàn',
                explanation: 'Quả bóng nằm ở phía dưới gầm bàn.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 97 }
              },
              {
                id: 'b15_ex_3',
                lessonId: 'bai_15',
                questionNumber: 3,
                type: 'multiple_choice',
                level: 'Thử thách',
                question: 'Quan sát cây xanh ở giữa: Bên trái cây có bạn thỏ trắng, bên phải cây có bạn cún vàng. Bạn cún ở phía bên nào của cây?',
                illustration: { type: 'spatial_positions', data: { mode: 'left_right' } },
                options: ['Bên phải', 'Bên trái', 'Ở trên', 'Ở dưới'],
                correctAnswer: 'Bên phải',
                explanation: 'Bạn cún vàng đứng ở vị trí phía bên tay phải của cây xanh.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 98 }
              }
            ]
          },
          {
            id: 'bai_16',
            lessonNumber: 16,
            title: 'Luyện tập chung',
            semester: 1,
            topicId: 'chu_de_4',
            topicName: 'Làm quen với một số hình khối',
            pageRange: 'Trang 100 - 101',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: [
              'Phân biệt khối lập phương, khối hộp chữ nhật và vị trí sắp xếp đồ vật'
            ],
            coreKnowledge: 'Khối lập phương và khối hộp chữ nhật có các mặt phẳng vững chắc nên dễ dàng xếp chồng lên nhau.',
            examples: [
              {
                title: 'Hình khối trong đời sống',
                description: 'Bao diêm, hộp phấn có dạng khối hộp chữ nhật; Viên xúc xắc, khối rubik có dạng khối lập phương.',
                illustration: { type: 'solids_3d', shape: 'cuboid' }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b16_ex_1',
                lessonId: 'bai_16',
                questionNumber: 1,
                type: 'geometry',
                level: 'Luyện tập',
                question: 'Bao diêm hoặc hộp phấn viết bảng có dạng hình khối nào?',
                illustration: { type: 'solids_3d', shape: 'cuboid' },
                options: ['Khối hộp chữ nhật', 'Khối lập phương', 'Hình vuông', 'Hình tròn'],
                correctAnswer: 'Khối hộp chữ nhật',
                explanation: 'Bao diêm và hộp phấn có dạng khối hộp chữ nhật.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 100 }
              },
              {
                id: 'b16_ex_2',
                lessonId: 'bai_16',
                questionNumber: 2,
                type: 'geometry',
                level: 'Luyện tập',
                question: 'Đồ vật nào sau đây có dạng khối lập phương?',
                illustration: { type: 'solids_3d', shape: 'cube' },
                options: ['Con xúc xắc 🎲', 'Bao diêm dài 📦', 'Quả bóng tròn ⚽', 'Quyển vở học sinh 📘'],
                correctAnswer: 'Con xúc xắc 🎲',
                explanation: 'Con xúc xắc có 6 mặt vuông bằng nhau nên có dạng khối lập phương.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 101 }
              }
            ]
          }
        ]
      },
      {
        id: 'chu_de_5',
        topicNumber: 5,
        name: 'Ôn tập học kì 1',
        semester: 1,
        description: 'Tổng kết kiến thức học kì I: số đếm, so sánh, cộng trừ đến 10 và hình học.',
        iconName: 'Award',
        lessons: [
          {
            id: 'bai_17',
            lessonNumber: 17,
            title: 'Ôn tập các số trong phạm vi 10',
            semester: 1,
            topicId: 'chu_de_5',
            topicName: 'Ôn tập học kì 1',
            pageRange: 'Trang 102 - 105',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: ['Hệ thống hóa đọc, viết, đếm và so sánh các số từ 0 đến 10'],
            coreKnowledge: 'Thứ tự từ 0 đến 10. Tìm số lớn nhất, số bé nhất.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b17_ex_1',
                lessonId: 'bai_17',
                questionNumber: 1,
                type: 'sort_numbers',
                level: 'Luyện tập',
                question: 'Sắp xếp các số 6, 8, 5, 7 theo thứ tự từ bé đến lớn:',
                options: ['5, 6, 7, 8', '8, 7, 6, 5', '5, 7, 6, 8', '6, 5, 7, 8'],
                correctAnswer: '5, 6, 7, 8',
                explanation: 'Thứ tự từ bé đến lớn là: 5, 6, 7, 8.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 104 }
              }
            ]
          },
          {
            id: 'bai_18',
            lessonNumber: 18,
            title: 'Ôn tập phép cộng, phép trừ trong phạm vi 10',
            semester: 1,
            topicId: 'chu_de_5',
            topicName: 'Ôn tập học kì 1',
            pageRange: 'Trang 106 - 109',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: ['Tính nhẩm cộng trừ trong phạm vi 10 nhanh và chính xác'],
            coreKnowledge: 'Cộng trừ với số 0: a + 0 = a; a − 0 = a; a − a = 0.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b18_ex_1',
                lessonId: 'bai_18',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Cơ bản',
                question: 'Tính nhẩm: 8 − 0 = ?',
                options: ['0', '8', '7', '9'],
                correctAnswer: '8',
                explanation: 'Bất kỳ số nào trừ đi 0 vẫn bằng chính nó: 8 − 0 = 8.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 106 }
              }
            ]
          },
          {
            id: 'bai_19',
            lessonNumber: 19,
            title: 'Ôn tập hình học',
            semester: 1,
            topicId: 'chu_de_5',
            topicName: 'Ôn tập học kì 1',
            pageRange: 'Trang 110 - 111',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: ['Ôn tập phân loại hình phẳng và hình khối đã học'],
            coreKnowledge: 'Hình vuông, hình tròn, hình tam giác, hình chữ nhật, khối lập phương, khối hộp chữ nhật.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b19_ex_1',
                lessonId: 'bai_19',
                questionNumber: 1,
                type: 'geometry',
                level: 'Cơ bản',
                question: 'Hình nào dưới đây có đúng 3 cạnh và 3 đỉnh?',
                illustration: { type: 'flat_shapes', shape: 'triangle' },
                options: ['Hình tam giác', 'Hình tròn', 'Hình vuông', 'Hình chữ nhật'],
                correctAnswer: 'Hình tam giác',
                explanation: 'Hình tam giác luôn có 3 cạnh.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 110 }
              }
            ]
          },
          {
            id: 'bai_20',
            lessonNumber: 20,
            title: 'Ôn tập chung',
            semester: 1,
            topicId: 'chu_de_5',
            topicName: 'Ôn tập học kì 1',
            pageRange: 'Trang 112 - 114',
            sourceBook: 'Toán 1 - Tập một',
            learningObjectives: ['Tổng kết toàn diện kiến thức kì 1'],
            coreKnowledge: 'Làm quen với các bài toán có lời văn và tình huống thực tế.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b20_ex_1',
                lessonId: 'bai_20',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Thử thách',
                question: 'Tính: 4 + 4 + 2 = ?',
                options: ['8', '9', '10', '11'],
                correctAnswer: '10',
                explanation: '4 + 4 = 8, rồi 8 + 2 = 10.',
                sourceRef: { bookTitle: 'Toán 1 - Tập một', page: 112 }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sgk_toan_1_tap_2',
    title: 'Toán 1 - Tập hai',
    publisher: 'Nhà xuất bản Giáo dục Việt Nam',
    authors: 'Hà Huy Khoái (Tổng Chủ biên), Lê Anh Vinh (Chủ biên), Nguyễn Áng, Vũ Văn Dương, Nguyễn Minh Hải, Bùi Bá Mạnh',
    semester: 2,
    pageCount: 110,
    uploadDate: '2026-10-16',
    status: 'analyzed',
    reviewNotes: 'Hoàn thiện 5 chủ đề và 21 bài học chuẩn GDPT 2018 Tập 2 (tổng cộng 41 bài).',
    topics: [
      {
        id: 'chu_de_6',
        topicNumber: 6,
        name: 'Các số đến 100',
        semester: 2,
        description: 'Số có hai chữ số, số tròn chục, cấu tạo thập phân chục và đơn vị, bảng số 1 đến 100.',
        iconName: 'Sparkles',
        lessons: [
          {
            id: 'bai_21',
            lessonNumber: 21,
            title: 'Số có hai chữ số',
            semester: 2,
            topicId: 'chu_de_6',
            topicName: 'Các số đến 100',
            pageRange: 'Trang 4 - 15',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: [
              'Nhận biết số có hai chữ số gồm hàng chục và hàng đơn vị',
              'Đọc và viết các số tròn chục: 10, 20, 30, 40, 50, 60, 70, 80, 90'
            ],
            coreKnowledge: 'Số có hai chữ số: chữ số hàng chục đứng trước, chữ số hàng đơn vị đứng sau.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b21_ex_1',
                lessonId: 'bai_21',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Số 47 gồm mấy chục và mấy đơn vị?',
                options: ['4 chục và 7 đơn vị', '7 chục và 4 đơn vị', '4 chục và 0 đơn vị', '47 chục'],
                correctAnswer: '4 chục và 7 đơn vị',
                explanation: 'Chữ số 4 đứng trước là số chục, số 7 đứng sau là số đơn vị.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 10 }
              }
            ]
          },
          {
            id: 'bai_22',
            lessonNumber: 22,
            title: 'So sánh số có hai chữ số',
            semester: 2,
            topicId: 'chu_de_6',
            topicName: 'Các số đến 100',
            pageRange: 'Trang 16 - 21',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['So sánh hàng chục trước, nếu bằng nhau thì so sánh hàng đơn vị'],
            coreKnowledge: 'So sánh 42 và 25: hàng chục 4 > 2 nên 42 > 25.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b22_ex_1',
                lessonId: 'bai_22',
                questionNumber: 1,
                type: 'compare',
                level: 'Cơ bản',
                question: 'Điền dấu thích hợp: 56 ? 65',
                options: ['<', '>', '='],
                correctAnswer: '<',
                explanation: '5 chục bé hơn 6 chục (5 < 6), do đó 56 < 65.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 17 }
              }
            ]
          },
          {
            id: 'bai_23',
            lessonNumber: 23,
            title: 'Bảng các số từ 1 đến 100',
            semester: 2,
            topicId: 'chu_de_6',
            topicName: 'Các số đến 100',
            pageRange: 'Trang 22 - 23',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Nắm vững cấu trúc bảng 100 số, số liền trước, số liền sau'],
            coreKnowledge: 'Số liền trước của một số bé hơn số đó 1 đơn vị. Số liền sau lớn hơn số đó 1 đơn vị.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b23_ex_1',
                lessonId: 'bai_23',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Luyện tập',
                question: 'Số liền sau của số 99 là số nào?',
                options: ['98', '100', '90', '101'],
                correctAnswer: '100',
                explanation: '99 thêm 1 là 100 (một trăm).',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 22 }
              }
            ]
          },
          {
            id: 'bai_24',
            lessonNumber: 24,
            title: 'Luyện tập chung',
            semester: 2,
            topicId: 'chu_de_6',
            topicName: 'Các số đến 100',
            pageRange: 'Trang 24 - 27',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Ôn tập nhận biết số chục, số đơn vị và thứ tự trong phạm vi 100'],
            coreKnowledge: 'Đọc và viết các số có hai chữ số thành thạo.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b24_ex_1',
                lessonId: 'bai_24',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Số "Ba mươi lăm" được viết là:',
                options: ['35', '53', '305', '30'],
                correctAnswer: '35',
                explanation: 'Ba mươi lăm viết là 35.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 24 }
              }
            ]
          }
        ]
      },
      {
        id: 'chu_de_7',
        topicNumber: 7,
        name: 'Độ dài và đo độ dài',
        semester: 2,
        description: 'So sánh dài ngắn, cao thấp, đơn vị đo xăng-ti-mét (cm) và thực hành ước lượng.',
        iconName: 'Ruler',
        lessons: [
          {
            id: 'bai_25',
            lessonNumber: 25,
            title: 'Dài hơn, ngắn hơn',
            semester: 2,
            topicId: 'chu_de_7',
            topicName: 'Độ dài và đo độ dài',
            pageRange: 'Trang 28 - 31',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['So sánh trực tiếp độ dài của hai đồ vật'],
            coreKnowledge: 'Đặt một đầu của hai vật thẳng hàng với nhau để so sánh.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b25_ex_1',
                lessonId: 'bai_25',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Chú hươu cao cổ và chú ngựa vằn, bạn nào cao hơn?',
                options: ['Hươu cao cổ cao hơn', 'Ngựa vằn cao hơn', 'Hai bạn cao bằng nhau'],
                correctAnswer: 'Hươu cao cổ cao hơn',
                explanation: 'Hươu cao cổ có chiếc cổ rất dài nên cao hơn chú ngựa vằn.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 30 }
              }
            ]
          },
          {
            id: 'bai_26',
            lessonNumber: 26,
            title: 'Đơn vị đo độ dài',
            semester: 2,
            topicId: 'chu_de_7',
            topicName: 'Độ dài và đo độ dài',
            pageRange: 'Trang 32 - 35',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Làm quen đơn vị xăng-ti-mét (viết tắt là cm), cách đặt thước vạch 0'],
            coreKnowledge: 'Xăng-ti-mét viết tắt là cm. Đặt đầu vật trùng với vạch số 0 trên thước kẻ.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b26_ex_1',
                lessonId: 'bai_26',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Quan sát hình vẽ. Bút chì dài bao nhiêu xăng-ti-mét?',
                illustration: { type: 'ruler_cm', data: { lengthCm: 7, item: 'pencil' } },
                options: ['5 cm', '6 cm', '7 cm', '8 cm'],
                correctAnswer: '7 cm',
                explanation: 'Đầu trái bút chì trùng đúng vạch số 0, đầu nhọn chạm đúng vạch số 7. Vậy bút chì dài đúng 7 cm.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 34 }
              }
            ]
          },
          {
            id: 'bai_27',
            lessonNumber: 27,
            title: 'Thực hành ước lượng và đo độ dài',
            semester: 2,
            topicId: 'chu_de_7',
            topicName: 'Độ dài và đo độ dài',
            pageRange: 'Trang 36 - 39',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Ước lượng độ dài bằng gang tay, bước chân, sải tay'],
            coreKnowledge: '1 gang tay học sinh lớp 1 dài khoảng 12 cm đến 15 cm.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b27_ex_1',
                lessonId: 'bai_27',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Một hộp bút học sinh thường dài khoảng bao nhiêu xăng-ti-mét?',
                options: ['2 cm', '20 cm', '200 cm', '2000 cm'],
                correctAnswer: '20 cm',
                explanation: 'Hộp bút thường dài khoảng 15 cm đến 20 cm.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 36 }
              }
            ]
          },
          {
            id: 'bai_28',
            lessonNumber: 28,
            title: 'Luyện tập chung',
            semester: 2,
            topicId: 'chu_de_7',
            topicName: 'Độ dài và đo độ dài',
            pageRange: 'Trang 40 - 43',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Thực hiện phép tính với số đo độ dài đơn vị cm'],
            coreKnowledge: '5 cm + 3 cm = 8 cm; 9 cm − 4 cm = 5 cm.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b28_ex_1',
                lessonId: 'bai_28',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Luyện tập',
                question: 'Tính: 6 cm + 4 cm = ? cm',
                options: ['8 cm', '9 cm', '10 cm', '12 cm'],
                correctAnswer: '10 cm',
                explanation: '6 + 4 = 10, vậy 6 cm + 4 cm = 10 cm.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 40 }
              }
            ]
          }
        ]
      },
      {
        id: 'chu_de_8',
        topicNumber: 8,
        name: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
        semester: 2,
        description: 'Cộng trừ số có hai chữ số với số có một hoặc hai chữ số không nhớ.',
        iconName: 'PlusCircle',
        lessons: [
          {
            id: 'bai_29',
            lessonNumber: 29,
            title: 'Phép cộng số có hai chữ số với số có một chữ số',
            semester: 2,
            topicId: 'chu_de_8',
            topicName: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
            pageRange: 'Trang 44 - 47',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Cộng hàng đơn vị với hàng đơn vị, giữ nguyên hàng chục'],
            coreKnowledge: 'Ví dụ 41 + 5: 1 cộng 5 bằng 6, viết 6. Hạ 4, viết 4. Kết quả là 46.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b29_ex_1',
                lessonId: 'bai_29',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Cơ bản',
                question: 'Tính: 20 + 4 = ?',
                options: ['24', '20', '42', '60'],
                correctAnswer: '24',
                explanation: '20 + 4 = 24.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 44 }
              }
            ]
          },
          {
            id: 'bai_30',
            lessonNumber: 30,
            title: 'Phép cộng số có hai chữ số với số có hai chữ số',
            semester: 2,
            topicId: 'chu_de_8',
            topicName: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
            pageRange: 'Trang 48 - 51',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Đặt tính thẳng cột: hàng đơn vị thẳng hàng đơn vị, hàng chục thẳng hàng chục'],
            coreKnowledge: 'Ví dụ 32 + 15: 2 + 5 = 7; 3 + 1 = 4. Kết quả là 47.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b30_ex_1',
                lessonId: 'bai_30',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Luyện tập',
                question: 'Tính: 24 + 30 = ?',
                options: ['50', '54', '56', '44'],
                correctAnswer: '54',
                explanation: '4 + 0 = 4; 2 + 3 = 5. Kết quả là 54.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 48 }
              }
            ]
          },
          {
            id: 'bai_31',
            lessonNumber: 31,
            title: 'Phép trừ số có hai chữ số cho số có một chữ số',
            semester: 2,
            topicId: 'chu_de_8',
            topicName: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
            pageRange: 'Trang 52 - 57',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Trừ hàng đơn vị cho hàng đơn vị, giữ nguyên hàng chục'],
            coreKnowledge: 'Ví dụ 76 − 5: 6 trừ 5 bằng 1, viết 1. Hạ 7, viết 7. Kết quả là 71.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b31_ex_1',
                lessonId: 'bai_31',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Cơ bản',
                question: 'Tính: 34 − 4 = ?',
                options: ['30', '34', '38', '20'],
                correctAnswer: '30',
                explanation: '4 − 4 = 0, hạ 3 được 30.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 52 }
              }
            ]
          },
          {
            id: 'bai_32',
            lessonNumber: 32,
            title: 'Phép trừ số có hai chữ số cho số có hai chữ số',
            semester: 2,
            topicId: 'chu_de_8',
            topicName: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
            pageRange: 'Trang 58 - 63',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Đặt tính và trừ thẳng cột số có hai chữ số không nhớ'],
            coreKnowledge: 'Ví dụ 58 − 23: 8 trừ 3 bằng 5; 5 trừ 2 bằng 3. Kết quả là 35.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b32_ex_1',
                lessonId: 'bai_32',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Luyện tập',
                question: 'Tính: 48 − 16 = ?',
                options: ['30', '32', '34', '22'],
                correctAnswer: '32',
                explanation: '8 − 6 = 2, 4 − 1 = 3. Kết quả là 32.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 58 }
              }
            ]
          },
          {
            id: 'bai_33',
            lessonNumber: 33,
            title: 'Luyện tập chung',
            semester: 2,
            topicId: 'chu_de_8',
            topicName: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
            pageRange: 'Trang 64 - 71',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Thực hiện thành thạo cộng trừ không nhớ trong phạm vi 100'],
            coreKnowledge: 'Giải toán có lời văn và tính toán nhanh chóng.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b33_ex_1',
                lessonId: 'bai_33',
                questionNumber: 1,
                type: 'word_problem',
                level: 'Thử thách',
                question: 'Lớp 1/1 có 32 học sinh, lớp 1/2 có 30 học sinh. Cả hai lớp có tất cả bao nhiêu học sinh?',
                options: ['60 học sinh', '62 học sinh', '64 học sinh', '52 học sinh'],
                correctAnswer: '62 học sinh',
                explanation: '32 + 30 = 62 học sinh.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 64 }
              }
            ]
          }
        ]
      },
      {
        id: 'chu_de_9',
        topicNumber: 9,
        name: 'Thời gian, giờ và lịch',
        semester: 2,
        description: 'Xem giờ đúng trên đồng hồ, các ngày trong tuần, thực hành xem lịch.',
        iconName: 'Clock',
        lessons: [
          {
            id: 'bai_34',
            lessonNumber: 34,
            title: 'Xem giờ đúng trên đồng hồ',
            semester: 2,
            topicId: 'chu_de_9',
            topicName: 'Thời gian, giờ và lịch',
            pageRange: 'Trang 72 - 75',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: [
              'Nhận biết kim ngắn chỉ giờ, kim dài chỉ phút trên mặt đồng hồ',
              'Xem giờ đúng khi kim dài chỉ thẳng vào số 12, kim ngắn chỉ vào số nào là bấy nhiêu giờ'
            ],
            coreKnowledge: 'Kim ngắn chỉ giờ, kim dài chỉ phút. Khi kim dài chỉ số 12, kim ngắn chỉ số mấy là bấy nhiêu giờ đúng (ví dụ: 8 giờ đúng).',
            examples: [
              {
                title: 'Khám phá xem giờ đúng (8 giờ)',
                description: 'Kim ngắn màu đỏ chỉ số 8, kim dài màu xanh chỉ số 12. Đồng hồ chỉ 8 giờ đúng.',
                illustration: { type: 'clock_face', data: { hour: 8 } }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b34_ex_1',
                lessonId: 'bai_34',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Bé quan sát đồng hồ: Lúc này là mấy giờ đúng?',
                illustration: { type: 'clock_face', data: { hour: 8 } },
                options: ['7 giờ', '8 giờ', '9 giờ', '12 giờ'],
                correctAnswer: '8 giờ',
                explanation: 'Kim ngắn chỉ số 8, kim dài chỉ số 12 nên là 8 giờ đúng.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 72 }
              },
              {
                id: 'b34_ex_2',
                lessonId: 'bai_34',
                questionNumber: 2,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Buổi trưa em ăn cơm lúc kim ngắn chỉ số 11, kim dài chỉ số 12. Đó là lúc mấy giờ?',
                illustration: { type: 'clock_face', data: { hour: 11 } },
                options: ['10 giờ', '11 giờ', '12 giờ', '1 giờ'],
                correctAnswer: '11 giờ',
                explanation: 'Kim ngắn chỉ số 11 và kim dài chỉ số 12 là đúng 11 giờ trưa.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 73 }
              },
              {
                id: 'b34_ex_3',
                lessonId: 'bai_34',
                questionNumber: 3,
                type: 'multiple_choice',
                level: 'Thử thách',
                question: 'Buổi sáng em thức dậy lúc 6 giờ đúng. Vị trí hai kim đồng hồ lúc này như thế nào?',
                illustration: { type: 'clock_face', data: { hour: 6 } },
                options: [
                  'Kim ngắn chỉ số 6, kim dài chỉ số 12',
                  'Kim ngắn chỉ số 12, kim dài chỉ số 6',
                  'Kim ngắn chỉ số 5, kim dài chỉ số 12',
                  'Cả hai kim cùng chỉ số 6'
                ],
                correctAnswer: 'Kim ngắn chỉ số 6, kim dài chỉ số 12',
                explanation: 'Lúc 6 giờ đúng, kim ngắn chỉ số 6 và kim dài chỉ thẳng số 12.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 74 }
              }
            ]
          },
          {
            id: 'bai_35',
            lessonNumber: 35,
            title: 'Các ngày trong tuần',
            semester: 2,
            topicId: 'chu_de_9',
            topicName: 'Thời gian, giờ và lịch',
            pageRange: 'Trang 76 - 79',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: [
              'Biết một tuần lễ có 7 ngày: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy, Chủ Nhật',
              'Phân biệt các ngày đi học (Thứ Hai đến Thứ Sáu) và ngày nghỉ cuối tuần (Thứ Bảy, Chủ Nhật)'
            ],
            coreKnowledge: 'Một tuần lễ có đúng 7 ngày theo thứ tự: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy, Chủ Nhật.',
            examples: [
              {
                title: 'Các ngày trong tuần lễ',
                description: 'Bé đi học từ Thứ Hai đến Thứ Sáu (5 ngày). Nghỉ học vào Thứ Bảy và Chủ Nhật (2 ngày).',
                illustration: { type: 'calendar_page', data: { dayName: 'Thứ Hai', dayNumber: 1, month: 9, year: 2026 } }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b35_ex_1',
                lessonId: 'bai_35',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Một tuần lễ có bao nhiêu ngày?',
                options: ['5 ngày', '6 ngày', '7 ngày', '8 ngày'],
                correctAnswer: '7 ngày',
                explanation: 'Một tuần lễ gồm đúng 7 ngày: từ Thứ Hai đến Chủ Nhật.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 76 }
              },
              {
                id: 'b35_ex_2',
                lessonId: 'bai_35',
                questionNumber: 2,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Trong một tuần, các em đến trường đi học vào những ngày nào?',
                options: [
                  'Từ Thứ Hai đến Thứ Sáu',
                  'Chỉ Thứ Bảy và Chủ Nhật',
                  'Cả 7 ngày trong tuần',
                  'Chỉ Thứ Hai và Thứ Ba'
                ],
                correctAnswer: 'Từ Thứ Hai đến Thứ Sáu',
                explanation: 'Học sinh tiểu học đi học 5 ngày trong tuần: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 77 }
              },
              {
                id: 'b35_ex_3',
                lessonId: 'bai_35',
                questionNumber: 3,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Hai ngày cuối tuần các em được nghỉ học cùng gia đình là ngày nào?',
                options: [
                  'Thứ Bảy và Chủ Nhật',
                  'Thứ Năm và Thứ Sáu',
                  'Thứ Hai và Thứ Ba',
                  'Chủ Nhật và Thứ Hai'
                ],
                correctAnswer: 'Thứ Bảy và Chủ Nhật',
                explanation: 'Thứ Bảy và Chủ Nhật là 2 ngày nghỉ cuối tuần.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 78 }
              }
            ]
          },
          {
            id: 'bai_36',
            lessonNumber: 36,
            title: 'Thực hành xem lịch và giờ',
            semester: 2,
            topicId: 'chu_de_9',
            topicName: 'Thời gian, giờ và lịch',
            pageRange: 'Trang 80 - 83',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: [
              'Xem tờ lịch bóc tường, đọc đúng thứ trong tuần và ngày trong tháng',
              'Nắm được số ngày trong tháng (28, 29, 30 hoặc 31 ngày)'
            ],
            coreKnowledge: 'Đọc ngày và thứ tương ứng trên tờ lịch. Nhận biết hôm qua, hôm nay và ngày mai.',
            examples: [
              {
                title: 'Đọc tờ lịch bóc tường',
                description: 'Tờ lịch bóc tường ghi: Ngày 15, Thứ Năm, Tháng 5.',
                illustration: { type: 'calendar_page', data: { dayName: 'Thứ Năm', dayNumber: 15, month: 5, year: 2026 } }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b36_ex_1',
                lessonId: 'bai_36',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Nếu hôm nay là Thứ Năm, thì ngày mai là thứ mấy?',
                options: ['Thứ Tư', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'],
                correctAnswer: 'Thứ Sáu',
                explanation: 'Ngày mai là ngày liền sau hôm nay. Liền sau Thứ Năm là Thứ Sáu.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 80 }
              },
              {
                id: 'b36_ex_2',
                lessonId: 'bai_36',
                questionNumber: 2,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Bé quan sát tờ lịch bóc tường dưới đây: Hôm nay là thứ mấy, ngày mấy?',
                illustration: { type: 'calendar_page', data: { dayName: 'Thứ Hai', dayNumber: 20, month: 10, year: 2026 } },
                options: [
                  'Thứ Hai, ngày 20',
                  'Thứ Ba, ngày 20',
                  'Thứ Hai, ngày 10',
                  'Chủ Nhật, ngày 20'
                ],
                correctAnswer: 'Thứ Hai, ngày 20',
                explanation: 'Tờ lịch ghi rõ hàng trên là Thứ Hai và chữ số lớn ở giữa là ngày 20.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 81 }
              },
              {
                id: 'b36_ex_3',
                lessonId: 'bai_36',
                questionNumber: 3,
                type: 'multiple_choice',
                level: 'Thử thách',
                question: 'Tháng Hai của năm thông thường (không nhuận) có bao nhiêu ngày?',
                options: ['28 ngày', '30 ngày', '31 ngày', '25 ngày'],
                correctAnswer: '28 ngày',
                explanation: 'Tháng Hai năm thường có đúng 28 ngày (năm nhuận có 29 ngày).',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 82 }
              }
            ]
          },
          {
            id: 'bai_37',
            lessonNumber: 37,
            title: 'Luyện tập chung',
            semester: 2,
            topicId: 'chu_de_9',
            topicName: 'Thời gian, giờ và lịch',
            pageRange: 'Trang 84 - 87',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: [
              'Tổng kết và củng cố vững chắc kỹ năng xem giờ đúng và lịch tuần'
            ],
            coreKnowledge: 'Củng cố các khái niệm thời gian gần gũi với sinh hoạt hàng ngày: giờ vào lớp, giờ tan trường, giờ đi ngủ.',
            examples: [
              {
                title: 'Một ngày của em',
                description: '7 giờ sáng vào lớp học; 4 giờ chiều tan học; 9 giờ tối đi ngủ.',
                illustration: { type: 'clock_face', data: { hour: 7 } }
              }
            ],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b37_ex_1',
                lessonId: 'bai_37',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Cơ bản',
                question: 'Buổi sáng em vào lớp học lúc mấy giờ đúng?',
                illustration: { type: 'clock_face', data: { hour: 7 } },
                options: ['7 giờ', '10 giờ', '12 giờ', '3 giờ'],
                correctAnswer: '7 giờ',
                explanation: 'Đồng hồ có kim ngắn chỉ số 7, kim dài chỉ số 12 nên là 7 giờ đúng.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 84 }
              },
              {
                id: 'b37_ex_2',
                lessonId: 'bai_37',
                questionNumber: 2,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Buổi tối em đi ngủ lúc 9 giờ đúng. Lúc đó kim ngắn chỉ vào số mấy?',
                illustration: { type: 'clock_face', data: { hour: 9 } },
                options: ['Số 9', 'Số 12', 'Số 8', 'Số 6'],
                correctAnswer: 'Số 9',
                explanation: 'Lúc 9 giờ đúng, kim ngắn chỉ vào số 9 và kim dài chỉ vào số 12.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 85 }
              },
              {
                id: 'b37_ex_3',
                lessonId: 'bai_37',
                questionNumber: 3,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Nếu hôm nay là Thứ Sáu, thì ngày hôm qua là thứ mấy?',
                options: ['Thứ Năm', 'Thứ Bảy', 'Thứ Tư', 'Chủ Nhật'],
                correctAnswer: 'Thứ Năm',
                explanation: 'Ngày hôm qua là ngày liền trước hôm nay. Liền trước Thứ Sáu là Thứ Năm.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 86 }
              }
            ]
          }
        ]
      },
      {
        id: 'chu_de_10',
        topicNumber: 10,
        name: 'Ôn tập cuối năm',
        semester: 2,
        description: 'Tổng kết toàn diện kiến thức cả năm học môn Toán lớp 1 chuẩn GDPT 2018.',
        iconName: 'Trophy',
        lessons: [
          {
            id: 'bai_38',
            lessonNumber: 38,
            title: 'Ôn tập các số và phép tính trong phạm vi 10',
            semester: 2,
            topicId: 'chu_de_10',
            topicName: 'Ôn tập cuối năm',
            pageRange: 'Trang 88 - 93',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Củng cố thành thạo các số và phép cộng trừ đến 10'],
            coreKnowledge: 'Bảng cộng, bảng trừ và tính toán chuỗi phép tính.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b38_ex_1',
                lessonId: 'bai_38',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Luyện tập',
                question: 'Tính: 9 − 3 + 2 = ?',
                options: ['6', '7', '8', '9'],
                correctAnswer: '8',
                explanation: '9 − 3 = 6, rồi 6 + 2 = 8.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 88 }
              }
            ]
          },
          {
            id: 'bai_39',
            lessonNumber: 39,
            title: 'Ôn tập các số và phép tính trong phạm vi 100',
            semester: 2,
            topicId: 'chu_de_10',
            topicName: 'Ôn tập cuối năm',
            pageRange: 'Trang 94 - 99',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Ôn tập cấu tạo số đến 100 và cộng trừ không nhớ'],
            coreKnowledge: 'Thực hiện chính xác các phép tính cộng, trừ hai chữ số.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b39_ex_1',
                lessonId: 'bai_39',
                questionNumber: 1,
                type: 'fill_blank',
                level: 'Luyện tập',
                question: 'Tính: 55 + 23 = ?',
                options: ['75', '78', '88', '77'],
                correctAnswer: '78',
                explanation: '5 + 3 = 8; 5 + 2 = 7. Kết quả là 78.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 94 }
              }
            ]
          },
          {
            id: 'bai_40',
            lessonNumber: 40,
            title: 'Ôn tập hình học và đo lường',
            semester: 2,
            topicId: 'chu_de_10',
            topicName: 'Ôn tập cuối năm',
            pageRange: 'Trang 100 - 103',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Hệ thống hóa hình học phẳng, hình khối, đo độ dài cm và xem giờ đúng'],
            coreKnowledge: 'Phân loại hình phẳng, khối lập phương, khối hộp chữ nhật, đo xăng-ti-mét và đồng hồ.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b40_ex_1',
                lessonId: 'bai_40',
                questionNumber: 1,
                type: 'geometry',
                level: 'Luyện tập',
                question: 'Hình nào dưới đây có 4 cạnh bằng nhau?',
                illustration: { type: 'flat_shapes', shape: 'square' },
                options: ['Hình vuông', 'Hình chữ nhật', 'Hình tam giác', 'Hình tròn'],
                correctAnswer: 'Hình vuông',
                explanation: 'Hình vuông có 4 cạnh bằng nhau.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 100 }
              },
              {
                id: 'b40_ex_2',
                lessonId: 'bai_40',
                questionNumber: 2,
                type: 'multiple_choice',
                level: 'Luyện tập',
                question: 'Quan sát hình vẽ. Bút chì dài bao nhiêu xăng-ti-mét?',
                illustration: { type: 'ruler_cm', data: { lengthCm: 7, item: 'pencil' } },
                options: ['5 cm', '6 cm', '7 cm', '8 cm'],
                correctAnswer: '7 cm',
                explanation: 'Đầu trái bút chì trùng đúng vạch số 0, đầu nhọn chạm đúng vạch số 7. Vậy bút chì dài đúng 7 cm.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 102 }
              }
            ]
          },
          {
            id: 'bai_41',
            lessonNumber: 41,
            title: 'Ôn tập chung',
            semester: 2,
            topicId: 'chu_de_10',
            topicName: 'Ôn tập cuối năm',
            pageRange: 'Trang 104 - 106',
            sourceBook: 'Toán 1 - Tập hai',
            learningObjectives: ['Đánh giá tổng kết năng lực Toán học lớp 1 chuẩn bị lên lớp 2'],
            coreKnowledge: 'Tổng kết hoàn thành chương trình Toán lớp 1 GDPT 2018.',
            examples: [],
            isTeacherVerified: true,
            exercises: [
              {
                id: 'b41_ex_1',
                lessonId: 'bai_41',
                questionNumber: 1,
                type: 'multiple_choice',
                level: 'Thử thách',
                question: 'Số lớn nhất có hai chữ số là số nào?',
                options: ['90', '98', '99', '100'],
                correctAnswer: '99',
                explanation: '99 là số lớn nhất có hai chữ số.',
                sourceRef: { bookTitle: 'Toán 1 - Tập hai', page: 104 }
              }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_BOOKS: BookDocument[] = RAW_BOOKS.map(book => ({
  ...book,
  topics: book.topics.map(topic => ({
    ...topic,
    lessons: topic.lessons.map(lesson => ({
      ...lesson,
      exercises: ALL_LESSON_EXERCISES[lesson.id] || lesson.exercises
    }))
  }))
}));

// Helper to list all 26 official primary classes 1/1 to 1/26
export const OFFICIAL_CLASSES: string[] = Array.from({ length: 26 }, (_, i) => `1/${i + 1}`);

export const INITIAL_STUDENTS = [
  {
    id: 'hs_lop_1_1_nam',
    classId: '1/1',
    code: '1/1-01',
    name: 'Bé Nam',
    avatar: '👦',
    stars: 20,
    completedLessons: ['bai_1', 'bai_2', 'bai_10'],
    gameHighScores: { mystery_number: 100, speed_match: 90, math_superhero: 95 },
    history: []
  },
  {
    id: 'hs_lop_1_1_mai',
    classId: '1/1',
    code: '1/1-02',
    name: 'Bé Mai',
    avatar: '👧',
    stars: 24,
    completedLessons: ['bai_1', 'bai_7', 'bai_10', 'bai_21'],
    gameHighScores: { mystery_number: 110, math_raceway: 100 },
    history: []
  }
];

export const INITIAL_CLASSES = [
  {
    id: 'lop_1_1',
    name: 'Lớp 1/1',
    schoolYear: '2025 - 2026',
    students: INITIAL_STUDENTS
  }
];
