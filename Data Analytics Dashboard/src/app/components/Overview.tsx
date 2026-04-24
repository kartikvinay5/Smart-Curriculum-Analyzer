import { ProcessedData } from '../data/surveyData';
import { GrowthData } from '../utils/analytics';
import { TrendingUp, TrendingDown, Activity, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

interface OverviewProps {
  data: ProcessedData[];
  growthData: GrowthData[];
  topN: number;
}

export function Overview({ data, growthData, topN }: OverviewProps) {
  // Calculate key metrics
  const totalTechnologies = new Set(data.map(d => d.technology)).size;
  const emergingCount = growthData.filter(g => g.trend === 'emerging').length;
  const decliningCount = growthData.filter(g => g.trend === 'declining').length;
  const topGrowing = growthData.filter(g => g.growthRate > 0).slice(0, 5);
  const topDeclining = growthData.filter(g => g.growthRate < 0).slice(-5).reverse();

  // Get latest year data for top technologies
  const latestYear = Math.max(...data.map(d => d.year));
  const latestData = data.filter(d => d.year === latestYear)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, topN);

  const kpiCards = [
    {
      title: 'Total Technologies',
      value: totalTechnologies,
      change: null,
      icon: Target,
      color: 'indigo',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      iconBg: 'bg-indigo-600',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Emerging Technologies',
      value: emergingCount,
      change: '+' + Math.round((emergingCount / totalTechnologies) * 100) + '%',
      icon: TrendingUp,
      color: 'emerald',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconBg: 'bg-emerald-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Declining Technologies',
      value: decliningCount,
      change: '-' + Math.round((decliningCount / totalTechnologies) * 100) + '%',
      icon: TrendingDown,
      color: 'rose',
      bgColor: 'bg-rose-50 dark:bg-rose-950/30',
      iconBg: 'bg-rose-600',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Active Trends',
      value: emergingCount + decliningCount,
      change: null,
      icon: Activity,
      color: 'amber',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      iconBg: 'bg-amber-600',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                    {card.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {card.value}
                    </h3>
                    {card.change && (
                      <span className={`text-sm font-semibold ${card.textColor} flex items-center gap-1`}>
                        {card.change.startsWith('+') ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {card.change}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`${card.iconBg} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Top Growing and Declining - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Growing Technologies */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Top Growing Technologies</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {topGrowing.map((tech, idx) => (
              <div key={tech.technology} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-950/30 rounded-lg flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {tech.technology}
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 ml-2">
                      +{tech.growthRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (tech.growthRate / Math.max(...topGrowing.map(t => t.growthRate))) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Declining Technologies */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Top Declining Technologies</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {topDeclining.map((tech, idx) => (
              <div key={tech.technology} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-rose-100 dark:bg-rose-950/30 rounded-lg flex items-center justify-center text-sm font-bold text-rose-700 dark:text-rose-400">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {tech.technology}
                    </span>
                    <span className="text-sm font-bold text-rose-600 dark:text-rose-400 ml-2">
                      {tech.growthRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (Math.abs(tech.growthRate) / Math.max(...topDeclining.map(t => Math.abs(t.growthRate)))) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Most Popular Technologies Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Most Popular Technologies ({latestYear})
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Current adoption rates across all categories
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {latestData.map((tech) => (
              <div
                key={tech.technology}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                    {tech.technology}
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 rounded text-xs font-medium">
                    {tech.category}
                  </span>
                </div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {tech.percentage.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">adoption rate</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}