/**
 * Data structures and types for "Thế Giới Toán Học Lớp 1"
 */

export type SemesterType = 1 | 2;

export type DifficultyLevel = 'Cơ bản' | 'Luyện tập' | 'Thử thách' | 'Nhận biết' | 'Thông hiểu' | 'Thực hành' | 'Vận dụng';

export type ExerciseType = 
  | 'multiple_choice' 
  | 'fill_blank' 
  | 'compare' 
  | 'count_items' 
  | 'geometry' 
  | 'matching' 
  | 'sort_numbers' 
  | 'word_problem';

export type IllustrationType = 
  | 'fruits' 
  | 'animals' 
  | 'sea_creatures' 
  | 'flat_shapes' 
  | 'solids_3d' 
  | 'ruler_cm' 
  | 'clock_face' 
  | 'calendar_page'
  | 'spatial_positions'
  | 'shapes_composition'
  | 'train_cars' 
  | 'number_igloo' 
  | 'balance_tray'
  | 'compare_groups';

export interface MathIllustration {
  type: IllustrationType;
  count?: number;
  secondaryCount?: number;
  itemType?: 'tomato' | 'apple' | 'carrot' | 'penguin' | 'fish' | 'frog' | 'chick' | 'boat' | 'pencil' | 'bus' | 'orange' | 'flower' | 'eraser' | 'clip' | 'ribbon' | string;
  shape?: 'square' | 'circle' | 'triangle' | 'rectangle' | 'cube' | 'cuboid';
  data?: any;
}

export interface ExerciseItem {
  id: string;
  lessonId: string;
  questionNumber: number;
  type: ExerciseType;
  level: DifficultyLevel;
  question: string;
  illustration?: MathIllustration;
  options?: string[];
  correctAnswer: string | number | string[];
  explanation: string;
  sourceRef?: {
    bookTitle: string;
    page: number;
  };
  needsReview?: boolean;
}

export interface ExampleItem {
  title: string;
  description: string;
  calculationText?: string;
  illustration?: MathIllustration;
}

export interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  semester: SemesterType;
  topicId: string;
  topicName: string;
  pageRange: string;
  sourceBook: string;
  learningObjectives: string[];
  coreKnowledge: string;
  examples: ExampleItem[];
  exercises: ExerciseItem[];
  isTeacherVerified: boolean;
  needsReview?: boolean;
  notes?: string;
}

export interface Topic {
  id: string;
  topicNumber: number;
  name: string;
  semester: SemesterType;
  description: string;
  iconName: string;
  lessons: Lesson[];
}

export interface BookDocument {
  id: string;
  title: string;
  publisher: string;
  authors: string;
  semester: SemesterType;
  pageCount: number;
  uploadDate: string;
  status: 'uploaded' | 'reading' | 'analyzed' | 'needs_review' | 'error';
  topics: Topic[];
  fileSource?: string;
  reviewNotes?: string;
}

export type GameId = 
  | 'mystery_number' 
  | 'math_superhero' 
  | 'speed_match' 
  | 'find_house' 
  | 'math_raceway' 
  | 'geometry_detective' 
  | 'lucky_box' 
  | 'grand_quest'
  // 30 Trò chơi mới nâng cấp
  | 'fishing_math'
  | 'fruit_harvest'
  | 'feed_the_animals'
  | 'balloon_pop'
  | 'build_robot'
  | 'train_cargo'
  | 'feed_bird_nest'
  | 'frog_jump_pond'
  | 'clock_master'
  | 'ruler_measurement'
  | 'space_rocket_launch'
  | 'candy_shop'
  | 'shape_tangram'
  | 'balance_scale'
  | 'save_the_dinosaur'
  | 'ice_cream_stack'
  | 'bubble_counting'
  | 'calendar_explorer'
  | 'parking_master'
  | 'plant_watering'
  | 'treasure_dive'
  | 'monkey_climb_coconut'
  | 'color_by_numbers'
  | 'sheep_pen'
  | 'bridge_builder'
  | 'cake_baker'
  | 'traffic_lights'
  | 'piggy_bank'
  | 'magic_potions'
  | 'galaxy_constellation';

export interface GameInfo {
  id: GameId;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  targetTopic: string;
}

export interface ExerciseAttempt {
  id: string;
  lessonId: string;
  exerciseId: string;
  question: string;
  chosenAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: string;
  level: DifficultyLevel;
  topicName: string;
}

export interface Student {
  id: string;
  classId: string;
  code: string;
  name: string;
  avatar: string;
  stars: number;
  completedLessons: string[];
  gameHighScores: Record<string, number>;
  history: ExerciseAttempt[];
}

export interface Classroom {
  id: string;
  name: string;
  schoolYear: string;
  students: Student[];
}

export interface TeacherCustomization {
  heroPhoto: string;
  footerPhoto: string;
  zoom: number;
  posX: number;
  posY: number;
  teacherName: string;
  schoolName: string;
  hasRealPhoto?: boolean;
}

