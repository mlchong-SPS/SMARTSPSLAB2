/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SPS_Skill, Language, Question } from '../types';

interface IllustrationProps {
  skill: SPS_Skill;
  lang: Language;
  questionIndex: number;
  activeQuestion?: Question;
}

export default function SPSIllustrations({ skill, lang, questionIndex, activeQuestion }: IllustrationProps) {
  // Sync state values on question changes for small micro-interactions
  const [activeTabPulse, setActiveTabPulse] = useState(0);

  useEffect(() => {
    setActiveTabPulse(prev => prev + 1);
  }, [questionIndex, skill]);

  // Fast translation helper inside the file
  const txt = (en: string, ms: string, zh: string) => {
    if (lang === 'zh') return zh;
    if (lang === 'ms') return ms;
    return en;
  };

  const diff = activeQuestion?.difficulty || 'easy';

  // Get dynamic name of animal, substance or value from current scenario
  const getEntityName = (category: 'animal' | 'substance' | 'val') => {
    const scenarioEn = activeQuestion?.scenario?.en || '';
    if (category === 'animal') {
      if (scenarioEn.includes('snails') || scenarioEn.includes('snail')) return txt('Snail 🐌', 'Siput 🐌', '蜗牛 🐌');
      if (scenarioEn.includes('caterpillars') || scenarioEn.includes('caterpillar')) return txt('Caterpillar 🐛', 'Ulat Bulu 🐛', '毛毛虫 🐛');
      if (scenarioEn.includes('mealworms') || scenarioEn.includes('mealworm')) return txt('Mealworm 🐛', 'Ulat Roti 🐛', '面包虫 🐛');
      if (scenarioEn.includes('crickets') || scenarioEn.includes('cricket')) return txt('Cricket 🦗', 'Cengkerik 🦗', '蟋蟀 🦗');
      if (scenarioEn.includes('woodlice') || scenarioEn.includes('woodlouse')) return txt('Woodlouse 🪲', 'Kutu Kayu 🪲', '潮虫/鼠妇 🪲');
      return txt('Organism 🐛', 'Organisma 🐛', '生物标本 🐛');
    } else if (category === 'substance') {
      if (scenarioEn.includes('lemon juice')) return txt('Lemon Juice 🍋', 'Jus Lemon 🍋', '柠檬汁 🍋');
      if (scenarioEn.includes('vinegar')) return txt('Vinegar 🍶', 'Cuka 🍶', '醋 🍶');
      if (scenarioEn.includes('pineapple juice')) return txt('Pineapple Juice 🍍', 'Jus Nanas 🍍', '菠萝汁 🍍');
      if (scenarioEn.includes('acid solution') || scenarioEn.includes('acidic')) return txt('Acid solution 🧪', 'Larutan asid 🧪', '酸性溶液 🧪');
      return txt('Substance 🧪', 'Bahan Kimia 🧪', '化学物质 🧪');
    } else {
      // Extract numbers
      const match = scenarioEn.match(/\d+/);
      return match ? match[0] : '50';
    }
  };

  // Switch depending on Science Process Skill
  switch (skill) {
    case 'observation':
      return (
        <div id="illustration-observation" className="rounded-xl border border-emerald-500/20 bg-slate-950/80 p-5 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.05)]">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/10 mb-4 select-none">
            <span className="text-xs font-mono uppercase text-emerald-400">⚡ {txt("SPS: Observation holographic projector", "KPS: Projektor Holografik Pemerhatian", "SPS: 观察室物理全息投影仪")}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {diff === 'easy' ? (
            /* Easy questions (index 0 to 4 in question array) */
            (questionIndex % 5 === 0) ? (
              /* Q0: Plant growth comparison */
              <div className="space-y-4">
                <div className="text-center font-bold text-xs text-slate-300 font-mono">
                  🌱 {txt("Specimen Response: Grasslands Light Contrast", "Respons Spesimen: Kontras Cahaya Padang Rumput", "生物对照组：光照对比绿色植物")}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Plant X (Healthy) */}
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/15 text-center flex flex-col items-center">
                    <span className="text-[10px] font-bold text-emerald-400 block mb-1 truncate w-full">{txt("Plant X (Light + Water)", "Tumbuhan X (Cahaya + Air)", "植物 X (光照 + 浇水)")}</span>
                    <div className="relative h-24 w-24 flex items-center justify-center bg-slate-950/60 rounded-md p-1">
                      <motion.div 
                        className="absolute top-1 right-1 text-base text-yellow-400"
                        animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        ☀️
                      </motion.div>
                      <div className="absolute top-1 left-1 text-xs text-sky-400 animate-bounce">💧</div>

                      <svg viewBox="0 0 100 100" className="w-16 h-16 text-emerald-500">
                        <path d="M50,90 Q48,60 50,20" stroke="#10b981" strokeWidth="4" fill="none" />
                        <path d="M50,40 Q25,25 50,15" fill="#10b981" />
                        <path d="M50,40 Q75,25 50,15" fill="#10b981" />
                        <path d="M50,70 Q20,55 50,45" fill="#22c55e" />
                        <path d="M50,70 Q80,55 50,45" fill="#22c55e" />
                      </svg>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-300 mt-2 px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/20 rounded-full">
                      ✅ {txt("Healthy & Green", "Sihat & Hijau", "健康翠绿")}
                    </span>
                  </div>

                  {/* Plant Y (Wilted) */}
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-center flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1 truncate w-full">{txt("Plant Y (Carbon cupboard + Dry)", "Tumbuhan Y (Almari gelap + Kering)", "植物 Y (黑暗处 + 干燥)")}</span>
                    <div className="relative h-24 w-24 flex items-center justify-center bg-slate-950/60 rounded-md p-1 border border-slate-900">
                      <span className="absolute top-1 right-2 text-xs text-slate-600">🚪</span>
                      <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-600/70">
                        <path d="M50,90 Q40,65 30,40" stroke="#d97706" strokeWidth="3" fill="none" />
                        <path d="M30,40 Q15,45 22,55" fill="#b45309" />
                        <path d="M30,40 Q45,35 32,55" fill="#b45309" />
                        <path d="M42,65 Q25,75 35,80" fill="#78350f" />
                      </svg>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-amber-500 mt-2 px-2 py-0.5 bg-amber-950/30 border border-amber-900/20 rounded-full">
                      ⚠️ {txt("Wilted & Yellow", "Layu & Kuning", "枯萎发黄")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (questionIndex % 5 === 1) ? (
              /* Q1: Magnet Attraction Scene */
              <div className="space-y-3">
                <div className="text-center font-bold text-xs text-slate-300 font-mono">
                  🧲 {txt("Active Magnetic Flux test-bench", "Bangku Ujian Fluks Magnetik Aktif", "电磁学：物理磁铁吸引力试验台")}
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-emerald-500/10 flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-around w-full">
                    {/* Left Side: Magnet + Attracted Iron Nail */}
                    <div className="flex flex-col items-center p-2 bg-slate-950/60 rounded border border-emerald-500/20 w-[48%]">
                      <span className="text-[9px] font-bold text-red-400 mb-1">{txt("Magnet & Iron Nail", "Magnet & Paku Besi", "磁铁与金属铁钉")}</span>
                      <div className="relative h-20 w-24 flex items-center justify-center">
                        <motion.div 
                          className="w-12 h-6 rounded flex border border-slate-700 overflow-hidden font-mono text-[9px] font-black"
                          animate={{ x: [-2, 2, -2] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <div className="w-1/2 bg-red-600 flex items-center justify-center text-white">N</div>
                          <div className="w-1/2 bg-sky-600 flex items-center justify-center text-white">S</div>
                        </motion.div>
                        <motion.div 
                          className="absolute right-4 w-6 h-10 border-r-2 border-dashed border-red-500/60 rounded-full"
                          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                        <motion.svg viewBox="0 0 40 20" className="w-8 h-4 absolute right-1 text-slate-400" animate={{ x: [0, -1, 0] }}>
                          <path d="M 0,10 L 30,10 L 30,5 L 35,5 L 35,15 L 30,15 L 30,10" fill="currentColor" />
                          <polygon points="0,10 5,6 5,14" fill="currentColor" />
                        </motion.svg>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-mono">✅ {txt("Clings instantly", "Ditarik Serta-merta", "牢牢吸附！")}</span>
                    </div>

                    {/* Right Side: Non-magnetic materials ruler & eraser */}
                    <div className="flex flex-col items-center p-2 bg-slate-950/40 rounded border border-slate-800 w-[48%] border-dashed">
                      <span className="text-[9px] font-bold text-slate-400 mb-1">{txt("Plastic & Eraser", "Pembaris & Pemadam", "塑料尺与橡皮擦")}</span>
                      <div className="h-20 w-24 flex flex-col justify-around items-center p-1">
                        <div className="w-16 h-3 bg-yellow-650/20 border border-yellow-600/30 rounded text-[7px] text-yellow-500 font-mono flex items-center justify-center">
                          📐 {txt("Ruler", "Pembaris", "塑料直尺")}
                        </div>
                        <div className="w-10 h-4 bg-pink-850/25 border border-pink-500/35 rounded text-[7px] text-pink-400 font-mono flex items-center justify-center">
                          Eraser ▰
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">❌ {txt("No attraction", "Tiada Tarikan", "无法吸引/无反应")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (questionIndex % 5 === 2) ? (
              /* Q2: Sugar and Sand Solubility & Sediment Beakers */
              <div className="space-y-3">
                <div className="text-center font-bold text-xs text-slate-300 font-mono">
                  🍶 {txt("Beaker Solubility Analysis", "Analisis Kelarutan Bikar", "化学：溶液混合颗粒溶解度对比")}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Beaker A - Dissolved Sugar */}
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/10 text-center flex flex-col items-center">
                    <span className="text-[10px] font-bold text-emerald-400 block mb-1 truncate w-full">{txt("Beaker A (Stir Sugar)", "Bikar A (Gula)", "烧杯 A (加入蔗糖并搅拌)")}</span>
                    <div className="relative h-20 w-20 flex items-center justify-center bg-slate-950/60 rounded-md">
                      <svg viewBox="0 0 60 80" className="w-10 h-14 text-sky-400">
                        <path d="M15,10 V75 A5,5 0 0 0 20,80 H40 A5,5 0 0 0 45,75 V10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                        <rect x="16.5" y="40" width="27" fill="rgba(56, 189, 248, 0.25)" height="38" />
                        <circle cx="22" cy="50" r="1" fill="#fff" className="animate-ping" />
                        <circle cx="34" cy="65" r="1" fill="#fff" className="animate-pulse" />
                      </svg>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-300 mt-2">
                      ✨ {txt("Larut / Clear solution", "Larut & Jernih", "完全溶解，无杂质")}
                    </span>
                  </div>

                  {/* Beaker B - Sand Settled */}
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-amber-900/25 text-center flex flex-col items-center">
                    <span className="text-[10px] font-bold text-amber-500 block mb-1 truncate w-full">{txt("Beaker B (Stir Fine Sand)", "Bikar B (Pasir)", "烧杯 B (加入细砂并搅拌)")}</span>
                    <div className="relative h-20 w-20 flex items-center justify-center bg-slate-950/60 rounded-md">
                      <svg viewBox="0 0 60 80" className="w-10 h-14 text-slate-400">
                        <path d="M15,10 V75 A5,5 0 0 0 20,80 H40 A5,5 0 0 0 45,75 V10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                        <rect x="16.5" y="40" width="27" fill="rgba(217, 119, 6, 0.08)" height="38" />
                        <rect x="16.5" y="70" width="27" fill="#854d0e" height="8" className="rounded" />
                        <circle cx="20" cy="73" r="0.7" fill="#b45309" />
                        <circle cx="28" cy="74" r="0.7" fill="#d97706" />
                        <circle cx="32" cy="72" r="0.7" fill="#78350f" />
                        <circle cx="38" cy="75" r="0.7" fill="#b45309" />
                      </svg>
                    </div>
                    <span className="text-[9px] font-mono text-amber-500 mt-2">
                      🟤 {txt("Sand settles at bottom", "Pasir mendap di dasar", "产生沉淀，细砂积于底部")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (questionIndex % 5 === 3) ? (
              /* Q3: Balloon air expansion cylinder */
              <div className="space-y-4">
                <div className="text-center font-bold text-xs text-slate-300 font-mono">
                  🎈 {txt("Thermal Gas Expansion Demo", "Demonstrasi Eksperimen Pengembangan Gas Haba", "物理：气体热胀冷缩全息模拟")}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Left: Hot water - inflated */}
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-red-500/15 text-center flex flex-col items-center">
                    <span className="text-[10px] font-semibold text-red-400 block mb-1 font-mono">🌡️ {txt("Extremely Hot Water", "Air Amat Panas", "1. 放入极热水 (45s)")}</span>
                    <div className="relative h-28 w-24 bg-slate-950/60 rounded flex items-center justify-center border border-red-500/5">
                      {/* Hot steam waves */}
                      <motion.span 
                        className="absolute text-red-400/40 text-[9px] top-6 font-serif"
                        animate={{ y: [0, -15], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        ♨ ♨ ♨
                      </motion.span>
                      <svg viewBox="0 0 80 100" className="w-14 h-24">
                        {/* Bottle */}
                        <rect x="25" y="45" width="30" height="45" rx="4" fill="rgba(255,255,255,0.05)" stroke="#64748b" strokeWidth="2" />
                        <rect x="33" y="30" width="14" height="15" fill="rgba(255,255,255,0.05)" stroke="#64748b" strokeWidth="2" />
                        {/* Inflated standing green balloon */}
                        <ellipse cx="40" cy="18" rx="16" ry="14" fill="#10b981" opacity="0.9" />
                        <path d="M37,32 L43,32 L40,28 Z" fill="#10b981" />
                      </svg>
                    </div>
                    <span className="text-[8.5px] font-bold text-emerald-400 mt-2 block leading-snug">
                      🎈 {txt("Inflated & stands upright", "Belon mengembung & tegak", "气球瞬间膨胀、直立")}
                    </span>
                  </div>

                  {/* Right: Ice water - deflated */}
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-sky-500/15 text-center flex flex-col items-center">
                    <span className="text-[10px] font-semibold text-sky-400 block mb-1 font-mono">❄️ {txt("Ice Cold Water", "Air Sangat Sejuk", "2. 转移到冰水中")}</span>
                    <div className="relative h-28 w-24 bg-slate-950/60 rounded flex items-center justify-center border border-sky-500/5">
                      <svg viewBox="0 0 80 100" className="w-14 h-24">
                        {/* Bottle */}
                        <rect x="25" y="45" width="30" height="45" rx="4" fill="rgba(255,255,255,0.05)" stroke="#64748b" strokeWidth="2" />
                        <rect x="33" y="30" width="14" height="15" fill="rgba(255,255,255,0.05)" stroke="#64748b" strokeWidth="2" />
                        {/* Wrinkled deflated blue balloon */}
                        <path d="M32,32 Q25,25 35,26 Q40,24 45,28 Q43,32 37,32 Z" fill="#3b82f6" opacity="0.8" />
                      </svg>
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-400 mt-2 block leading-snug">
                      📉 {txt("Shrinks & deflates", "Belon mengecut & kempis", "气球迅速塌瘪、收缩")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Q4: Insect lit/dark preferences */
              <div className="space-y-4">
                <div className="text-center font-bold text-xs text-slate-300 font-mono">
                  🐛 {txt("Organism Phototaxis Bio-tray", "Dulang Ujian Fototaksis Organisma", "生物学：昆虫趋光性有盖托盘")}
                </div>
                <div className="bg-slate-900/60 rounded-xl border border-indigo-500/10 p-3 flex flex-col items-center space-y-3">
                  <span className="text-[10px] font-mono text-indigo-300">{txt(`Behavior Trial tracking ${getEntityName('animal')}`, `Ujian perlakuan mengesan ${getEntityName('animal')}`, `行为学研究：跟踪 ${getEntityName('animal')} 分布`)}</span>
                  
                  {/* Bio tray divided */}
                  <div className="w-full h-20 bg-slate-950 rounded-lg border border-slate-800 relative flex overflow-hidden">
                    {/* Shadowy half */}
                    <div className="w-1/2 h-full bg-slate-900/90 relative p-1.5 flex flex-col justify-between border-r border-slate-800">
                      <span className="text-[8px] font-mono uppercase text-slate-400">🌑 {txt("Dark Half (Covered)", "Bahagian Gelap (Tertutup)", "黑暗端区 (装有遮光盖)")}</span>
                      <div className="flex flex-wrap gap-2 items-center justify-center h-full max-h-12 overflow-hidden py-1">
                        {[...Array(9)].map((_, idx) => (
                          <motion.span 
                            key={idx} 
                            className="text-xs"
                            animate={{ x: [-1, 1, -1], y: [1, -1, 1] }}
                            transition={{ duration: 1.5 + (idx * 0.1), repeat: Infinity }}
                          >
                            🐛
                          </motion.span>
                        ))}
                      </div>
                      <span className="text-[9px] text-teal-300 font-bold font-mono text-center">{txt("Count: 9", "Kiraan: 9", "测出数量：9 只 (90%)")}</span>
                    </div>

                    {/* Illuminated half */}
                    <div className="w-1/2 h-full bg-yellow-500/10 relative p-1.5 flex flex-col justify-between">
                      <span className="text-[8px] font-mono uppercase text-amber-400">💡 {txt("Lit Half (Lamp)", "Bahagian Terang (Lampu)", "强光端区 (台灯直射)")}</span>
                      <div className="flex items-center justify-center h-full">
                        <motion.span 
                          className="text-xs"
                          animate={{ x: [-2, 2, -2] }}
                          transition={{ duration: 2.2, repeat: Infinity }}
                        >
                          🐛
                        </motion.span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold font-mono text-center">{txt("Count: 1", "Kiraan: 1", "测出数量：1 只 (10%)")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : diff === 'medium' ? (
            /* Medium question: Bunsen water heating graph */
            <div className="space-y-3">
              <div className="text-center font-bold text-xs text-slate-300 font-mono">
                🔥 {txt("Bunsen Burner Calorimetry Console", "Konsol Kalorimetri Penunu Bunsen", "热力学：本生灯加热水温测定")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                
                {/* SVG experimental apparatus */}
                <div className="md:col-span-4 bg-slate-900/60 p-2.5 rounded-lg border border-indigo-500/10 flex flex-col items-center">
                  <div className="relative h-28 w-20 flex flex-col justify-end items-center">
                    <span className="absolute top-1 text-slate-400 text-[8px] font-mono">100ºC Limit</span>
                    {/* Beaker with water and thermometer */}
                    <svg viewBox="0 0 60 80" className="w-12 h-16 text-cyan-400">
                      <rect x="15" y="25" width="30" height="50" rx="3" fill="rgba(56, 189, 248, 0.2)" stroke="currentColor" strokeWidth="2.5" />
                      <line x1="16.5" y1="35" x2="43.5" y2="35" stroke="currentColor" strokeWidth="1.5" />
                      {/* Thermometer rod */}
                      <rect x="28" y="10" width="4" height="60" rx="1" fill="#fff" stroke="#475569" strokeWidth="1" />
                      <rect x="29" y="32" width="2" height="38" fill="#ef4444" />
                    </svg>
                    {/* Fire burner */}
                    <div className="h-6 w-10 relative flex justify-center items-end mt-1">
                      <div className="h-4 w-1 bg-slate-400" />
                      <motion.div 
                        className="absolute bottom-2 w-6 h-6 bg-gradient-to-t from-yellow-300 via-amber-500 to-red-500 rounded-full blur-xs"
                        animate={{ scale: [1, 1.25, 1], y: [0, -3, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  <span className="text-[8.5px] font-bold text-red-400 mt-2 font-mono uppercase bg-red-950/40 px-1 py-0.2 rounded border border-red-500/20">{txt("Evaporating 100ºC", "Mengewap 100ºC", "持续沸腾 100ºC")}</span>
                </div>

                {/* Table Data list */}
                <div className="md:col-span-8 bg-slate-900/60 p-3 rounded-lg border border-slate-850 font-mono text-[9.5px] space-y-1.5 text-slate-300">
                  <div className="font-bold border-b border-white/5 pb-1 select-none flex justify-between text-yellow-400">
                    <span>⏱️ {txt("Timer Index", "Indeks Masa", "时间记录轴")}</span>
                    <span>🌡️ {txt("Temperature", "Suhu Air (ºC)", "摄氏读数")}</span>
                  </div>
                  <div className="flex justify-between"><span>0 min</span> <span>30ºC ({txt("Room", "Bilik", "室温")})</span></div>
                  <div className="flex justify-between"><span>2 mins</span> <span>48ºC</span></div>
                  <div className="flex justify-between"><span>4 mins</span> <span>66ºC</span></div>
                  <div className="flex justify-between"><span>6 mins</span> <span>84ºC</span></div>
                  <div className="flex justify-between text-emerald-300 font-bold bg-emerald-950/20 px-1 rounded">
                    <span>8 mins onwards</span> 
                    <span>100ºC ({txt("Boiling Point", "Takat Didih", "稳定平衡沸点")})</span>
                  </div>
                  <div className="flex justify-between text-emerald-300 font-bold bg-emerald-950/20 px-1 rounded">
                    <span>10 mins</span> 
                    <span>100ºC ({txt("Constant", "Malar", "常温保持")})</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Advanced question: Acid substance pH paper */
            <div className="space-y-4">
              <div className="text-center font-bold text-xs text-slate-300 font-mono">
                🧪 {txt("Indicator Litmus Chemical Reactor", "Reaktor Kimia Kertas Litmus Penunjuk", "酸碱化学：pH 传感器与蓝色石蕊试纸试验")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Acidic Substance beaker */}
                <div className="bg-slate-900/60 p-3 rounded-lg border border-purple-500/15 text-center flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-300 block mb-1 truncate w-full">{getEntityName('substance')}</span>
                  <div className="relative h-24 w-24 bg-slate-950/60 rounded flex items-center justify-center border border-purple-500/5">
                    
                    {/* Litmus Paper turning red */}
                    <div className="absolute top-2 w-2.5 h-14 border border-slate-600 rounded-sm overflow-hidden flex flex-col">
                      <div className="bg-sky-500 h-1/2 w-full" />
                      <motion.div 
                        className="bg-red-500 h-1/2 w-full" 
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    </div>

                    <svg viewBox="0 0 60 80" className="w-12 h-16 text-purple-400">
                      <path d="M15,15 V75 A5,5 0 0 0 20,80 H40 A5,5 0 0 0 45,75 V15" fill="none" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="16.5" y="45" width="27" fill="rgba(168, 85, 247, 0.15)" height="33" />
                    </svg>

                    {/* Sensor LCD meter */}
                    <div className="absolute bottom-1 bg-slate-900/90 border border-purple-500/20 text-purple-300 text-[8px] font-mono px-1.5 py-0.5 rounded scale-90">
                      pH: 3.6
                    </div>
                  </div>
                  <span className="text-[8.5px] font-black text-red-400 mt-2 block">{txt("Instant Red Litmus Shift", "Kertas Litmus Biru ➔ Merah", "蓝色石蕊试纸 ➔ 变红")}</span>
                </div>

                {/* Pure water beaker */}
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-center flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1 truncate w-full">{txt("Pure Water", "Air Suling", "纯净蒸馏水")}</span>
                  <div className="relative h-24 w-24 bg-slate-950/60 rounded flex items-center justify-center border border-slate-900">
                    
                    {/* Unchanged blue Litmus Paper */}
                    <div className="absolute top-2 w-2.5 h-14 bg-sky-500 border border-slate-600 rounded-sm" />

                    <svg viewBox="0 0 60 80" className="w-12 h-16 text-cyan-500">
                      <path d="M15,15 V75 A5,5 0 0 0 20,80 H40 A5,5 0 0 0 45,75 V15" fill="none" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="16.5" y="45" width="27" fill="rgba(6, 182, 212, 0.15)" height="33" />
                    </svg>

                    {/* Water LCD meter */}
                    <div className="absolute bottom-1 bg-slate-900/90 border border-cyan-500/20 text-cyan-300 text-[8px] font-mono px-1.5 py-0.5 rounded scale-90">
                      pH: 7.0
                    </div>
                  </div>
                  <span className="text-[8.5px] font-semibold text-slate-400 mt-2 block">{txt("No Paper Change (Neutral)", "Kertas Tiada Perubahan", "石蕊试纸无任何颜色改变")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      );

    case 'inference':
      return (
        <div id="illustration-inference" className="rounded-xl border border-sky-500/20 bg-slate-950/80 p-5 backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.05)]">
          <div className="flex items-center justify-between pb-3 border-b border-sky-500/10 mb-4 select-none">
            <span className="text-xs font-mono uppercase text-sky-400">⚡ {txt("SPS: Scientific Inference Lab", "KPS: Makmal Inferens Saintifik", "SPS: 逻辑科学推断室")}</span>
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
          </div>

          {diff === 'easy' ? (
            /* Easy caterpillar airtight dome testing */
            <div className="space-y-4">
              <div className="text-center font-bold text-xs text-slate-300 font-mono">
                🧪{txt(`Bell Dome Airtight respiration of ${getEntityName('animal')}`, `Gas Kedap Udara bagi ${getEntityName('animal')}`, `气密钟罩：${getEntityName('animal')} 呼吸试验系统`)}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Jar A (Lively) */}
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/15 text-center flex flex-col items-center">
                  <span className="text-[10px] font-bold text-emerald-400 block mb-1 truncate w-full">{txt("Jar A (Leaf Only)", "Balang A (Daun Sahaja)", "A 密封瓶 (普通叶片食物)")}</span>
                  <div className="relative h-24 w-24 flex items-center justify-center bg-slate-950/60 rounded-md">
                    <svg viewBox="0 0 80 80" className="w-16 h-16 text-emerald-500">
                      <path d="M15,75 C15,20 65,20 65,75 V75" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="10" y1="75" x2="70" y2="75" stroke="currentColor" strokeWidth="3" />
                      {/* Active green caterpillars */}
                      <circle cx="35" cy="55" r="4" fill="#10b981" />
                      <circle cx="39" cy="54" r="4" fill="#22c55e" />
                      <circle cx="43" cy="56" r="4" fill="#10b981" />
                      <circle cx="47" cy="55" r="3.5" fill="#34d399" />
                      <path d="M49,53 L49,50" stroke="#10b981" strokeWidth="1" />
                    </svg>
                    <span className="absolute bottom-1.5 right-2 text-xs">🌿</span>
                    <span className="absolute top-1 left-1.5 text-[8.5px] text-emerald-400 px-1 bg-slate-900/50 rounded font-mono">O₂ ✅</span>
                  </div>
                  <span className="text-[9px] font-mono font-black text-emerald-400 mt-2 uppercase">
                    {txt("Lively & Active", "Sangat Aktif", "活泼健康，自主呼吸")}
                  </span>
                </div>

                {/* Jar B (Dead) */}
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-red-500/15 text-center flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1 truncate w-full">{txt("Jar B (Added NaOH Dish)", "Balang B (+ Mangkuk NaOH)", "B 密封瓶 (+ 氢氧化钠除潮剂)")}</span>
                  <div className="relative h-24 w-24 flex items-center justify-center bg-slate-950/60 rounded-md">
                    <svg viewBox="0 0 80 80" className="w-16 h-16 text-slate-600">
                      <path d="M15,75 C15,20 65,20 65,75 V75" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="10" y1="75" x2="70" y2="75" stroke="currentColor" strokeWidth="3" />
                      {/* Dead/motionless insect */}
                      <ellipse cx="40" cy="65" r="3" fill="#ef4444" opacity="0.6" />
                      <circle cx="43" cy="67" r="2.5" fill="#f87171" opacity="0.6" />
                      {/* Dish at bottom */}
                      <rect x="22" y="70" width="36" height="4" rx="1" fill="#94a3b8" />
                    </svg>
                    <span className="absolute bottom-1.5 right-1.5 text-xs grayscale line-through">🍂</span>
                    <span className="absolute top-1 left-1 bg-slate-900/80 border border-red-500/20 text-red-400 text-[8px] font-mono px-1 rounded scale-85">No CO₂-H₂O</span>
                  </div>
                  <span className="text-[9px] font-mono font-black text-red-500 mt-2 uppercase">
                    💀 {txt("Dead / No Movement", "Layu / Mati", "窒息死亡 / 无法生存")}
                  </span>
                </div>
              </div>
            </div>
          ) : diff === 'medium' ? (
            /* Medium thermal rod heat conduction wax melting study */
            <div className="space-y-3 font-mono">
              <div className="text-center font-bold text-xs text-slate-300">
                🔥 {txt("Far-end Paraffin Wax Heating Bar", "Ujian Pepejal Lilin Hujung Rod Bahan", "热导率：铜、铁、玻璃棒远端石蜡熔化快慢")}
              </div>
              <div className="bg-slate-900/60 rounded-lg p-3 border border-sky-500/10 space-y-3">
                {/* Copper */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-amber-400 font-bold">
                    <span>👑 {txt("Copper Rod (Visibly fast conductance)", "Rod Kuprum (Konduktiviti Tinggi)", "铜棒 (金属热的不良导体? 极佳导热体)")}</span>
                    <span>{txt("Melted in ", "Lebur dalam ", "熔化时间：")}{getEntityName('val')}s</span>
                  </div>
                  <div className="h-4 bg-amber-950/20 rounded border border-amber-500/30 relative flex items-center p-0.5 overflow-hidden">
                    <div className="absolute right-3 text-[8.5px] text-yellow-400 bg-yellow-950/40 px-1 rounded animate-pulse">{txt("Wax fully melted 💧", "Lilin Lebur Cair", "石蜡完全变成液态 💧")}</div>
                    <motion.div 
                      className="h-full bg-gradient-to-r from-red-650 via-amber-505 to-transparent"
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                </div>

                {/* Iron */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-300">
                    <span>⛓️ {txt("Iron Rod (Medium conductance)", "Rod Besi (Konduktiviti Sederhana)", "铁棒 (中等导热体)")}</span>
                    <span>{txt("Melted in ", "Lebur dalam ", "熔化时间：")}{Number(getEntityName('val')) + 45}s</span>
                  </div>
                  <div className="h-4 bg-slate-900/20 rounded border border-slate-700 relative flex items-center p-0.5 overflow-hidden">
                    <div className="absolute right-3 text-[8.5px] text-slate-400">{txt("Semi-melted ⏳", "Lilin Separa Cair", "石蜡正在缓慢熔化 ⏳")}</div>
                    <motion.div 
                      className="h-full bg-gradient-to-r from-red-650 to-transparent"
                      initial={{ width: 0 }}
                      animate={{ width: "40%" }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                </div>

                {/* Glass */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-sky-400">
                    <span>💎 {txt("Glass Rod (Thermal Insulator)", "Rod Kaca (Penebat Haba)", "玻璃棒 (热的不良导体/绝热体)")}</span>
                    <span>{txt("Solid > 5 mins", "Pepejal > 5 min", "固态 > 5分钟未变")}</span>
                  </div>
                  <div className="h-4 bg-cyan-950/20 rounded border border-cyan-850 relative flex items-center p-0.5 overflow-hidden">
                    <div className="absolute right-3 text-[8.5px] text-sky-300 bg-sky-950/30 px-1 rounded font-bold font-mono">❄️ {txt("Meltless Solid ⚪", "Kekal Pepejal Keras", "石蜡依旧保持固态 ⚪")}</div>
                    <div className="h-full w-1 bg-red-600" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Advanced river ecological zones and Dissolved Oxygen levels */
            <div className="space-y-3 font-mono">
              <div className="text-center font-bold text-xs text-slate-300">
                🌊 {txt("Industrial Riverine Effluent Oxygen Grid", "Grid Oksigen Aliran Sisa Sungai Industri", "河流生态学：工业废水氧含量及物种生存图示")}
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-sky-500/10 space-y-4">
                
                {/* Layout Segments */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Segment A Upstream */}
                  <div className="bg-slate-950/80 p-2 border border-emerald-500/20 rounded text-center">
                    <span className="text-[9px] text-emerald-400 uppercase tracking-widest block font-bold mb-1">⛲ {txt("River Segment A (Upstream)", "Sungai Segmen A (Hulu)", "上游 A 河段 (未受污染)")}</span>
                    <div className="h-14 w-full bg-gradient-to-b from-teal-900/40 to-teal-950/60 rounded flex items-center justify-around text-lg">
                      <span>🐠</span> <span>🐠</span> <span>🐟</span>
                    </div>
                    <div className="mt-1.5 flex justify-between text-[8px] text-slate-400">
                      <span>{txt("Bio Diversity: 45 species", "Biodiversiti: 45 spesies", "生物群落：45种")}</span>
                      <span className="text-emerald-400 font-bold">O₂: 100%</span>
                    </div>
                  </div>

                  {/* Segment B Downstream of discharge */}
                  <div className="bg-slate-950/80 p-2 border border-red-550/20 rounded text-center relative overflow-hidden">
                    {/* Tiny smoking factory pipes */}
                    <div className="absolute top-0 right-1 text-[11px] animate-bounce">🏭➔☣️</div>
                    <span className="text-[9px] text-purple-400 uppercase tracking-widest block font-bold mb-1">☣️ {txt("Segment B (Downstream)", "Sungai Segmen B (Hilir)", "下游 B 河段 (废水灌入)")}</span>
                    <div className="h-14 w-full bg-gradient-to-b from-purple-950/40 to-slate-900 rounded flex items-center justify-around text-lg">
                      <span className="opacity-80">🪱</span> <span className="opacity-45 scale-75">🪱</span>
                    </div>
                    <div className="mt-1.5 flex justify-between text-[8px] text-slate-400">
                      <span>{txt("Resilient: 4 species", "Tahan: 4 spesies cecacing", "高抗：仅4种蠕虫")}</span>
                      <span className="text-red-400 font-bold">O₂: {100 - Number(getEntityName('val'))}% 📉</span>
                    </div>
                  </div>
                </div>

                <div className="text-[8.5px] text-center text-slate-400 border-t border-white/5 pt-2 leading-relaxed">
                  📢 <strong>Inference:</strong> {txt("Industrial discharges introduced pollutants which consume DO (Dissolved Oxygen) and choke sensitive ecosystem species.", "Pelepasan sisa industri memperkenalkan bahan pencemar yang memakan DO (Oksigen Terlarut) lalu membunuh spesies sensitif.", "工业排污引入有机污染物，导致水中溶解氧(DO)被细菌消耗，窒息了敏感的高级水生物种。")}
                </div>
              </div>
            </div>
          )}
        </div>
      );

    case 'hypothesis':
      return (
        <div id="illustration-hypothesis" className="rounded-xl border border-amber-500/20 bg-slate-950/80 p-5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.05)]">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/10 mb-4 select-none">
            <span className="text-xs font-mono uppercase text-amber-400">⚡ {txt("SPS: Hypothesis formulation terminal", "KPS: Terminal Formulasi Hipotesis", "SPS: 科学假说/趋势研究终端")}</span>
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          </div>

          {diff === 'easy' ? (
            /* Easy: Grass growth vs temperature */
            <div className="space-y-4 font-mono">
              <div className="text-center font-bold text-xs text-slate-350">
                🌿 {txt("Daily Stem Extension vs Ambient Temperature", "Kadar Tinggi Batang Rumput vs Suhu Sekitar", "生态：不同环境温度下草地每日生长高度")}
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {/* 15C */}
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-center flex flex-col items-center">
                  <span className="text-[9px] text-slate-400 block mb-1">Cold 15ºC</span>
                  <div className="h-16 w-full bg-slate-950/60 rounded flex items-end justify-center p-1.5">
                    {/* Small grass */}
                    <div className="w-1.5 h-4 bg-emerald-600 rounded-t-full mx-0.5" />
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-t-full mx-0.5" />
                  </div>
                  <span className="text-[8.5px] text-slate-400 mt-2 font-bold font-mono">1.2 cm ({txt("Slow", "Perlahan", "慢")})</span>
                </div>

                {/* 25C */}
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-center flex flex-col items-center">
                  <span className="text-[9px] text-amber-400 block mb-1">Mild 25ºC</span>
                  <div className="h-16 w-full bg-slate-950/60 rounded flex items-end justify-center p-1.5">
                    {/* Medium grass */}
                    <div className="w-1.5 h-6 bg-emerald-600 rounded-t-full mx-0.5 animate-pulse" />
                    <div className="w-1.5 h-10 bg-emerald-450 rounded-t-full mx-0.5" />
                    <div className="w-1.5 h-8 bg-emerald-500 rounded-t-full mx-0.5" />
                  </div>
                  <span className="text-[8.5px] text-amber-400 mt-2 font-bold font-mono">3.4 cm ({txt("Medium", "Sederhana", "中")})</span>
                </div>

                {/* 35C */}
                <div className="bg-slate-900/60 p-2 rounded-lg border border-emerald-500/15 text-center flex flex-col items-center">
                  <span className="text-[9px] text-emerald-400 block mb-1">Warm 35ºC</span>
                  <div className="h-16 w-full bg-slate-950/60 rounded flex items-end justify-center p-1.5">
                    {/* Tall grass */}
                    <motion.div className="w-1.5 h-10 bg-emerald-600 rounded-t-full mx-0.5" animate={{ height: [36, 40, 36] }} transition={{ repeat: Infinity, duration: 1 }} />
                    <motion.div className="w-1.5 h-14 bg-emerald-400 rounded-t-full mx-0.5" animate={{ height: [50, 56, 50] }} transition={{ repeat: Infinity, duration: 1.1 }} />
                    <motion.div className="w-1.5 h-11 bg-emerald-500 rounded-t-full mx-0.5" animate={{ height: [40, 44, 40] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                  </div>
                  <span className="text-[8.5px] text-emerald-400 mt-2 font-black font-mono">5.8 cm ({txt("Rapid", "Cepat", "快")})</span>
                </div>
              </div>
              <div className="font-mono text-[8px] text-center text-slate-400">{txt("Hypothesis: The HIGHER the ambient environment temp, the FASTER the daily grass growth.", "Hipotesis: Semakin TINGGI suhu persekitaran, semakin CEPAT kadar tinggi pertumbuhan batang.", "假说结构：外界环境温度越高，植物/草地的每日生长高度越快。")}</div>
            </div>
          ) : diff === 'medium' ? (
            /* Medium: Electromagnet pickup loops */
            <div className="space-y-4 font-mono">
              <div className="text-center font-bold text-xs text-slate-350">
                🧲 {txt("Electromagnet Clinging Force vs Coil Count", "Kekuatan Elektromagnet vs Bilangan Lilitan Gelung", "物理：电磁铁线圈缠绕圈数与吸起回形针数量")}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
                {/* 10 loops */}
                <div className="bg-slate-900/65 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block font-bold">10 loops</span>
                  <div className="h-14 flex items-center justify-center text-lg">🧲📎📎</div>
                  <span className="text-[8.5px] text-slate-400 font-bold">{txt("Lifts 3 clips", "3 klip kertas", "吸起 3 个回形针")}</span>
                </div>

                {/* 20 loops */}
                <div className="bg-slate-900/65 p-2 rounded border border-slate-800">
                  <span className="text-amber-400 block font-bold">20 loops</span>
                  <div className="h-14 flex items-center justify-center text-lg gap-0.5 animate-bounce">🧲📎📎📎</div>
                  <span className="text-[8.5px] text-amber-300 font-bold">{txt("Lifts 7 clips", "7 klip kertas", "吸起 7 个回形针")}</span>
                </div>

                {/* 30 loops */}
                <div className="bg-slate-905/70 p-2 rounded border border-amber-500/15">
                  <span className="text-emerald-400 block font-bold animate-pulse">30 loops ⚡</span>
                  <div className="h-14 flex items-center justify-center text-lg gap-0.5">🧲📎📎📎📎</div>
                  <span className="text-[8.5px] text-emerald-400 font-black">{txt("Lifts 12 clips!", "12 klip kertas!", "吸起 12 个回形针！")}</span>
                </div>
              </div>
              <div className="font-mono text-[8px] text-center text-slate-400">{txt("Hypothesis: Shifting counts of wire coils boosts physical electromagnetic flux densities.", "Hipotesis: Peningkatan bilangan lilitan dawai meningkatkan kekuatan medan magnet sisa paku.", "假说结论：绝缘导线缠绕在金属钉上的线圈圈数越多，其电磁引力场越强。")}</div>
            </div>
          ) : (
            /* Advanced: Enzyme chemical reaction curve */
            <div className="space-y-4">
              <div className="text-center font-bold text-xs text-slate-350 font-mono">
                📈 {txt("Non-linear Enzyme Reaction Velocity Curve", "Hubungan Bukan Linear Enzim vs Suhu", "生物化学：酶反应活性速率曲线 (山峰状模型)")}
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-amber-500/15 flex flex-col justify-between h-40 font-mono">
                <div className="flex justify-between items-center text-[8.5px]">
                  <span className="text-amber-300">🌡️ Temp Sweep: 10ºC to 60ºC</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded text-[8px] font-bold">Optimum Peak: 37ºC - 40ºC</span>
                </div>

                {/* Draw curve peaks */}
                <div className="h-24 px-4 border-b border-l border-slate-705 relative flex items-end justify-between">
                  {/* Curve backdrop */}
                  <svg className="absolute inset-0 w-full h-full text-amber-500" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Area curve path */}
                    <path d="M 5,95 Q 50,5 95,95" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="3 3" />
                    {/* Active peak circle */}
                    <circle cx="50" cy="15" r="4" fill="#f59e0b" className="animate-ping" />
                    <circle cx="50" cy="15" r="3" fill="#10b981" />
                  </svg>

                  <span className="text-[7.5px] text-slate-500">10ºC<br/>{txt("Low", "Rendah", "几乎无活性")}</span>
                  <span className="text-[7.5px] text-emerald-400 font-bold -translate-y-16">37ºC Optimum<br/>{txt("Peak Activity", "Kemuncak Enzim", "活性巅峰")}</span>
                  <span className="text-[7.5px] text-red-500">60ºC<br/>{txt("Denatured", "Tenyahasil", "高温变性")}</span>
                </div>
              </div>
              <div className="font-mono text-[8px] text-center text-slate-400">{txt("Hypothesis format: Enzymes speed up to an optimum temperature peak (37ºC) and run low when extreme heat denatures proteins.", "Format Hipotesis: Aktiviti enzim meningkat sehingga takat optimum, bertukar susut mendadak akibat denaturasi haba.", "高级假说：酶反应活性随温度升高而匀速加剧，直至 37ºC 活性巅峰；超过此最优温度后蛋白质变性，活性降为零。")}</div>
            </div>
          )}
        </div>
      );

    case 'variables':
      return (
        <div id="illustration-variables" className="rounded-xl border border-cyan-500/20 bg-slate-950/80 p-5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.05)]">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/10 mb-4 select-none">
            <span className="text-xs font-mono uppercase text-cyan-400">⚡ {txt("SPS: Variables Control Board", "KPS: Panel Kawalan Pemboleh Ubah", "SPS: 核心控制自变量配置面板")}</span>
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          <div className="space-y-4">
            {diff === 'easy' ? (
              /* Easy: Tomato fertilizer dose yields */
              <div className="space-y-3 font-mono">
                <div className="text-center font-bold text-xs text-slate-350">
                  🍅 {txt("Tomato Plot Nitrogen Fertilizer doses", "Siasatan Baja Nitrogen Hasil Tomato", "农业：施用不同数量有机氮肥的番茄产量对比")}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* Plot A (0g) */}
                  <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800 text-center flex flex-col items-center">
                    <span className="text-[8px] font-bold text-slate-400 block mb-1">0g {txt("Fertilizer", "Baja", "无化肥")}</span>
                    <div className="h-16 flex items-end justify-center text-xl">🌱🍅</div>
                    <span className="text-[8px] text-slate-400 block mt-1">1 {txt("Tomato", "Tomato", "个番茄")}</span>
                  </div>

                  {/* Plot B (50g) */}
                  <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800 text-center flex flex-col items-center">
                    <span className="text-[8px] font-bold text-amber-400 block mb-1">50g {txt("Fertilizer", "Baja", "50克化肥")}</span>
                    <div className="h-16 flex items-end justify-center text-xl animate-pulse">🌿🍅🍅🍅</div>
                    <span className="text-[8px] text-amber-400 block mt-1">4 {txt("Tomatoes", "Tomato", "个番茄")}</span>
                  </div>

                  {/* Plot C (100g) */}
                  <div className="bg-slate-900/60 p-1.5 rounded border border-emerald-500/15 text-center flex flex-col items-center">
                    <span className="text-[8px] font-bold text-emerald-400 block mb-1">100g {txt("Fertilizer", "Baja", "100克化肥")}</span>
                    <div className="h-16 flex items-end justify-center text-2xl">🌳🍅🍅🍅🍅</div>
                    <span className="text-[8px] text-emerald-400 block font-bold mt-1">9 {txt("Yield Max!", "Hasil Lumayan!", "生机爆棚！")}</span>
                  </div>
                </div>
              </div>
            ) : diff === 'medium' ? (
              /* Medium: Viscous Emptying Cyinders fluid flow */
              <div className="space-y-3 font-mono">
                <div className="text-center font-bold text-xs text-slate-350">
                  ⌛ {txt("Viscosity Piping Flow Emptying Timers", "Masa Aliran Paip Mengikut Kelikatan", "流体力学：等体积不同黏度液体排空速度对比")}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* Water */}
                  <div className="bg-slate-900/65 p-2 rounded border border-slate-800 text-center">
                    <span className="text-[9px] text-sky-400 font-bold block mb-1">{txt("Plain Water", "Air Suling", "纯净水 (极稀)")}</span>
                    <div className="h-10 bg-sky-950/20 border border-sky-900/30 rounded flex items-center justify-center text-[10px]">💧 {txt("Empty 2s", "Kempis 2s", "排空需 2秒")}</div>
                  </div>

                  {/* Oil */}
                  <div className="bg-slate-900/65 p-2 rounded border border-slate-800 text-center">
                    <span className="text-[9px] text-yellow-400 font-bold block mb-1">{txt("Cooking Oil", "Minyak Masak", "食用油 (普通)")}</span>
                    <div className="h-10 bg-yellow-950/20 border border-yellow-900/30 rounded flex items-center justify-center text-[10px] animate-pulse">⏳ {txt("Empty 8s", "Kempis 8s", "排空需 8秒")}</div>
                  </div>

                  {/* Honey */}
                  <div className="bg-slate-900/65 p-2 rounded border border-cyan-500/15 text-center">
                    <span className="text-[9px] text-amber-500 font-bold block mb-1">{txt("Thick Honey", "Madu Pekat", "浓蜂蜜 (高黏度)")}</span>
                    <div className="h-10 bg-amber-950/20 border border-amber-900/30 rounded flex items-center justify-center text-[10px]">🍯 {txt("Drip 45s", "Menitis 45s", "滴落耗时 45s")}</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Advanced: wire alloys resistance gauge with constant constraints */
              <div className="space-y-3 font-mono">
                <div className="text-center font-bold text-xs text-slate-350">
                  ⚡ {txt("Wire Alloys Diameter Electrical Ohm-meter Resistance", "Rintangan Dawai Alatan Logam Keratan Rentas", "冶金材料学：金属导线横截面积与电阻关系测定")}
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded border border-cyan-500/25 space-y-2 text-[9.5px]">
                  <div className="flex justify-between">
                    <span className="text-amber-400 font-bold">1. MV: {txt("Cross-sectional thickness ($0.5-2.0\\text{ mm}^2$)", "Ketebalan keratan rentas dawai", "横截面厚度 ($0.5-2.0\\text{ mm}^2$ )")}</span>
                    <span className="text-slate-500">[Varies]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-400 font-bold">2. RV: {txt("Electrical resistance (ohms ⚡)", "Rintangan elektrik (ohm)", "测出电阻 (欧姆/ohms ⚡)")}</span>
                    <span className="text-slate-500">[Decreases]</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-1.5 font-bold text-sky-400">
                    <span>🔒 CV: {txt("Wire Length (1.0 Meter) & Temp (25ºC)", "Panjang Dawai (1.0m) & Suhu Bilik", "确保恒定：导线长度(1.0米) 及 环境室温(25ºC)")}</span>
                    <span>[LOCKED]</span>
                  </div>
                </div>
              </div>
            )}

            {/* General dynamic metadata rendering block */}
            {activeQuestion?.variablesSetup && (
              <div className="bg-slate-900/90 border border-indigo-500/35 p-3 rounded-lg space-y-1.5 font-mono text-[9px]">
                <div className="text-center border-b border-indigo-500/10 pb-1.5 select-none font-bold text-indigo-300">
                  🎮 {txt("Active Selected Variables Mapping Setup", "Pemadanan Pemboleh Ubah Semasa", "当前题目自变量物理对照数据")}
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-400">Manipulated (MV):</span>
                  <span className="text-slate-205 truncate pl-2 max-w-[200px]">{activeQuestion.variablesSetup.manipulated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">Responding (RV):</span>
                  <span className="text-slate-205 truncate pl-2 max-w-[200px]">{activeQuestion.variablesSetup.responding}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-400">Constant (CV):</span>
                  <span className="text-slate-205 truncate pl-2 max-w-[200px]">{activeQuestion.variablesSetup.constant}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 'operational_definition':
      return (
        <div id="illustration-operational-definition" className="rounded-xl border border-violet-500/20 bg-slate-950/80 p-5 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.05)]">
          <div className="flex items-center justify-between pb-3 border-b border-violet-500/10 mb-4 select-none">
            <span className="text-xs font-mono uppercase text-violet-400">⚡ {txt("SPS: Operational Definition Engine", "KPS: Enjin Definisi Secara Operasi", "SPS: 操作性定义物理参数测定仪")}</span>
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
          </div>

          {diff === 'easy' ? (
            /* Easy: rusting nails naked vs painted */
            <div className="space-y-4 font-mono">
              <div className="text-center font-bold text-xs text-slate-350">
                📌 {txt("Iron Rusting chemical trials after 1 week", "Pengaratan Paku Besi Selepas 1 Minggu", "材料学：铁钉浸润防锈生锈对比 (1周后)")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Tube A Naked */}
                <div className="bg-slate-900/60 p-2.5 rounded border border-red-500/15 text-center flex flex-col items-center">
                  <span className="text-[9.5px] font-bold text-red-400 block mb-1">Tube A ({txt("Naked Nail", "Paku Bogel", "无遮挡裸铁钉")})</span>
                  <div className="relative h-20 w-16 bg-slate-950/60 rounded flex items-center justify-center">
                    {/* Nail SVG covered in rust overlay */}
                    <svg viewBox="0 0 20 60" className="w-5 h-16 text-amber-700 animate-pulse">
                      <path d="M 8,0 H 12 V 5 H 10 V 55 H 8 Z" fill="currentColor" />
                      <circle cx="10" cy="12" r="3" fill="#b45309" />
                      <circle cx="8" cy="30" r="2.5" fill="#d97706" />
                      <circle cx="12" cy="45" r="3" fill="#78350f" />
                    </svg>
                    <span className="absolute bottom-1 right-1 text-[8px] text-red-400">💧+💨</span>
                  </div>
                  <span className="text-[8.5px] font-black text-amber-500 mt-2 block">{txt("Reddish-Brown Rust Coating", "Bahan Perang Kemerahan", "产生粗糙红褐色斑块")}</span>
                </div>

                {/* Tube B Painted */}
                <div className="bg-slate-900/60 p-2.5 rounded border border-emerald-500/15 text-center flex flex-col items-center">
                  <span className="text-[9.5px] font-bold text-emerald-400 block mb-1">Tube B ({txt("Painted Rustproof Nail", "Paku Cat", "优质蓝色电泳漆钉")})</span>
                  <div className="relative h-20 w-16 bg-slate-950/60 rounded flex items-center justify-center">
                    <svg viewBox="0 0 20 60" className="w-5 h-16 text-sky-400">
                      <path d="M 8,0 H 12 V 5 H 10 V 55 H 8 Z" fill="currentColor" />
                    </svg>
                    <span className="absolute bottom-1 right-1 text-[8px] text-sky-400">💧+💨</span>
                  </div>
                  <span className="text-[8.5px] font-semibold text-slate-400 mt-2 block">{txt("Smooth protection (No rust)", "Licin Sempurna (Tiada Karat)", "表层光滑亮丽 (未被氧化)")}</span>
                </div>
              </div>
            </div>
          ) : diff === 'medium' ? (
            /* Medium: yeast conical flask with displaced water measure cylinder */
            <div className="space-y-4 font-mono">
              <div className="text-center font-bold text-xs text-slate-350">
                💨 {txt("Yeast Anaerobic Fermentation Bubble Spurt", "Pelepasan Buih Fermentasi Yis Anaerobik", "生物化学：酵母发酵气泡逸出及排水排气速率")}
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-violet-550/20 flex flex-col items-center space-y-4">
                <div className="flex items-center justify-around w-full">
                  {/* Conical flask */}
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-slate-500 font-bold mb-1">Sugar + Yeast in Warm H₂O</span>
                    <div className="relative h-20 w-16 bg-slate-950/60 rounded flex items-center justify-center">
                      <svg viewBox="0 0 60 80" className="w-10 h-16 text-violet-400">
                        {/* Flask profile */}
                        <path d="M25,10 H35 V25 L50,70 A3,3 0 0 1 47,75 H13 A3,3 0 0 1 10,70 L25,25 Z" fill="rgba(167, 139, 250, 0.1)" stroke="currentColor" strokeWidth="2" />
                        <rect x="15" y="55" width="30" height="15" fill="rgba(139, 92, 246, 0.18)" rx="1" />
                        {/* Shaking bubbles */}
                        <motion.circle cx="20" cy="60" r="1.5" fill="#fff" animate={{ y: [0, -25], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
                        <motion.circle cx="35" cy="65" r="1.5" fill="#fff" animate={{ y: [0, -30], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                        <motion.circle cx="28" cy="58" r="1" fill="#fff" animate={{ y: [0, -18], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1 }} />
                      </svg>
                      <span className="absolute text-[12px] top-1">🧪</span>
                    </div>
                  </div>

                  {/* Glass delivery tube path arrow */}
                  <span className="text-violet-500 animate-pulse text-lg font-black shrink-0">➔➔</span>

                  {/* Measuring tube with water displacement */}
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-slate-500 font-bold mb-1">Inverted Water Cylinder</span>
                    <div className="relative h-20 w-12 bg-slate-950/60 rounded border border-slate-800 flex items-end justify-center">
                      {/* Water volume displaced */}
                      <div className="bg-sky-500/20 w-full h-12 border-t border-sky-400 relative">
                        <span className="absolute bottom-1 right-1 text-[8px] text-sky-300 font-mono font-black scale-90">{txt("Displaced H₂O", "Isi padu sisa air", "排出水量")}</span>
                      </div>
                      <span className="absolute text-[10px] top-2 font-mono text-cyan-300 font-black animate-bounce">+{getEntityName('val')} ml/min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Advanced: Muscle fatigue holding dumbbells outstretched */
            <div className="space-y-4">
              <div className="text-center font-bold text-xs text-slate-350 font-mono">
                🏋️ {txt("Dumbbell Biomechanic EMG Signal Fatigue Calibration", "Kalibrasi Amplitud Isyarat EMG Keletihan Otot", "人体工程学：水平负重举起哑铃与肌肉疲劳极限 (EMG波形)")}
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-violet-500/15 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[9.5px]">
                    <span className="text-lg">🏋️</span>
                    <div>
                      <span className="text-slate-400 font-bold block">{txt("Volunteer horizontal posture", "Postur mengangkat tangan", "受试者水平负重哑铃：")} {getEntityName('val')}kg</span>
                      <span className="text-violet-400 text-[8px] block">{txt("Angle threshold drop > 15º check", "Ralat sudut lengan jatuh > 15 darjah", "极限下垂角度检测：> 15º")}</span>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 bg-violet-950/40 border border-violet-500/20 rounded text-[9px] text-emerald-300 font-bold animate-pulse text-right">
                    EMG Ticker Active 〰️
                  </div>
                </div>

                {/* Simulated EMG oscillator wave */}
                <div className="h-14 bg-slate-950/90 rounded border border-slate-905 relative flex overflow-hidden items-center justify-center p-1">
                  <svg className="w-full h-full text-violet-400" viewBox="0 0 200 40" preserveAspectRatio="none">
                    <motion.path 
                      d="M 0,20 Q 25,10 50,20 T 100,20 T 150,20 T 200,20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                      animate={{ d: [
                        "M 0,20 Q 25,5 50,35 T 100,20 T 150,5 T 200,20",
                        "M 0,20 Q 25,35 50,5 T 100,20 T 150,35 T 200,20",
                        "M 0,20 Q 25,5 50,35 T 100,20 T 150,5 T 200,20"
                      ]}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      );

    case 'interpreting_data':
      return (
        <div id="illustration-interpreting-data" className="rounded-xl border border-rose-500/20 bg-slate-950/80 p-5 backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.05)]">
          <div className="flex items-center justify-between pb-3 border-b border-rose-500/10 mb-4 select-none">
            <span className="text-xs font-mono uppercase text-rose-400">⚡ {txt("SPS: Dynamic Data Charts analyzer", "KPS: Analisis Pencatatan Graf Data", "SPS: 科学数据分析/图表解读中心")}</span>
            <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
          </div>

          {activeQuestion?.graphData ? (
            /* Plot custom question specific graph data */
            <div className="bg-slate-900/60 rounded-xl border border-rose-500/15 p-3.5 h-44 flex flex-col justify-between font-mono">
              <div className="text-[8.5px] text-rose-350 flex justify-between uppercase font-bold">
                <span>📈 {txt("Live plotted telemetry metrics for current scenario", "Telemetry Metrik Semasa Spesifik", "题目特载实测数据多维柱状图")}</span>
                <span className="text-rose-400 font-mono bg-rose-950/30 px-1 rounded scale-90 border border-rose-500/10">{activeQuestion.difficulty} level</span>
              </div>

              <div className="flex items-end justify-between h-28 px-3 pt-2 border-b border-l border-slate-800 relative select-none">
                {/* Horizontal grid guide */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
                  <div className="border-b border-white w-full" />
                  <div className="border-b border-white w-full" />
                </div>

                {activeQuestion.graphData.map((point, ptIdx) => {
                  const maxVal = Math.max(...(activeQuestion.graphData?.map(d => d.value) || [100]));
                  const computedHeight = maxVal > 0 ? (point.value / maxVal) * 90 : 10;

                  return (
                    <div key={ptIdx} className="flex flex-col items-center gap-1 group z-10 w-full">
                      <span className="text-[7.5px] font-mono text-rose-300 leading-none mb-1 opacity-80 group-hover:opacity-100 transition-all font-bold">
                        {point.value}
                      </span>
                      <motion.div 
                        className="w-5 sm:w-6 hover:bg-rose-450 rounded-t-sm transition-all duration-300 relative shadow-[0_0_8px_rgba(244,63,94,0.18)]"
                        style={{ height: `${computedHeight}%`, backgroundColor: ptIdx % 2 === 0 ? '#f43f5e' : '#fda4af' }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                      />
                      <span className="text-[8px] font-mono text-slate-400 truncate w-10 text-center mt-1 leading-tighter select-none">
                        {point.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Fallback dynamic indicator chart */
            <div className="bg-slate-900/60 rounded border border-rose-500/10 p-3 h-36 flex flex-col justify-between">
              <div className="text-[8px] font-mono text-rose-300 flex justify-between uppercase">
                <span>📊 SYSTEM TIME vs RATE PLOTS</span>
                <span className="text-rose-400 font-black animate-pulse">Running live</span>
              </div>

              <div className="flex items-end justify-between h-20 px-4 pt-4 border-b border-l border-slate-700 relative">
                {[
                  { label: '0m', h: 'h-4 bg-rose-500/30' },
                  { label: '2m', h: 'h-10 bg-rose-500/50' },
                  { label: '4m', h: 'h-14 bg-rose-500 shadow-md' },
                  { label: '6m', h: 'h-8 bg-rose-500/50' }
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 w-1/4">
                    <div className={`w-6 rounded-t-sm ${b.h}`} />
                    <span className="text-[8px] font-mono text-slate-500">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
