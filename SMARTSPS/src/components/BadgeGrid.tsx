/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ALL_BADGES, getFullQuestionBank } from '../data/questions';
import { BadgeId, Language } from '../types';
import * as Icons from 'lucide-react';

interface BadgeGridProps {
  earnedBadges: BadgeId[];
  lang: Language;
}

export default function BadgeGrid({ earnedBadges, lang }: BadgeGridProps) {
  const translations = {
    en: {
      title: 'Achievement Badges',
      unlocked: 'UNLOCKED',
      locked: 'LOCKED',
      rarity: 'Rarity',
      desc: 'Test your Science Process Skills to unlock rare badges!',
      earnedStatus: 'You have earned {count} out of {total} accolades'
    },
    ms: {
      title: 'Lencana Pencapaian',
      unlocked: 'DIKUNCI',
      locked: 'TERKUNCI',
      rarity: 'Tahap',
      desc: 'Uji Kemahiran Proses Sains anda untuk membuka lencana nadir!',
      earnedStatus: 'Selesai merekod {count} daripada {total} kejayaan'
    },
    zh: {
      title: '成就勋章手册',
      unlocked: '已解锁',
      locked: '未解锁',
      rarity: '稀有度',
      desc: '解答科学过程技能问题，解锁稀有勋章！',
      earnedStatus: '你已在总共 {total} 项成就中解锁了 {count} 个勋章'
    }
  }[lang];

  // Helper to dynamically render Lucide icons by name safely
  const renderBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Award;
    return (
      <IconComponent 
        className={`h-8 w-8 transition-colors duration-300 ${
          isUnlocked ? 'text-amber-400' : 'text-slate-600'
        }`} 
      />
    );
  };

  const getRarityStyles = (rarity: 'common' | 'rare' | 'epic' | 'legendary', isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        badgeBorder: 'border-slate-800/40 bg-slate-900/10 opacity-45',
        glowText: 'text-slate-500',
        pills: 'bg-slate-800 text-slate-500'
      };
    }
    switch (rarity) {
      case 'common':
        return {
          badgeBorder: 'border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500/40',
          glowText: 'text-emerald-400',
          pills: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        };
      case 'rare':
        return {
          badgeBorder: 'border-sky-500/20 bg-sky-950/20 hover:border-sky-500/40',
          glowText: 'text-sky-400',
          pills: 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
        };
      case 'epic':
        return {
          badgeBorder: 'border-violet-500/30 bg-violet-950/20 hover:border-violet-500/55',
          glowText: 'text-violet-400',
          pills: 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
        };
      case 'legendary':
        return {
          badgeBorder: 'border-amber-500/40 bg-amber-950/25 hover:border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.05)]',
          glowText: 'text-amber-400 font-extrabold animate-pulse',
          pills: 'bg-amber-500/25 text-amber-300 border border-amber-500/30'
        };
    }
  };

  return (
    <div id="badge-grid-container" className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Icons.Trophy className="h-4 w-4 text-amber-400" />
            {translations.title}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{translations.desc}</p>
        </div>
        <div className="text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full self-start">
          🏆 {translations.earnedStatus.replace('{count}', String(earnedBadges.length)).replace('{total}', String(ALL_BADGES.length))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ALL_BADGES.map((badge, idx) => {
          const isUnlocked = earnedBadges.includes(badge.id);
          const style = getRarityStyles(badge.rarity, isUnlocked);
          
          return (
            <motion.div
              id={`badge-card-${badge.id}`}
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`relative rounded-xl border p-4 transition-all duration-300 flex items-start gap-3.5 group cursor-default ${style.badgeBorder}`}
            >
              <div className={`p-2.5 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-slate-950/40' : 'bg-slate-950/20'}`}>
                {renderBadgeIcon(badge.iconName, isUnlocked)}
              </div>

              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className={`text-[12px] font-bold truncate ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                    {badge.name[lang]}
                  </span>
                  <span className={`text-[8px] tracking-wider uppercase font-mono px-1.5 py-0.5 rounded ${style.pills}`}>
                    {badge.rarity}
                  </span>
                </div>
                
                <p className={`text-[10px] leading-relaxed transition-colors duration-200 ${isUnlocked ? 'text-slate-300' : 'text-slate-600'}`}>
                  {badge.description[lang]}
                </p>

                {isUnlocked ? (
                  <div className="text-[8px] font-mono font-bold text-emerald-400 flex items-center gap-1 pt-1.5">
                    <Icons.Check className="h-2.5 w-2.5" />
                    {translations.unlocked}
                  </div>
                ) : (
                  <div className="text-[8px] font-mono text-slate-600 flex items-center gap-1 pt-1.5">
                    <Icons.Lock className="h-2.5 w-2.5" />
                    {translations.locked}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
