import { GrowthData } from '../utils/analytics';
import { ProcessedData } from '../data/surveyData';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

interface EmergingTechnologiesProps {
  growthData: GrowthData[];
  data: ProcessedData[];
}

export function EmergingTechnologies({ growthData, data }: EmergingTechnologiesProps) {
  const emerging = growthData.filter(g => g.trend === 'emerging').slice(0, 10);
  const declining = growthData.filter(g => g.trend === 'declining').slice(0, 10);
  const stable = growthData.filter(g => g.trend === 'stable').slice(0, 10);

  // Prepare data for bar chart
  const chartData = [...emerging.slice(0, 8), ...declining.slice(0, 8)]
    .sort((a, b) => b.growthRate - a.growthRate)
    .map(item => ({
      technology: item.technology,
      growth: item.growthRate,
      category: item.category,
    }));

  const getBarColor = (growth: number) => {
    if (growth > 50) return '#10b981';
    if (growth > 0) return '#06b6d4';
    if (growth > -20) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      {/* Growth Rate Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Technology Growth Rate Analysis
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Comparative view of fastest growing and declining technologies
          </p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis
                type="number"
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
                label={{ value: 'Growth Rate (%)', position: 'insideBottom', offset: -5, style: { fill: '#64748b' } }}
              />
              <YAxis
                dataKey="technology"
                type="category"
                width={120}
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                }}
                formatter={(value: any) => [`${value.toFixed(1)}%`, 'Growth Rate']}
              />
              <Bar dataKey="growth" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.growth)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Three Category Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emerging Technologies */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Emerging</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Growth &gt; 20%</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {emerging.map((tech) => (
              <div
                key={tech.technology}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                    {tech.technology}
                  </span>
                  <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded font-semibold">
                    +{tech.growthRate.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">{tech.category}</span>
                  <span>{tech.startPercentage.toFixed(1)}% → {tech.endPercentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Declining Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-rose-50 dark:bg-rose-950/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Declining</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Growth &lt; -10%</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {declining.map((tech) => (
              <div
                key={tech.technology}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                    {tech.technology}
                  </span>
                  <span className="text-xs px-2 py-1 bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded font-semibold">
                    {tech.growthRate.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">{tech.category}</span>
                  <span>{tech.startPercentage.toFixed(1)}% → {tech.endPercentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stable Technologies */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <Minus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Stable</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">-10% &lt; Growth &lt; 20%</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {stable.map((tech) => (
              <div
                key={tech.technology}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                    {tech.technology}
                  </span>
                  <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded font-semibold">
                    {tech.growthRate > 0 ? '+' : ''}{tech.growthRate.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">{tech.category}</span>
                  <span>{tech.startPercentage.toFixed(1)}% → {tech.endPercentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}