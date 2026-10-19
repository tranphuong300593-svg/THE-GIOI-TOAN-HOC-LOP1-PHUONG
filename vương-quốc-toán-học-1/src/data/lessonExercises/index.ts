import { ExerciseItem } from '../../types';
import { topic1Exercises } from './topic1Exercises';
import { topic2Exercises } from './topic2Exercises';
import { topic3Exercises } from './topic3Exercises';
import { topic4Exercises } from './topic4Exercises';
import { topic5Exercises } from './topic5Exercises';
import { topic6Exercises } from './topic6Exercises';
import { topic7Exercises } from './topic7Exercises';
import { topic8Exercises } from './topic8Exercises';
import { topic9Exercises } from './topic9Exercises';
import { topic10Exercises } from './topic10Exercises';

export const ALL_LESSON_EXERCISES: Record<string, ExerciseItem[]> = {
  ...topic1Exercises,
  ...topic2Exercises,
  ...topic3Exercises,
  ...topic4Exercises,
  ...topic5Exercises,
  ...topic6Exercises,
  ...topic7Exercises,
  ...topic8Exercises,
  ...topic9Exercises,
  ...topic10Exercises
};
