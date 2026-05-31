/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  StudentProgress, 
  SPS_Skill, 
  Difficulty, 
  Language, 
  Question, 
  BadgeId, 
  Mission 
} from './types';
import { 
  getFullQuestionBank, 
  generateQuestionsForSkill, 
  KEY_MISSIONS, 
  ALL_BADGES,
  VIRTUAL_LEADERBOARD
} from './data/questions';
import { sfx, getMuteState, toggleMute } from './utils/audio';
import SPSIllustrations from './components/SPSIllustrations';
import BadgeGrid from './components/BadgeGrid';
import Dashboard from './components/Dashboard';
import * as Icons from 'lucide-react';

export interface CongratsNotification {
  type: 'level' | 'mission' | 'badge';
  title: string;
  subtitle: string;
  badgeId?: string;
  xpReward?: number;
}

export default function App() {
  // State variables
  const [lang, setLang] = useState<Language>('en');
  const [notificationQueue, setNotificationQueue] = useState<CongratsNotification[]>([]);

  const queueNotification = (notif: CongratsNotification) => {
    setNotificationQueue(prev => [...prev, notif]);
  };

  const currentNotification = notificationQueue[0] || null;

  const handleDismissNotification = () => {
    setNotificationQueue(prev => prev.slice(1));
    sfx.playTap();
  };
  const [activeTab, setActiveTab] = useState<'quest' | 'missions' | 'badges' | 'leaderboard' | 'dashboard'>(() => {
    const saved = localStorage.getItem('sps_active_tab');
    return (saved as any) || 'quest';
  });
  const [isLobbyMuted, setIsLobbyMuted] = useState(getMuteState());

  // Student progress details - hydrated from LocalStorage
  const [progress, setProgress] = useState<StudentProgress | null>(null);

  // Multi-user Registered Student Accounts database
  const [registeredAccounts, setRegisteredAccounts] = useState<StudentProgress[]>(() => {
    const saved = localStorage.getItem('sps_registered_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing registered accounts list:', err);
      }
    }
    return [];
  });

  // Track if current user is choosing an existing profile, or registering a brand new one
  const [signupMode, setSignupMode] = useState<'login' | 'register'>('register');

  // Sync registered accounts to LocalStorage
  useEffect(() => {
    localStorage.setItem('sps_registered_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  // Adjust default sign up view mode on load
  useEffect(() => {
    if (registeredAccounts.length > 0) {
      setSignupMode('login');
    } else {
      setSignupMode('register');
    }
  }, [registeredAccounts.length]);

  // Form states for signup
  const [signupName, setSignupName] = useState('');
  const [signupClass, setSignupClass] = useState('Year 5 Cosmos');
  const [signupAvatar, setSignupAvatar] = useState('chemist_marie');

  // Quiz active category/index details
  const [selectedSkill, setSelectedSkill] = useState<SPS_Skill>(() => {
    const saved = localStorage.getItem('sps_selected_skill');
    return (saved as SPS_Skill) || 'observation';
  });
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(() => {
    const saved = localStorage.getItem('sps_current_quiz_index');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  // Pre-cached questions state map to allow individual skill shuffling on runtime
  const [skillQuestionsMap, setSkillQuestionsMap] = useState<Record<SPS_Skill, Question[]>>(() => {
    const saved = localStorage.getItem('sps_skill_questions_map');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing local storage questions map:', err);
      }
    }
    const skills: SPS_Skill[] = ['observation', 'inference', 'hypothesis', 'variables', 'operational_definition', 'interpreting_data'];
    const initialMap: Record<SPS_Skill, Question[]> = {} as any;
    skills.forEach(sk => {
      initialMap[sk] = generateQuestionsForSkill(sk);
    });
    return initialMap;
  });

  // Sync state values to localStorage for robust progression recovery
  useEffect(() => {
    localStorage.setItem('sps_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('sps_selected_skill', selectedSkill);
  }, [selectedSkill]);

  useEffect(() => {
    localStorage.setItem('sps_current_quiz_index', String(currentQuizIndex));
  }, [currentQuizIndex]);

  useEffect(() => {
    if (skillQuestionsMap) {
      localStorage.setItem('sps_skill_questions_map', JSON.stringify(skillQuestionsMap));
    }
  }, [skillQuestionsMap]);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sps_gamification_progress');
    const savedLang = localStorage.getItem('sps_gamification_lang') as Language;
    
    if (savedLang) {
      setLang(savedLang);
    }
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
      } catch (err) {
        console.error('Error parsing local storage progress:', err);
      }
    }
  }, []);

  const saveProgressToStorage = (newProg: StudentProgress) => {
    setProgress(newProg);
    localStorage.setItem('sps_gamification_progress', JSON.stringify(newProg));

    // Upsert into registered accounts pool
    setRegisteredAccounts(prev => {
      const idx = prev.findIndex(acc => acc.id === newProg.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newProg;
        return copy;
      } else {
        return [...prev, newProg];
      }
    });
  };

  // Log out current student and save state
  const handleLogout = () => {
    if (progress) {
      const currentProg = { ...progress, lastActive: new Date().toISOString().split('T')[0] };
      setRegisteredAccounts(prev => {
        const idx = prev.findIndex(acc => acc.id === currentProg.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = currentProg;
          return copy;
        } else {
          return [...prev, currentProg];
        }
      });
    }
    setProgress(null);
    localStorage.removeItem('sps_gamification_progress');
    localStorage.setItem('sps_active_tab', 'quest');
    setActiveTab('quest');
    sfx.playTap();
  };

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('sps_gamification_lang', newLang);
    sfx.playTap();
  };

  // Sound toggling wrapper
  const handleToggleMuteBtn = () => {
    const muted = toggleMute();
    setIsLobbyMuted(muted);
    sfx.playTap();
  };

  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(() => {
    const saved = localStorage.getItem('sps_how_to_play_open');
    return saved !== 'false';
  });

  const toggleHowToPlay = () => {
    const nextState = !isHowToPlayOpen;
    setIsHowToPlayOpen(nextState);
    localStorage.setItem('sps_how_to_play_open', String(nextState));
    sfx.playTap();
  };

  // Create standard multi-lingual translation map
  const uiTranslation = {
    en: {
      tagline: 'STEM Lab Science Process Skills Quest',
      loginHeader: 'Enter the Holographic SPS Lab',
      loginSub: 'Register your cadet account to begin interactive experiments, earn XP, and collect rare badges.',
       cadetName: 'Cadet Name',
      cadetNamePl: 'Enter your name...',
      selectAvatar: 'Choose your Science Mentor Avatar',
      selectClass: 'Science Grade / Class',
      enterLabBtn: 'Initialize Science Quest',
      levelLabel: 'Science Level',
      xpLabel: 'Total XP Points',
      spsDashboard: 'Quest Deck',
      missionDeck: 'Mission Log',
      badgesDeck: 'Accolade Hall',
      leaderboardDeck: 'Global Arena',
      dashboardDeck: 'Teacher Desk',
      selectSkillPrompt: 'Select a Science Process Skill (SPS) to Begin',
      currentDifficulty: 'Difficulty Level',
      questionTracker: 'Challenge {current} of {total}',
      chooseAnswer: 'Select your answer choice below:',
      checkAnswerBtn: 'Submit Hypothesis',
      nextChallengeBtn: 'Initiate Next Level',
      correctBox: '🧬 EXCELLENT HYPOTHESIS!',
      incorrectBox: '🧪 ANOMALY DETECTED!',
      resetProgress: 'Reset Progress',
      resetConfirm: 'Are you sure you want to reset all your progress, badges, and levels?',
      currentMission: 'Active Science Missions',
      missionStatus: 'Completed {curr} of {target}',
      rank: 'Rank',
      student: 'Science Cadet',
      level: 'Level',
      xp: 'XP',
      congratsBadge: 'New Badge Accolade Unlocked!',
      congratsLevel: 'Congratulations! You leveled up to Science Level {lvl}!',
      avatarNames: {
        chemist_marie: 'Prof. Marie (Chemistry)',
        botanist_flora: 'Dr. Flora (Ecology)',
        physicist_newton: 'Dr. Newton (Gravity)',
        coder_ada: 'Ada (Algorithms)'
      },
      skills: {
        observation: 'Observation',
        inference: 'Inference',
        hypothesis: 'Hypothesis',
        variables: 'Variables',
        operational_definition: 'Operational Definition',
        interpreting_data: 'Interpreting Data'
      },
      skillHeads: {
        observation: 'Observe, measure, and record visual details using senses.',
        inference: 'Deduce scientific explanations for observed patterns.',
        hypothesis: 'Formulate relation hypotheses between independent factors.',
        variables: 'Identify manipulated, responding, and constant variables.',
        operational_definition: 'Define abstract metrics by actions and outcomes.',
        interpreting_data: 'Analyze datasets, graphs, and trends.'
      },
      difficulties: {
        easy: '🟢 Easy (Level 1)',
        medium: '🟡 Medium (Level 2)',
        advanced: '🔴 Advanced (Level 3)'
      },
      helpBox: 'Need help? Ask AI Tutor',
      tutorThinking: 'Consulting the laboratory database...',
      tutorHeader: 'AI Scientific Explainer'
    },
    ms: {
      tagline: 'Misi Interaktif Kemahiran Proses Sains KPS',
      loginHeader: 'Masuki Makmal Holografik KPS',
      loginSub: 'Daftar akaun kadet anda untuk memulakan eksperimen interaktif, meraih XP, dan mengumpul lencana nadir.',
      cadetName: 'Nama Kadet',
      cadetNamePl: 'Masukkan nama anda...',
      selectAvatar: 'Pilih Avatar Mentor Sains Anda',
      selectClass: 'Tingkatan / Kelas Sains',
      enterLabBtn: 'Mulai Pengembaraan Sains',
      levelLabel: 'Tahap Sains',
      xpLabel: 'Jumlah Mata XP',
      spsDashboard: 'Dek Misi KPS',
      missionDeck: 'Log Misi',
      badgesDeck: 'Dewan Kejayaan',
      leaderboardDeck: 'Arena Global',
      dashboardDeck: 'Meja Guru',
      selectSkillPrompt: 'Pilih Kemahiran Proses Sains (KPS) untuk Bermula',
      currentDifficulty: 'Tahap Kesukaran',
      questionTracker: 'Cabaran {current} daripada {total}',
      chooseAnswer: 'Pilih jawapan anda di bawah:',
      checkAnswerBtn: 'Hantar Hipotesis',
      nextChallengeBtn: 'Mulakan Tahap Seterusnya',
      correctBox: '🧬 HIPOTESIS CEMERLANG!',
      incorrectBox: '🧪 ANOMALI DIKESAN!',
      resetProgress: 'Set Semula Kemajuan',
      resetConfirm: 'Adakah anda pasti untuk memadam semua kemajuan, lencana, dan tahap anda?',
      currentMission: 'Misi Sains Aktif',
      missionStatus: 'Selesai {curr} daripada {target}',
      rank: 'Kedudukan',
      student: 'Kadet Sains',
      level: 'Tahap',
      xp: 'XP',
      congratsBadge: 'Lencana Pencapaian Baru Dibuka!',
      congratsLevel: 'Tahniah! Anda telah naik ke Tahap Sains {lvl}!',
      avatarNames: {
        chemist_marie: 'Prof. Marie (Kimia)',
        botanist_flora: 'Dr. Flora (Ekologi)',
        physicist_newton: 'Dr. Newton (Graviti)',
        coder_ada: 'Ada (Algoritma)'
      },
      skills: {
        observation: 'Pemerhatian',
        inference: 'Inferens',
        hypothesis: 'Hipotesis',
        variables: 'Pemboleh Ubah',
        operational_definition: 'Definisi Secara Operasi',
        interpreting_data: 'Mentafsir Data'
      },
      skillHeads: {
        observation: 'Perhati, ukur dan rekod butiran fizikal menggunakan deria.',
        inference: 'Reka penjelasan saintifik bagi corak yang diperhatikan.',
        hypothesis: 'Formulasikan hipotesis hubungan antara faktor pemboleh ubah.',
        variables: 'Kenal pasti pemboleh ubah dimanipulasi, bergerak balas dan dimalarkan.',
        operational_definition: 'Definisikan ukuran abstrak melalui tindakan dan keputusan.',
        interpreting_data: 'Analisis set data, graf, dan arah aliran.'
      },
      difficulties: {
        easy: '🟢 Mudah (Tahap 1)',
        medium: '🟡 Sederhana (Tahap 2)',
        advanced: '🔴 Sukar (Tahap 3)'
      },
      helpBox: 'Perlu bantuan? Tanya Tutor AI',
      tutorThinking: 'Mengimbas pangkalan makmal sains...',
      tutorHeader: 'Penjelas Saintifik AI'
    },
    zh: {
      tagline: '科学过程技能互动与探索平台 (SPS)',
      loginHeader: '进入全息科学实验室',
      loginSub: '注册您的科学学术账户，开启科学探究，赚取奖励 XP，解锁稀有勋章成就。',
      cadetName: '科学学员姓名',
      cadetNamePl: '请输入您的姓名...',
      selectAvatar: '请选择您的科学导师',
      selectClass: '科学年级与班级',
      enterLabBtn: '初始化科学探险',
      levelLabel: '科学研究等级',
      xpLabel: '总 XP 经验值',
      spsDashboard: '科学探索台',
      missionDeck: '研究任务书',
      badgesDeck: '勋章荣誉殿堂',
      leaderboardDeck: '竞技光荣榜',
      dashboardDeck: '教师监控室',
      selectSkillPrompt: '选择一项科学过程技能 (SPS) 开启实验',
      currentDifficulty: '题目难度分级',
      questionTracker: '第 {current} 题 / 共 {total} 题',
      chooseAnswer: '请选择您的答案选项：',
      checkAnswerBtn: '提交假说 hypothesis',
      nextChallengeBtn: '进入下一个研究课题',
      correctBox: '🧬 杰出的假说！回答正确',
      incorrectBox: '🧪 发现数据异常！回答错误',
      resetProgress: '重置所有数据',
      resetConfirm: '确定要重置所有的学习进度、勋章和经验值级别吗？',
      currentMission: '进行中的研究项目',
      missionStatus: '已完成 {curr} 项 / 目标为 {target} 项',
      rank: '名次',
      student: '实验学员',
      level: '科学级别',
      xp: 'XP值',
      congratsBadge: '恭喜！解锁了新的科学勋章！',
      congratsLevel: '太棒了！您升级到了科学研究第 {lvl} 级！',
      avatarNames: {
        chemist_marie: '居里教授 (化学)',
        botanist_flora: '芙洛拉博士 (生态生殖)',
        physicist_newton: '牛顿博士 (经典引力)',
        coder_ada: '艾达 (计算分析)'
      },
      skills: {
        observation: '观察能力 (Observation)',
        inference: '推断能力 (Inference)',
        hypothesis: '提出假设 (Hypothesis)',
        variables: '控制变量 (Variables)',
        operational_definition: '操作性定义 (Operational Definition)',
        interpreting_data: '解释数据 (Interpreting Data)'
      },
      skillHeads: {
        observation: '利用感觉器官观察、测量、记录物理形态或变化。',
        inference: '对所观察到的现象或物理事实归纳科学原因。',
        hypothesis: '推导自变量与因变量之间的可测试关系陈述。',
        variables: '精准区分操纵性自变量、反应性因变量和恒定的控制变量。',
        operational_definition: '使用可操作性的活动或可视指标量化抽象科学概念。',
        interpreting_data: '分析和整理收集到的图表坐标与表格数据，并寻找规律规律。'
      },
      difficulties: {
        easy: '🟢 基础入门 ( Easy )',
        medium: '🟡 中级探索 ( Medium )',
        advanced: '🔴 高级研究 ( Advanced )'
      },
      helpBox: '解答有疑问？咨询智能 AI 导师',
      tutorThinking: '正在检索全息科学知识库...',
      tutorHeader: 'AI 智能科学导师'
    }
  }[lang];

  // Selected skill questions cache from state (supports shuffling and direct updates)
  const activeQuestionsList: Question[] = useMemo(() => {
    return skillQuestionsMap[selectedSkill] || [];
  }, [skillQuestionsMap, selectedSkill]);

  const activeQuestion: Question | undefined = useMemo(() => {
    return activeQuestionsList[currentQuizIndex];
  }, [activeQuestionsList, currentQuizIndex]);

  // AI Assistant Tutor state using @google/genai (fully integrated server-less direct AI tutoring)
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Helper inside client to fetch response using AI explaining custom concepts
  const handleConsultAiTutor = async () => {
    if (!activeQuestion) return;
    sfx.playTap();
    setAiLoading(true);
    setAiResponse(null);

    const questionDetail = JSON.stringify({
      scenario: activeQuestion.scenario?.[lang],
      question: activeQuestion.questionText?.[lang],
      options: activeQuestion.options.map(o => o[lang]),
      correctAnswer: activeQuestion.options[activeQuestion.correctIndex][lang],
      explanation: activeQuestion.explanation[lang],
      skill: uiTranslation.skills[selectedSkill]
    });

    try {
      // Proxying serverless call securely using localized system prompt
      const systemPrompt = `You are an elite Science School tutor explaining the Science Process Skill: ${uiTranslation.skills[selectedSkill]}. Explain the science concept behind this multiple choice question to a 10 year old student simply and clearly in ${lang === 'en' ? 'English' : lang === 'ms' ? 'Bahasa Melayu' : 'Mandarin Chinese'}. Mention why the correct option is indeed correct, and why observation represents real facts while inference represents underlying causes. Keep your output friendly, engaging, using bold headings, and no longer than 4 short bulleted sentences.`;
      
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionDetail,
          systemPrompt,
          lang
        })
      });

      if (!response.ok) {
        throw new Error('API server request failed');
      }

      const resData = await response.json();
      setAiResponse(resData.explanation || 'Could not fetch explanation from AI.');
    } catch (err: any) {
      console.error('Tutor search error:', err);
      // Fallback fallback if key is unauthorized
      setAiResponse(activeQuestion.explanation[lang]);
    } finally {
      setAiLoading(false);
    }
  };

  // Setup cadet registration
  const handleCadetSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) return;

    sfx.playLevelUp(); // play initial greeting melody

    const initialProgress: StudentProgress = {
      id: `cadet_${Date.now()}`,
      name: signupName.trim(),
      avatar: signupAvatar,
      xp: 0,
      level: 1,
      completedQuestions: [],
      schoolClass: signupClass,
      skillsXp: {
        observation: 0,
        inference: 0,
        hypothesis: 0,
        variables: 0,
        operational_definition: 0,
        interpreting_data: 0
      },
      skillsHistory: {
        observation: [],
        inference: [],
        hypothesis: [],
        variables: [],
        operational_definition: [],
        interpreting_data: []
      },
      earnedBadges: [],
      unlockedMissions: [],
      lastActive: new Date().toISOString().split('T')[0]
    };

    saveProgressToStorage(initialProgress);
  };

  // Handle quiz selected option verify
  const handleSubmitHypothesis = () => {
    if (!progress || !activeQuestion || selectedOption === null || isAnswerRevealed) return;

    const isCorrect = selectedOption === activeQuestion.correctIndex;
    setWasCorrect(isCorrect);
    setIsAnswerRevealed(true);

    // Setup reward
    const xpReward = activeQuestion.difficulty === 'easy' ? 100 : activeQuestion.difficulty === 'medium' ? 200 : 350;
    const finalEarnedXp = isCorrect ? xpReward : 0;

    if (isCorrect) {
      sfx.playCorrect();
    } else {
      sfx.playIncorrect();
    }

    // Clone progress state
    const updated = { ...progress };

    // Record question attempt history and timestamp
    const skillHistoryList = updated.skillsHistory[selectedSkill] || [];
    const isAlreadyPassed = updated.completedQuestions.includes(activeQuestion.id);

    skillHistoryList.push({
      questionId: activeQuestion.id,
      isCorrect,
      scoreEarned: finalEarnedXp,
      timestamp: new Date().toISOString().split('T')[0]
    });
    
    updated.skillsHistory[selectedSkill] = skillHistoryList;

    if (isCorrect && !isAlreadyPassed) {
      // Feed XP, complete successfully
      updated.completedQuestions.push(activeQuestion.id);
      updated.xp += finalEarnedXp;
      updated.skillsXp[selectedSkill] = (updated.skillsXp[selectedSkill] || 0) + finalEarnedXp;

      // Handle XP-based levels scaling
      let calculatedLevel = 1;
      if (updated.xp >= 2500) {
        calculatedLevel = 10;
      } else if (updated.xp >= 1600) {
        calculatedLevel = 5;
      } else if (updated.xp >= 1000) {
        calculatedLevel = 4;
      } else if (updated.xp >= 500) {
        calculatedLevel = 3;
      } else if (updated.xp >= 200) {
        calculatedLevel = 2;
      }

      const leveledUp = calculatedLevel > updated.level;
      if (leveledUp) {
        updated.level = calculatedLevel;
        setTimeout(() => {
          sfx.playLevelUp();
          queueNotification({
            type: 'level',
            title: lang === 'zh' ? '⭐ 等级提升！' : lang === 'ms' ? '⭐ Peningkatan Tahap Seterusnya!' : '⭐ Science Level Up!',
            subtitle: uiTranslation.congratsLevel.replace('{lvl}', String(calculatedLevel))
          });
        }, 600);
      }

      // Handle Mission progress checks
      KEY_MISSIONS.forEach(mission => {
        if (updated.unlockedMissions.includes(mission.id)) return;

        // Custom validation based on different types
        if (mission.type === 'complete_quizzes' && mission.targetSkill === selectedSkill) {
          // Count correctly answered questions in this skill
          const correctCount = updated.completedQuestions.filter(id => id.startsWith(selectedSkill)).length;
          // Check difficulty conditions for advanced mission
          if (mission.id === 'm3') {
            const correctlySolvedAdvanced = updated.completedQuestions.filter(id => id.startsWith('hypothesis') && id.endsWith('_11') || id.endsWith('_12') || id.endsWith('_13') || id.endsWith('_14') || id.endsWith('_15')).length;
            if (correctlySolvedAdvanced >= mission.reqCount) {
              updated.unlockedMissions.push(mission.id);
              updated.xp += mission.rewardXp;
              setTimeout(() => {
                sfx.playBadgeUnlock();
                queueNotification({
                  type: 'mission',
                  title: lang === 'zh' ? '🚀 探究任务圆满完成！' : lang === 'ms' ? '🚀 Misi KPS Selesai!' : '🚀 Mission Completed!',
                  subtitle: lang === 'zh'
                    ? `成功攻克优质科学过程课题: "${mission.title[lang]}"`
                    : lang === 'ms'
                    ? `Berjaya menyiapkan misi penyelidikan: "${mission.title[lang]}"`
                    : `Active Science Skill Mission Mastered: "${mission.title[lang]}"`,
                  xpReward: mission.rewardXp
                });
              }, 400);
            }
          } else {
            if (correctCount >= mission.reqCount) {
              updated.unlockedMissions.push(mission.id);
              updated.xp += mission.rewardXp;
              setTimeout(() => {
                sfx.playBadgeUnlock();
                queueNotification({
                  type: 'mission',
                  title: lang === 'zh' ? '🚀 探究任务圆满完成！' : lang === 'ms' ? '🚀 Misi KPS Selesai!' : '🚀 Mission Completed!',
                  subtitle: lang === 'zh'
                    ? `成功攻克优质科学过程课题: "${mission.title[lang]}"`
                    : lang === 'ms'
                    ? `Berjaya menyiapkan misi penyelidikan: "${mission.title[lang]}"`
                    : `Active Science Skill Mission Mastered: "${mission.title[lang]}"`,
                  xpReward: mission.rewardXp
                });
              }, 450);
            }
          }
        } else if (mission.type === 'reach_xp' && mission.id === 'm4') {
          // General 15 answers check
          if (updated.completedQuestions.length >= mission.reqCount) {
            updated.unlockedMissions.push(mission.id);
            updated.xp += mission.rewardXp;
            setTimeout(() => {
              sfx.playBadgeUnlock();
              queueNotification({
                type: 'mission',
                title: lang === 'zh' ? '🚀 探究任务圆满完成！' : lang === 'ms' ? '🚀 Misi KPS Selesai!' : '🚀 Mission Completed!',
                subtitle: lang === 'zh'
                  ? `成功攻克优质科学过程课题: "${mission.title[lang]}"`
                  : lang === 'ms'
                  ? `Berjaya menyiapkan misi penyelidikan: "${mission.title[lang]}"`
                  : `Active Science Skill Mission Mastered: "${mission.title[lang]}"`,
                xpReward: mission.rewardXp
              });
            }, 500);
          }
        }
      });

      // Handle Badge triggers
      const currentEarnedBadges = [...updated.earnedBadges];

      // First step badge
      if (!currentEarnedBadges.includes('first_step')) {
        currentEarnedBadges.push('first_step');
        setTimeout(() => {
          sfx.playBadgeUnlock();
          queueNotification({
            type: 'badge',
            title: lang === 'zh' ? '🏆 崭露头角勋章已解锁！' : lang === 'ms' ? '🏆 Lencana Pertama Diaktifkan!' : '🏆 First Step Badge Unlocked!',
            subtitle: ALL_BADGES[0].name[lang],
            badgeId: 'first_step'
          });
        }, 1200);
      }

      // Check skill completion count for individual accolades
      const skillCounts: Record<SPS_Skill, number> = {
        observation: 0, inference: 0, hypothesis: 0, variables: 0, operational_definition: 0, interpreting_data: 0
      };
      
      updated.completedQuestions.forEach(qId => {
        const skillKey = qId.split('_q_')[0] as SPS_Skill;
        if (skillCounts[skillKey] !== undefined) {
          skillCounts[skillKey] += 1;
        }
      });

      // 5 corrects in any of the 6 core skills triggering their specific badge
      const skillBadgeMap: Record<SPS_Skill, BadgeId> = {
        observation: 'observer_badge',
        inference: 'detective_badge',
        hypothesis: 'theorist_badge',
        variables: 'control_master',
        operational_definition: 'definer_badge',
        interpreting_data: 'data_wizard'
      };

      Object.keys(skillBadgeMap).forEach(key => {
        const sk = key as SPS_Skill;
        const badgeId = skillBadgeMap[sk];
        if (skillCounts[sk] >= 5 && !currentEarnedBadges.includes(badgeId)) {
          currentEarnedBadges.push(badgeId);
          setTimeout(() => {
            sfx.playBadgeUnlock();
            const badgeMeta = ALL_BADGES.find(b => b.id === badgeId);
            queueNotification({
              type: 'badge',
              title: lang === 'zh' ? '🏆 卓越科学探究勋章！' : lang === 'ms' ? '🏆 Pencapaian Cemerlang Lencana!' : '🏆 Outstanding Acumen Badge!',
              subtitle: badgeMeta?.name[lang] || '',
              badgeId: badgeId
            });
          }, 1500);
        }
      });

      // Level 5 badge check
      if (updated.level >= 5 && !currentEarnedBadges.includes('halfway_there')) {
        currentEarnedBadges.push('halfway_there');
        setTimeout(() => {
          sfx.playBadgeUnlock();
          const badgeMeta = ALL_BADGES.find(b => b.id === 'halfway_there');
          queueNotification({
            type: 'badge',
            title: lang === 'zh' ? '🏆 勋章解锁！' : lang === 'ms' ? '🏆 Lencana Diaktifkan!' : '🏆 Badge Unlocked!',
            subtitle: badgeMeta?.name[lang] || '',
            badgeId: 'halfway_there'
          });
        }, 1600);
      }

      // Master of science 2500 XP check
      if (updated.xp >= 2500 && !currentEarnedBadges.includes('sps_champion')) {
        currentEarnedBadges.push('sps_champion');
        setTimeout(() => {
          sfx.playBadgeUnlock();
          const badgeMeta = ALL_BADGES.find(b => b.id === 'sps_champion');
          queueNotification({
            type: 'badge',
            title: lang === 'zh' ? '👑 科学研究总冠军勋章！' : lang === 'ms' ? '👑 Juara Penyelidikan Agung!' : '👑 Science Champion Badge!',
            subtitle: badgeMeta?.name[lang] || '',
            badgeId: 'sps_champion'
          });
        }, 1700);
      }

      updated.earnedBadges = currentEarnedBadges;
    }

    updated.lastActive = new Date().toISOString().split('T')[0];
    saveProgressToStorage(updated);
  };

  // Jump to next index
  const handleProceedQuiz = () => {
    setAiResponse(null);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    
    // Choose next question
    if (activeQuestionsList && activeQuestionsList.length > 0 && currentQuizIndex < activeQuestionsList.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      // Loop back
      setCurrentQuizIndex(0);
      queueNotification({
        type: 'mission',
        title: lang === 'zh' ? '🎉 通关星章！' : lang === 'ms' ? '🎉 Melengkapkan Bab!' : '🎉 Segment Mastery!',
        subtitle: lang === 'zh' ? '恭喜！您已在当前科学方法单元中顺利完成了全部 15 级探究题目！' : lang === 'ms' ? 'Tahniah! Anda telah melengkapkan kesemua 15 soalan dalam bahagian ini!' : 'Congratulations! You successfully finished all 15 science process levels in this hub!'
      });
    }
    sfx.playTap();
  };

  // Change active skill portal
  const handleSelectSpsSkill = (sk: SPS_Skill) => {
    setSelectedSkill(sk);
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setAiResponse(null);
    sfx.playTap();
  };

  // Helper to shuffle questions for a specific skill
  const handleShuffleSkillQuestions = (skillToShuffle?: SPS_Skill) => {
    const target = skillToShuffle || selectedSkill;
    const questions = [...(skillQuestionsMap[target] || [])];
    
    // Fisher-Yates Shuffle
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    
    setSkillQuestionsMap(prev => ({
      ...prev,
      [target]: questions
    }));
    
    // Reset quiz active index and reveals
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setAiResponse(null);
    sfx.playTap();
  };

  const clearDatabase = () => {
    if (confirm(uiTranslation.resetConfirm)) {
      localStorage.removeItem('sps_gamification_progress');
      localStorage.removeItem('sps_active_tab');
      localStorage.removeItem('sps_selected_skill');
      localStorage.removeItem('sps_current_quiz_index');
      localStorage.removeItem('sps_skill_questions_map');
      
      setProgress(null);
      setActiveTab('quest');
      setSelectedSkill('observation');
      setCurrentQuizIndex(0);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setAiResponse(null);

      // Re-initialize questions to standard
      const skills: SPS_Skill[] = ['observation', 'inference', 'hypothesis', 'variables', 'operational_definition', 'interpreting_data'];
      const initialMap: Record<SPS_Skill, Question[]> = {} as any;
      skills.forEach(sk => {
        initialMap[sk] = generateQuestionsForSkill(sk);
      });
      setSkillQuestionsMap(initialMap);

      sfx.playIncorrect();
    }
  };

  // Generate virtual leader list dynamically linking player's current scores & other local accounts
  const fullLeaderboardList = useMemo(() => {
    // Start with the base list
    const items = [...VIRTUAL_LEADERBOARD];
    
    // Merge all registered students that are NOT already in the leaderboard
    registeredAccounts.forEach(acc => {
      const existingIdx = items.findIndex(v => v.id === acc.id);
      const isCurrent = progress && acc.id === progress.id;
      const displayName = isCurrent ? `${acc.name} (You)` : acc.name;
      
      const convertedEntry = {
        id: acc.id,
        name: displayName,
        avatar: acc.avatar,
        level: acc.level,
        xp: acc.xp,
        schoolClass: acc.schoolClass,
        isCurrentUser: !!isCurrent
      };

      if (existingIdx >= 0) {
        items[existingIdx] = convertedEntry;
      } else {
        items.push(convertedEntry);
      }
    });

    // If for some reason progress isn't in registeredAccounts yet, still add it
    if (progress && !registeredAccounts.some(acc => acc.id === progress.id)) {
      items.push({
        id: progress.id,
        name: `${progress.name} (You)`,
        avatar: progress.avatar,
        level: progress.level,
        xp: progress.xp,
        schoolClass: progress.schoolClass,
        isCurrentUser: true
      });
    }

    // Sort by total XP descending 
    return items.sort((a, b) => b.xp - a.xp);
  }, [progress, registeredAccounts]);

  const handleSelectProfile = (profile: StudentProgress) => {
    sfx.playLevelUp();
    saveProgressToStorage(profile);
  };

  const handleDeleteProfile = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent logging in
    if (confirm(lang === 'zh' ? '确定要删除该学员的所有进度吗？此操作不可撤销。' : lang === 'ms' ? 'Padam rekod profil murid ini?' : 'Are you sure you want to delete this student profile? This cannot be undone.')) {
      setRegisteredAccounts(prev => prev.filter(acc => acc.id !== profileId));
      sfx.playIncorrect();
    }
  };

  // Sign up layout
  if (!progress) {
    return (
      <div id="classroom-signup-deck" className="min-h-screen bg-gradient-to-br from-[#0c0d24] via-[#12163b] to-[#040612] text-slate-100 flex flex-col justify-between p-4 selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden">
        {/* Background glowing sci-fi graphics - increased opacity for high vibrancy */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-fuchsia-500/10 blur-[110px] pointer-events-none" />

        {/* Global Lang Toolbar */}
        <div className="max-w-4xl mx-auto w-full flex justify-between items-center py-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 h-9 w-9 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/10">
              <Icons.Atom className="h-5 w-5 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">🔬 {lang === 'zh' ? '高能科学实验室' : lang === 'ms' ? 'KABIN SAINS AKTIF' : 'ACTIVE SCIENCE PLATFORM'} v2.0</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-white/5 p-1 rounded-xl">
            <button 
              onClick={() => changeLanguage('en')} 
              className={`text-[9.5px] font-mono px-3 py-1 rounded-lg font-bold transition-all ${lang === 'en' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-550 hover:text-white'}`}
            >
              ENGLISH
            </button>
            <button 
              onClick={() => changeLanguage('ms')} 
              className={`text-[9.5px] font-mono px-3 py-1 rounded-lg font-bold transition-all ${lang === 'ms' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-550 hover:text-white'}`}
            >
              MELAYU
            </button>
            <button 
              onClick={() => changeLanguage('zh')} 
              className={`text-[9.5px] font-mono px-3 py-1 rounded-lg font-bold transition-all ${lang === 'zh' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-550 hover:text-white'}`}
            >
              中文
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-md mx-auto w-full py-6 relative z-10 my-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            <div className="text-center space-y-2.5 border-b border-white/15 pb-5">
              <span className="text-[10px] tracking-widest font-mono text-cyan-400 uppercase font-black block">
                🚀 {uiTranslation.tagline}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-mono">
                {uiTranslation.loginHeader}
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto font-sans">
                {uiTranslation.loginSub}
              </p>
            </div>

            {/* TAB SELECTOR: Show only if registered student profiles exist */}
            {registeredAccounts.length > 0 && (
              <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => { setSignupMode('login'); sfx.playTap(); }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-center text-[10px] font-bold font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    signupMode === 'login'
                      ? 'bg-slate-800 text-cyan-300 border border-white/5 shadow-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  👥 {lang === 'zh' ? '选择学员登录' : lang === 'ms' ? 'PILIH KADET' : 'SELECT STUDENT'}
                </button>
                <button
                  type="button"
                  onClick={() => { setSignupMode('register'); sfx.playTap(); }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-center text-[10px] font-bold font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    signupMode === 'register'
                      ? 'bg-slate-800 text-cyan-300 border border-white/5 shadow-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  🚀 {lang === 'zh' ? '新学员注册' : lang === 'ms' ? 'DAFTAR BARU' : 'REGISTER NEW'}
                </button>
              </div>
            )}

            {signupMode === 'login' && registeredAccounts.length > 0 ? (
              /* Profile select mode */
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                  <span>{lang === 'zh' ? '点击名字选择学员登录' : lang === 'ms' ? 'KETIK PROFIL UNTUK MULA' : 'CLICK PROFILE TO ENTER'}</span>
                  <span className="text-cyan-400 text-[9px] bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/10">
                    {registeredAccounts.length} {lang === 'zh' ? '人已注册' : lang === 'ms' ? 'Kadet' : 'Profiles'}
                  </span>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {registeredAccounts.map((acc) => {
                    const avatarSymbol = acc.avatar === 'chemist_marie' ? '🧪' : acc.avatar === 'botanist_flora' ? '🌿' : acc.avatar === 'physicist_newton' ? '🍎' : '💻';
                    return (
                      <div
                        key={acc.id}
                        onClick={() => handleSelectProfile(acc)}
                        className="group relative w-full bg-slate-950/40 border border-white/5 hover:border-violet-500/50 hover:bg-violet-950/20 p-3 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer active:scale-99 shadow-inner"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 shrink-0 flex items-center justify-center bg-slate-900 border border-white/10 rounded-lg text-lg shadow group-hover:scale-105 transition-transform">
                            {avatarSymbol}
                          </div>
                          <div className="min-w-0 text-left">
                            <span className="text-xs font-bold text-slate-100 block group-hover:text-cyan-300 transition-colors truncate">
                              {acc.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 block truncate leading-none mt-0.5">
                              {acc.schoolClass} • <strong className="text-amber-400 font-bold font-mono">Lv {acc.level}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] font-mono text-cyan-400 font-bold bg-cyan-950/20 px-1.5 py-0.5 rounded border border-cyan-500/10">
                            {acc.xp} XP
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProfile(acc.id, e)}
                            className="p-1 px-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete profile"
                          >
                            <Icons.Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Register Mode Form */
              <form onSubmit={handleCadetSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5 leading-none">
                    <Icons.User className="h-3.5 w-3.5 text-slate-500" />
                    {uiTranslation.cadetName}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={uiTranslation.cadetNamePl}
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400 transition-colors focus:ring-1 focus:ring-indigo-400 p-3.5 rounded-xl text-xs font-semibold"
                    maxLength={18}
                  />
                </div>

                {/* Class Sector Custom Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5 leading-none">
                    <Icons.Notebook className="h-3.5 w-3.5 text-slate-500" />
                    {uiTranslation.selectClass}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'zh' ? '请输入年级与班级（例如：五年级甲班）' : lang === 'ms' ? 'Masukkan tingkatan / kelas anda' : 'Enter your class/grade (e.g. Year 5 Cosmos)'}
                    value={signupClass}
                    onChange={(e) => setSignupClass(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 text-xs p-3.5 rounded-xl text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 font-semibold"
                    maxLength={25}
                  />
                </div>

                {/* Choose Science Avatar */}
                <div className="space-y-3 pb-2">
                  <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block leading-none">
                    🛡️ {uiTranslation.selectAvatar}
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'chemist_marie', label: uiTranslation.avatarNames.chemist_marie, icon: '🧪' },
                      { id: 'botanist_flora', label: uiTranslation.avatarNames.botanist_flora, icon: '🌿' },
                      { id: 'physicist_newton', label: uiTranslation.avatarNames.physicist_newton, icon: '🍎' },
                      { id: 'coder_ada', label: uiTranslation.avatarNames.coder_ada, icon: '💻' }
                    ].map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => { setSignupAvatar(av.id); sfx.playTap(); }}
                        className={`p-3 rounded-2xl border flex flex-col justify-between h-20 transition-all text-left cursor-pointer ${
                          signupAvatar === av.id 
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] text-white font-bold' 
                            : 'bg-slate-950/50 border-white/5 hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xl">{av.icon}</span>
                        <span className="text-[10px] font-mono font-bold tracking-tight leading-tight truncate w-full">{av.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-98 text-white font-bold p-3.5 rounded-xl text-xs font-mono uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-500/20 border border-blue-400/20"
                >
                  ⚡ {uiTranslation.enterLabBtn}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-[9px] text-slate-600 font-mono tracking-widest uppercase">
          Made for Science Educators • English • Melayu • 中文
        </div>
      </div>
    );
  }

  // Active Main Dashboard Panel Layout 
  return (
    <div id="holograma-lab-main" className="min-h-screen bg-gradient-to-br from-[#090b1c] via-[#101438] to-[#04050d] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Background radial overlays - boosted for rich science laboratory vibes */}
      <div className="absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-violet-500/15 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[110px] pointer-events-none" />

      {/* Primary Science Dashboard Navbar */}
      <header className="h-20 bg-slate-900/80 border-b border-white/10 flex items-center justify-between px-4 sm:px-8 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Icons.Atom className="w-8 h-8 text-white animate-spin stroke-[2]" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-mono">
                SMART SPS LAB
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                {lang === 'zh' ? '科学过程技能实验室 v2.0' : lang === 'ms' ? 'KABIN KPS: MAKMAL INTERAKTIF' : 'Science Process Skills v2.0'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Level Badge and progress fill line */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-amber-400 font-bold text-sm tracking-tight">LVL {progress.level}</span>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden mt-1 flex">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((progress.xp % 1000) / 10, 100)}%` }} 
                />
              </div>
            </div>

            {/* XP button */}
            <div className="bg-indigo-600 px-4 py-2 rounded-lg border border-indigo-400/30 flex items-center gap-3 shadow-lg shadow-indigo-600/20">
              <span className="text-xs font-bold font-mono text-white whitespace-nowrap">{progress.xp} XP</span>
            </div>

            {/* Audio Toggle, Reset, and Language controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMuteBtn}
                className="p-1.5 rounded-full bg-slate-800 border border-white/5 text-slate-400 hover:text-white transition-all shadow hidden sm:block pointer-events-auto"
                title="Toggle SFX Mute"
              >
                {isLobbyMuted ? <Icons.VolumeX className="h-4 w-4" /> : <Icons.Volume2 className="h-4 w-4 text-emerald-400" />}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[9px] sm:text-xs font-mono border border-emerald-500/30 text-emerald-300 bg-emerald-950/20 hover:bg-emerald-900/35 hover:text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all font-bold cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95"
                title={lang === 'zh' ? '点击此处：注销当前账号并让新学生注册姓名' : lang === 'ms' ? 'Klik untuk tukar nama murid / daftar baru' : 'Click here for another student to sign in / enter their name'}
              >
                <Icons.UserMinus className="h-3.5 w-3.5" />
                <span>
                  {lang === 'zh' ? '切换学员 / 重置' : lang === 'ms' ? 'Tukar Murid' : 'Change Student'}
                </span>
              </button>

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/smart-sps-lab.html';
                  link.download = 'smart-sps-lab.html';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  sfx.playLevelUp();
                }}
                className="flex items-center gap-1.5 text-[9px] sm:text-xs font-mono border border-cyan-500/30 text-cyan-300 bg-cyan-950/20 hover:bg-cyan-900/35 hover:text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all font-bold cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10 active:scale-95"
                title={lang === 'zh' ? '下载完全单文件离线 HTML - 无需网络，双击电脑即可玩！' : lang === 'ms' ? 'Muat turun fail tunggal HTML offline - main tanpa internet!' : 'Download single-file Offline HTML - play anywhere without internet!'}
              >
                <Icons.Download className="h-3.5 w-3.5 animate-pulse" />
                <span>
                  {lang === 'zh' ? '下载单文件 HTML' : lang === 'ms' ? 'Muat Turun HTML' : 'Export HTML'}
                </span>
              </button>

              {/* Language selections matching Design */}
              <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                {(['en', 'ms', 'zh'] as Language[]).map(l => (
                  <button
                    key={l}
                    onClick={() => changeLanguage(l)}
                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                      lang === l ? 'bg-slate-700 text-white font-extrabold shadow-sm' : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Compact dynamic cadets banner with avatar info */}
      <section className="bg-slate-900/30 border-b border-white/5 py-3 px-4 relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto w-full flex flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-white/10 text-xl shadow-md">
              {progress.avatar === 'chemist_marie' ? '🧪' : progress.avatar === 'botanist_flora' ? '🌿' : progress.avatar === 'physicist_newton' ? '🍎' : '💻'}
            </div>

            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                {progress.name} 
                <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
                  {progress.schoolClass}
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">
                Mentor: {uiTranslation.avatarNames[progress.avatar as keyof typeof uiTranslation.avatarNames]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
            <div className="flex gap-4">
              <span>🚀 Corrects: <strong className="text-emerald-400 font-bold">{progress.completedQuestions.length}</strong></span>
              <span>🏆 Accolades: <strong className="text-amber-400 font-bold">{progress.earnedBadges.length}</strong></span>
              <button 
                onClick={handleLogout} 
                className="text-emerald-400 hover:text-emerald-300 hover:underline font-mono text-[9px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Icons.LogOut className="h-3 w-3" />
                <span>{lang === 'zh' ? '新学员登录' : lang === 'ms' ? 'Tukar Murid' : 'Change Student'}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main Core Content Desk */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        
        {/* Left Column Navigation & Sidebar widgets */}
        <nav className="col-span-1 lg:col-span-3 space-y-4">
          
          {/* Menu link cards */}
          <div className="space-y-2">
            <button
              onClick={() => { setActiveTab('quest'); sfx.playTap(); }}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold font-mono tracking-wide flex items-center justify-between border cursor-pointer transition-all ${
                activeTab === 'quest' 
                  ? 'bg-indigo-600 border-indigo-400 bg-opacity-100 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-900/50 border-white/5 hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icons.Binary className="h-4 w-4" />
                {uiTranslation.spsDashboard}
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${activeTab === 'quest' ? 'bg-white/20 text-white' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}>SPS</span>
            </button>

            <button
              onClick={() => { setActiveTab('missions'); sfx.playTap(); }}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold font-mono tracking-wide flex items-center justify-between border cursor-pointer transition-all ${
                activeTab === 'missions' 
                  ? 'bg-indigo-600 border-indigo-400 bg-opacity-100 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-900/50 border-white/5 hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icons.Rocket className="h-4 w-4" />
                {uiTranslation.missionDeck}
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${activeTab === 'missions' ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/20'}`}>
                {progress.unlockedMissions.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('badges'); sfx.playTap(); }}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold font-mono tracking-wide flex items-center justify-between border cursor-pointer transition-all ${
                activeTab === 'badges' 
                  ? 'bg-indigo-600 border-indigo-400 bg-opacity-100 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-900/50 border-white/5 hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icons.Trophy className="h-4 w-4" />
                {uiTranslation.badgesDeck}
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${activeTab === 'badges' ? 'bg-white/20 text-white' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}>
                {progress.earnedBadges.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('leaderboard'); sfx.playTap(); }}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold font-mono tracking-wide flex items-center justify-between border cursor-pointer transition-all ${
                activeTab === 'leaderboard' 
                  ? 'bg-indigo-600 border-indigo-400 bg-opacity-100 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-900/50 border-white/5 hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icons.Activity className="h-4 w-4" />
                {uiTranslation.leaderboardDeck}
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${activeTab === 'leaderboard' ? 'bg-white/20 text-white' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}>RANK</span>
            </button>

            <button
              onClick={() => { setActiveTab('dashboard'); sfx.playTap(); }}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold font-mono tracking-wide flex items-center justify-between border cursor-pointer transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-indigo-600 border-indigo-400 bg-opacity-100 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-900/50 border-white/5 hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icons.Users className="h-4 w-4" />
                {uiTranslation.dashboardDeck}
              </div>
              <span className="text-[8px] font-sans px-1.5 bg-red-500 text-white font-extrabold rounded">LIVE TE</span>
            </button>
          </div>

          {/* Active Missions widget - matching Design HTML */}
          <div className="hidden lg:block bg-slate-900/50 p-5 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
              <Icons.Rocket className="h-3.5 w-3.5 text-slate-500 animate-bounce" />
              {lang === 'zh' ? '当前科学任务' : lang === 'ms' ? 'Misi Aktif KPS' : 'Active Missions'}
            </h3>
            <div className="space-y-3">
              {KEY_MISSIONS.slice(0, 2).map((m) => {
                const isCompleted = progress.unlockedMissions.includes(m.id);
                // calculate progress %
                let currentCount = 0;
                if (m.type === 'complete_quizzes' && m.targetSkill) {
                  currentCount = progress.completedQuestions.filter(id => id.startsWith(m.targetSkill!)).length;
                } else if (m.type === 'reach_xp') {
                  currentCount = progress.completedQuestions.length;
                }
                const targetVal = m.reqCount;
                const displayPercent = Math.min(Math.round((currentCount / targetVal) * 100), 100);

                return (
                  <div key={m.id} className={`p-3 rounded-2xl border transition-all ${
                    isCompleted 
                      ? 'bg-emerald-500/10 border-emerald-500/35' 
                      : 'bg-indigo-500/10 border-indigo-500/20'
                  }`}>
                    <div className="flex justify-between items-center mb-1.5 select-none">
                      <span className="text-[11px] font-semibold text-slate-200 truncate pr-2" title={m.title[lang]}>
                        {m.title[lang]}
                      </span>
                      <span className={`text-[9px] font-bold ${isCompleted ? 'text-emerald-400' : 'text-indigo-400'}`}>
                        {displayPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-emerald-400' : 'bg-indigo-500'}`} 
                        style={{ width: `${displayPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements widget - matching Design HTML */}
          <div className="hidden lg:block bg-slate-900/50 p-5 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 select-none font-sans">
              <Icons.Trophy className="h-3.5 w-3.5 text-slate-400" />
              {lang === 'zh' ? '最新解锁勋章' : lang === 'ms' ? 'Pencapaian Lencana' : 'Achievements'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {ALL_BADGES.slice(0, 2).map((badge) => {
                const isUnlocked = progress.earnedBadges.includes(badge.id);
                return (
                  <div 
                    key={badge.id} 
                    onClick={() => { setActiveTab('badges'); sfx.playTap(); }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center border cursor-pointer select-none transition-all ${
                      isUnlocked 
                        ? 'bg-slate-800/80 border-white/10 hover:border-amber-500/45 text-white/90 shadow' 
                        : 'bg-slate-800/20 border-white/5 opacity-40 hover:opacity-100 text-slate-400'
                    }`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center mb-1 ${isUnlocked ? 'text-amber-400' : 'text-slate-650'}`}>
                      {badge.id === 'first_step' ? <Icons.Sparkles className="h-6 w-6" /> : <Icons.Award className="h-6 w-6" />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight truncate w-full">
                      {badge.name[lang].substring(0, 10)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collapsible How to Play Guide */}
          <div className="hidden lg:block bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden transition-all duration-300">
            <button 
              onClick={toggleHowToPlay}
              className="w-full p-5 flex items-center justify-between text-left text-xs font-bold font-mono tracking-widest text-slate-450 hover:text-white uppercase select-none cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Icons.HelpCircle className="h-4 w-4 text-indigo-400" />
                {lang === 'zh' ? '物理量子实验室指南' : lang === 'ms' ? 'Panduan Bermain KPS' : 'How To Play Game'}
              </span>
              <span className="text-slate-400 font-mono text-base font-black">
                {isHowToPlayOpen ? '−' : '+'}
              </span>
            </button>

            {isHowToPlayOpen && (
              <div className="px-5 pb-5 pt-0 space-y-4 text-[10px] leading-relaxed text-slate-300 border-t border-white/5 font-sans">
                <div className="text-slate-400 font-mono text-[8px] uppercase tracking-wider pb-1.5 border-b border-white/5 select-none">
                  🛡️ {lang === 'zh' ? '科学训练营核心手册' : lang === 'ms' ? 'Manual Diagnostik Kadet KPS' : 'STEM Cadet Mission Manual'}
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 font-bold text-indigo-400 font-mono text-[9px]">
                      <span>01.</span>
                      <span>{lang === 'zh' ? '选择过程技能' : lang === 'ms' ? 'Pilih Kemahiran KPS' : 'SELECT PROCESS SKILL'}</span>
                    </div>
                    <p className="pl-3.5 text-slate-400 font-medium">
                      {lang === 'zh' 
                        ? '在Quest主控制台选择6项核心科学过程技能之一开始你的诊断挑战。' 
                        : lang === 'ms' 
                        ? 'Pilih satu daripada 6 dimensi Kemahiran KPS di konsol utama untuk mula cabaran.' 
                        : 'Choose one of 6 process skills on the quest desk to initiate your diagnostic quest.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 font-bold text-indigo-400 font-mono text-[9px]">
                      <span>02.</span>
                      <span>{lang === 'zh' ? '观测全息图像' : lang === 'ms' ? 'Siasat Hologram' : 'INSPECT HOLOGRAPHIC DIAGRAM'}</span>
                    </div>
                    <p className="pl-3.5 text-slate-400 font-medium">
                      {lang === 'zh' 
                        ? '仔细看左侧的全息模拟。它会根据每一道题目的微调物理场景、变量或数据图表，实时进行同步更新动画！' 
                        : lang === 'ms' 
                        ? 'Lihat unjuran simulasi hologram di sebelah kiri. Ia berubah mengikut soalan semasa!' 
                        : 'Examine the live interactive simulation card on the left. It updates variables and plots in real-time for each challenge!'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 font-bold text-indigo-400 font-mono text-[9px]">
                      <span>03.</span>
                      <span>{lang === 'zh' ? '提交实验答案' : lang === 'ms' ? 'Selesaikan Misi' : 'SUBMIT REASONED ANSWER'}</span>
                    </div>
                    <p className="pl-3.5 text-slate-400 font-medium">
                      {lang === 'zh' 
                        ? '阅读多语言科研案例与选项，做出科学理性的推论或假设，选出最客观的一项。' 
                        : lang === 'ms' 
                        ? 'Baca senario eksperimen dan jawapan pilihan dengan logik fizik yang paling teliti.' 
                        : 'Analyze the case scenario carefully. Select the most scientifically valid and objective statement.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 font-bold text-indigo-400 font-mono text-[9px]">
                      <span>04.</span>
                      <span>{lang === 'zh' ? '解锁成就与勋章' : lang === 'ms' ? 'Lencana Latihan KPS' : 'EARN XP & UNLOCK ACHIEVEMENTS'}</span>
                    </div>
                    <p className="pl-3.5 text-slate-400 font-medium">
                      {lang === 'zh' 
                        ? '回答正确赢取 XP 并解锁珍贵的科学勋章，提升你的周度任务级别，冲刺全球排行榜。' 
                        : lang === 'ms' 
                        ? 'Dapatkan ganjaran XP, kumpul lencana kelayakan sains, dan naikkan kedudukan tangga anda!' 
                        : 'Earn point XP for correct answers. Collect rare badges, complete missions, and climb the Leaderboard!'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 font-bold text-indigo-400 font-mono text-[9px]">
                      <span>05.</span>
                      <span>{lang === 'zh' ? '咨询AI科学顾问' : lang === 'ms' ? 'Rujuk Mentor AI' : 'ASK THE AI SCIENTIFIC EXPLORER'}</span>
                    </div>
                    <p className="pl-3.5 text-slate-400 font-medium">
                      {lang === 'zh' 
                        ? '对题目有疑问？点击插图底部的“AI 导师”按钮，获取通俗易懂的图解说明与启发引导。' 
                        : lang === 'ms' 
                        ? 'Keliru? Tekan butang AI di bawah gambar rajah untuk penjelasan ringkas dan mesra daripada mentor AI.' 
                        : 'Trouble with a concept? Click the AI Scientific Explainer below the illustration for friendly guiding explanations!'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </nav>

        {/* Real-time Dynamic View Body */}
        <section className="col-span-1 lg:col-span-6 rounded-3xl bg-slate-900/30 border border-white/5 p-4 sm:p-5 min-h-[480px]">
          <AnimatePresence mode="wait">
            
            {/* 1. SPS QUESTING TAB */}
            {activeTab === 'quest' && (
              <motion.div
                key="tab-quest"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Horizontal Skill Carousel Picker Selector */}
                <div className="space-y-4 bg-slate-900/50 border border-white/5 p-4 sm:p-5 rounded-3xl">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider font-extrabold select-none">
                    🎛️ {uiTranslation.selectSkillPrompt}
                  </span>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { key: 'observation', title: uiTranslation.skills.observation, desc: { en: 'Master the art of seeing.', ms: 'Kuasai seni memerhati.', zh: '掌握精细观察的艺术。' }[lang], bg: 'rose', icon: '👁️' },
                      { key: 'inference', title: uiTranslation.skills.inference, desc: { en: 'The logic behind clues.', ms: 'Logik di sebalik petunjuk.', zh: '寻找隐藏线索的科学推断。' }[lang], bg: 'blue', icon: '🔎' },
                      { key: 'hypothesis', title: uiTranslation.skills.hypothesis, desc: { en: 'Predict the outcome.', ms: 'Ramalkan hasil eksperimen.', zh: '预测变量间的探究性因果假设。' }[lang], bg: 'purple', icon: '💡' },
                      { key: 'variables', title: uiTranslation.skills.variables, desc: { en: 'Control the experiment.', ms: 'Kawal angkubah eksperimen.', zh: '明确并精准控制科学变量。' }[lang], bg: 'amber', icon: '⚖️' },
                      { key: 'operational_definition', title: uiTranslation.skills.operational_definition, desc: { en: 'Define the measurement.', ms: 'Takrifkan metrik operasi.', zh: '定制具体的实验测量物理操作。' }[lang], bg: 'emerald', icon: '📖' },
                      { key: 'interpreting_data', title: uiTranslation.skills.interpreting_data, desc: { en: 'Read the patterns.', ms: 'Mentafsir corak data.', zh: '分析图表以及挖掘实验趋势。' }[lang], bg: 'cyan', icon: '📊' }
                    ].map(item => {
                      const isActive = selectedSkill === item.key;
                      const solvedCountInSkill = progress.completedQuestions.filter(id => id.startsWith(item.key)).length;
                      
                      // Mastery tier label
                      let masteryTier = 'Novice';
                      if (solvedCountInSkill === 15) masteryTier = 'Mastered';
                      else if (solvedCountInSkill >= 10) masteryTier = 'Advanced';
                      else if (solvedCountInSkill >= 5) masteryTier = 'Intermediate';
                      else if (solvedCountInSkill > 0) masteryTier = 'Novice';
                      else masteryTier = 'Locked';

                      // Mapped color options matching Vibrant Palette 
                      const activeStyles = {
                        rose: 'bg-rose-550 border-white text-white shadow-xl shadow-rose-900/40 scale-[1.02] border-2',
                        blue: 'bg-blue-500 border-white text-white shadow-xl shadow-blue-900/40 scale-[1.02] border-2',
                        purple: 'bg-purple-500 border-white text-white shadow-xl shadow-purple-900/40 scale-[1.02] border-2',
                        amber: 'bg-amber-500 border-white text-white shadow-xl shadow-amber-900/40 scale-[1.02] border-2',
                        emerald: 'bg-emerald-500 border-white text-white shadow-xl shadow-emerald-900/40 scale-[1.02] border-2',
                        cyan: 'bg-cyan-500 border-white text-white shadow-xl shadow-cyan-900/40 scale-[1.02] border-2'
                      };
                      
                      const inactiveStyles = {
                        rose: 'bg-rose-500/10 border-rose-500/20 text-rose-200 hover:bg-rose-500/20',
                        blue: 'bg-blue-500/10 border-blue-500/20 text-blue-200 hover:bg-blue-500/20',
                        purple: 'bg-purple-500/10 border-purple-500/20 text-purple-200 hover:bg-purple-500/20',
                        amber: 'bg-amber-500/10 border-amber-500/20 text-amber-250 hover:bg-amber-500/20',
                        emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20',
                        cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20'
                      };

                      const currentStyle = isActive ? activeStyles[item.bg as keyof typeof activeStyles] : inactiveStyles[item.bg as keyof typeof inactiveStyles];

                      return (
                        <button
                          key={item.key}
                          onClick={() => { handleSelectSpsSkill(item.key as SPS_Skill); sfx.playTap(); }}
                          className={`rounded-2xl p-3 text-left border flex flex-col justify-between h-32 transition-all duration-200 cursor-pointer relative overflow-hidden group select-none ${currentStyle}`}
                        >
                          <div className="relative z-10 flex flex-col h-full justify-between w-full">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xl sm:text-2xl">{item.icon}</span>
                                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />}
                              </div>
                              <h4 className="text-[11px] font-bold font-sans tracking-tight mt-1 truncate">{item.title}</h4>
                              <p className={`text-[8.5px] line-clamp-2 mt-0.5 leading-tight ${isActive ? 'text-white/80' : 'text-slate-400 font-medium'}`}>
                                {item.desc}
                              </p>
                            </div>
                            
                            <div className="flex justify-between items-center text-[8.5px] font-mono font-bold mt-auto pt-1 w-full border-t border-white/10">
                              <span>{solvedCountInSkill}/15 PASSED</span>
                              <span className={`px-1.5 py-0.2 rounded text-[7px] font-semibold uppercase ${isActive ? 'bg-white/20 text-white' : 'bg-slate-900/40 text-slate-400'}`}>
                                {masteryTier}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Descriptions block explaining currently selected SPS capability */}
                  <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-350">
                      <Icons.Compass className="h-4 w-4 text-cyan-400 animate-pulse" />
                      <span className="font-medium">{uiTranslation.skillHeads[selectedSkill]}</span>
                    </div>
                  </div>
                </div>

                {/* Experimental visual lab stage & Quiz layout */}
                {activeQuestion ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* Left: Beautiful animated science lab illustrator */}
                    <div className="md:col-span-5 space-y-4">
                      <SPSIllustrations 
                        skill={selectedSkill} 
                        lang={lang} 
                        questionIndex={currentQuizIndex}
                        activeQuestion={activeQuestion}
                      />

                      {/* AI Chat explainer card */}
                      <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] tracking-wider font-mono uppercase text-slate-400 font-bold">
                            🤖 AI Tutor desk
                          </span>
                          {!aiLoading && !aiResponse && (
                            <button
                              onClick={handleConsultAiTutor}
                              className="text-[10px] font-mono font-bold text-violet-400 hover:text-white flex items-center gap-1"
                            >
                              <Icons.HelpCircle className="h-3.5 w-3.5" />
                              {uiTranslation.helpBox}
                            </button>
                          )}
                        </div>

                        {aiLoading && (
                          <div className="text-[11px] font-mono text-slate-400 animate-pulse flex items-center gap-2 py-2">
                            <Icons.Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                            {uiTranslation.tutorThinking}
                          </div>
                        )}

                        {aiResponse && (
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-violet-300 flex items-center gap-1">
                              <Icons.Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                              {uiTranslation.tutorHeader}
                            </div>
                            <div className="text-[11px] leading-relaxed text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-900">
                              {aiResponse}
                            </div>
                            <button
                              onClick={() => setAiResponse(null)}
                              className="text-[9px] font-mono text-slate-500 hover:text-slate-300"
                            >
                              Clear guidance
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Question container console */}
                    <div className="md:col-span-7 rounded-xl border border-slate-850 p-5 space-y-4 bg-slate-900/30">
                      
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-2 select-none">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-400">
                            🎯 {uiTranslation.questionTracker.replace('{current}', String(currentQuizIndex + 1)).replace('{total}', String(activeQuestionsList.length))}
                          </span>
                          
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300">
                            {uiTranslation.difficulties[activeQuestion.difficulty]}
                          </span>
                        </div>

                        {/* Interactive Shuffle Button */}
                        <button
                          onClick={() => handleShuffleSkillQuestions()}
                          className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-805 text-[10px] font-bold text-cyan-300 hover:text-cyan-200 hover:border-cyan-500/30 shadow-md hover:shadow-cyan-500/5 transition-all font-mono uppercase tracking-wider cursor-pointer"
                        >
                          <Icons.Shuffle className="h-3 w-3 text-cyan-400 animate-pulse" />
                          {lang === 'zh' ? '随机乱序' : lang === 'ms' ? 'Kocok' : 'Shuffle'}
                        </button>
                      </div>

                      {/* Scenario reading paragraph */}
                      {activeQuestion.scenario && (
                        <div className="rounded-lg bg-slate-950/80 p-3.5 border border-slate-900 text-[12px] leading-relaxed text-slate-300 font-sans">
                          📖 {activeQuestion.scenario[lang]}
                        </div>
                      )}

                      {/* Question header */}
                      <h4 className="text-[13px] font-bold text-white leading-relaxed">
                        ❓ {activeQuestion.questionText[lang]}
                      </h4>

                      {/* Render Variable variables setups as visually pretty cards if present */}
                      {activeQuestion.variablesSetup && (
                        <div className="grid grid-cols-3 gap-2 py-1 select-none">
                          <div className="bg-slate-950/70 p-2 rounded border border-slate-800 text-center">
                            <span className="text-[8px] font-mono text-slate-500 block uppercase">Manipulated</span>
                            <span className="text-[9px] font-medium text-cyan-300 block truncate mt-0.5">{activeQuestion.variablesSetup.manipulated}</span>
                          </div>
                          <div className="bg-slate-950/70 p-2 rounded border border-slate-800 text-center">
                            <span className="text-[8px] font-mono text-slate-500 block uppercase">Responding</span>
                            <span className="text-[9px] font-medium text-amber-300 block truncate mt-0.5">{activeQuestion.variablesSetup.responding}</span>
                          </div>
                          <div className="bg-slate-950/70 p-2 rounded border border-slate-800 text-center">
                            <span className="text-[8px] font-mono text-slate-500 block uppercase">Constant</span>
                            <span className="text-[9px] font-medium text-slate-400 block truncate mt-0.5">{activeQuestion.variablesSetup.constant}</span>
                          </div>
                        </div>
                      )}

                      {/* 4 Choices */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-mono uppercase text-slate-500 block tracking-wider font-bold">
                          {uiTranslation.chooseAnswer}
                        </span>

                        <div className="space-y-2">
                          {activeQuestion.options.map((option, choiceIdx) => {
                            const isSelected = selectedOption === choiceIdx;
                            const isCorrectAnswer = choiceIdx === activeQuestion.correctIndex;
                            
                            let choiceBtnStyles = 'bg-slate-950 border-slate-900 text-slate-300 hover:bg-slate-900 border hover:text-white';
                            if (isSelected) {
                              choiceBtnStyles = 'bg-indigo-950/40 border-indigo-400 text-white';
                            }
                            if (isAnswerRevealed) {
                              if (isCorrectAnswer) {
                                choiceBtnStyles = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 border-2 font-bold';
                              } else if (isSelected) {
                                choiceBtnStyles = 'bg-red-950/50 border-red-500 text-red-300 border-2 line-through';
                              } else {
                                choiceBtnStyles = 'bg-slate-950 border-slate-900 text-slate-500 opacity-60 pointer-events-none';
                              }
                            }

                            return (
                              <button
                                key={choiceIdx}
                                disabled={isAnswerRevealed}
                                onClick={() => { setSelectedOption(choiceIdx); sfx.playTap(); }}
                                className={`w-full p-3 rounded-lg text-left text-xs transition-all duration-150 flex items-start gap-2.5 ${choiceBtnStyles}`}
                              >
                                <span className="h-5 w-5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold font-mono tracking-wide flex items-center justify-center shrink-0">
                                  {String.fromCharCode(65 + choiceIdx)}
                                </span>
                                <span className="flex-1 leading-relaxed">{option[lang]}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Answer responses & Controls */}
                      <div className="pt-2">
                        {isAnswerRevealed ? (
                          <div className="space-y-4">
                            {/* Explanations Banner */}
                            <div className={`p-4 rounded-xl border leading-relaxed space-y-1.5 ${
                              wasCorrect 
                                ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-300' 
                                : 'bg-red-950/25 border-red-500/30 text-red-300'
                            }`}>
                              <span className="text-[11px] font-black font-mono tracking-wider block">
                                {wasCorrect ? uiTranslation.correctBox : uiTranslation.incorrectBox}
                              </span>
                              <p className="text-xs text-slate-350 font-sans">{activeQuestion.explanation[lang]}</p>
                            </div>

                            {/* Control button */}
                            <button
                              onClick={handleProceedQuiz}
                              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition-all font-mono tracking-wide active:scale-97 cursor-pointer"
                            >
                              🐾 {uiTranslation.nextChallengeBtn}
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={selectedOption === null}
                            onClick={handleSubmitHypothesis}
                            className={`w-full font-bold text-xs py-3 rounded-xl transition-all font-mono tracking-wide active:scale-97 flex items-center justify-center gap-2 ${
                              selectedOption === null 
                                ? 'bg-slate-850 text-slate-500 cursor-not-allowed border border-slate-800/40' 
                                : 'bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white shadow-md shadow-violet-500/20 cursor-pointer'
                            }`}
                          >
                            <Icons.CheckCheck className="h-4 w-4" />
                            {uiTranslation.checkAnswerBtn}
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 font-mono text-slate-650 italic">
                    Loading science laboratory coordinates...
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. MISSIONS TAB */}
            {activeTab === 'missions' && (
              <motion.div
                key="tab-missions"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-900 pb-3">
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Icons.Rocket className="h-4 w-4 text-indigo-400" />
                    {uiTranslation.currentMission}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Complete targeted learning chapters to obtain heavy level-up XP bonuses.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {KEY_MISSIONS.map((mission, idx) => {
                    const isCompleted = progress.unlockedMissions.includes(mission.id);
                    
                    // Track completion numbers based on conditions
                    let currentCount = 0;
                    if (mission.type === 'complete_quizzes' && mission.targetSkill) {
                      currentCount = progress.completedQuestions.filter(id => id.startsWith(mission.targetSkill!)).length;
                    } else if (mission.type === 'reach_xp') {
                      currentCount = progress.completedQuestions.length; // 15 check
                    }

                    const targetVal = mission.reqCount;
                    const displayPercent = Math.min(Math.round((currentCount / targetVal) * 100), 100);

                    return (
                      <div 
                        key={mission.id}
                        className={`rounded-xl border p-4 flex items-start gap-3.5 ${
                          isCompleted 
                            ? 'border-emerald-500/20 bg-emerald-950/5' 
                            : 'border-slate-800 bg-slate-900/10'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-950/40 text-emerald-400' : 'bg-slate-950 text-slate-500'}`}>
                          {isCompleted ? <Icons.CheckCircle2 className="h-5 w-5" /> : <Icons.Compass className="h-5 w-5" />}
                        </div>

                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[12px] font-bold text-slate-200">{mission.title[lang]}</span>
                            <span className="text-[9.5px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">
                              +{mission.rewardXp} XP
                            </span>
                          </div>

                          <p className="text-[10.5px] leading-relaxed text-slate-400">
                            {mission.desc[lang]}
                          </p>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[8.5px] font-mono text-slate-500">
                              <span>{isCompleted ? 'Completed ✅' : 'Progress'}</span>
                              <span>{currentCount} / {targetVal}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                              <div 
                                className={`h-full rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                                style={{ width: `${displayPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 3. ACHIEVEMENT HALL TAB */}
            {activeTab === 'badges' && (
              <motion.div
                key="tab-accolades"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <BadgeGrid earnedBadges={progress.earnedBadges} lang={lang} />
              </motion.div>
            )}

            {/* 4. GLOBAL LEADERBOARD ARENA */}
            {activeTab === 'leaderboard' && (
              <motion.div
                key="tab-rankings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-900 pb-3">
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Icons.Trophy className="h-4 w-4 text-sky-400" />
                    {uiTranslation.leaderboardDeck} ({progress.schoolClass})
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">See your research position against classmate scientists in Grade 5.</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/20 overflow-hidden">
                  <div className="grid grid-cols-12 bg-slate-950 text-[10px] font-mono uppercase tracking-wider text-slate-500 p-3 border-b border-slate-900">
                    <div className="col-span-2 text-center">{uiTranslation.rank}</div>
                    <div className="col-span-6">{uiTranslation.student}</div>
                    <div className="col-span-2 text-center">{uiTranslation.level}</div>
                    <div className="col-span-2 text-right">{uiTranslation.xp}</div>
                  </div>

                  <div className="divide-y divide-slate-900">
                    {fullLeaderboardList.map((st, idx) => {
                      const isMe = st.id === progress.id;
                      return (
                        <div 
                          key={st.id}
                          className={`grid grid-cols-12 p-3 text-xs items-center ${
                            isMe ? 'bg-violet-950/20 font-bold border-l-2 border-violet-500 text-white' : 'text-slate-300'
                          }`}
                        >
                          <div className="col-span-2 text-center font-mono font-bold">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                          </div>

                          <div className="col-span-6 flex items-center gap-2">
                            <span className="text-sm">
                              {st.avatar === 'chemist_marie' ? '🧪' : st.avatar === 'botanist_flora' ? '🌿' : st.avatar === 'physicist_newton' ? '🍎' : '💻'}
                            </span>
                            <div className="truncate">
                              <div>{st.name}</div>
                              <span className="text-[8px] text-slate-500 block font-mono capitalize">{st.schoolClass}</span>
                            </div>
                          </div>

                          <div className="col-span-2 text-center font-mono font-bold text-amber-400">
                            Lv {st.level}
                          </div>

                          <div className="col-span-2 text-right font-mono font-bold text-sky-400">
                            {st.xp} XP
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. TEACHER PANEL TAB */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="tab-teacher"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <Dashboard currentPlayerProgress={progress} lang={lang} onUpdateProgress={saveProgressToStorage} />
              </motion.div>
            )}

          </AnimatePresence>
        </section>

        {/* Right Column: AI Assistant Feedback & Laboratory logs */}
        <aside className="col-span-1 lg:col-span-3 space-y-4">
          
          {/* AI Advisor Panel */}
          <div className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 select-none font-sans">
              <Icons.Cpu className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              {lang === 'zh' ? 'AI 科学导师反馈' : lang === 'ms' ? 'Maklum Balas Tutor AI' : 'AI Mentor Feedback'}
            </h3>
            
            <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 space-y-3 relative overflow-hidden">
              <div className="absolute top-1 right-2 flex items-center gap-1 font-mono text-[8px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                ONLINE Advisor
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {progress.avatar === 'chemist_marie' ? '🧪' : progress.avatar === 'botanist_flora' ? '🌿' : progress.avatar === 'physicist_newton' ? '🍎' : '💻'}
                </span>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-250 leading-none">
                    {progress.avatar === 'chemist_marie' ? 'Marie Curie' : progress.avatar === 'botanist_flora' ? 'Flora Watson' : progress.avatar === 'physicist_newton' ? 'Isaac Newton' : 'Ada Lovelace'}
                  </h4>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 block">SPS LAB SUPERVISOR</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 italic leading-relaxed select-text font-serif">
                {lang === 'zh' 
                  ? `"欢迎回到世界科学过程实验室，科学新星！选择左边的技能卡以启动挑战。记住，假设需要经过反复的实验才能化为伟大的真理。"` 
                  : lang === 'ms' 
                  ? `"Selamat kembali ke makmal penyelidikan, bintang penyelidik! Klik kad kemahiran di kiri untuk mulakan cabaran anda. Kami bersedia menyokong anda."` 
                  : `"Welcome back to the skill lab, cadet scientist! Click any Science Process Skill card on the left to test your hypothesis. Let us observe the evidence together."`}
              </p>
            </div>
          </div>

          {/* Live Lab Calibration Logs */}
          <div className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 space-y-4 font-mono text-[10px]">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 select-none font-sans">
              <Icons.Activity className="h-3.5 w-3.5 text-cyan-400" />
              {lang === 'zh' ? '实验室探究日志' : lang === 'ms' ? 'Log Penyelidikan KPS' : 'Research Logs'}
            </h3>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-slate-400 divide-y divide-slate-900">
              <div className="pt-2 flex justify-between gap-1 items-start">
                <span className="text-[8px] text-indigo-400 font-bold tracking-tight bg-indigo-500/10 px-1 py-0.2 rounded shrink-0">SYS</span>
                <span className="flex-1 text-left truncate">System initialized successfully</span>
                <span className="text-[8px] text-slate-600">0.02s</span>
              </div>
              <div className="pt-2 flex justify-between gap-1 items-start">
                <span className="text-[8px] text-emerald-400 font-bold tracking-tight bg-emerald-500/10 px-1 py-0.2 rounded shrink-0">AUTH</span>
                <span className="flex-1 text-left truncate">Scientific cadet {progress.name} connected</span>
                <span className="text-[8px] text-slate-600">0.05s</span>
              </div>
              {progress.completedQuestions.length > 0 && (
                <div className="pt-2 flex justify-between gap-1 items-start">
                  <span className="text-[8px] text-amber-500 font-bold tracking-tight bg-amber-500/10 px-1 py-0.2 rounded shrink-0">XP</span>
                  <span className="flex-1 text-left truncate">Earned total {progress.xp} Science Points</span>
                  <span className="text-[8px] text-slate-600">0.08s</span>
                </div>
              )}
              {progress.earnedBadges.length > 0 && (
                <div className="pt-2 flex justify-between gap-1 items-start">
                  <span className="text-[8px] text-pink-400 font-bold tracking-tight bg-pink-500/10 px-1 py-0.2 rounded shrink-0">BADG</span>
                  <span className="flex-1 text-left truncate">{progress.earnedBadges.length} reward medals unlocked</span>
                  <span className="text-[8px] text-slate-600">0.11s</span>
                </div>
              )}
            </div>
          </div>

        </aside>

      </main>

      {/* Unified laboratory footer */}
      <footer className="border-t border-slate-900 py-4 px-4 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-500">
          <div>
            <span>© 2026 Science Process Skills Portal. Standard KSSR & International Primary 5 Syllabus.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-350">Status: Calibration Stable</span>
            <span className="hover:text-slate-350">Local Database: Stored Secure</span>
          </div>
        </div>
      </footer>

      {/* Unlocked Accolades / Badges / Missions Custom Modal Popups */}
      <AnimatePresence>
        {currentNotification && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop cover with high backdrop-blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={handleDismissNotification}
            />

            {/* Glowing neon dialog card wrapper */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative max-w-sm w-full bg-slate-900 border ${
                currentNotification.type === 'level' 
                  ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.35)]' 
                  : currentNotification.type === 'mission'
                  ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.35)]'
                  : 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.35)]'
              } rounded-3xl p-6 text-center z-10 flex flex-col items-center select-none overflow-hidden`}
            >
              {/* Animated energy orb / portal inside background backdrop */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-indigo-500/10 to-transparent blur-2xl rounded-full" />

              {/* Icon rendering depend on award category */}
              <div className="relative mb-5 z-10">
                {currentNotification.type === 'level' ? (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/25 animate-bounce">
                    ⚡
                  </div>
                ) : currentNotification.type === 'mission' ? (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-cyan-500/25 animate-bounce">
                    🚀
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-amber-500/25 animate-bounce">
                    🏆
                  </div>
                )}
              </div>

              {/* Text content details */}
              <h2 className="text-xl font-bold font-mono text-white tracking-tight mb-2 uppercase z-10">
                {currentNotification.title}
              </h2>

              <p className="text-sm font-sans text-slate-300 leading-relaxed mb-6 z-10">
                {currentNotification.subtitle}
              </p>

              {/* Mission heavy XP feedback rewards metrics if present */}
              {currentNotification.xpReward && (
                <div className="mb-6 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 z-10">
                  <Icons.Zap className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
                  +{currentNotification.xpReward} XP REWARD
                </div>
              )}

              {/* Action engage dismiss button */}
              <button
                onClick={handleDismissNotification}
                className="w-full relative z-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-98 text-white text-xs font-bold font-mono uppercase tracking-widest py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-indigo-500/10 border border-indigo-400/20 transition-all cursor-pointer"
              >
                {lang === 'zh' ? '⭐ 确认领取奖励' : lang === 'ms' ? '⭐ Selesai & Ambil' : '⭐ Claim Accolade'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
