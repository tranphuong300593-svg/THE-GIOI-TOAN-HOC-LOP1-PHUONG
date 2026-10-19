import { GameId } from '../types';

export interface GameRoundItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  actionFeedback: string;
  stageVisualHint?: string;
  customVisualData?: Record<string, any>;
}

export interface GameMetadata {
  id: GameId;
  num: number;
  title: string;
  subtitle: string;
  icon: string;
  bgGradient: string;
  badge: string;
  topicId: string;
  desc: string;
  mechanicDesc: string;
  actionVisualType: string;
  rewardNoun: string;
  maxProgress: number;
  rounds: GameRoundItem[];
}

export const NEW_GAMES_METADATA: GameMetadata[] = [
  // 9. Câu Cá Đại Dương (Chủ đề 1 & 3)
  {
    id: 'fishing_math',
    num: 9,
    title: 'Câu Cá Đại Dương',
    subtitle: 'Kéo cần câu cá vào giỏ',
    icon: '🎣',
    bgGradient: 'from-cyan-500 to-blue-600',
    badge: 'Chủ đề 1 & 3',
    topicId: 'chu_de_3',
    desc: 'Giải đúng phép tính, cần câu sẽ chuyển động kéo chú cá lên khỏi mặt nước và cho ngay vào giỏ!',
    mechanicDesc: 'Tính đúng → Cần câu kéo căng → Cá nhảy lên giỏ cá → Giỏ cá +1',
    actionVisualType: 'fishing',
    rewardNoun: 'chú cá tươi',
    maxProgress: 5,
    rounds: [
      {
        id: 'fish_1',
        question: 'Phép tính: 3 + 2 = ?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        explanation: '3 cộng 2 bằng 5. Đếm thêm 2 từ 3: 4, 5.',
        hint: 'Bé xoè 3 ngón tay rồi thêm 2 ngón tay nữa nhé!',
        actionFeedback: 'Cần câu giật mạnh kéo lên một chú cá hề cam sọc trắng! Đã vào giỏ cá! 🐟',
        stageVisualHint: '🐠 Cá hề nhiệt đới'
      },
      {
        id: 'fish_2',
        question: 'Phép tính: 7 - 3 = ?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: '7 bớt 3 còn 4 (7 - 3 = 4).',
        hint: 'Đếm lùi 3 bước từ 7: 6, 5, 4.',
        actionFeedback: 'Một chú cá heo xanh thông minh nhảy vút lên khỏi mặt nước! 🐬',
        stageVisualHint: '🐬 Cá heo vui nhộn'
      },
      {
        id: 'fish_3',
        question: 'Có 6 con cá, thêm 4 con cá nữa. Hỏi có tất cả bao nhiêu con cá?',
        options: ['8', '9', '10', '7'],
        correctAnswer: '10',
        explanation: '6 + 4 = 10 con cá tròn một chục.',
        hint: 'Tìm số cần thêm vào 6 để được một chục tròn nhé bé.',
        actionFeedback: 'Tuyệt vời! Chú cá vàng óng ánh to bự lọt vào lưới! ✨🐠',
        stageVisualHint: '🐡 Cá nóc vàng óng'
      },
      {
        id: 'fish_4',
        question: 'Tìm số thích hợp: 8 - ? = 6',
        options: ['1', '2', '3', '4'],
        correctAnswer: '2',
        explanation: '8 trừ 2 bằng 6. Vì 8 - 6 = 2.',
        hint: '8 bớt mấy ngón tay thì còn lại 6 ngón?',
        actionFeedback: 'Cần câu rung lắc dữ dội, một chú cá chuồn sải cánh lấp lánh! 🌊',
        stageVisualHint: '🐟 Cá chuồn bay lượn'
      },
      {
        id: 'fish_5',
        question: 'Phép tính: 5 + 5 - 2 = ?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '8',
        explanation: '5 + 5 = 10, rồi 10 - 2 = 8.',
        hint: 'Tính 5 + 5 trước được 10, sau đó lấy 10 trừ đi 2 nhé.',
        actionFeedback: 'Hoan hô! Chú cá thần lấp lánh 7 màu bơi vào giỏ đầy ắp! 🌈🐟',
        stageVisualHint: '👑 Cá vua ngọc bích'
      }
    ]
  },

  // 10. Thu Hoạch Hoa Quả (Chủ đề 1)
  {
    id: 'fruit_harvest',
    num: 10,
    title: 'Thu Hoạch Hoa Quả',
    subtitle: 'Hái táo đỏ vào sọt vàng',
    icon: '🍎',
    bgGradient: 'from-red-500 to-amber-500',
    badge: 'Chủ đề 1: Số 0 - 10',
    topicId: 'chu_de_1',
    desc: 'Đếm đúng số quả trên cành cây, quả chín sẽ rụng xuống lăn vào giỏ thu hoạch thơm lừng!',
    mechanicDesc: 'Đếm chính xác → Táo đỏ rung rinh rụng xuống → Rơi vào giỏ → Sọt quả đầy ắp',
    actionVisualType: 'fruit_tree',
    rewardNoun: 'quả táo chín',
    maxProgress: 5,
    rounds: [
      {
        id: 'fruit_1',
        question: 'Cây táo có 4 quả đỏ, bé hái thêm 3 quả. Hỏi có tất cả bao nhiêu quả?',
        options: ['6', '7', '8', '5'],
        correctAnswer: '7',
        explanation: '4 + 3 = 7 quả táo thơm ngon.',
        hint: '4 quả rồi đếm tiếp: 5, 6, 7 quả.',
        actionFeedback: 'Trái táo đỏ mọng rơi bộp xuống sọt, thơm nức mũi! 🍎',
        stageVisualHint: '🍎 Táo Envy ngọt ngào'
      },
      {
        id: 'fruit_2',
        question: 'Trên đĩa có 9 quả cam, bé ăn 3 quả. Hỏi đĩa còn lại bao nhiêu quả cam?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
        explanation: '9 bớt 3 còn 6 (9 - 3 = 6).',
        hint: 'Lấy 9 que tính bớt đi 3 que nhé.',
        actionFeedback: 'Quả cam ngọt ngào lăn tròn êm ái vào sọt thu hoạch! 🍊',
        stageVisualHint: '🍊 Cam mật ngọt'
      },
      {
        id: 'fruit_3',
        question: 'Nhìn số lượng: Số nào lớn hơn số 8?',
        options: ['6', '7', '8', '10'],
        correctAnswer: '10',
        explanation: '10 lớn hơn 8 (10 > 8).',
        hint: 'Con hãy đếm tiếp trong dãy số tự nhiên từ bé đến lớn nhé.',
        actionFeedback: 'Chùm nho tím lịm sai trĩu cành đã rơi vào giỏ! 🍇',
        stageVisualHint: '🍇 Nho ngọc bích'
      },
      {
        id: 'fruit_4',
        question: 'Tách số: 8 gồm 5 và mấy?',
        options: ['2', '3', '4', '1'],
        correctAnswer: '3',
        explanation: '8 gồm 5 và 3 (vì 5 + 3 = 8).',
        hint: 'Xoè 8 ngón tay, một bên 5 ngón thì bên kia mấy ngón?',
        actionFeedback: 'Quả dưa hấu mát lạnh lăn vào giỏ vàng! 🍉',
        stageVisualHint: '🍉 Dưa hấu ngọt lành'
      },
      {
        id: 'fruit_5',
        question: 'Điền dấu thích hợp: 4 + 4 ... 9 - 1',
        options: ['>', '<', '='],
        correctAnswer: '=',
        explanation: '4 + 4 = 8 và 9 - 1 = 8. Do đó 8 = 8.',
        hint: 'Tính kết quả hai vế trước: 4+4 bằng 8, 9-1 bằng 8.',
        actionFeedback: 'Sọt hoa quả ngập tràn thơm ngát cả vườn tược! 🧺✨',
        stageVisualHint: '🧺 Sọt quả bội thu'
      }
    ]
  },

  // 11. Cho Thú Cưng Ăn (Chủ đề 3)
  {
    id: 'feed_the_animals',
    num: 11,
    title: 'Cho Thú Cưng Ăn',
    subtitle: 'Ném thức ăn cho bạn thỏ & cún',
    icon: '🥕',
    bgGradient: 'from-amber-400 to-emerald-500',
    badge: 'Chủ đề 3: Phép tính',
    topicId: 'chu_de_3',
    desc: 'Bé giải đúng phép tính, củ cà rốt giòn ngọt hoặc chiếc xương sẽ bay thẳng vào miệng thú cưng vui vẻ!',
    mechanicDesc: 'Tính đúng → Cà rốt bay vút → Thỏ ăn nhồm nhoàm → Cười híp mắt',
    actionVisualType: 'feed_animal',
    rewardNoun: 'món ăn ngon',
    maxProgress: 5,
    rounds: [
      {
        id: 'feed_1',
        question: 'Chú thỏ trắng cần 2 + 6 = ? củ cà rốt',
        options: ['7', '8', '9', '6'],
        correctAnswer: '8',
        explanation: '2 + 6 = 8 củ cà rốt màu cam.',
        hint: '6 thêm 2 là 8 nhé bé.',
        actionFeedback: 'Chú thỏ tai dài há miệng nhai rôm rốp củ cà rốt giòn tan! 🐰🥕',
        stageVisualHint: '🐰 Bạn Thỏ Tai Dài'
      },
      {
        id: 'feed_2',
        question: 'Cún con có 10 khúc xương, đã ăn 4 khúc. Còn lại bao nhiêu khúc xương?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
        explanation: '10 - 4 = 6 khúc xương thơm ngon.',
        hint: '10 ngón tay cụp lại 4 ngón.',
        actionFeedback: 'Cún con vẫy đuôi tít mù mừng rỡ gặm khúc xương! 🐶🦴',
        stageVisualHint: '🐶 Bạn Cún Đốm'
      },
      {
        id: 'feed_3',
        question: 'Mèo con bắt được 3 con cá buổi sáng và 4 con cá buổi chiều. Tổng cộng?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '7',
        explanation: '3 + 4 = 7 con cá tươi rói.',
        hint: '3 cộng thêm 4 bằng 7.',
        actionFeedback: 'Mèo con kêu meo meo liếm mép thưởng thức đĩa cá thơm! 🐱🐟',
        stageVisualHint: '🐱 Bạn Mèo Mướp'
      },
      {
        id: 'feed_4',
        question: 'Khỉ con nhặt được 9 quả chuối, chia cho em 5 quả. Khỉ con còn lại?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: '9 - 5 = 4 quả chuối tiêu vàng.',
        hint: '9 bớt 5 bằng 4.',
        actionFeedback: 'Khỉ con nhảy múa bóc quả chuối vàng ăn ngon lành! 🐵🍌',
        stageVisualHint: '🐵 Bạn Khỉ Nhanh Trí'
      },
      {
        id: 'feed_5',
        question: 'Gấu con hái 5 hũ mật ong, bố cho thêm 5 hũ nữa. Gấu có tất cả?',
        options: ['9', '10', '8', '11'],
        correctAnswer: '10',
        explanation: '5 + 5 = 10 hũ mật ong thơm lừng.',
        hint: 'Con hãy đếm tổng số ngón tay trên cả hai bàn tay nhé.',
        actionFeedback: 'Gấu con xoa bụng tròn vo, no nê sung sướng! 🐻🍯',
        stageVisualHint: '🐻 Bạn Gấu Nâu'
      }
    ]
  },

  // 12. Bắn Bóng Bay Toán Học (Chủ đề 1 & 6)
  {
    id: 'balloon_pop',
    num: 12,
    title: 'Bắn Bóng Bay Toán Học',
    subtitle: 'Nổ bóng bay sắc màu phát sáng',
    icon: '🎈',
    bgGradient: 'from-pink-500 to-rose-600',
    badge: 'Chủ đề 1 & 6',
    topicId: 'chu_de_1',
    desc: 'Chạm chọn quả bóng bay mang đáp án đúng, quả bóng sẽ bùm nổ thành cơn mưa pháo hoa rực rỡ!',
    mechanicDesc: 'Chọn số đúng → Cung tên bắn trúng → Bóng nổ bùm → Pháo hoa giấy tung bay',
    actionVisualType: 'balloon',
    rewardNoun: 'quả bóng phát nổ',
    maxProgress: 5,
    rounds: [
      {
        id: 'ball_1',
        question: 'Quả bóng nào mang số lớn nhất trong các số sau?',
        options: ['12', '45', '29', '38'],
        correctAnswer: '45',
        explanation: '45 có chữ số hàng chục là 4, lớn nhất trong 1, 2, 3, 4.',
        hint: 'So sánh chữ số hàng chục trước nhé: 4 chục là lớn nhất.',
        actionFeedback: 'BÙM! Quả bóng hồng nổ tung toé thành muôn ngàn ngôi sao lấp lánh! 🎈✨',
        stageVisualHint: '🎈 Bóng số 45 bay cao'
      },
      {
        id: 'ball_2',
        question: 'Tìm quả bóng mang số tròn chục:',
        options: ['23', '50', '47', '19'],
        correctAnswer: '50',
        explanation: '50 có tận cùng là số 0 nên là số tròn chục (năm mươi).',
        hint: 'Số tròn chục có chữ số 0 ở hàng đơn vị.',
        actionFeedback: 'PẰNG! Bóng tròn chục nổ vang, thả ra một dải ruy băng ngũ sắc! 🎉',
        stageVisualHint: '🎈 Bóng tròn chục 50'
      },
      {
        id: 'ball_3',
        question: 'Bóng nào có kết quả bằng 10?',
        options: ['4 + 5', '6 + 4', '3 + 6', '8 + 1'],
        correctAnswer: '6 + 4',
        explanation: '6 + 4 = 10. Còn các phép tính kia bằng 9.',
        hint: '6 cộng 4 là cặp bạn thân tạo thành 10.',
        actionFeedback: 'CHÍNH XÁC! Bóng bay số 10 phát nổ rực sáng cả bầu trời! 🌟',
        stageVisualHint: '🎈 Bóng phép tính 6 + 4'
      },
      {
        id: 'ball_4',
        question: 'Dãy số tăng dần: Số đứng liền sau của số 19 là số nào?',
        options: ['18', '20', '21', '30'],
        correctAnswer: '20',
        explanation: 'Liền sau 19 là 20 (đếm: 18, 19, 20).',
        hint: 'Số liền sau là số ngay tiếp theo, con hãy đếm thêm 1 đơn vị nhé.',
        actionFeedback: 'VÈO... BÙM! Mũi tên ánh sáng bắn trúng tim bóng 20! 🎯',
        stageVisualHint: '🎈 Bóng số liền sau 20'
      },
      {
        id: 'ball_5',
        question: 'Bóng nào mang số bé nhất?',
        options: ['61', '16', '26', '60'],
        correctAnswer: '16',
        explanation: '16 có 1 chục, bé hơn các số có 2 chục hoặc 6 chục.',
        hint: 'So sánh chữ số hàng chục: 1 chục bé nhất.',
        actionFeedback: 'Rực rỡ! Cơn mưa bóng bay ngũ sắc bay lượn trên nền trời xanh thẳm! 🎊🎈',
        stageVisualHint: '🎈 Chùm bóng sắc màu'
      }
    ]
  },

  // 13. Lắp Ráp Robot 3D (Chủ đề 4)
  {
    id: 'build_robot',
    num: 13,
    title: 'Lắp Ráp Robot 3D',
    subtitle: 'Gắn thân, tay, chân robot thông minh',
    icon: '🤖',
    bgGradient: 'from-indigo-600 to-purple-600',
    badge: 'Chủ đề 4: Hình khối',
    topicId: 'chu_de_4',
    desc: 'Nhận biết đúng khối lập phương và khối hộp chữ nhật để lắp ráp từng bộ phận cho chú Robot cử động!',
    mechanicDesc: 'Chọn khối đúng → Khối bay vào vị trí → Robot gắn thêm bộ phận → Sáng đèn mắt',
    actionVisualType: 'robot',
    rewardNoun: 'bộ phận robot',
    maxProgress: 5,
    rounds: [
      {
        id: 'rob_1',
        question: 'Viên xúc xắc (con súc sắc) có dạng khối gì?',
        options: ['Khối lập phương', 'Khối hộp chữ nhật', 'Hình tròn', 'Hình tam giác'],
        correctAnswer: 'Khối lập phương',
        explanation: 'Viên xúc xắc có 6 mặt đều là hình vuông, đó là khối lập phương.',
        hint: 'Con hãy quan sát khối hình có các mặt là hình vuông bằng nhau nhé.',
        actionFeedback: 'Đã gắn xong ĐẦU ROBOT từ khối lập phương! Mắt robot sáng xanh bíp bíp! 🤖💡',
        stageVisualHint: '🎲 Khối lập phương xúc xắc'
      },
      {
        id: 'rob_2',
        question: 'Hộp sữa tươi hoặc hộp bánh quy thường có dạng khối gì?',
        options: ['Khối hộp chữ nhật', 'Khối lập phương', 'Hình vuông', 'Hình thoi'],
        correctAnswer: 'Khối hộp chữ nhật',
        explanation: 'Hộp sữa có các mặt hình chữ nhật, đó là khối hộp chữ nhật.',
        hint: 'Con hãy quan sát khối hình có các mặt là hình chữ nhật nhé.',
        actionFeedback: 'Đã gắn THÂN ROBOT từ khối hộp chữ nhật chắc chắn! 🛡️',
        stageVisualHint: '📦 Khối hộp chữ nhật hộp sữa'
      },
      {
        id: 'rob_3',
        question: 'Khối lập phương có mấy mặt?',
        options: ['4 mặt', '6 mặt', '8 mặt', '12 mặt'],
        correctAnswer: '6 mặt',
        explanation: 'Khối lập phương có đúng 6 mặt bằng nhau.',
        hint: 'Bé đếm các mặt xúc xắc từ 1 đến 6 chấm nhé.',
        actionFeedback: 'Đã gắn 2 CÁNH TAY CƠ HỌC cho Robot! Robot vẫy tay chào bé! 🦾',
        stageVisualHint: '🦾 Cánh tay rô-bốt siêu năng'
      },
      {
        id: 'rob_4',
        question: 'Vật nào sau đây KHÔNG PHẢI là khối lập phương?',
        options: ['Hộp quà vuông vắn', 'Khối rubik 3x3', 'Bao diêm dài', 'Viên xúc xắc'],
        correctAnswer: 'Bao diêm dài',
        explanation: 'Bao diêm dài là khối hộp chữ nhật, không phải khối lập phương.',
        hint: 'Bao diêm có mặt dài hình chữ nhật.',
        actionFeedback: 'Đã lắp 2 CHÂN PHẢN LỰC cho Robot đứng vững vàng! 🦿',
        stageVisualHint: '🦿 Đôi chân phản lực'
      },
      {
        id: 'rob_5',
        question: 'Để xây một tháp cao vững, khối nào dễ chồng khít lên nhau nhất?',
        options: ['Khối lập phương & khối hộp chữ nhật', 'Quả bóng tròn', 'Cái phễu', 'Cái nón lá'],
        correctAnswer: 'Khối lập phương & khối hộp chữ nhật',
        explanation: 'Khối có mặt phẳng như lập phương và hộp chữ nhật xếp chồng rất vững chắc.',
        hint: 'Khối có mặt phẳng phẳng lì không bị lăn trượt.',
        actionFeedback: 'HOÀN THÀNH ROBOT 3D! Robot cử động nhảy múa chúc mừng bé! 🤖🎉🕺',
        stageVisualHint: '👑 Robot Chiến Binh hoàn thiện'
      }
    ]
  },

  // 14. Đoàn Tàu Xếp Hàng (Chủ đề 6)
  {
    id: 'train_cargo',
    num: 14,
    title: 'Đoàn Tàu Xếp Hàng',
    subtitle: 'Nối toa chở hàng lăn bánh xình xịch',
    icon: '🚂',
    bgGradient: 'from-emerald-500 to-teal-700',
    badge: 'Chủ đề 6: Số đến 100',
    topicId: 'chu_de_6',
    desc: 'Điền đúng số thứ tự vào toa tàu còn trống, đầu tàu sẽ kéo còi tu tu và chở hàng lăn bánh!',
    mechanicDesc: 'Gắn đúng số toa → Khói phun phì phì → Tàu chuyển động xình xịch → Về ga an toàn',
    actionVisualType: 'train',
    rewardNoun: 'toa tàu nối thêm',
    maxProgress: 5,
    rounds: [
      {
        id: 'trn_1',
        question: 'Dãy số trên toa tàu: 10, 20, 30, ?, 50. Toa số ? là bao nhiêu?',
        options: ['35', '40', '45', '60'],
        correctAnswer: '40',
        explanation: 'Dãy số tròn chục đếm thêm 10: 10, 20, 30, 40, 50.',
        hint: 'Sau 3 chục, đếm thêm 1 chục nữa là bao nhiêu chục nhé.',
        actionFeedback: 'Tu tu xình xịch! Toa số 40 gắn khít vào đoàn tàu! 🚂🚃',
        stageVisualHint: '🚃 Toa tàu 40 chở hoa quả'
      },
      {
        id: 'trn_2',
        question: 'Số 37 gồm mấy chục và mấy đơn vị?',
        options: ['3 chục và 7 đơn vị', '7 chục và 3 đơn vị', '30 chục và 7 đơn vị', '3 và 7 chục'],
        correctAnswer: '3 chục và 7 đơn vị',
        explanation: 'Số 37 có chữ số hàng chục là 3, chữ số hàng đơn vị là 7.',
        hint: 'Chữ số bên trái chỉ số chục, chữ số bên phải chỉ đơn vị.',
        actionFeedback: 'Toa tàu chở 3 chục kiện hàng và 7 túi quà lăn bánh! 📦✨',
        stageVisualHint: '🚃 Toa hàng 37 kiện bưu phẩm'
      },
      {
        id: 'trn_3',
        question: 'Toa tàu tiếp theo: 28, 29, ?',
        options: ['27', '30', '31', '39'],
        correctAnswer: '30',
        explanation: 'Đếm liên tiếp: 28, 29, 30.',
        hint: 'Số liền sau là số ngay sau 29 trong dãy số đếm nhé.',
        actionFeedback: 'Tiếng còi tàu vang vọng: Tu tuuuu! Toa 30 đã sẵn sàng! 🔔',
        stageVisualHint: '🚃 Toa khách 30 ghế ngồi'
      },
      {
        id: 'trn_4',
        question: 'Số gồm 6 chục và 0 đơn vị viết là:',
        options: ['6', '60', '06', '600'],
        correctAnswer: '60',
        explanation: '6 chục và 0 đơn vị viết là 60 (sáu mươi).',
        hint: 'Viết số 6 trước rồi viết số 0 sau.',
        actionFeedback: 'Bánh xe lửa quay tít mù trên đường ray lung linh! 🛤️',
        stageVisualHint: '🚃 Toa năng lượng 60 pin mặt trời'
      },
      {
        id: 'trn_5',
        question: 'So sánh hai toa tàu: 54 ... 45',
        options: ['>', '<', '='],
        correctAnswer: '>',
        explanation: '54 lớn hơn 45 vì hàng chục là 5 lớn hơn 4 (54 > 45).',
        hint: 'So sánh hàng chục trước: 5 chục lớn hơn 4 chục.',
        actionFeedback: 'Đoàn tàu siêu tốc 5 toa đã về đích huy hoàng! Cờ hoa bay ngợp trời! 🚂🚩🎉',
        stageVisualHint: '🏁 Ga cuối cùng rực rỡ cờ hoa'
      }
    ]
  },

  // 15. Nuôi Chim Non Trong Tổ (Chủ đề 1)
  {
    id: 'feed_bird_nest',
    num: 15,
    title: 'Nuôi Chim Non',
    subtitle: 'Chim mẹ mang mồi về tổ ấm',
    icon: '🐣',
    bgGradient: 'from-amber-400 to-yellow-600',
    badge: 'Chủ đề 1: Tách gộp số',
    topicId: 'chu_de_1',
    desc: 'Thực hiện phép tách gộp số chính xác để chim mẹ bay đi tìm hạt kê ngọt ngào về mớm cho các chú chim non!',
    mechanicDesc: 'Tách gộp đúng → Chim mẹ vỗ cánh bay về → Chim non chíp chíp há mỏ → Lông mọc rực rỡ',
    actionVisualType: 'bird_nest',
    rewardNoun: 'hạt ngọc nuôi chim',
    maxProgress: 5,
    rounds: [
      {
        id: 'bird_1',
        question: 'Gộp 2 và 3 được mấy chú chim non?',
        options: ['4', '5', '6', '3'],
        correctAnswer: '5',
        explanation: '2 gộp với 3 được 5 (2 + 3 = 5).',
        hint: 'Đếm 2 ngón tay rồi đếm thêm 3 ngón tay nữa.',
        actionFeedback: 'Chim mẹ bay về tổ ríu rít mớm sâu cho chú chim non thứ nhất! 🐣🐛',
        stageVisualHint: '🪺 Tổ chim cành dâu'
      },
      {
        id: 'bird_2',
        question: 'Tách số 6 thành 4 và mấy?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '2',
        explanation: '6 gồm 4 và 2 (4 + 2 = 6).',
        hint: '6 bớt đi 4 còn lại 2.',
        actionFeedback: 'Chú chim non vỗ đôi cánh non nớt kêu chíp chíp vui sướng! 🐦',
        stageVisualHint: '🪺 Chim non vỗ cánh'
      },
      {
        id: 'bird_3',
        question: 'Số 7 gồm 5 và mấy?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '2',
        explanation: '7 gồm 5 và 2.',
        hint: 'Xoè 7 ngón tay, một bên là cả bàn tay 5 ngón thì bên kia là 2 ngón.',
        actionFeedback: 'Chim non thứ ba mở to đôi mắt long lanh ăn no nê! 🌟',
        stageVisualHint: '🪺 Ba chú chim non xinh xắn'
      },
      {
        id: 'bird_4',
        question: 'Gộp 4 và 4 được mấy?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '8',
        explanation: '4 gộp với 4 được 8 (4 + 4 = 8).',
        hint: '4 ngón tay bên trái gộp 4 ngón tay bên phải.',
        actionFeedback: 'Tổ chim ấm áp tràn ngập tiếng hót líu lo chào buổi sáng! 🎶',
        stageVisualHint: '🪺 Chim mẹ đậu trên cành'
      },
      {
        id: 'bird_5',
        question: '10 gồm 7 và mấy?',
        options: ['2', '3', '4', '5'],
        correctAnswer: '3',
        explanation: '10 gồm 7 và 3 (7 + 3 = 10).',
        hint: '10 ngón tay cụp lại 7 ngón thì còn 3 ngón giơ lên.',
        actionFeedback: 'Cả đàn chim non đã đủ lông đủ cánh bay lượn vút lên bầu trời tự do! 🕊️🌈',
        stageVisualHint: '🕊️ Đàn chim sải cánh bay cao'
      }
    ]
  },

  // 16. Ếch Nhảy Lá Sen (Chủ đề 1 & 3)
  {
    id: 'frog_jump_pond',
    num: 16,
    title: 'Ếch Nhảy Lá Sen',
    subtitle: 'Nhảy tong tong vượt đầm lầy xanh',
    icon: '🐸',
    bgGradient: 'from-green-500 to-emerald-700',
    badge: 'Chủ đề 1 & 3',
    topicId: 'chu_de_3',
    desc: 'Điền đúng số trên tia số để chú ếch xanh nhún chân nhảy tanh tách qua từng chiếc lá sen thơm ngát!',
    mechanicDesc: 'Tính đúng số tia số → Ếch nhún mình nhảy dù → Đáp trúng lá sen → Hoa sen nở bung',
    actionVisualType: 'frog_jump',
    rewardNoun: 'bước nhảy sen hồng',
    maxProgress: 5,
    rounds: [
      {
        id: 'frog_1',
        question: 'Ếch đang ở lá sen số 2, nhảy thêm 3 bước nữa. Ếch đến lá số mấy? (2 + 3 = ?)',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        explanation: '2 nhảy thêm 3 bước: 3, 4, 5. Ếch đến lá số 5.',
        hint: 'Từ số 2 đếm thêm 3 bước nhé bé.',
        actionFeedback: 'Tõm! Chú ếch nhảy một cú ngoạn mục đáp trúng lá sen số 5! 🐸🪷',
        stageVisualHint: '🪷 Lá sen xanh số 5'
      },
      {
        id: 'frog_2',
        question: 'Ếch đang ở lá số 7, nhảy lùi 2 bước. Ếch đến lá số mấy? (7 - 2 = ?)',
        options: ['4', '5', '6', '3'],
        correctAnswer: '5',
        explanation: '7 lùi 2 bước: 6, 5 (7 - 2 = 5).',
        hint: 'Từ số 7 đếm lùi 2 bước.',
        actionFeedback: 'Ếch con chớp mắt kêu ộp ộp trên phiến lá sen êm dịu! 🌿',
        stageVisualHint: '🪷 Lá sen mát lành'
      },
      {
        id: 'frog_3',
        question: 'Dãy số bước nhảy: 2, 4, 6, ?. Lá sen tiếp theo là số mấy?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '8',
        explanation: 'Đếm cách đều 2 đơn vị: 2, 4, 6, 8.',
        hint: 'Mỗi lần ếch nhảy thêm 2 đơn vị: 6 + 2 = 8.',
        actionFeedback: 'Póc! Chú ếch tung người trên không trung đón ánh nắng vàng! ☀️',
        stageVisualHint: '🪷 Lá sen nở hoa vàng'
      },
      {
        id: 'frog_4',
        question: 'Phép tính: 1 + 4 + 4 = ?',
        options: ['8', '9', '10', '7'],
        correctAnswer: '9',
        explanation: '1 + 4 = 5, 5 + 4 = 9.',
        hint: 'Cộng lần lượt từ trái sang phải: 1+4=5 rồi 5+4.',
        actionFeedback: 'Bông sen hồng thắm nở rộ thơm ngát cả hồ nước trong veo! 🪷🌸',
        stageVisualHint: '🌸 Hoa sen hồng nở rực rỡ'
      },
      {
        id: 'frog_5',
        question: 'Để nhảy tới vương miện Vua Ếch ở số 10 từ số 4, ếch cần nhảy thêm mấy bước?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '6',
        explanation: '10 - 4 = 6 bước nhảy.',
        hint: '4 cộng với mấy thì được 10?',
        actionFeedback: 'HOAN HÔ! Chú ếch đã đội vương miện vàng, làm Vua Đầm Sen! 👑🐸🎉',
        stageVisualHint: '👑 Vương miện Vua Đầm Sen'
      }
    ]
  },

  // 17. Đồng Hồ Thông Minh (Chủ đề 9)
  {
    id: 'clock_master',
    num: 17,
    title: 'Đồng Hồ Thông Minh',
    subtitle: 'Xem giờ đúng và chuông báo thức',
    icon: '⏰',
    bgGradient: 'from-violet-500 to-purple-700',
    badge: 'Chủ đề 9: Thời gian',
    topicId: 'chu_de_9',
    desc: 'Nhìn kim ngắn chỉ giờ và kim dài chỉ số 12, đọc đúng giờ sinh hoạt trong ngày của bé!',
    mechanicDesc: 'Xem giờ đúng → Kim đồng hồ xoay tít → Chuông reo reng reng → Mặt trời/mặt trăng đổi vị',
    actionVisualType: 'clock',
    rewardNoun: 'khoảnh khắc chuẩn giờ',
    maxProgress: 5,
    rounds: [
      {
        id: 'clk_1',
        question: 'Kim ngắn chỉ số 7, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?',
        options: ['6 giờ', '7 giờ', '8 giờ', '12 giờ'],
        correctAnswer: '7 giờ',
        explanation: 'Khi kim dài chỉ số 12, kim ngắn chỉ vào số nào thì đó là giờ đúng (7 giờ sáng bé đến trường).',
        hint: 'Kim ngắn chỉ vào số nào thì đồng hồ chỉ bấy nhiêu giờ.',
        actionFeedback: 'Reng reng reng! Đồng hồ điểm 7 giờ sáng, gà trống gáy ò ó o! ⏰🐓',
        stageVisualHint: '⏰ Đồng hồ 7 giờ sáng'
      },
      {
        id: 'clk_2',
        question: 'Bé ăn cơm trưa lúc kim ngắn chỉ số 11, kim dài chỉ số 12. Đó là mấy giờ?',
        options: ['10 giờ', '11 giờ', '12 giờ', '1 giờ'],
        correctAnswer: '11 giờ',
        explanation: 'Đồng hồ chỉ 11 giờ trưa.',
        hint: 'Nhìn kim ngắn màu đỏ chỉ số 11 nhé bé.',
        actionFeedback: 'Keng keng! Bữa trưa nóng hổi ngon lành đã sẵn sàng! 🍲🥣',
        stageVisualHint: '⏰ Đồng hồ 11 giờ trưa'
      },
      {
        id: 'clk_3',
        question: 'Buổi chiều tan học lúc 4 giờ. Kim ngắn sẽ chỉ vào số mấy?',
        options: ['Số 3', 'Số 4', 'Số 5', 'Số 12'],
        correctAnswer: 'Số 4',
        explanation: 'Lúc 4 giờ, kim ngắn chỉ số 4 và kim dài chỉ số 12.',
        hint: 'Đúng giờ thì kim ngắn chỉ vào số giờ, kim dài chỉ số 12 nhé.',
        actionFeedback: 'Tùng tùng tùng! Tiếng trống trường tan học rộn rã! 🏫🎒',
        stageVisualHint: '⏰ Đồng hồ 4 giờ chiều'
      },
      {
        id: 'clk_4',
        question: 'Buổi tối bé đi ngủ lúc 9 giờ. Đồng hồ nào sau đây chỉ đúng 9 giờ?',
        options: ['Kim ngắn chỉ số 9, kim dài chỉ 12', 'Kim ngắn chỉ số 12, kim dài chỉ 9', 'Kim ngắn chỉ số 8', 'Kim ngắn chỉ số 10'],
        correctAnswer: 'Kim ngắn chỉ số 9, kim dài chỉ 12',
        explanation: 'Đúng 9 giờ tối, kim ngắn chỉ số 9 và kim dài chỉ số 12.',
        hint: 'Kim dài luôn chỉ số 12 khi đúng giờ tròn.',
        actionFeedback: 'Mặt trăng sao lấp lánh, chúc bé ngủ ngon giấc mơ đẹp! 🌙⭐',
        stageVisualHint: '⏰ Đồng hồ 9 giờ tối'
      },
      {
        id: 'clk_5',
        question: 'Một ngày có bao nhiêu giờ?',
        options: ['12 giờ', '24 giờ', '10 giờ', '20 giờ'],
        correctAnswer: '24 giờ',
        explanation: 'Một ngày có 24 giờ, tính từ 12 giờ đêm hôm trước đến 12 giờ đêm hôm sau.',
        hint: 'Một ngày bắt đầu từ 12 giờ đêm hôm trước đến 12 giờ đêm hôm sau nhé.',
        actionFeedback: 'Bé đã trở thành BẬC THẦY THỜI GIAN của lớp 1! Rất giỏi! 🏆⏳✨',
        stageVisualHint: '🏆 Cúp Vàng Quản Lý Thời Gian'
      }
    ]
  },

  // 18. Thước Kẻ Đo Độ Dài (Chủ đề 7)
  {
    id: 'ruler_measurement',
    num: 18,
    title: 'Thước Kẻ Đo Độ Dài',
    subtitle: 'Đo bút chì, que tính bằng cm',
    icon: '📏',
    bgGradient: 'from-amber-500 to-orange-600',
    badge: 'Chủ đề 7: Đo độ dài',
    topicId: 'chu_de_7',
    desc: 'Đặt điểm đầu vật trùng với vạch số 0 của thước kẻ, đọc chính xác độ dài xăng-ti-mét (cm)!',
    mechanicDesc: 'Đọc đúng vạch thước → Thước kẻ sáng dạ quang → Bút chì kéo dài xinh đẹp → Tô màu tranh',
    actionVisualType: 'ruler',
    rewardNoun: 'độ dài chính xác',
    maxProgress: 5,
    rounds: [
      {
        id: 'rul_1',
        question: 'Quan sát hình vẽ. Bút chì dài bao nhiêu xăng-ti-mét?',
        options: ['5 cm', '6 cm', '7 cm', '8 cm'],
        correctAnswer: '7 cm',
        explanation: 'Đầu trái bút chì trùng đúng vạch số 0, đầu nhọn chạm đúng vạch số 7. Vậy bút chì dài đúng 7 cm.',
        hint: 'Đầu trái bút ở vạch 0, nhìn vạch số mà đầu nhọn bút chì chạm tới trên thước nhé.',
        actionFeedback: 'Thước kẻ phát sáng! Cây bút chì vẽ nên một bức tranh rực rỡ! ✏️🌸',
        stageVisualHint: '📏 Bút chì trên thước kẻ'
      },
      {
        id: 'rul_2',
        question: 'Cục tẩy đặt từ vạch 0 đến vạch 3 cm. Cục tẩy dài mấy cm?',
        options: ['2 cm', '3 cm', '4 cm', '5 cm'],
        correctAnswer: '3 cm',
        explanation: 'Đầu trái ở vạch 0, đầu phải ở vạch 3 nên độ dài cục tẩy là 3 cm.',
        hint: 'Đầu trái cục tẩy ở vạch 0, nhìn xem điểm cuối cục tẩy chạm vạch số mấy trên thước nhé.',
        actionFeedback: 'Cục tẩy thơm mùi dâu tây đã được đo rất chính xác! 🍓🧼',
        stageVisualHint: '📏 Cục tẩy trên thước kẻ'
      },
      {
        id: 'rul_3',
        question: 'Tính: 5 cm + 4 cm = ? cm',
        options: ['8 cm', '9 cm', '10 cm', '7 cm'],
        correctAnswer: '9 cm',
        explanation: '5 + 4 = 9, kèm đơn vị là 9 cm.',
        hint: 'Lấy số xăng-ti-mét thứ nhất cộng số xăng-ti-mét thứ hai rồi giữ nguyên đơn vị cm nhé.',
        actionFeedback: 'Thước đo nối dài thẳng tắp như đường băng! ✈️',
        stageVisualHint: '📏 Đoạn thẳng trên thước kẻ'
      },
      {
        id: 'rul_4',
        question: 'Tính: 10 cm - 3 cm = ? cm',
        options: ['6 cm', '7 cm', '8 cm', '5 cm'],
        correctAnswer: '7 cm',
        explanation: '10 cm trừ 3 cm bằng 7 cm.',
        hint: 'Lấy số ban đầu bớt đi số xăng-ti-mét đã cắt rồi ghi thêm đơn vị cm nhé.',
        actionFeedback: 'Chiếc kéo cắt dải ruy băng thật khéo léo! ✂️🎀',
        stageVisualHint: '📏 Dải ruy băng trên thước kẻ'
      },
      {
        id: 'rul_5',
        question: 'Bút sáp màu dài 6 cm, compa dài 9 cm. Vật nào dài hơn và dài hơn bao nhiêu cm?',
        options: ['Compa dài hơn 3 cm', 'Bút sáp dài hơn 3 cm', 'Compa dài hơn 2 cm', 'Hai vật bằng nhau'],
        correctAnswer: 'Compa dài hơn 3 cm',
        explanation: '9 cm - 6 cm = 3 cm. Vậy compa dài hơn bút sáp 3 cm.',
        hint: 'So sánh hai số đo để xem vật nào có số đo lớn hơn, rồi làm phép trừ tìm khoảng chênh lệch nhé.',
        actionFeedback: 'Bé đã là KỸ SƯ NHÍ ĐO ĐẠC tài ba của lớp! Hoan hô bé! 📐🏅✨',
        stageVisualHint: '🏅 Huy hiệu Thước Thần Tài Ba'
      }
    ]
  },

  // 19. Phóng Tên Lửa Vũ Trụ (Chủ đề 1)
  {
    id: 'space_rocket_launch',
    num: 19,
    title: 'Phóng Tên Lửa Vũ Trụ',
    subtitle: 'Đếm ngược 10, 9, 8... Phóng!',
    icon: '🚀',
    bgGradient: 'from-blue-600 via-indigo-700 to-purple-800',
    badge: 'Chủ đề 1: Đếm ngược',
    topicId: 'chu_de_1',
    desc: 'Đếm lùi chính xác và giải phép tính nhiên liệu để kích hoạt dàn động cơ đẩy tên lửa bay vào vũ trụ sao!',
    mechanicDesc: 'Tính đúng → Động cơ phụt lửa → Đồng hồ đếm lùi → Tên lửa bay vút lên trời',
    actionVisualType: 'rocket',
    rewardNoun: 'nhiên liệu tên lửa',
    maxProgress: 5,
    rounds: [
      {
        id: 'rkt_1',
        question: 'Đếm lùi chuẩn bị phóng: 10, 9, 8, ?, 6. Số còn thiếu là:',
        options: ['5', '7', '4', '8'],
        correctAnswer: '7',
        explanation: 'Đếm lùi từ 10: 10, 9, 8, 7, 6.',
        hint: 'Đứng giữa 8 và 6 khi đếm ngược là số 7.',
        actionFeedback: 'Động cơ số 1 bùng cháy! Khói trắng cuồn cuộn bao bọc bệ phóng! 🚀💨',
        stageVisualHint: '🚀 Tên lửa Apollo sẵn sàng'
      },
      {
        id: 'rkt_2',
        question: 'Tiếp tục đếm lùi: 5, 4, 3, 2, ?, 0. Số còn thiếu là:',
        options: ['1', '0', '2', '3'],
        correctAnswer: '1',
        explanation: 'Đếm lùi: 3, 2, 1, 0.',
        hint: 'Sau số 2 đếm lùi là số 1.',
        actionFeedback: 'Hệ thống năng lượng đạt 100%! Ngọn lửa phản lực rực sáng! 🔥',
        stageVisualHint: '🔥 Lửa phản lực bùng cháy'
      },
      {
        id: 'rkt_3',
        question: 'Nạp năng lượng: 4 + 6 = ? khối năng lượng',
        options: ['8', '9', '10', '12'],
        correctAnswer: '10',
        explanation: '4 + 6 = 10 (đủ 10 thanh nhiên liệu tối đa).',
        hint: 'Giữ số 4 trong đầu rồi đếm tiếp 6 bước nhé bé!',
        actionFeedback: '3... 2... 1... RUNG CHUYỂN BỆ PHÓNG! Tên lửa rời bệ bay lên! 🚀✨',
        stageVisualHint: '🌌 Tên lửa bay vào tầng mây'
      },
      {
        id: 'rkt_4',
        question: 'Trên trạm vũ trụ có 8 phi hành gia, 3 người ra ngoài không gian. Trong trạm còn mấy người?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        explanation: '8 - 3 = 5 phi hành gia.',
        hint: 'Lấy số 8 bớt đi 3 và đếm lùi để tìm kết quả nhé bé!',
        actionFeedback: 'Tên lửa vượt qua tầng khí quyển, tiến vào quỹ đạo Trái Đất xanh biếc! 🌍🛰️',
        stageVisualHint: '🌍 Trái Đất nhìn từ không gian'
      },
      {
        id: 'rkt_5',
        question: 'Bé đếm thấy 5 ngôi sao xanh và 5 ngôi sao vàng. Có tất cả bao nhiêu ngôi sao?',
        options: ['8', '9', '10', '11'],
        correctAnswer: '10',
        explanation: '5 + 5 = 10 ngôi sao lấp lánh.',
        hint: 'Giữ số 5 trong đầu rồi đếm tiếp 5 bước nhé bé!',
        actionFeedback: 'CẮM CỜ CHIẾN THẮNG TRÊN MẶT TRĂNG! Bé là Phi hành gia nhí tài ba! 👨‍🚀🌕🚩',
        stageVisualHint: '🌕 Mặt trăng và cờ chiến thắng'
      }
    ]
  },

  // 20. Cửa Hàng Kẹo Ngọt (Chủ đề 6 & 8)
  {
    id: 'candy_shop',
    num: 20,
    title: 'Cửa Hàng Kẹo Ngọt',
    subtitle: 'Đóng gói kẹo que và kẹo sô-cô-la',
    icon: '🍭',
    bgGradient: 'from-rose-400 via-pink-400 to-amber-300',
    badge: 'Chủ đề 8: Cộng trừ đến 100',
    topicId: 'chu_de_8',
    desc: 'Tính nhẩm cộng trừ số tròn chục và số có 2 chữ số để gói kẹo đẹp mắt tặng các bạn nhỏ!',
    mechanicDesc: 'Tính đúng → Kẹo đủ màu rơi vào hũ → Cột nơ hồng lấp lánh → Khách hàng vui vẻ',
    actionVisualType: 'candy',
    rewardNoun: 'hũ kẹo ngọt ngào',
    maxProgress: 5,
    rounds: [
      {
        id: 'cnd_1',
        question: 'Tính nhẩm số tròn chục: 20 + 30 = ? viên kẹo',
        options: ['40', '50', '60', '70'],
        correctAnswer: '50',
        explanation: '2 chục + 3 chục = 5 chục (50 viên kẹo).',
        hint: 'Giữ số 2 trong đầu rồi đếm thêm 3 đơn vị nhé bé!',
        actionFeedback: '50 viên kẹo ngũ sắc rơi lanh canh vào lọ thuỷ tinh trong suốt! 🍭🍬',
        stageVisualHint: '🍬 Hũ kẹo ngũ sắc 50 viên'
      },
      {
        id: 'cnd_2',
        question: 'Cửa hàng có 60 cái kẹo mút, đã bán 20 cái. Còn lại bao nhiêu cái?',
        options: ['30', '40', '50', '20'],
        correctAnswer: '40',
        explanation: '6 chục - 2 chục = 4 chục (40 cái kẹo).',
        hint: 'Lấy số 6 bớt đi 2 và đếm lùi từng bước nhé bé!',
        actionFeedback: '40 chiếc kẹo mút cầu vồng xếp ngay ngắn trên kệ trưng bày! 🍭🌈',
        stageVisualHint: '🍭 Kẹo mút xoắn ốc cầu vồng'
      },
      {
        id: 'cnd_3',
        question: 'Phép tính không nhớ: 24 + 5 = ?',
        options: ['28', '29', '30', '27'],
        correctAnswer: '29',
        explanation: 'Lấy hàng đơn vị 4 + 5 = 9, giữ nguyên hàng chục là 2 chục. Kết quả là 29.',
        hint: 'Giữ số 4 trong đầu rồi đếm tiếp 5 bước nhé bé!',
        actionFeedback: 'Hộp sô-cô-la trái tim thơm ngọt đã thắt nơ vàng xinh xắn! 🍫🎀',
        stageVisualHint: '🍫 Hộp sô-cô-la trái tim 29 viên'
      },
      {
        id: 'cnd_4',
        question: 'Phép tính: 48 - 6 = ?',
        options: ['41', '42', '43', '44'],
        correctAnswer: '42',
        explanation: '8 đơn vị trừ 6 đơn vị bằng 2. Giữ nguyên 4 chục được 42.',
        hint: 'Lấy số 8 bớt đi 6 và đếm lùi từng bước nhé bé!',
        actionFeedback: 'Túi kẹo dẻo gấu thơm mùi hoa quả mát lạnh! 🐻🍬',
        stageVisualHint: '🍬 Kẹo gấu dẻo 42 bé gấu'
      },
      {
        id: 'cnd_5',
        question: 'Phép tính: 30 + 40 - 10 = ?',
        options: ['50', '60', '70', '40'],
        correctAnswer: '60',
        explanation: '30 + 40 = 70; 70 - 10 = 60.',
        hint: '3 chục + 4 chục = 7 chục; 7 chục - 1 chục = 6 chục.',
        actionFeedback: 'CỬA HÀNG KẸO NGỌT BỘI THU! Bé nhận huy hiệu Vua Bánh Kẹo! 🏆🍬🍰',
        stageVisualHint: '🏆 Cúp Vàng Cửa Hàng Kẹo Ngọt'
      }
    ]
  },

  // 21. Ghép Tranh Hình Học Tangram (Chủ đề 2)
  {
    id: 'shape_tangram',
    num: 21,
    title: 'Ghép Tranh Hình Học',
    subtitle: 'Lắp thuyền buồm, ngôi nhà từ các hình',
    icon: '📐',
    bgGradient: 'from-orange-400 via-amber-500 to-yellow-500',
    badge: 'Chủ đề 2: Hình phẳng',
    topicId: 'chu_de_2',
    desc: 'Nhận biết hình vuông, hình tròn, hình tam giác, hình chữ nhật để ghép thành tranh nghệ thuật tuyệt đẹp!',
    mechanicDesc: 'Chọn hình đúng → Hình bay khớp vào khung → Bức tranh hiện rõ màu sắc',
    actionVisualType: 'tangram',
    rewardNoun: 'mảnh ghép hoàn hảo',
    maxProgress: 5,
    rounds: [
      {
        id: 'tg_1',
        question: 'Mái nhà trong tranh thường có dạng hình gì?',
        options: ['Hình tam giác', 'Hình tròn', 'Hình chữ nhật', 'Hình vuông'],
        correctAnswer: 'Hình tam giác',
        explanation: 'Mái nhà có 3 cạnh nhọn lên trên, có dạng hình tam giác.',
        hint: 'Hình có 3 cạnh và 3 góc nhọn.',
        actionFeedback: 'Mảnh ghép hình tam giác đỏ rực gắn khít làm mái nhà ấm cúng! 🏠🔺',
        stageVisualHint: '🔺 Mái nhà tam giác đỏ'
      },
      {
        id: 'tg_2',
        question: 'Cửa ra vào của ngôi nhà thường có dạng hình gì?',
        options: ['Hình chữ nhật', 'Hình tròn', 'Hình tam giác', 'Hình thoi'],
        correctAnswer: 'Hình chữ nhật',
        explanation: 'Cửa ra vào đứng dài có 2 cạnh dài và 2 cạnh ngắn, đó là hình chữ nhật.',
        hint: 'Hình có 4 cạnh, 2 cạnh dài bằng nhau và 2 cạnh ngắn bằng nhau.',
        actionFeedback: 'Cánh cửa chữ nhật gỗ sồi mở ra chào đón bé! 🚪✨',
        stageVisualHint: '🚪 Cửa chính chữ nhật'
      },
      {
        id: 'tg_3',
        question: 'Mặt trời chiếu sáng trên bầu trời có dạng hình gì?',
        options: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'],
        correctAnswer: 'Hình tròn',
        explanation: 'Mặt trời tròn xoe, đường cong khép kín không có góc cạnh, là hình tròn.',
        hint: 'Hình này có đường cong tròn đều, không có góc nào nhé.',
        actionFeedback: 'Mặt trời tròn xoe vàng rực toả những tia nắng ấm áp! ☀️🟡',
        stageVisualHint: '☀️ Mặt trời hình tròn vàng óng'
      },
      {
        id: 'tg_4',
        question: 'Cánh buồm của con thuyền lướt sóng có dạng hình gì?',
        options: ['Hình tam giác', 'Hình tròn', 'Hình vuông', 'Hình chữ nhật'],
        correctAnswer: 'Hình tam giác',
        explanation: 'Cánh buồm đón gió có dạng hình tam giác.',
        hint: 'Hình có 3 cạnh căng gió.',
        actionFeedback: 'Cánh buồm no gió căng tròn đưa thuyền lướt sóng ra khơi! ⛵🌊',
        stageVisualHint: '⛵ Thuyền buồm tam giác'
      },
      {
        id: 'tg_5',
        question: 'Hình nào sau đây có 4 cạnh bằng nhau?',
        options: ['Hình vuông', 'Hình chữ nhật', 'Hình tam giác', 'Hình tròn'],
        correctAnswer: 'Hình vuông',
        explanation: 'Hình vuông có 4 cạnh bằng nhau và 4 góc vuông vức.',
        hint: 'Viên gạch men lát sàn nhà vuông vắn.',
        actionFeedback: 'BỨC TRANH HÌNH HỌC HOÀN CHỈNH! Một tuyệt tác phong cảnh đồng quê rực rỡ! 🖼️🎨✨',
        stageVisualHint: '🖼️ Bức tranh phong cảnh hoàn hảo'
      }
    ]
  },

  // 22. Cân Thăng Bằng (Chủ đề 7)
  {
    id: 'balance_scale',
    num: 22,
    title: 'Cân Thăng Bằng',
    subtitle: 'So sánh nặng nhẹ và thăng bằng đĩa cân',
    icon: '⚖️',
    bgGradient: 'from-amber-600 to-yellow-600',
    badge: 'Chủ đề 7: Nặng - nhẹ',
    topicId: 'chu_de_7',
    desc: 'Quan sát đĩa cân nghiêng xuống bên nào nặng hơn, chọn vật đối trọng để đĩa cân thăng bằng thăng hoa!',
    mechanicDesc: 'Chọn vật cân đúng → Kim cân dịch chuyển về giữa → Đĩa cân cân bằng phát sáng',
    actionVisualType: 'balance',
    rewardNoun: 'quả cân chuẩn xác',
    maxProgress: 5,
    rounds: [
      {
        id: 'bal_1',
        question: 'Đĩa cân bên quả dưa hấu chúc xuống dưới, đĩa bên quả táo nhấc lên. Vật nào nặng hơn?',
        options: ['Quả dưa hấu', 'Quả táo', 'Hai quả bằng nhau', 'Không biết'],
        correctAnswer: 'Quả dưa hấu',
        explanation: 'Đĩa cân bên nào bị đè chúc xuống thấp hơn thì vật bên đó nặng hơn.',
        hint: 'Vật nặng hơn sẽ làm đĩa cân hạ xuống thấp.',
        actionFeedback: 'Đúng rồi! Quả dưa hấu nặng hơn quả táo rất nhiều! 🍉⚖️🍎',
        stageVisualHint: '🍉 Dưa hấu đè nặng đĩa cân'
      },
      {
        id: 'bal_2',
        question: 'Muốn đĩa cân thăng bằng với quả bí ngô nặng 5 kg, ta cần đặt mấy quả cân 1 kg?',
        options: ['3 quả', '4 quả', '5 quả', '6 quả'],
        correctAnswer: '5 quả',
        explanation: 'Cần đúng 5 quả cân 1 kg để bằng 5 kg (1 + 1 + 1 + 1 + 1 = 5).',
        hint: 'Mỗi quả cân là 1 kg, con hãy đếm số quả cân để có khối lượng bằng đĩa bên kia nhé.',
        actionFeedback: 'Ting! Kim cân chỉ chính giữa vạch thăng bằng hoàn hảo! ⚖️✨',
        stageVisualHint: '⚖️ Cân thăng bằng quả bí ngô'
      },
      {
        id: 'bal_3',
        question: 'Con voi và con chuột túi, con nào nhẹ hơn?',
        options: ['Con voi', 'Con chuột', 'Bằng nhau', 'Cả hai đều nặng'],
        correctAnswer: 'Con chuột',
        explanation: 'Con chuột nhỏ bé nhẹ hơn chú voi khổng lồ rất nhiều.',
        hint: 'Con vật nhỏ bé xinh xắn là con nhẹ hơn.',
        actionFeedback: 'Chú chuột nhắt nhảy nhót trên đĩa cân nhẹ tênh! 🐭🎈',
        stageVisualHint: '🐭 Chuột nhắt nhẹ nhàng'
      },
      {
        id: 'bal_4',
        question: 'Bên trái có 3 quả táo, bên phải có 3 quả táo cùng loại. Đĩa cân sẽ như thế nào?',
        options: ['Thăng bằng', 'Bên trái nghiêng', 'Bên phải nghiêng', 'Bị rơi'],
        correctAnswer: 'Thăng bằng',
        explanation: 'Số lượng và loại quả bằng nhau nên hai bên nặng như nhau, cân thăng bằng.',
        hint: 'Hai bên đều có 3 quả táo giống hệt nhau.',
        actionFeedback: 'Hai đĩa cân ngang bằng nhau tăm tắp tuyệt đẹp! 🍏⚖️🍏',
        stageVisualHint: '⚖️ Cân thăng bằng 3 quả táo'
      },
      {
        id: 'bal_5',
        question: 'Bên trái có 4 khối gỗ, bên phải có 6 khối gỗ. Cần thêm mấy khối gỗ vào bên trái để thăng bằng?',
        options: ['1 khối', '2 khối', '3 khối', '4 khối'],
        correctAnswer: '2 khối',
        explanation: '6 - 4 = 2. Cần thêm 2 khối gỗ vào bên có 4 khối.',
        hint: '4 cộng thêm mấy thì bằng 6?',
        actionFeedback: 'XUẤT SẮC! Cân Thần đã thăng bằng hoàn toàn, toả ánh sáng kim cương! 💎⚖️🌟',
        stageVisualHint: '💎 Ánh sáng cân thần kim cương'
      }
    ]
  },

  // 23. Giải Cứu Khủng Long (Chủ đề 3 & 8)
  {
    id: 'save_the_dinosaur',
    num: 23,
    title: 'Giải Cứu Khủng Long',
    subtitle: 'Đập tan băng đá cứu khủng long con',
    icon: '🦖',
    bgGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    badge: 'Chủ đề 8: Phép trừ',
    topicId: 'chu_de_8',
    desc: 'Giải đúng mật mã phép tính để chiếc búa thần kỳ đập tan từng lớp băng giá cứu bạn khủng long con ra ngoài!',
    mechanicDesc: 'Tính đúng → Búa thần giáng xuống → Băng nứt toác rắc rắc → Khủng long cựa quậy',
    actionVisualType: 'dinosaur',
    rewardNoun: 'mảnh băng tan vỡ',
    maxProgress: 5,
    rounds: [
      {
        id: 'dino_1',
        question: 'Mật mã phá băng tầng 1: 10 - 6 = ?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: '10 - 6 = 4.',
        hint: '10 bớt đi 6 còn lại 4.',
        actionFeedback: 'RẮC! Lớp băng ngoài cùng nứt ra một đường dài! Khủng long con cựa mình! 🧊🔨',
        stageVisualHint: '🧊 Tảng băng nứt đường đầu tiên'
      },
      {
        id: 'dino_2',
        question: 'Mật mã tầng 2: 7 + 3 = ?',
        options: ['9', '10', '11', '8'],
        correctAnswer: '10',
        explanation: '7 + 3 = 10 (cặp số tròn chục).',
        hint: 'Con hãy giữ số 7 và đếm thêm 3 bước nữa nhé.',
        actionFeedback: 'XOẢNG! Nửa tảng băng vỡ vụn, để lộ chiếc đuôi gai xanh biếc của khủng long! 🦕',
        stageVisualHint: '🧊 Đuôi khủng long lộ ra ngoài'
      },
      {
        id: 'dino_3',
        question: 'Mật mã tầng 3: 15 - 5 = ?',
        options: ['9', '10', '11', '12'],
        correctAnswer: '10',
        explanation: '15 gồm 1 chục và 5 đơn vị. Bớt 5 đơn vị còn đúng 1 chục (10).',
        hint: '15 bớt 5 đơn vị ở hàng đơn vị.',
        actionFeedback: 'Băng tan chảy thành dòng suối ấm áp! Đôi cánh khủng long vẫy vẫy! 💧',
        stageVisualHint: '💧 Dòng nước ấm làm tan băng'
      },
      {
        id: 'dino_4',
        question: 'Mật mã tầng 4: 20 + 30 = ?',
        options: ['40', '50', '60', '70'],
        correctAnswer: '50',
        explanation: '2 chục cộng 3 chục bằng 5 chục (50).',
        hint: 'Giữ số 2 trong đầu rồi đếm thêm 3 đơn vị nhé bé!',
        actionFeedback: 'Khủng long con thò chiếc đầu đáng yêu ra ngoài cất tiếng gầm tí hon! 🦖🎶',
        stageVisualHint: '🦖 Đầu khủng long thò ra cười tươi'
      },
      {
        id: 'dino_5',
        question: 'Mật mã giải thoát hoàn toàn: 90 - 40 = ?',
        options: ['40', '50', '60', '30'],
        correctAnswer: '50',
        explanation: '9 chục trừ 4 chục bằng 5 chục (50).',
        hint: 'Lấy số 9 bớt đi 4 và đếm lùi từng bước nhé bé!',
        actionFeedback: 'KHỦNG LONG CON ĐÃ HOÀN TOÀN TỰ DO! Bạn ôm lấy bé cảm ơn rối rít! 🦖❤️🎉',
        stageVisualHint: '🎉 Khủng long con nhảy múa ăn mừng'
      }
    ]
  },

  // 24. Tiệm Kem Nhiều Tầng (Chủ đề 1 & 3)
  {
    id: 'ice_cream_stack',
    num: 24,
    title: 'Tiệm Kem Nhiều Tầng',
    subtitle: 'Chồng các viên kem dâu, socola, matcha',
    icon: '🍦',
    bgGradient: 'from-pink-400 via-rose-400 to-amber-300',
    badge: 'Chủ đề 3: Phép cộng',
    topicId: 'chu_de_3',
    desc: 'Mỗi phép cộng đúng sẽ thả thêm 1 viên kem ngọt mát lên trên cây ốc quế cao vút tuyệt đẹp!',
    mechanicDesc: 'Tính đúng → Muỗng múc kem thả viên kem dâu/socola → Ốc quế cao thêm 1 tầng → Rắc kẹo cốm',
    actionVisualType: 'ice_cream',
    rewardNoun: 'viên kem mát lạnh',
    maxProgress: 5,
    rounds: [
      {
        id: 'ice_1',
        question: 'Bé múc viên kem đầu tiên: 3 + 1 = ? tầng kem',
        options: ['3', '4', '5', '2'],
        correctAnswer: '4',
        explanation: '3 + 1 = 4.',
        hint: 'Giữ số 3 trong đầu rồi đếm tiếp 1 đơn vị nhé bé!',
        actionFeedback: 'Viên kem dâu tây hồng ngọt ngào rơi cái bẹp vào ốc quế giòn tan! 🍓🍦',
        stageVisualHint: '🍓 Tầng 1: Kem dâu tây'
      },
      {
        id: 'ice_2',
        question: 'Viên kem thứ hai: 4 + 2 = ?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
        explanation: '4 + 2 = 6.',
        hint: 'Đếm thêm 2 từ 4: 5, 6.',
        actionFeedback: 'Viên kem socola nâu đậm thơm lừng chồng lên tầng thứ hai! 🍫🍦',
        stageVisualHint: '🍫 Tầng 2: Kem socola béo ngậy'
      },
      {
        id: 'ice_3',
        question: 'Viên kem thứ ba: 5 + 3 = ?',
        options: ['7', '8', '9', '6'],
        correctAnswer: '8',
        explanation: '5 + 3 = 8.',
        hint: '5 ngón tay thêm 3 ngón tay là 8 ngón.',
        actionFeedback: 'Viên kem vani vàng óng ngát hương thơm chồng lên tầng ba! 🍦✨',
        stageVisualHint: '🍨 Tầng 3: Kem vani thơm mát'
      },
      {
        id: 'ice_4',
        question: 'Viên kem thứ tư: 6 + 4 = ?',
        options: ['9', '10', '8', '11'],
        correctAnswer: '10',
        explanation: '6 + 4 = 10 (cặp số tròn 10).',
        hint: 'Con hãy giữ số 6 trong đầu rồi đếm thêm 4 đơn vị nhé.',
        actionFeedback: 'Viên kem matcha trà xanh mát lạnh tiếp tục nâng cao cây kem! 🍵🍦',
        stageVisualHint: '🍵 Tầng 4: Kem matcha Nhật Bản'
      },
      {
        id: 'ice_5',
        question: 'Thêm quả cherry trên đỉnh: 2 + 3 + 4 = ?',
        options: ['8', '9', '10', '7'],
        correctAnswer: '9',
        explanation: '2 + 3 = 5, rồi 5 + 4 = 9.',
        hint: 'Tính 2 + 3 trước bằng 5, sau đó 5 + 4.',
        actionFeedback: 'CÂY KEM KHỔNG LỒ 5 TẦNG HOÀN THÀNH! Quả cherry đỏ chót ngự trên đỉnh! 🍒🎉',
        stageVisualHint: '🍒 Quả cherry đỏ trên đỉnh tháp kem'
      }
    ]
  },

  // 25. Thợ Lặn Săn Ngọc Trai (Chủ đề 1)
  {
    id: 'bubble_counting',
    num: 25,
    title: 'Thợ Lặn Săn Ngọc Trai',
    subtitle: 'Đếm vỏ ốc và mở nắp trai ngọc',
    icon: '🦪',
    bgGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    badge: 'Chủ đề 1: Đếm số lượng',
    topicId: 'chu_de_1',
    desc: 'Đếm đúng số lượng sinh vật biển và hạt ngọc, nắp vỏ sò sẽ hé mở phát ra viên ngọc trai phát sáng kỳ ảo!',
    mechanicDesc: 'Đếm đúng → Thợ lặn bơi tới → Vỏ trai mở hé → Viên ngọc trai phát sáng lung linh',
    actionVisualType: 'pearl_bubble',
    rewardNoun: 'viên ngọc trai sáng',
    maxProgress: 5,
    rounds: [
      {
        id: 'prl_1',
        question: 'Bé đếm xem có bao nhiêu chú sao biển: ⭐ ⭐ ⭐ ⭐ ⭐',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        explanation: 'Có đúng 5 chú sao biển màu cam rực rỡ.',
        hint: 'Đếm lần lượt từng ngôi sao: 1, 2, 3, 4, 5.',
        actionFeedback: 'Vỏ sò đầu tiên mở ra, viên ngọc trai ánh bạc lấp lánh! 🦪💎',
        stageVisualHint: '🦪 Ngọc trai ánh bạc'
      },
      {
        id: 'prl_2',
        question: 'Có 3 chú cá bơi sang trái, 4 chú cá bơi sang phải. Tổng cộng có bao nhiêu chú cá?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '7',
        explanation: '3 + 4 = 7 chú cá.',
        hint: 'Giữ số 3 trong đầu rồi đếm tiếp 4 bước nhé bé!',
        actionFeedback: 'Viên ngọc trai màu hồng ngọc toả sáng dưới rạn san hô! 🪸✨',
        stageVisualHint: '🦪 Ngọc trai hồng ngọc'
      },
      {
        id: 'prl_3',
        question: 'Đếm số lượng: 1 chục chú cá ngựa là bao nhiêu chú cá ngựa?',
        options: ['1', '5', '10', '20'],
        correctAnswer: '10',
        explanation: '1 chục = 10 đơn vị.',
        hint: 'Một chục là bao nhiêu đơn vị, con hãy nhớ lại bài học nhé.',
        actionFeedback: 'Đàn cá ngựa uốn lượn mang viên ngọc xanh ngọc bích về cho bé! 🫧💎',
        stageVisualHint: '🦪 Ngọc trai ngọc bích'
      },
      {
        id: 'prl_4',
        question: 'Bé lặn sâu thấy 9 vỏ ốc, đã nhặt 4 vỏ ốc. Còn lại mấy vỏ ốc trên cát?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        explanation: '9 - 4 = 5 vỏ ốc.',
        hint: '9 bớt 4 còn lại 5.',
        actionFeedback: 'Chú rùa biển khổng lồ bơi qua tặng bé viên ngọc vàng kim cương! 🐢✨',
        stageVisualHint: '🦪 Ngọc trai vàng kim'
      },
      {
        id: 'prl_5',
        question: 'Số nào đứng liền trước số 10?',
        options: ['8', '9', '11', '7'],
        correctAnswer: '9',
        explanation: 'Số đứng liền trước số 10 là số 9 (đếm: ..., 8, 9, 10).',
        hint: 'Số liền trước là số bé hơn 1 đơn vị: 10 - 1 = 9.',
        actionFeedback: 'KHO BÁU NGỌC TRAI HOÀNG GIA ĐÃ MỞ! Thợ lặn nhí được trao vương miện biển khơi! 👑🦪🌊',
        stageVisualHint: '👑 Vương miện Thần Biển'
      }
    ]
  },

  // 26. Thám Hiểm Lịch Tuần (Chủ đề 9)
  {
    id: 'calendar_explorer',
    num: 26,
    title: 'Thám Hiểm Lịch Tuần',
    subtitle: 'Khám phá từ thứ Hai đến Chủ nhật',
    icon: '📅',
    bgGradient: 'from-indigo-500 to-sky-600',
    badge: 'Chủ đề 9: Ngày trong tuần',
    topicId: 'chu_de_9',
    desc: 'Nhận biết thứ tự các ngày trong tuần, ngày hôm qua, hôm nay và ngày mai để trở thành chuyên gia lập kế hoạch!',
    mechanicDesc: 'Chọn ngày đúng → Tờ lịch bay lật phấp phới → Đóng dấu sao đỏ → Lịch tuần sáng bừng',
    actionVisualType: 'calendar',
    rewardNoun: 'ngày vui trong tuần',
    maxProgress: 5,
    rounds: [
      {
        id: 'cal_1',
        question: 'Một tuần lễ có bao nhiêu ngày?',
        options: ['5 ngày', '6 ngày', '7 ngày', '8 ngày'],
        correctAnswer: '7 ngày',
        explanation: 'Một tuần có đúng 7 ngày: từ thứ Hai đến Chủ nhật.',
        hint: 'Con hãy đếm lần lượt từ Thứ Hai đến Chủ nhật xem có bao nhiêu ngày nhé.',
        actionFeedback: 'Tờ lịch tuần lật mở rực rỡ với 7 sắc cầu vồng! 📅🌈',
        stageVisualHint: '📅 Lịch 7 ngày trong tuần'
      },
      {
        id: 'cal_2',
        question: 'Ngày đầu tiên đi học trong tuần là ngày nào?',
        options: ['Thứ Hai', 'Thứ Ba', 'Chủ nhật', 'Thứ Bảy'],
        correctAnswer: 'Thứ Hai',
        explanation: 'Thứ Hai là ngày đầu tiên các bé đến trường đi học trong tuần.',
        hint: 'Ngày sau ngày Chủ nhật nghỉ ngơi.',
        actionFeedback: 'Tiếng hát chào cờ đầu tuần rộn ràng phấn khởi! 🏫🎒',
        stageVisualHint: '📅 Thứ Hai đi học'
      },
      {
        id: 'cal_3',
        question: 'Nếu hôm nay là Thứ Tư thì ngày mai là thứ mấy?',
        options: ['Thứ Ba', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
        correctAnswer: 'Thứ Năm',
        explanation: 'Sau thứ Tư là thứ Năm.',
        hint: 'Con hãy đếm tiếp các thứ trong tuần sau Thứ Tư nhé.',
        actionFeedback: 'Con dấu ngôi sao đỏ tươi đóng dấu ngày Thứ Năm thành công! ⭐',
        stageVisualHint: '📅 Thứ Năm học toán'
      },
      {
        id: 'cal_4',
        question: 'Hai ngày cuối tuần bé được nghỉ học vui chơi cùng gia đình là:',
        options: ['Thứ Bảy và Chủ nhật', 'Thứ Năm và Thứ Sáu', 'Thứ Hai và Thứ Ba', 'Chủ nhật và Thứ Hai'],
        correctAnswer: 'Thứ Bảy và Chủ nhật',
        explanation: 'Thứ Bảy và Chủ nhật là hai ngày nghỉ cuối tuần.',
        hint: 'Hai ngày bé được đi chơi công viên hoặc thăm ông bà.',
        actionFeedback: 'Chuyến dã ngoại cuối tuần ngập tràn tiếng cười vui tươi! 🎡🏕️',
        stageVisualHint: '📅 Thứ Bảy & Chủ nhật'
      },
      {
        id: 'cal_5',
        question: 'Hôm nay là Thứ Sáu. Ngày hôm qua là thứ mấy?',
        options: ['Thứ Năm', 'Thứ Bảy', 'Thứ Tư', 'Chủ nhật'],
        correctAnswer: 'Thứ Năm',
        explanation: 'Ngày hôm qua là ngày liền trước hôm nay. Trước thứ Sáu là thứ Năm.',
        hint: 'Ngày trước ngày thứ Sáu là ngày nào?',
        actionFeedback: 'BÉ ĐÃ HOÀN THÀNH BẢN ĐỒ THỜI GIAN CỦA TUẦN! Quản lý thời gian cực đỉnh! 🏆📅✨',
        stageVisualHint: '🏆 Bản đồ lịch tuần hoàn hảo'
      }
    ]
  },

  // 27. Xe Về Bãi Đỗ (Chủ đề 6)
  {
    id: 'parking_master',
    num: 27,
    title: 'Xe Về Bãi Đỗ',
    subtitle: 'Lái ô tô con vào đúng ô số',
    icon: '🚗',
    bgGradient: 'from-amber-500 via-orange-500 to-red-500',
    badge: 'Chủ đề 6: Số đến 100',
    topicId: 'chu_de_6',
    desc: 'Bé tính đúng phép tính trên biển xe, chiếc ô tô sẽ bấm còi tin tin và tự động lùi chuẩn xác vào ô đỗ xe!',
    mechanicDesc: 'Tính đúng → Xe bật đèn pha nhấp nháy → Bấm còi tin tin → Lùi êm ru vào ô đỗ',
    actionVisualType: 'parking',
    rewardNoun: 'chỗ đỗ an toàn',
    maxProgress: 5,
    rounds: [
      {
        id: 'prk_1',
        question: 'Ô tô mang biển số: 30 + 5. Ô tô sẽ đỗ vào chuồng số mấy?',
        options: ['34', '35', '36', '37'],
        correctAnswer: '35',
        explanation: '30 + 5 = 35. Ô tô số 35.',
        hint: 'Con hãy viết chữ số hàng chục trước, chữ số hàng đơn vị sau nhé.',
        actionFeedback: 'Tin tin! Ô tô đỏ thể thao lùi êm ru vào vị trí số 35! 🚗💨',
        stageVisualHint: '🚗 Ô tô đỏ vào ô 35'
      },
      {
        id: 'prk_2',
        question: 'Ô tô xanh mang phép tính: 50 - 10. Tìm chuồng đỗ:',
        options: ['30', '40', '50', '60'],
        correctAnswer: '40',
        explanation: '50 - 10 = 40 (5 chục trừ 1 chục bằng 4 chục).',
        hint: 'Lấy số 5 bớt đi 1 và đếm lùi từng bước nhé bé!',
        actionFeedback: 'Đèn pha bật sáng trưng, ô tô xanh đỗ gọn gàng ở ô 40! 🚙✨',
        stageVisualHint: '🚙 Ô tô xanh vào ô 40'
      },
      {
        id: 'prk_3',
        question: 'Xe cứu thương tìm ô đỗ có số tròn chục lớn hơn 60 và bé hơn 80:',
        options: ['65', '70', '75', '80'],
        correctAnswer: '70',
        explanation: 'Số tròn chục giữa 60 và 80 là 70 (bảy mươi).',
        hint: 'Con hãy đếm tiếp trong dãy số tròn chục tăng dần nhé.',
        actionFeedback: 'Én èn en! Xe cứu thương đỗ an toàn tại bãi đỗ 70! 🚑❤️',
        stageVisualHint: '🚑 Xe cứu thương vào ô 70'
      },
      {
        id: 'prk_4',
        question: 'Biển số xe: 8 chục và 2 đơn vị. Xe mang số nào?',
        options: ['28', '82', '80', '802'],
        correctAnswer: '82',
        explanation: '8 chục viết trước, 2 đơn vị viết sau tạo thành số 82.',
        hint: 'Viết số 8 rồi viết số 2.',
        actionFeedback: 'VÈO! Siêu xe mui trần màu vàng kim lượn một vòng vào ô 82! 🏎️💛',
        stageVisualHint: '🏎️ Siêu xe vào ô 82'
      },
      {
        id: 'prk_5',
        question: 'Xe buýt trường học có 42 bạn, đón thêm 6 bạn nữa. Hỏi trên xe buýt có tất cả bao nhiêu bạn?',
        options: ['46', '47', '48', '49'],
        correctAnswer: '48',
        explanation: '42 + 6 = 48 (2 + 6 = 8, giữ nguyên 4 chục).',
        hint: 'Lấy 2 cộng 6 bằng 8, ghép với 4 chục.',
        actionFeedback: 'TẤT CẢ 5 XE ĐÃ ĐỖ CHUẨN XÁC! Bãi đỗ xe thông minh rực rỡ đèn hoa! 🚌🚗🏎️🎉',
        stageVisualHint: '🎉 Toàn bộ bãi đỗ hoàn thành'
      }
    ]
  },

  // 28. Tưới Cây Nở Hoa (Chủ đề 8)
  {
    id: 'plant_watering',
    num: 28,
    title: 'Tưới Cây Nở Hoa',
    subtitle: 'Chăm sóc hạt mầm nở hoa ngát hương',
    icon: '🌻',
    bgGradient: 'from-teal-500 to-emerald-600',
    badge: 'Chủ đề 8: Phép tính',
    topicId: 'chu_de_8',
    desc: 'Giải đúng phép tính, bình tưới sẽ phun những giọt nước lấp lánh để mầm non vươn lên thành bông hoa khoe sắc!',
    mechanicDesc: 'Tính đúng → Bình tưới nghiêng đổ nước → Mầm nhú lên → Nở hoa thơm ngát',
    actionVisualType: 'plant_flower',
    rewardNoun: 'bông hoa rực rỡ',
    maxProgress: 5,
    rounds: [
      {
        id: 'plt_1',
        question: 'Tưới nước cho mầm nhú lá: 20 + 20 = ?',
        options: ['30', '40', '50', '60'],
        correctAnswer: '40',
        explanation: '2 chục + 2 chục = 4 chục (40).',
        hint: 'Giữ số 2 trong đầu rồi đếm thêm 2 đơn vị nhé bé!',
        actionFeedback: 'Tưới mát rượi! Hạt mầm nứt vỏ nhú lên 2 chiếc lá xanh non xinh xắn! 🌱💧',
        stageVisualHint: '🌱 Mầm non 2 lá mầm'
      },
      {
        id: 'plt_2',
        question: 'Bón chất dinh dưỡng: 40 + 30 = ?',
        options: ['60', '70', '80', '90'],
        correctAnswer: '70',
        explanation: '4 chục + 3 chục = 7 chục (70).',
        hint: 'Giữ số 4 trong đầu rồi đếm thêm 3 đơn vị nhé bé!',
        actionFeedback: 'Thân cây vươn cao lớn nhanh như thổi, toả ra nhiều nhánh lá! 🌿☀️',
        stageVisualHint: '🌿 Cây non vươn cao'
      },
      {
        id: 'plt_3',
        question: 'Bắt sâu cho cây: 60 - 30 = ?',
        options: ['20', '30', '40', '50'],
        correctAnswer: '30',
        explanation: '6 chục - 3 chục = 3 chục (30).',
        hint: 'Lấy số 6 bớt đi 3 và đếm lùi từng bước nhé bé!',
        actionFeedback: 'Một nụ hoa chúm chím màu hồng xuất hiện nơi đầu cành! 🌷',
        stageVisualHint: '🌷 Nụ hoa hồng chúm chím'
      },
      {
        id: 'plt_4',
        question: 'Thêm ánh nắng ấm áp: 53 + 4 = ?',
        options: ['56', '57', '58', '59'],
        correctAnswer: '57',
        explanation: '3 + 4 = 7, giữ nguyên 5 chục được 57.',
        hint: '3 đơn vị cộng 4 đơn vị bằng 7, ghép với 5 chục.',
        actionFeedback: 'Cánh hoa xòe rộng, toả hương thơm ngọt ngào thu hút đàn bướm bay tới! 🦋🌺',
        stageVisualHint: '🌺 Hoa nở rộ đón đàn bướm'
      },
      {
        id: 'plt_5',
        question: 'Vườn hoa khoe sắc: 89 - 5 = ?',
        options: ['82', '83', '84', '85'],
        correctAnswer: '84',
        explanation: '9 đơn vị - 5 đơn vị = 4. Giữ nguyên 8 chục được 84.',
        hint: 'Lấy số 9 bớt đi 5 và đếm lùi từng bước nhé bé!',
        actionFeedback: 'KHU VƯỜN CỔ TÍCH NỞ HOA NGÁT HƯƠNG! Bé là Người làm vườn nhí xuất sắc nhất! 🌻🌸🌼🎉',
        stageVisualHint: '🌻 Vườn hoa hướng dương rực rỡ'
      }
    ]
  },

  // 29. Lặn Biển Mở Rương Vàng (Chủ đề 10)
  {
    id: 'treasure_dive',
    num: 29,
    title: 'Mở Rương Vàng',
    subtitle: 'Giải mật mã mở rương kho báu đảo xa',
    icon: '👑',
    bgGradient: 'from-amber-500 via-yellow-500 to-amber-700',
    badge: 'Chủ đề 10: Ôn tập cuối năm',
    topicId: 'chu_de_10',
    desc: 'Vượt qua chuỗi câu đố mật mã để mở từng tầng ổ khóa của rương kho báu hải tặc chứa đầy đá quý!',
    mechanicDesc: 'Giải đúng mật mã → Ổ khóa cạch mở → Nắp rương nhấc lên → Kim cương phát sáng chói lọi',
    actionVisualType: 'treasure_chest',
    rewardNoun: 'chìa khóa vàng',
    maxProgress: 5,
    rounds: [
      {
        id: 'trs_1',
        question: 'Mật mã ổ khóa số 1: Số lớn nhất có một chữ số là số nào?',
        options: ['8', '9', '10', '1'],
        correctAnswer: '9',
        explanation: 'Các số có một chữ số là 0, 1, 2, ..., 9. Số lớn nhất là 9.',
        hint: 'Số lớn nhất trước khi chuyển sang số có hai chữ số là 10.',
        actionFeedback: 'CẠCH! Ổ khóa bằng đồng đầu tiên bật mở! 🗝️✨',
        stageVisualHint: '🗝️ Ổ khóa đồng'
      },
      {
        id: 'trs_2',
        question: 'Mật mã ổ khóa số 2: Số bé nhất có hai chữ số là số nào?',
        options: ['10', '11', '01', '99'],
        correctAnswer: '10',
        explanation: 'Số bé nhất có hai chữ số là 10.',
        hint: 'Số đứng liền sau số 9.',
        actionFeedback: 'CẠCH! Ổ khóa bằng bạc xoay tròn và rơi xuống cát! 🗝️🥈',
        stageVisualHint: '🗝️ Ổ khóa bạc'
      },
      {
        id: 'trs_3',
        question: 'Mật mã ổ khóa số 3: 50 + 50 = ?',
        options: ['80', '90', '100', '60'],
        correctAnswer: '100',
        explanation: '5 chục cộng 5 chục bằng 10 chục (100 - một trăm).',
        hint: 'Giữ số 5 trong đầu rồi đếm thêm 5 đơn vị nhé bé!',
        actionFeedback: 'CẠCH! Ổ khóa vàng ròng sáng rực bật mở! 🗝️🥇',
        stageVisualHint: '🗝️ Ổ khóa vàng'
      },
      {
        id: 'trs_4',
        question: 'Số tròn chục liền sau số 80 là:',
        options: ['70', '81', '90', '100'],
        correctAnswer: '90',
        explanation: 'Số tròn chục liền sau 80 là 90 (chín mươi).',
        hint: '8 chục rồi đến 9 chục.',
        actionFeedback: 'CẠCH! Ổ khóa ngọc lục bảo tách đôi toả ánh sáng huyền ảo! 🗝️💚',
        stageVisualHint: '🗝️ Ổ khóa ngọc lục bảo'
      },
      {
        id: 'trs_5',
        question: 'Tính nhanh: 10 + 20 + 30 = ?',
        options: ['50', '60', '70', '40'],
        correctAnswer: '60',
        explanation: '1 chục + 2 chục = 3 chục; 3 chục + 3 chục = 6 chục (60).',
        hint: '1 + 2 + 3 = 6, thêm số 0.',
        actionFeedback: 'NẮP RƯƠNG BẬT MỞ! Kho báu tràn ngập vương miện, chuỗi ngọc và kim cương rực rỡ! 👑💎💰🎉',
        stageVisualHint: '👑 Vương miện Vua Kho Báu'
      }
    ]
  },

  // 30. Khỉ Con Leo Cây Dừa (Chủ đề 3)
  {
    id: 'monkey_climb_coconut',
    num: 30,
    title: 'Khỉ Leo Cây Dừa',
    subtitle: 'Leo từng bậc thang hái dừa xiêm ngọt',
    icon: '🌴',
    bgGradient: 'from-amber-600 via-yellow-600 to-emerald-600',
    badge: 'Chủ đề 3: Phép tính',
    topicId: 'chu_de_3',
    desc: 'Mỗi phép tính đúng, chú khỉ nâu sẽ thoăn thoắt trèo lên 1 nấc thang để hái buồng dừa ngọt lịm!',
    mechanicDesc: 'Tính đúng → Khỉ nhảy lên 1 nấc thang → Quả dừa rung rinh → Dừa rụng vào giỏ',
    actionVisualType: 'monkey_coconut',
    rewardNoun: 'quả dừa xiêm ngọt',
    maxProgress: 5,
    rounds: [
      {
        id: 'mnk_1',
        question: 'Nấc thang 1: 5 - 2 = ?',
        options: ['2', '3', '4', '1'],
        correctAnswer: '3',
        explanation: '5 - 2 = 3.',
        hint: '5 ngón tay cụp lại 2 ngón.',
        actionFeedback: 'Khỉ con thoăn thoắt đu đuôi nhảy lên nấc thang thứ nhất! 🐵🍌',
        stageVisualHint: '🐵 Khỉ ở nấc 1'
      },
      {
        id: 'mnk_2',
        question: 'Nấc thang 2: 3 + 4 = ?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '7',
        explanation: '3 + 4 = 7.',
        hint: 'Giữ số 3 trong đầu rồi đếm tiếp 4 bước nhé bé!',
        actionFeedback: 'Vèo! Khỉ con tung người leo lên giữa thân cây dừa xanh mát! 🌴',
        stageVisualHint: '🐵 Khỉ ở nấc 2'
      },
      {
        id: 'mnk_3',
        question: 'Nấc thang 3: 8 - 4 = ?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: '8 - 4 = 4.',
        hint: 'Lấy số 8 bớt đi 4 và đếm lùi để tìm kết quả nhé bé!',
        actionFeedback: 'Bụp! Một quả dừa thơm ngọt rơi xuống giỏ bên dưới! 🥥',
        stageVisualHint: '🥥 Quả dừa rơi xuống giỏ'
      },
      {
        id: 'mnk_4',
        question: 'Nấc thang 4: 6 + 3 = ?',
        options: ['8', '9', '10', '7'],
        correctAnswer: '9',
        explanation: '6 + 3 = 9.',
        hint: '6 đếm thêm 3: 7, 8, 9.',
        actionFeedback: 'Khỉ con đã chạm tay vào buồng dừa sai trĩu quả trên ngọn! 🥥🌴',
        stageVisualHint: '🐵 Khỉ chạm buồng dừa'
      },
      {
        id: 'mnk_5',
        question: 'Nấc thang đỉnh dừa: 10 - 5 + 3 = ?',
        options: ['7', '8', '9', '6'],
        correctAnswer: '8',
        explanation: '10 - 5 = 5; 5 + 3 = 8.',
        hint: '10 bớt 5 bằng 5, sau đó lấy 5 cộng 3.',
        actionFeedback: 'BÉ VÀ KHỈ CON THƯỞNG THỨC NƯỚC DỪA MÁT LẠNH! Tuyệt vời ông mặt trời! 🥥🍹🎉',
        stageVisualHint: '🍹 Cốc nước dừa mát lạnh'
      }
    ]
  },

  // 31. Tô Màu Bức Tranh Theo Số (Chủ đề 2 & 3)
  {
    id: 'color_by_numbers',
    num: 31,
    title: 'Tô Màu Theo Số',
    subtitle: 'Tô màu các vùng theo kết quả phép tính',
    icon: '🎨',
    bgGradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
    badge: 'Chủ đề 2 & 3',
    topicId: 'chu_de_2',
    desc: 'Giải đúng phép tính để cọ vẽ ma thuật tự động phết những mảng màu rực rỡ lên bức tranh phong cảnh!',
    mechanicDesc: 'Tính đúng → Cọ vẽ nhúng màu → Phết đều lên tranh → Bức tranh bừng sáng sắc màu',
    actionVisualType: 'color_paint',
    rewardNoun: 'mảng màu rực rỡ',
    maxProgress: 5,
    rounds: [
      {
        id: 'cbn_1',
        question: 'Tô màu xanh da trời cho bầu trời: 2 + 3 = ?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        explanation: '2 + 3 = 5. Vùng số 5 tô màu xanh da trời.',
        hint: 'Giữ số 2 trong đầu rồi đếm tiếp 3 bước nhé bé!',
        actionFeedback: 'Cọ vẽ phết một dải màu xanh da trời trong vắt ngập tràn ánh nắng! 🎨🌤️',
        stageVisualHint: '🌤️ Bầu trời xanh biếc'
      },
      {
        id: 'cbn_2',
        question: 'Tô màu xanh lá cho đồi cỏ: 9 - 3 = ?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
        explanation: '9 - 3 = 6. Vùng số 6 tô màu xanh lá cây.',
        hint: 'Lấy số 9 bớt đi 3 và đếm lùi để tìm kết quả nhé bé!',
        actionFeedback: 'Đồi cỏ non xanh mướt trải dài tít tắp đến chân trời! 🌿💚',
        stageVisualHint: '🌿 Đồi cỏ xanh mướt'
      },
      {
        id: 'cbn_3',
        question: 'Tô màu vàng óng cho mặt trời: 4 + 4 = ?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '8',
        explanation: '4 + 4 = 8. Vùng số 8 tô màu vàng rực rỡ.',
        hint: 'Giữ số 4 trong đầu rồi đếm tiếp 4 đơn vị nhé bé!',
        actionFeedback: 'Ông mặt trời toả những vạt nắng vàng ấm áp khắp muôn nơi! ☀️💛',
        stageVisualHint: '☀️ Mặt trời vàng rực'
      },
      {
        id: 'cbn_4',
        question: 'Tô màu đỏ tươi cho mái nhà: 10 - 3 = ?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '7',
        explanation: '10 - 3 = 7. Vùng số 7 tô màu đỏ thắm.',
        hint: 'Lấy số 10 bớt đi 3 và đếm lùi để tìm kết quả nhé bé!',
        actionFeedback: 'Ngôi nhà nhỏ xinh khoác lên mình chiếc áo mái ngói đỏ tươi! 🏠❤️',
        stageVisualHint: '🏠 Mái nhà ngói đỏ'
      },
      {
        id: 'cbn_5',
        question: 'Tô cầu vồng ngũ sắc: 1 + 2 + 3 = ?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
        explanation: '1 + 2 = 3; 3 + 3 = 6.',
        hint: 'Cộng lần lượt: 1 cộng 2 bằng 3, 3 cộng 3 bằng 6.',
        actionFeedback: 'BỨC TRANH HOẠ SĨ NHÍ HOÀN THIỆN XUẤT THẦN! Cầu vồng rực rỡ vắt ngang trời! 🌈🖼️🎉',
        stageVisualHint: '🖼️ Tuyệt tác tranh hoàn chỉnh'
      }
    ]
  },

  // 32. Đưa Cừu Vào Chuồng (Chủ đề 1 & 6)
  {
    id: 'sheep_pen',
    num: 32,
    title: 'Đưa Cừu Vào Chuồng',
    subtitle: 'Đếm đàn cừu bông mở cổng về chuồng',
    icon: '🐑',
    bgGradient: 'from-emerald-400 to-green-600',
    badge: 'Chủ đề 1 & 6',
    topicId: 'chu_de_1',
    desc: 'Đếm đúng số cừu lông trắng múp míp, chiếc cổng gỗ sẽ mở ra cho các bạn cừu nhảy tung tăng vào chuồng ấm!',
    mechanicDesc: 'Đếm đúng → Cổng chuồng mở rộng kẽo kẹt → Cừu be be nhảy qua hàng rào → Vào ổ rơm',
    actionVisualType: 'sheep_gate',
    rewardNoun: 'chú cừu ngoan ngoãn',
    maxProgress: 5,
    rounds: [
      {
        id: 'shp_1',
        question: 'Có 3 chú cừu trong chuồng, thêm 3 chú cừu ngoài đồng chạy vào. Có tất cả mấy chú cừu?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
        explanation: '3 + 3 = 6 chú cừu bông trắng.',
        hint: 'Giữ số 3 trong đầu rồi đếm tiếp 3 bước nhé bé!',
        actionFeedback: 'Cổng chuồng mở rộng! Các chú cừu be be vui sướng nhảy qua hàng rào! 🐑🌾',
        stageVisualHint: '🐑 Cừu nhảy qua rào'
      },
      {
        id: 'shp_2',
        question: 'Bác nông dân có 8 chú cừu, 2 chú đang gặm cỏ trên đồi. Trong chuồng có mấy chú cừu?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
        explanation: '8 - 2 = 6 chú cừu trong chuồng.',
        hint: '8 bớt đi 2 còn 6.',
        actionFeedback: 'Chú cừu đầu đàn lông xoăn tít dẫn các bạn vào ổ rơm ấm cúng! 🐑❤️',
        stageVisualHint: '🐑 Cừu mẹ và cừu con'
      },
      {
        id: 'shp_3',
        question: 'Số nào đứng liền sau số 39?',
        options: ['38', '40', '41', '50'],
        correctAnswer: '40',
        explanation: 'Số liền sau 39 là 40.',
        hint: 'Con hãy đếm tiếp số liền sau số 39 nhé.',
        actionFeedback: '40 chú cừu ngoan ngoãn nằm sưởi nắng chiều ấm áp! ☀️🐑',
        stageVisualHint: '🐑 Đàn cừu 40 chú'
      },
      {
        id: 'shp_4',
        question: 'Tách 10 chú cừu thành 2 chuồng, chuồng 1 có 7 chú thì chuồng 2 có mấy chú?',
        options: ['2', '3', '4', '5'],
        correctAnswer: '3',
        explanation: '10 gồm 7 và 3 (10 - 7 = 3).',
        hint: '7 cộng mấy bằng 10?',
        actionFeedback: 'Cả hai chuồng đều có cỏ non xanh mướt cho cừu ăn! 🍀',
        stageVisualHint: '🏡 Hai chuồng cừu xinh xắn'
      },
      {
        id: 'shp_5',
        question: 'Phép tính: 50 + 20 = ? chú cừu',
        options: ['60', '70', '80', '90'],
        correctAnswer: '70',
        explanation: '5 chục + 2 chục = 7 chục (70).',
        hint: 'Giữ số 5 trong đầu rồi đếm thêm 2 đơn vị nhé bé!',
        actionFeedback: 'TRANG TRẠI CỪU VUI VẺ BỘI THU! Bé nhận cúp Bác Nông Dân Nhí giỏi nhất! 🏆🐑🚜🎉',
        stageVisualHint: '🏆 Cúp Bác Nông Dân Tài Năng'
      }
    ]
  },

  // 33. Xây Cầu Gỗ Qua Sông (Chủ đề 7 & 8)
  {
    id: 'bridge_builder',
    num: 33,
    title: 'Xây Cầu Gỗ Qua Sông',
    subtitle: 'Lắp thanh gỗ vừa vặn cho sóc qua suối',
    icon: '🪵',
    bgGradient: 'from-amber-700 via-orange-600 to-amber-500',
    badge: 'Chủ đề 7: Độ dài',
    topicId: 'chu_de_7',
    desc: 'Chọn thanh gỗ có độ dài chính xác theo xăng-ti-mét (cm) để bắc cây cầu vững chắc giúp bạn sóc nhỏ qua suối!',
    mechanicDesc: 'Chọn độ dài đúng → Thanh gỗ hạ xuống khớp mố cầu → Búa gõ cộc cộc đóng đinh → Sóc tung tăng bước qua',
    actionVisualType: 'bridge',
    rewardNoun: 'nhịp cầu gỗ vững chắc',
    maxProgress: 5,
    rounds: [
      {
        id: 'brg_1',
        question: 'Khoảng cách giữa hai tảng đá là 6 cm. Cần thanh gỗ dài bao nhiêu cm?',
        options: ['4 cm', '5 cm', '6 cm', '7 cm'],
        correctAnswer: '6 cm',
        explanation: 'Cần thanh gỗ dài đúng 6 cm để vừa khít nhịp cầu.',
        hint: 'Con hãy quan sát khoảng cách giữa hai mố cầu trên thước nhé.',
        actionFeedback: 'Cộc cộc cộc! Thanh gỗ 6 cm đóng chặt vào mố đá vững vàng! 🪵🔨',
        stageVisualHint: '🪵 Nhịp cầu gỗ 6 cm'
      },
      {
        id: 'brg_2',
        question: 'Nối hai thanh gỗ 3 cm và 4 cm. Cây cầu dài bao nhiêu cm?',
        options: ['6 cm', '7 cm', '8 cm', '9 cm'],
        correctAnswer: '7 cm',
        explanation: '3 cm + 4 cm = 7 cm.',
        hint: 'Giữ số 3 trong đầu rồi đếm tiếp 4 bước nhé bé!',
        actionFeedback: 'Cây cầu nối dài ra giữa dòng suối trong vắt róc rách! 🌊🐿️',
        stageVisualHint: '🪵 Nhịp cầu dài 7 cm'
      },
      {
        id: 'brg_3',
        question: 'Cây cầu dài 10 cm, đã lát được 4 cm. Còn thiếu bao nhiêu cm nữa?',
        options: ['5 cm', '6 cm', '7 cm', '4 cm'],
        correctAnswer: '6 cm',
        explanation: '10 cm - 4 cm = 6 cm.',
        hint: 'Lấy số 10 bớt đi 4 và đếm lùi từng bước nhé bé!',
        actionFeedback: 'Thanh gỗ thứ ba hạ xuống khít khao không một kẽ hở! ✨',
        stageVisualHint: '🪵 Cầu gần hoàn thành'
      },
      {
        id: 'brg_4',
        question: 'So sánh: Thanh gỗ 15 cm ... thanh gỗ 12 cm',
        options: ['Dài hơn', 'Ngắn hơn', 'Bằng nhau', 'Không biết'],
        correctAnswer: 'Dài hơn',
        explanation: '15 cm lớn hơn 12 cm nên thanh gỗ 15 cm dài hơn.',
        hint: 'Số 15 lớn hơn số 12.',
        actionFeedback: 'Lan can cầu gỗ được gắn thêm thật an toàn và xinh xắn! 🌲',
        stageVisualHint: '🌲 Lan can cầu an toàn'
      },
      {
        id: 'brg_5',
        question: 'Tính: 20 cm + 30 cm = ? cm',
        options: ['40 cm', '50 cm', '60 cm', '70 cm'],
        correctAnswer: '50 cm',
        explanation: '20 + 30 = 50 cm.',
        hint: '2 chục cộng 3 chục bằng 5 chục cm.',
        actionFeedback: 'CÂY CẦU CỔ TÍCH ĐÃ HOÀN THÀNH! Bạn sóc nhỏ ôm quả sồi tung tăng chạy qua sông! 🐿️🌰🎉',
        stageVisualHint: '🎉 Sóc nhỏ qua cầu an toàn'
      }
    ]
  },

  // 34. Đầu Bếp Làm Bánh (Chủ đề 1 & 3)
  {
    id: 'cake_baker',
    num: 34,
    title: 'Đầu Bếp Làm Bánh',
    subtitle: 'Thêm dâu tây và ngọn nến lung linh',
    icon: '🎂',
    bgGradient: 'from-pink-400 via-rose-300 to-amber-200',
    badge: 'Chủ đề 3: Phép tính',
    topicId: 'chu_de_3',
    desc: 'Giải đúng công thức phép tính để trang trí thêm kem tươi, dâu tây chín mọng và thắp sáng nến sinh nhật!',
    mechanicDesc: 'Tính đúng → Kem tươi phun tròn trịa → Dâu tây thả xuống → Nến phát sáng lung linh',
    actionVisualType: 'cake',
    rewardNoun: 'trang trí bánh kem',
    maxProgress: 5,
    rounds: [
      {
        id: 'ck_1',
        question: 'Bánh kem có 3 quả dâu, đặt thêm 3 quả nữa. Có tất cả mấy quả dâu?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
        explanation: '3 + 3 = 6 quả dâu tây đỏ mọng.',
        hint: 'Giữ số 3 trong đầu rồi đếm tiếp 3 bước nhé bé!',
        actionFeedback: '6 quả dâu tây đỏ chót viền quanh lớp kem trắng mịn như tuyết! 🍓🎂',
        stageVisualHint: '🍓 Bánh kem dâu tây'
      },
      {
        id: 'ck_2',
        question: 'Có 7 ngọn nến lung linh, gió thổi tắt 2 ngọn. Còn lại mấy ngọn nến đang cháy?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        explanation: '7 - 2 = 5 ngọn nến sáng.',
        hint: 'Lấy số 7 bớt đi 2 và đếm lùi để tìm kết quả nhé bé!',
        actionFeedback: '5 ngọn nến lung linh toả ánh sáng ấm áp diệu kỳ! 🕯️✨',
        stageVisualHint: '🕯️ Nến sinh nhật sáng rực'
      },
      {
        id: 'ck_3',
        question: 'Đầu bếp cần 4 thanh socola đen và 4 thanh socola trắng. Tổng cộng?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '8',
        explanation: '4 + 4 = 8 thanh socola.',
        hint: 'Giữ số 4 trong đầu rồi đếm tiếp 4 đơn vị nhé bé!',
        actionFeedback: 'Những bông hoa bằng socola thơm nức mũi gắn lên thân bánh! 🍫🌸',
        stageVisualHint: '🍫 Hoa socola trang trí'
      },
      {
        id: 'ck_4',
        question: 'Đĩa có 10 viên kẹo cốm sắc màu, bé rắc 6 viên lên bánh. Còn lại mấy viên kẹo?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: '10 - 6 = 4 viên kẹo cốm.',
        hint: 'Lấy số 10 bớt đi 6 và đếm lùi để tìm kết quả nhé bé!',
        actionFeedback: 'Cơn mưa kẹo cốm lấp lánh phủ kín bề mặt chiếc bánh sinh nhật! 🍬✨',
        stageVisualHint: '🍬 Kẹo cốm bảy màu'
      },
      {
        id: 'ck_5',
        question: 'Bé 7 tuổi, năm sau bé thêm 1 tuổi nữa. Lúc đó trên bánh cắm mấy ngọn nến?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '8',
        explanation: '7 + 1 = 8 tuổi (8 ngọn nến).',
        hint: 'Giữ số 7 trong đầu rồi đếm tiếp 1 bước nhé bé!',
        actionFeedback: 'BÀI HÁT HAPPY BIRTHDAY VANG LÊN! Chiếc bánh sinh nhật đẹp nhất thế giới! 🎂🎵🎉',
        stageVisualHint: '🎂 Chiếc bánh kem hoàn hảo'
      }
    ]
  },

  // 35. Bé Qua Đường An Toàn (Chủ đề 2 & 9)
  {
    id: 'traffic_lights',
    num: 35,
    title: 'Bé Qua Đường An Toàn',
    subtitle: 'Đèn xanh, đèn đỏ và vạch sang đường',
    icon: '🚦',
    bgGradient: 'from-slate-700 via-sky-800 to-emerald-700',
    badge: 'Chủ đề 2 & 9',
    topicId: 'chu_de_2',
    desc: 'Nhận biết hình dạng đèn giao thông hình tròn, đếm giây đếm ngược để dắt bạn nhỏ bước qua vạch kẻ đường an toàn!',
    mechanicDesc: 'Tính đúng giây → Đèn đỏ chuyển sang đèn xanh sáng rực → Xe dừng lại → Bé sang đường vui vẻ',
    actionVisualType: 'traffic_light',
    rewardNoun: 'bước đi an toàn',
    maxProgress: 5,
    rounds: [
      {
        id: 'trf_1',
        question: 'Đèn tín hiệu giao thông (đỏ, vàng, xanh) có dạng hình gì?',
        options: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'],
        correctAnswer: 'Hình tròn',
        explanation: 'Các bóng đèn giao thông đều có dạng hình tròn.',
        hint: 'Bóng đèn tròn xoe phát sáng.',
        actionFeedback: 'Đèn đỏ bật sáng hình tròn báo hiệu xe cộ dừng lại nhường đường! 🔴🛑',
        stageVisualHint: '🔴 Đèn đỏ dừng lại'
      },
      {
        id: 'trf_2',
        question: 'Đèn xanh bật sáng, người đi bộ được phép làm gì?',
        options: ['Được đi qua đường an toàn', 'Phải dừng lại', 'Phải quay về', 'Không được đi'],
        correctAnswer: 'Được đi qua đường an toàn',
        explanation: 'Đèn xanh bật lên là tín hiệu được phép đi qua đường trên vạch trắng.',
        hint: 'Đèn xanh nghĩa là được đi.',
        actionFeedback: 'Ting ting! Đèn xanh bật sáng, chú gấu nhỏ bắt đầu bước qua đường! 🟢🚶',
        stageVisualHint: '🟢 Đèn xanh sang đường'
      },
      {
        id: 'trf_3',
        question: 'Đồng hồ đếm ngược đèn giao thông: 10 bớt đi 3 còn mấy giây?',
        options: ['6 giây', '7 giây', '8 giây', '5 giây'],
        correctAnswer: '7 giây',
        explanation: '10 - 3 = 7 giây.',
        hint: 'Lấy số 10 bớt đi 3 và đếm lùi từng bước nhé bé!',
        actionFeedback: 'Số 7 màu xanh nhấp nháy rõ ràng trên cột đèn tín hiệu! ⏳',
        stageVisualHint: '⏱️ Đếm lùi 7 giây'
      },
      {
        id: 'trf_4',
        question: 'Vạch kẻ đường dành cho người đi bộ thường có dạng các dải hình gì?',
        options: ['Hình chữ nhật màu trắng', 'Hình tròn', 'Hình tam giác', 'Hình thoi'],
        correctAnswer: 'Hình chữ nhật màu trắng',
        explanation: 'Vạch sang đường (vạch ngựa vằn) là các hình chữ nhật màu trắng nằm song song.',
        hint: 'Các dải vạch dài song song nhau.',
        actionFeedback: 'Bé bước đều chân trên những vạch chữ nhật trắng tinh an toàn! 🦓🤍',
        stageVisualHint: '🦓 Vạch kẻ đường chữ nhật'
      },
      {
        id: 'trf_5',
        question: 'Tính nhanh: 5 giây + 5 giây = ? giây',
        options: ['9 giây', '10 giây', '8 giây', '11 giây'],
        correctAnswer: '10 giây',
        explanation: '5 + 5 = 10 giây.',
        hint: 'Giữ số 5 trong đầu rồi đếm tiếp 5 bước nhé bé!',
        actionFeedback: 'HOAN HÔ! Bé đã qua đường an toàn và nhận HUY HIỆU HIỆP SĨ GIAO THÔNG NHÍ! 🏅🚦🎉',
        stageVisualHint: '🏅 Huy hiệu Hiệp Sĩ Giao Thông'
      }
    ]
  },

  // 36. Heo Đất Tiết Kiệm (Chủ đề 6 & 8)
  {
    id: 'piggy_bank',
    num: 36,
    title: 'Heo Đất Tiết Kiệm',
    subtitle: 'Thả đồng xu leng keng nuôi heo lớn',
    icon: '🐷',
    bgGradient: 'from-pink-500 via-rose-400 to-amber-300',
    badge: 'Chủ đề 8: Phép cộng trừ',
    topicId: 'chu_de_8',
    desc: 'Tính đúng số tiền xu và tiền giấy tròn chục, đồng xu vàng sẽ thả vào lưng chú heo đất kêu leng keng vui tai!',
    mechanicDesc: 'Tính đúng → Xu vàng rơi leng keng → Heo đất vẫy tai chớp mắt → Bụng heo no tròn',
    actionVisualType: 'piggy',
    rewardNoun: 'đồng xu vàng óng',
    maxProgress: 5,
    rounds: [
      {
        id: 'pgy_1',
        question: 'Bé bỏ vào heo đất 1 đồng xu 10 nghìn và 1 đồng xu 10 nghìn nữa. Có tất cả bao nhiêu?',
        options: ['10 nghìn', '20 nghìn', '30 nghìn', '40 nghìn'],
        correctAnswer: '20 nghìn',
        explanation: '10 + 10 = 20 nghìn đồng.',
        hint: '1 chục cộng 1 chục bằng 2 chục.',
        actionFeedback: 'KENG! Đồng xu vàng rơi vào khe lưng chú heo đất hồng! Heo đất vẫy tai! 🐷🪙',
        stageVisualHint: '🪙 Xu vàng rơi vào heo'
      },
      {
        id: 'pgy_2',
        question: 'Heo đất có 30 nghìn, bé tiết kiệm thêm 20 nghìn. Trong heo có bao nhiêu?',
        options: ['40 nghìn', '50 nghìn', '60 nghìn', '70 nghìn'],
        correctAnswer: '50 nghìn',
        explanation: '30 + 20 = 50 nghìn đồng (3 chục + 2 chục = 5 chục).',
        hint: 'Giữ số 3 trong đầu rồi đếm thêm 2 đơn vị nhé bé!',
        actionFeedback: 'KENG KENG! Heo đất cười tít mắt, hai má ửng hồng đáng yêu! 💕',
        stageVisualHint: '🐷 Heo đất cười toe toét'
      },
      {
        id: 'pgy_3',
        question: 'Bé có 50 nghìn, mua một cuốn vở bài tập Toán hết 20 nghìn. Bé còn lại bao nhiêu?',
        options: ['20 nghìn', '30 nghìn', '40 nghìn', '10 nghìn'],
        correctAnswer: '30 nghìn',
        explanation: '50 - 20 = 30 nghìn đồng.',
        hint: '5 chục trừ 2 chục bằng 3 chục.',
        actionFeedback: 'Cuốn vở bài tập mới tinh thơm mùi mực, bé học thật chăm chỉ! 📖✏️',
        stageVisualHint: '📖 Vở bài tập Toán lớp 1'
      },
      {
        id: 'pgy_4',
        question: 'Số gồm 7 chục và 5 đơn vị viết là:',
        options: ['57', '75', '705', '70'],
        correctAnswer: '75',
        explanation: '7 chục viết trước, 5 đơn vị viết sau tạo thành số 75.',
        hint: 'Viết số 7 rồi viết số 5.',
        actionFeedback: 'KENG! Tờ tiền tiết kiệm 75 nghìn làm bụng chú heo tròn xoe! 💵✨',
        stageVisualHint: '💵 Tờ tiền tiết kiệm mới cong'
      },
      {
        id: 'pgy_5',
        question: 'Phép tính: 40 + 40 + 20 = ?',
        options: ['80', '90', '100', '70'],
        correctAnswer: '100',
        explanation: '40 + 40 = 80; 80 + 20 = 100.',
        hint: 'Mười chục được viết thành số nào, con hãy nhớ lại nhé.',
        actionFeedback: 'HEO ĐẤT TIẾT KIỆM ĐẦY ẮP 100 ĐIỂM! Bé được phong tặng danh hiệu Thần Đồng Tiết Kiệm! 🏆🐷💰🎉',
        stageVisualHint: '🏆 Cúp Thần Đồng Tiết Kiệm'
      }
    ]
  },

  // 37. Bình Nước Phép Thuật (Chủ đề 3 & 8)
  {
    id: 'magic_potions',
    num: 37,
    title: 'Bình Nước Phép Thuật',
    subtitle: 'Pha màu và đong thể tích thần kỳ',
    icon: '🧪',
    bgGradient: 'from-purple-600 via-violet-600 to-indigo-700',
    badge: 'Chủ đề 8: Phép tính',
    topicId: 'chu_de_8',
    desc: 'Giải đúng công thức phép tính để hòa tan dung dịch màu sắc vào bình thuốc ma thuật phát sáng lấp lánh!',
    mechanicDesc: 'Tính đúng → Giọt nước phép thuật rơi tí tách → Bình đổi màu tím/hồng → Bọt khí sủi tăm phát sáng',
    actionVisualType: 'magic_potion',
    rewardNoun: 'giọt nước phép thuật',
    maxProgress: 5,
    rounds: [
      {
        id: 'pot_1',
        question: 'Pha 3 giọt dung dịch đỏ và 4 giọt dung dịch xanh. Có tất cả mấy giọt?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '7',
        explanation: '3 + 4 = 7 giọt phép thuật.',
        hint: 'Giữ số 3 trong đầu rồi đếm tiếp 4 bước nhé bé!',
        actionFeedback: 'XÈO XÈO! Dung dịch đổi sang màu tím kỳ ảo toả khói thơm ngọt ngào! 🧪💜',
        stageVisualHint: '🧪 Bình phép thuật màu tím'
      },
      {
        id: 'pot_2',
        question: 'Trong bình có 9 giọt nước thần, bốc hơi đi 5 giọt. Còn lại bao nhiêu giọt?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: '9 - 5 = 4 giọt.',
        hint: 'Lấy số 9 bớt đi 5 và đếm lùi để tìm kết quả nhé bé!',
        actionFeedback: 'Bọt khí ngũ sắc sủi tăm bay lên không trung lấp lánh như pha lê! 🫧✨',
        stageVisualHint: '🫧 Bọt khí sủi tăm'
      },
      {
        id: 'pot_3',
        question: 'Phép tính kích hoạt thần chú: 20 + 30 = ?',
        options: ['40', '50', '60', '70'],
        correctAnswer: '50',
        explanation: '2 chục cộng 3 chục bằng 5 chục (50).',
        hint: 'Giữ số 2 trong đầu rồi đếm thêm 3 đơn vị nhé bé!',
        actionFeedback: 'Chiếc gậy phép thuật phát sáng rực rỡ đầu ngôi sao vàng! 🪄⭐',
        stageVisualHint: '🪄 Gậy phép phát sáng'
      },
      {
        id: 'pot_4',
        question: 'Phép tính giải độc: 70 - 40 = ?',
        options: ['20', '30', '40', '50'],
        correctAnswer: '30',
        explanation: '7 chục trừ 4 chục bằng 3 chục (30).',
        hint: 'Lấy số 7 bớt đi 4 và đếm lùi từng bước nhé bé!',
        actionFeedback: 'Bình nước phép thuật trong suốt lấp lánh ánh kim tuyến nhiệm màu! 💎🧪',
        stageVisualHint: '💎 Dung dịch pha lê kim tuyến'
      },
      {
        id: 'pot_5',
        question: 'Công thức thần dược Trí Tuệ: 15 + 4 = ?',
        options: ['18', '19', '20', '17'],
        correctAnswer: '19',
        explanation: '5 + 4 = 9, giữ nguyên 1 chục được 19.',
        hint: 'Giữ số 5 trong đầu rồi đếm tiếp 4 bước nhé bé!',
        actionFeedback: 'CHÚC MỪNG PHÙ THỦY TOÁN HỌC TÀI BA! Thần dược Trí Tuệ hoàn thành xuất sắc! 🧙‍♂️🔮✨🎉',
        stageVisualHint: '🔮 Quả cầu tiên tri tỏa sáng'
      }
    ]
  },

  // 38. Nối Sao Thiên Hà (Chủ đề 1 & 2)
  {
    id: 'galaxy_constellation',
    num: 38,
    title: 'Nối Sao Thiên Hà',
    subtitle: 'Nối các vì sao thành chòm sao lấp lánh',
    icon: '✨',
    bgGradient: 'from-slate-900 via-indigo-950 to-blue-900',
    badge: 'Chủ đề 1 & 2',
    topicId: 'chu_de_1',
    desc: 'Điền đúng số thứ tự của các vì sao từ 1 đến 10 để vạch sáng nối liền thành chòm sao Gấu Nhỏ và Sư Tử bay giữa dải Ngân Hà!',
    mechanicDesc: 'Chọn số tiếp theo đúng → Tia sáng laser nối giữa 2 ngôi sao → Ngôi sao bừng sáng → Hiện hình chòm sao',
    actionVisualType: 'constellation',
    rewardNoun: 'ngôi sao sáng chói',
    maxProgress: 5,
    rounds: [
      {
        id: 'glx_1',
        question: 'Bắt đầu từ sao số 1, nối tiếp theo đến sao số 2, rồi đến sao số mấy?',
        options: ['3', '4', '5', '0'],
        correctAnswer: '3',
        explanation: 'Thứ tự đếm tự nhiên: 1, 2, 3.',
        hint: 'Sau số 2 là số 3.',
        actionFeedback: 'VÈO! Tia sáng laser vàng óng nối ngôi sao số 2 sang ngôi sao số 3! ✨⭐',
        stageVisualHint: '⭐ Sao số 3 phát sáng'
      },
      {
        id: 'glx_2',
        question: 'Dãy sao tiếp theo: 4, 5, 6, ?. Ngôi sao tiếp theo là:',
        options: ['7', '8', '9', '6'],
        correctAnswer: '7',
        explanation: 'Sau số 6 là số 7 (4, 5, 6, 7).',
        hint: 'Đếm tiếp từ 6 thêm 1 là 7.',
        actionFeedback: 'Đường ánh sáng thứ hai vẽ nên sống lưng uy vũ của chú Gấu Lớn! 🌌🐻',
        stageVisualHint: '🐻 Chòm sao Đại Hùng'
      },
      {
        id: 'glx_3',
        question: 'Phép tính thắp sáng sao Bắc Đẩu: 5 + 3 = ?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '8',
        explanation: '5 + 3 = 8. Ngôi sao số 8 bừng sáng.',
        hint: 'Giữ số 5 trong đầu rồi đếm tiếp 3 đơn vị nhé bé!',
        actionFeedback: 'Sao Bắc Đẩu toả ánh sáng kim cương định hướng muôn trùng khơi! 🌟🧭',
        stageVisualHint: '🌟 Sao Bắc Đẩu kim cương'
      },
      {
        id: 'glx_4',
        question: 'Số đứng liền trước số 10 trong chòm sao Thiên Nga là:',
        options: ['8', '9', '11', '7'],
        correctAnswer: '9',
        explanation: 'Liền trước số 10 là số 9.',
        hint: '10 bớt 1 bằng 9.',
        actionFeedback: 'Đôi cánh thiên nga ánh bạc sải rộng giữa dải Ngân Hà tuyệt mỹ! 🦢✨',
        stageVisualHint: '🦢 Chòm sao Thiên Nga'
      },
      {
        id: 'glx_5',
        question: 'Ngôi sao vương miện chói lọi nhất: 10 + 10 = ?',
        options: ['20', '30', '40', '100'],
        correctAnswer: '20',
        explanation: '10 + 10 = 20 (hai mươi).',
        hint: 'Một chục cộng một chục là hai chục, được viết thành số nào nhé.',
        actionFeedback: 'TOÀN BỘ BẦU TRỜI ĐÊM BỪNG SÁNG! Chòm sao Bé Yêu Toán Học toả sáng vĩnh cửu giữa vũ trụ bao la! 👑🌟🌌🎉',
        stageVisualHint: '🌌 Dải Ngân Hà bừng sáng'
      }
    ]
  }
];

export const ALL_38_GAMES_METADATA: (
  | {
      id: GameId;
      num: number;
      title: string;
      subtitle: string;
      icon: string;
      bgGradient: string;
      badge: string;
      topicId: string;
      desc: string;
      isLegacy: boolean;
    }
  | (GameMetadata & { isLegacy: boolean })
)[] = [
  // 8 Trò chơi gốc giữ nguyên 100%
  {
    id: 'mystery_number',
    num: 1,
    title: 'Săn Số Bí Ẩn',
    subtitle: 'Đếm hình và tìm số bí mật',
    icon: '🕵️‍♂️',
    bgGradient: 'from-amber-400 to-orange-500',
    badge: 'Chủ đề 1 & 6',
    topicId: 'chu_de_1',
    desc: 'Quan sát tranh gợi ý và nhanh tay chạm thẻ số chính xác nhất.',
    isLegacy: true
  },
  {
    id: 'math_superhero',
    num: 2,
    title: 'Siêu Nhân Cộng Trừ',
    subtitle: 'Phép tính siêu tốc cùng Rô-bốt',
    icon: '🦸‍♂️',
    bgGradient: 'from-rose-500 to-red-600',
    badge: 'Chủ đề 3 & 8',
    topicId: 'chu_de_3',
    desc: 'Rèn luyện phản xạ tính nhẩm cộng và trừ trong phạm vi 10 & 100.',
    isLegacy: true
  },
  {
    id: 'speed_match',
    num: 3,
    title: 'Ghép Đôi Thần Tốc',
    subtitle: 'Nối phép tính với kết quả',
    icon: '⚡',
    bgGradient: 'from-emerald-400 to-teal-600',
    badge: 'Cộng trừ & Hình học',
    topicId: 'chu_de_3',
    desc: 'Nhanh mắt ghép đúng thẻ phép tính và thẻ kết quả trước khi hết giờ.',
    isLegacy: true
  },
  {
    id: 'find_house',
    num: 4,
    title: 'Tìm Nhà Cho Số',
    subtitle: 'Giúp chim cánh cụt về lều tuyết',
    icon: '🏡',
    bgGradient: 'from-blue-500 to-indigo-600',
    badge: 'Số tròn chục & So sánh',
    topicId: 'chu_de_6',
    desc: 'Chọn ngôi nhà ấm áp phù hợp với cách đọc và điều kiện của từng thẻ số.',
    isLegacy: true
  },
  {
    id: 'math_raceway',
    num: 5,
    title: 'Đường Đua Toán Học',
    subtitle: 'Khám phá Đảo Giấu Vàng',
    icon: '🏎️',
    bgGradient: 'from-teal-500 to-emerald-600',
    badge: 'SGK Trang 8 & 20',
    topicId: 'chu_de_1',
    desc: 'Gieo xúc xắc và giải đúng thử thách để đưa nhân vật về đích rương báu.',
    isLegacy: true
  },
  {
    id: 'geometry_detective',
    num: 6,
    title: 'Thám Tử Hình Học',
    subtitle: 'Phân loại hình phẳng & hình khối',
    icon: '🔍',
    bgGradient: 'from-purple-500 to-indigo-600',
    badge: 'Chủ đề 2 & 4',
    topicId: 'chu_de_2',
    desc: 'Truy tìm hình vuông, hình tròn, tam giác, hình chữ nhật và khối lập phương.',
    isLegacy: true
  },
  {
    id: 'lucky_box',
    num: 7,
    title: 'Chiếc Hộp May Mắn',
    subtitle: 'Mở quà nhận sao & huy hiệu',
    icon: '🎁',
    bgGradient: 'from-pink-500 to-rose-500',
    badge: 'Huy hiệu bí mật',
    topicId: 'chu_de_5',
    desc: 'Mỗi hộp quà chứa một bí mật toán học để thu thập thêm nhiều ngôi sao.',
    isLegacy: true
  },
  {
    id: 'grand_quest',
    num: 8,
    title: 'Vượt Thử Thách Tổng Hợp',
    subtitle: 'Chinh phục 6 trạm thám hiểm',
    icon: '👑',
    bgGradient: 'from-orange-500 to-amber-500',
    badge: 'Tổng hợp học kỳ',
    topicId: 'chu_de_10',
    desc: 'Chuỗi nhiệm vụ liên hoàn kiểm tra toàn diện kiến thức Toán lớp 1.',
    isLegacy: true
  },

  // 30 Trò chơi mới (9 đến 38)
  ...NEW_GAMES_METADATA.map((game) => ({
    ...game,
    isLegacy: false
  }))
];
