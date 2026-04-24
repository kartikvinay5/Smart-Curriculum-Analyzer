import { ProcessedData } from '../data/surveyData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

interface TrendsChartProps {
  data: ProcessedData[];
  topN: number;
}

const COLORS = [
  '#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#a855f7'
];

export function TrendsChart({ data, topN }: TrendsChartProps) {
  // Get top N technologies by latest year percentage
  const latestYear = Math.max(...data.map(d => d.year));
  const topTechs = data
    .filter(d => d.year === latestYear)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, topN)
    .map(d => d.technology);

  // Prepare chart data
  const years = Array.from(new Set(data.map(d => d.year))).sort();
  const chartData = years.map(year => {
    const yearData: any = { year };
    topTechs.forEach(tech => {
      const techData = data.find(d => d.technology === tech && d.year === year);
      yearData[tech] = techData ? techData.percentage : null;
    });
    return yearData;
  });

  return (
    <div className="space-y-6">
      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Technology Adoption Trends Over Time
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tracking popularity changes from 2020 to 2024
          </p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis
                dataKey="year"
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
                tickLine={{ stroke: '#64748b' }}
              />
              <YAxis
                label={{ value: 'Adoption Rate (%)', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
                tickLine={{ stroke: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                }}
                formatter={(value: any) => [`${value.toFixed(2)}%`, '']}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {topTechs.map((tech, idx) => (
                <Line
                  key={tech}
                  type="monotone"
                  dataKey={tech}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ fill: COLORS[idx % COLORS.length], r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Technology Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topTechs.slice(0, 6).map((tech, idx) => {
          const techData = data.filter(d => d.technology === tech).sort((a, b) => a.year - b.year);
          const startValue = techData[0]?.percentage || 0;
          const endValue = techData[techData.length - 1]?.percentage || 0;
          const growth = ((endValue - startValue) / startValue) * 100;

          return (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{tech}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Current Rate</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {endValue.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">5-Year Growth</span>
                  <span className={`font-semibold ${growth > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}