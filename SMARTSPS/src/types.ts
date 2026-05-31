/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ms' | 'zh';

export type SPS_Skill = 
  | 'observation'
  | 'inference'
  | 'hypothesis'
  | 'variables'
  | 'operational_definition'
  | 'interpreting_data';

export type Difficulty = 'easy' | 'medium' | 'advanced';

export type BadgeId =
  | 'first_step'
  | 'observer_badge'
  | 'detective_badge'
  | 'theorist_badge'
  | 'control_master'
  | 'definer_badge'
  | 'data_wizard'
  | 'halfway_there'
  | 'sps_champion';

export interface TranslationObj {
  en: string;
  ms: string;
  zh: string;
}

export interface Question {
  id: string;
  skill: SPS_Skill;
  difficulty: Difficulty;
  scenario?: TranslationObj;
  questionText: TranslationObj;
  options: TranslationObj[]; // 4 options
  correctIndex: number;
  explanation: TranslationObj;
  graphData?: { label: string; value: number }[]; // optional structured data for charting in interpreting_data
  variablesSetup?: {
    manipulated: string;
    responding: string;
    constant: string;
  }; // metadata for variable selection rendering
}

export interface Badge {
  id: BadgeId;
  name: TranslationObj;
  description: TranslationObj;
  iconName: string; // lucide icon name
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Mission {
  id: string;
  title: TranslationObj;
  desc: TranslationObj;
  rewardXp: number;
  targetSkill?: SPS_Skill;
  reqCount: number;
  type: 'complete_quizzes' | 'reach_xp' | 'unlock_badge' | 'skill_mastery';
}

export interface SkillAttempt {
  questionId: string;
  isCorrect: boolean;
  scoreEarned: number;
  timestamp: string;
}

export interface StudentProgress {
  id: string;
  name: string;
  avatar: string; // key of avatar illustration
  xp: number;
  level: number;
  completedQuestions: string[]; // successful question IDs
  schoolClass: string; // e.g. "Primary 5 Alpha"
  skillsXp: Record<SPS_Skill, number>;
  skillsHistory: Record<SPS_Skill, SkillAttempt[]>;
  earnedBadges: BadgeId[];
  unlockedMissions: string[]; // completed mission IDs
  lastActive: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  schoolClass: string;
  isCurrentUser?: boolean;
}
