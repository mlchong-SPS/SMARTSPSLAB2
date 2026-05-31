/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  StudentProgress, 
  SPS_Skill, 
  Language, 
  LeaderboardEntry 
} from '../types';
import { ALL_BADGES, KEY_MISSIONS, VIRTUAL_LEADERBOARD } from '../data/questions';
import * as Icons from 'lucide-react';

interface DashboardProps {
  currentPlayerProgress: StudentProgress;
  lang: Language;
  onUpdateProgress?: (newProg: StudentProgress) => void;
}

export default function Dashboard({ currentPlayerProgress, lang, onUpdateProgress }: DashboardProps) {
  // Store a list of simulated classmates that the teacher can audit
  const [classmates, setClassmates] = useState<StudentProgress[]>([
    {
      id: 'v1',
      name: 'Zhi Hao Lin',
      avatar: 'avatar_male_1',
      xp: 6200,
      level: 14,
      completedQuestions: ['observation_q_1', 'observation_q_6', 'variables_q_1', 'variables_q_6', 'hypothesis_q_1', 'inference_q_1', 'interpreting_data_q_1', 'interpreting_data_q_6'],
      schoolClass: 'Year 5 Cosmos',
      skillsXp: { observation: 1200, inference: 800, hypothesis: 900, variables: 1100, operational_definition: 1000, interpreting_data: 1200 },
      skillsHistory: {
        observation: [{ questionId: 'observation_q_1', isCorrect: true, scoreEarned: 100, timestamp: '2026-05-28' }],
        inference: [{ questionId: 'inference_q_1', isCorrect: false, scoreEarned: 0, timestamp: '2026-05-28' }],
        hypothesis: [],
        variables: [],
        operational_definition: [],
        interpreting_data: []
      },
      earnedBadges: ['first_step', 'observer_badge', 'data_wizard'],
      unlockedMissions: ['m1'],
      lastActive: '2026-05-28'
    },
    {
      id: 'v2',
      name: 'Ahmad Faiz',
      avatar: 'avatar_male_2',
      xp: 4850,
      level: 12,
      completedQuestions: ['observation_q_1', 'variables_q_1', 'hypothesis_q_1', 'operational_definition_q_1'],
      schoolClass: 'Year 5 Nebula',
      skillsXp: { observation: 900, inference: 750, hypothesis: 800, variables: 900, operational_definition: 800, interpreting_data: 700 },
      skillsHistory: {
        observation: [{ questionId: 'observation_q_1', isCorrect: true, scoreEarned: 100, timestamp: '2026-05-27' }],
        inference: [],
        hypothesis: [],
        variables: [],
        operational_definition: [],
        interpreting_data: []
      },
      earnedBadges: ['first_step', 'control_master'],
      unlockedMissions: [],
      lastActive: '2026-05-27'
    },
    {
      id: 'v3',
      name: 'Sarah Tan',
      avatar: 'avatar_female_1',
      xp: 4200,
      level: 11,
      completedQuestions: ['observation_q_1', 'inference_q_1', 'interpreting_data_q_1'],
      schoolClass: 'Year 5 Cosmos',
      skillsXp: { observation: 800, inference: 900, hypothesis: 600, variables: 700, operational_definition: 600, interpreting_data: 600 },
      skillsHistory: {},
      earnedBadges: ['first_step', 'detective_badge'],
      unlockedMissions: [],
      lastActive: '2026-05-29'
    }
  ]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(currentPlayerProgress.id);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Year 5 Cosmos');
  const [newStudentLevel, setNewStudentLevel] = useState<number>(5);

  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editLevel, setEditLevel] = useState<number>(1);

  // Multi-lingual translation maps for teacher-related metrics
  const t = {
    en: {
      dashTitle: 'SPS Teacher Control Panel',
      dashSubtitle: 'Analyze real-time classroom statistics, individual skill mastery, and down-to-the-second progress.',
      exportCsvBtn: 'Download Class CSV Report',
      addStudentTitle: 'Register Simulated Student',
      studentNamePl: 'Full Name (e.g. Rachel Lim)',
      classLabel: 'Grade / Class',
      registerBtn: 'Enroll Student',
      rosterTitle: 'Enrolled Class Roster',
      classAverages: 'Class Averages',
      avgXp: 'Avg XP Points',
      avgLvl: 'Avg Level',
      weakestSkill: 'Weakest Skill Focus',
      activeStudents: 'Active Class Size',
      noData: 'No records matching this selection.',
      skillBreakdownTitle: 'SPS Mastery Level Metrics',
      skillAcc: 'Process Accuracy Rate',
      badgesEarned: 'Completed Badges',
      missionsUnlocked: 'Missions Passed',
      activityHistory: 'Latest Interactive Logs',
      studentHeader: 'Student Report Card',
      playerBadge: 'Current Player (You)',
      simulatedBadge: 'Simulated Demo Student',
      correctAttempt: 'Correct Solve',
      incorrectAttempt: 'Incorrect Solve',
      backToMe: 'Jump to My Student View',
      accuracy: 'Accuracy',
      weak: 'Needs practice',
      strong: 'Advanced Mastery',
      skills: {
        observation: 'Observation',
        inference: 'Inference',
        hypothesis: 'Hypothesis',
        variables: 'Variables',
        operational_definition: 'Operational Definition',
        interpreting_data: 'Interpreting Data'
      }
    },
    ms: {
      dashTitle: 'Panel Kawalan Guru KPS',
      dashSubtitle: 'Analisis statistik bilik darjah masa nyata, penguasaan kemahiran individu, dan kemajuan terperinci.',
      exportCsvBtn: 'Muat Turun Laporan CSV Kelas',
      addStudentTitle: 'Daftar Pelajar Simulasi',
      studentNamePl: 'Nama Penuh (cth. Rachel Lim)',
      classLabel: 'Tingkatan / Kelas',
      registerBtn: 'Daftar Pelajar',
      rosterTitle: 'Senarai Nama Pelajar Kelas',
      classAverages: 'Purata Prestasi Kelas',
      avgXp: 'Purata Mata XP',
      avgLvl: 'Purata Tahap',
      weakestSkill: 'Fokus Kemahiran Terlemah',
      activeStudents: 'Jumlah Saiz Kelas',
      noData: 'Tiada rekod sepadan dengan pilihan ini.',
      skillBreakdownTitle: 'Matrik Tahap Penguasaan KPS',
      skillAcc: 'Kadar Ketepatan Proses',
      badgesEarned: 'Lencana Diperoleh',
      missionsUnlocked: 'Misi Berjaya Diselesaikan',
      activityHistory: 'Log Interaktif Terkini',
      studentHeader: 'Kad Laporan Pelajar',
      playerBadge: 'Pemain Semasa (Anda)',
      simulatedBadge: 'Simulasi Pelajar Demo',
      correctAttempt: 'Selesai Betul',
      incorrectAttempt: 'Selesai Salah',
      backToMe: 'Kembali ke Pandangan Saya',
      accuracy: 'Ketepatan',
      weak: 'Perlu latihan',
      strong: 'Penguasaan Tinggi',
      skills: {
        observation: 'Pemerhatian',
        inference: 'Inferens',
        hypothesis: 'Hipotesis',
        variables: 'Pemboleh Ubah',
        operational_definition: 'Definisi Secara Operasi',
        interpreting_data: 'Mentafsir Data'
      }
    },
    zh: {
      dashTitle: 'SPS 教师教学控制台',
      dashSubtitle: '实时分析课堂多维度统计、学生个人科学技能掌握度及答题精确足迹。',
      exportCsvBtn: '下载全班 CSV 成绩报告单',
      addStudentTitle: '注册模拟演示学生',
      studentNamePl: '学生全名（例如：林美玲）',
      classLabel: '年级/班级',
      registerBtn: '注册学生入学',
      rosterTitle: '已注册班级名单',
      classAverages: '名义班级平均指标',
      avgXp: '平均 XP 经验值',
      avgLvl: '平均科学等级',
      weakestSkill: '重点练习弱项技能',
      activeStudents: '班级学生总数',
      noData: '没有符合该选定条件的记录。',
      skillBreakdownTitle: 'SPS 核心技能掌握度矩阵',
      skillAcc: '过程技能答题正确率',
      badgesEarned: '已解锁实验勋章',
      missionsUnlocked: '经通关科学任务',
      activityHistory: '最新互动答题轨迹',
      studentHeader: '学生科学成长报告书',
      playerBadge: '当前操作玩家（您）',
      simulatedBadge: '模拟测试学生',
      correctAttempt: '答题正确',
      incorrectAttempt: '答题错误',
      backToMe: '快速跳转到我的成长卡',
      accuracy: '正确率',
      weak: '急需辅导',
      strong: '卓越掌握',
      skills: {
        observation: '观察能力 (Observation)',
        inference: '推断能力 (Inference)',
        hypothesis: '提出假设 (Hypothesis)',
        variables: '控制变量 (Variables)',
        operational_definition: '操作性定义 (Operational Definition)',
        interpreting_data: '解释数据 (Interpreting Data)'
      }
    }
  }[lang];

  // Combine Active Current Player with Simulated Classmates array
  const allStudents = useMemo(() => {
    return [currentPlayerProgress, ...classmates];
  }, [currentPlayerProgress, classmates]);

  // Find currently selected student object
  const selectedStudent = useMemo(() => {
    return allStudents.find(s => s.id === selectedStudentId) || currentPlayerProgress;
  }, [allStudents, selectedStudentId, currentPlayerProgress]);

  // Aggregate Class Level Stats
  const classStats = useMemo(() => {
    const count = allStudents.length;
    if (count === 0) return { avgLevel: 1, avgXp: 0, weakestSPS: 'observation' as SPS_Skill };

    let totalLvl = 0;
    let totalXp = 0;
    
    // Track total questions answered across entire class per SPS to spot weak nodes
    const sSpsCorrect: Record<SPS_Skill, number> = {
      observation: 0, inference: 0, hypothesis: 0, variables: 0, operational_definition: 0, interpreting_data: 0
    };
    const sSpsTotal: Record<SPS_Skill, number> = {
      observation: 0, inference: 0, hypothesis: 0, variables: 0, operational_definition: 0, interpreting_data: 0
    };

    allStudents.forEach(st => {
      totalLvl += st.level;
      totalXp += st.xp;

      // Scan through skillsHistory
      const skillsArray: SPS_Skill[] = ['observation', 'inference', 'hypothesis', 'variables', 'operational_definition', 'interpreting_data'];
      skillsArray.forEach(sk => {
        const history = st.skillsHistory[sk] || [];
        history.forEach(att => {
          sSpsTotal[sk] += 1;
          if (att.isCorrect) sSpsCorrect[sk] += 1;
        });

        // Add weight for precompleted virtual accounts
        if (st.id !== currentPlayerProgress.id) {
          // precomplete simulated answers weight
          sSpsTotal[sk] += 5;
          sSpsCorrect[sk] += st.skillsXp[sk] > 800 ? 4 : 2;
        }
      });
    });

    // Find SPS skill with lowest accuracy rate
    let weakestSPS: SPS_Skill = 'variables';
    let lowestRatio = 1.0;
    const skillsArray: SPS_Skill[] = ['observation', 'inference', 'hypothesis', 'variables', 'operational_definition', 'interpreting_data'];
    
    skillsArray.forEach(sk => {
      const tot = sSpsTotal[sk] || 1;
      const tCor = sSpsCorrect[sk] || 0;
      const ratio = tCor / tot;
      if (ratio < lowestRatio) {
        lowestRatio = ratio;
        weakestSPS = sk;
      }
    });

    return {
      avgLevel: Math.round((totalLvl / count) * 10) / 10,
      avgXp: Math.round(totalXp / count),
      weakestSPS
    };
  }, [allStudents, currentPlayerProgress.id]);

  // Sync editing inputs when selected student changes
  React.useEffect(() => {
    setIsEditingStudent(false);
    if (selectedStudent) {
      setEditName(selectedStudent.name);
      setEditClass(selectedStudent.schoolClass);
      setEditLevel(selectedStudent.level);
    }
  }, [selectedStudentId, selectedStudent]);

  // Handle saving modified student details (affects classmates or current player)
  const handleSaveStudentChanges = () => {
    if (!editName.trim()) return;

    const validatedClass = editClass.trim() || 'Year 5 Cosmos';
    const validatedLevel = Math.max(1, editLevel);

    const updatedFields: Partial<StudentProgress> = {
      name: editName.trim(),
      schoolClass: validatedClass,
      level: validatedLevel,
    };

    if (selectedStudent.id === currentPlayerProgress.id) {
      if (onUpdateProgress) {
        onUpdateProgress({
          ...currentPlayerProgress,
          ...updatedFields
        });
      }
    } else {
      setClassmates(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, ...updatedFields } : s));
    }
    
    setIsEditingStudent(false);
  };

  // Handle adding a brand new simulated student for teachers to play with
  const handleRegisterInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const validatedClass = newStudentClass.trim() || 'Year 5 Cosmos';
    const validatedLevel = Math.max(1, newStudentLevel);

    const newProg: StudentProgress = {
      id: `sim_st_${Date.now()}`,
      name: newStudentName.trim(),
      avatar: ['avatar_male_1', 'avatar_female_1', 'avatar_male_2', 'avatar_female_2'][Math.floor(Math.random() * 4)],
      xp: validatedLevel * 400 + Math.floor(Math.random() * 150), // scale base XP on level
      level: validatedLevel,
      completedQuestions: [],
      schoolClass: validatedClass,
      skillsXp: {
        observation: Math.floor(Math.random() * 200),
        inference: Math.floor(Math.random() * 200),
        hypothesis: Math.floor(Math.random() * 200),
        variables: Math.floor(Math.random() * 200),
        operational_definition: Math.floor(Math.random() * 200),
        interpreting_data: Math.floor(Math.random() * 200)
      },
      skillsHistory: {
        observation: [], inference: [], hypothesis: [], variables: [], operational_definition: [], interpreting_data: []
      },
      earnedBadges: ['first_step'],
      unlockedMissions: [],
      lastActive: new Date().toISOString().split('T')[0]
    };

    setClassmates(prev => [newProg, ...prev]);
    setSelectedStudentId(newProg.id);
    setNewStudentName('');
  };

  /**
   * Complete download formatter. 
   * Formats current student and team database into standard CSV, generates clean blobs, triggers download.
   */
  const downloadCsvReport = () => {
    const csvHeaders = [
      'Student ID',
      'Student Name',
      'Grade Class',
      'Total Score (XP)',
      'Science level',
      'Completed Quizzes Count',
      'Observation XP',
      'Inference XP',
      'Hypothesis XP',
      'Variables XP',
      'Operational Def XP',
      'Interpreting Data XP',
      'Earned Badges Count',
      'Last Active'
    ];

    const csvRows = allStudents.map(s => {
      return [
        s.id,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.schoolClass}"`,
        s.xp,
        s.level,
        s.completedQuestions.length,
        s.skillsXp.observation,
        s.skillsXp.inference,
        s.skillsXp.hypothesis,
        s.skillsXp.variables,
        s.skillsXp.operational_definition,
        s.skillsXp.interpreting_data,
        s.earnedBadges.length,
        s.lastActive
      ].join(',');
    });

    const csvContent = '\uFEFF' + [csvHeaders.join(','), ...csvRows].join('\n'); // added BOM to support UTF-8 characters like Chinese/Malay in Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SPS_Classtrack_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process data for rendering student skill bars accurately 
  const currentStudentSkillsData = useMemo(() => {
    const skillsList: SPS_Skill[] = ['observation', 'inference', 'hypothesis', 'variables', 'operational_definition', 'interpreting_data'];
    return skillsList.map(sk => {
      // Determine accuracy rate from history or show defaults based on XP values
      const history = selectedStudent.skillsHistory[sk] || [];
      const totalAnswers = history.length;
      const correctAnswers = history.filter(h => h.isCorrect).length;

      let percentage = 0;
      if (totalAnswers > 0) {
        percentage = Math.round((correctAnswers / totalAnswers) * 100);
      } else {
        // Fallback calculation for precompiled virtual student visual meters
        const xp = selectedStudent.skillsXp[sk] || 0;
        percentage = Math.min(Math.round((xp / 1500) * 100) + 40, 95);
        if (xp === 0) percentage = 0;
      }

      return {
        key: sk,
        name: t.skills[sk],
        rawXp: selectedStudent.skillsXp[sk] || 0,
        accuracy: percentage,
        status: percentage < 50 ? t.weak : t.strong
      };
    });
  }, [selectedStudent, lang, t.skills, t.weak, t.strong]);

  return (
    <div id="teacher-dashboard-main" className="space-y-6">
      {/* Dashboard Top header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-violet-500 to-indigo-500 p-2 rounded-lg text-white">
              <Icons.Users className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">{t.dashTitle}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">{t.dashSubtitle}</p>
        </div>

        <button
          onClick={downloadCsvReport}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg active:scale-95 transition-all shadow-md self-start md:self-center"
        >
          <Icons.Download className="h-4 w-4" />
          {t.exportCsvBtn}
        </button>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase">{t.activeStudents}</div>
          <div className="text-2xl font-bold font-mono text-violet-400 mt-1">{allStudents.length}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">{newStudentClass}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase">{t.avgXp}</div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">{classStats.avgXp}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">points per student</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase">{t.avgLvl}</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{classStats.avgLevel}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">mastery levels</div>
        </div>

        <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/10 backdrop-blur-sm">
          <div className="text-[10px] font-mono text-red-400 uppercase">{t.weakestSkill}</div>
          <div className="text-sm font-bold text-red-200 mt-2 truncate">{t.skills[classStats.weakestSPS]}</div>
          <div className="text-[9px] text-red-400/80 mt-0.5 font-mono">⚠️ Need Intervention</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Enrolled Roster Selection Bar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-mono text-slate-300 font-bold">
              👤 {t.rosterTitle}
            </h3>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {allStudents.map(student => {
                const isSelected = selectedStudentId === student.id;
                const isMe = student.id === currentPlayerProgress.id;
                
                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all duration-200 ${
                      isSelected 
                        ? 'bg-violet-950/40 border-violet-500/50 shadow-sm' 
                        : 'bg-slate-950/30 border-slate-900/60 hover:bg-slate-900/30 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-md ${isMe ? 'bg-indigo-950 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                        {isMe ? <Icons.Trophy className="h-4 w-4" /> : <Icons.User className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white truncate flex items-center gap-1.5">
                          {student.name}
                          {isMe && <span className="text-[8px] px-1 py-0.2 bg-indigo-500/20 text-indigo-300 rounded font-mono">me</span>}
                        </div>
                        <div className="text-[9px] font-mono text-slate-500">Lv {student.level} • {student.xp} XP</div>
                      </div>
                    </div>
                    {isSelected && <Icons.Check className="h-3.5 w-3.5 text-violet-400" />}
                  </button>
                );
              })}
            </div>

            {/* Quick action to jump to Current Player */}
            {selectedStudentId !== currentPlayerProgress.id && (
              <button
                onClick={() => setSelectedStudentId(currentPlayerProgress.id)}
                className="w-full text-center text-[10px] text-violet-400 hover:text-white font-mono hover:underline flex items-center justify-center gap-1 py-1"
              >
                <Icons.Command className="h-3 w-3" />
                {t.backToMe}
              </button>
            )}
          </div>

          {/* Quick Registration Form for simulation testing */}
          <form onSubmit={handleRegisterInput} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3.5">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
              <Icons.UserPlus className="h-3.5 w-3.5 text-emerald-400" />
              {t.addStudentTitle}
            </h3>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono text-slate-500 uppercase block">Student Name</label>
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder={t.studentNamePl}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                maxLength={25}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono text-slate-500 uppercase block">Class / Grade</label>
              <input
                type="text"
                value={newStudentClass}
                onChange={(e) => setNewStudentClass(e.target.value)}
                placeholder="e.g. Year 5 Cosmos"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                maxLength={25}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono text-slate-500 uppercase block">Science level</label>
              <input
                type="number"
                min={1}
                max={50}
                value={newStudentLevel}
                onChange={(e) => setNewStudentLevel(Math.max(1, parseInt(e.target.value, 15) || 1))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-200 border border-slate-700 font-bold text-[10px] py-1.5 rounded-lg font-mono tracking-wide transition-all active:scale-97"
            >
              ➕ {t.registerBtn}
            </button>
          </form>
        </div>

        {/* Selected Student Deep Profile Report */}
        <div id="deep-student-report" className="lg:col-span-8 rounded-xl border border-slate-850 bg-slate-900/20 p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <Icons.Award className="h-4 w-4 text-amber-400" />
                  {t.studentHeader} 
                </h3>
                <span className={`text-[9px] px-2 py-0.5 font-mono rounded-full ${
                  selectedStudent.id === currentPlayerProgress.id 
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' 
                    : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                }`}>
                  {selectedStudent.id === currentPlayerProgress.id ? t.playerBadge : t.simulatedBadge}
                </span>
              </div>
              
              {isEditingStudent ? (
                <div className="mt-2 space-y-2 max-w-sm">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">Edit Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-lg font-extrabold text-white mt-1.5 font-sans flex items-center gap-2">
                  <span>{selectedStudent.name}</span>
                  <button
                    onClick={() => {
                      setIsEditingStudent(true);
                      setEditName(selectedStudent.name);
                      setEditClass(selectedStudent.schoolClass);
                      setEditLevel(selectedStudent.level);
                    }}
                    className="p-1 text-violet-400 hover:text-violet-300 text-[10px] flex items-center gap-1 font-mono hover:underline cursor-pointer"
                    title="Edit Name, Class or Level"
                  >
                    <Icons.Edit3 className="h-3 w-3" /> Edit
                  </button>
                </div>
              )}
            </div>

            <div className="text-right flex flex-col items-end gap-1 shrink-0">
              {isEditingStudent ? (
                <div className="space-y-2 text-left bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">Class/Grade</label>
                    <input
                      type="text"
                      value={editClass}
                      onChange={(e) => setEditClass(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-violet-500 w-36"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">Science Level</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={editLevel}
                      onChange={(e) => setEditLevel(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-violet-500 w-20 text-center font-mono"
                    />
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      onClick={handleSaveStudentChanges}
                      className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded hover:bg-emerald-500 transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingStudent(false)}
                      className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{t.classLabel}</span>
                    <span className="text-xs font-mono font-bold text-violet-300">{selectedStudent.schoolClass}</span>
                  </div>
                  <div className="text-[10px] text-slate-550 font-mono mt-0.5">
                    Level: <strong className="text-amber-400 font-mono text-xs">Lv {selectedStudent.level}</strong> <span className="text-slate-500">({selectedStudent.xp} XP)</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: SPS Skills Mastery Meter Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Icons.TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
                {t.skillBreakdownTitle}
              </h4>

              <div className="space-y-3.5">
                {currentStudentSkillsData.map(skillSet => (
                  <div key={skillSet.key} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-300 truncate">{skillSet.name}</span>
                      <span className="text-slate-400">
                        {skillSet.rawXp} XP 
                        <span className="text-indigo-400 ml-1.5">({skillSet.accuracy}%)</span>
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900 flex">
                      <motion.div
                        className={`h-full rounded-full ${
                          skillSet.accuracy < 50 
                            ? 'bg-gradient-to-r from-red-500 to-amber-500' 
                            : 'bg-gradient-to-r from-indigo-500 to-sky-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${skillSet.accuracy}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Badges, Missions completed & Real-time Logs */}
            <div className="space-y-5">
              {/* Badges unlocked listed */}
              <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800 space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider font-bold">
                  🎖️ {t.badgesEarned} ({selectedStudent.earnedBadges.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.earnedBadges.length === 0 ? (
                    <span className="text-[10px] text-slate-600 font-mono italic">{t.noData}</span>
                  ) : (
                    selectedStudent.earnedBadges.map(badgeId => {
                      const badgeObj = ALL_BADGES.find(b => b.id === badgeId);
                      return (
                        <span 
                          key={badgeId}
                          className="text-[9px] px-2 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded font-bold"
                          title={badgeObj?.description[lang]}
                        >
                          🏅 {badgeObj?.name[lang] || badgeId}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Missions Completed Checkbox lists */}
              <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800 space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider font-bold">
                  🚀 {t.missionsUnlocked} ({selectedStudent.unlockedMissions.length})
                </span>
                <div className="space-y-1.5">
                  {KEY_MISSIONS.map(m => {
                    const isUnlocked = selectedStudent.unlockedMissions.includes(m.id);
                    return (
                      <div key={m.id} className="flex items-center gap-2 text-[10px] font-mono leading-relaxed text-slate-300">
                        {isUnlocked ? (
                          <Icons.CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <span className={isUnlocked ? 'text-slate-200 line-through' : 'text-slate-400'}>
                          {m.title[lang]} ({m.rewardXp} XP)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* History list logs */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider font-bold">
                  🕒 {t.activityHistory}
                </span>

                <div className="space-y-1.5 max-h-32 overflow-y-auto bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  {Object.values(selectedStudent.skillsHistory).flat().length === 0 ? (
                    <div className="text-[10px] hover:text-slate-500 font-mono text-slate-600 p-2 italic text-center">
                      No logs listed. Take quizzes to see audit path footprints!
                    </div>
                  ) : (
                    // Combine, Sort all histories by timestamp descending 
                    Object.keys(selectedStudent.skillsHistory).flatMap(skKey => {
                      const list = selectedStudent.skillsHistory[skKey as SPS_Skill] || [];
                      return list.map(item => ({ ...item, skill: skKey as SPS_Skill }));
                    })
                    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                    .map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[9px] font-mono border-b border-slate-900 pb-1.5 mb-1.5 last:border-0 last:pb-0 last:mb-0">
                        <div className="flex items-center gap-1.5">
                          {item.isCorrect ? (
                            <span className="text-emerald-400">●</span>
                          ) : (
                            <span className="text-red-500">●</span>
                          )}
                          <span className="text-slate-300 font-bold uppercase">{t.skills[item.skill]}</span>
                        </div>
                        <div className="text-slate-500">
                          {item.isCorrect ? `+${item.scoreEarned} XP` : '0 XP'} • {item.timestamp}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
