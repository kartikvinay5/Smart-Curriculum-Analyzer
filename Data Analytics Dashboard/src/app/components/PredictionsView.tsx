import { ProcessedData } from '../data/surveyData';
import { PredictionData } from '../utils/analytics';
import { Brain, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

interface PredictionsViewProps {
  data: ProcessedData[];
  predictions: PredictionData[];
  topN: number;
}

const COLORS = [
  '#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#a855f7'
];

export function PredictionsView({ data, predictions, topN }: PredictionsViewProps) {
  // Get top technologies for prediction
  const latestYear = Math.max(...data.map(d => d.year));
  const topTechs = data
    .filter(d => d.year === latestYear)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, Math.min(topN, 8))
    .map(d => d.technology);

  // Combine historical and predicted data
  const allYears = Array.from(new Set([
    ...data.map(d => d.year),
    ...predictions.map(p => p.year)
  ])).sort();

  const chartData = allYears.map(year => {
    const yearData: any = { year };
    topTechs.forEach(tech => {
      const historical = data.find(d => d.technology === tech && d.year === year);
      const predicted = predictions.find(p => p.technology === tech && p.year === year);
      yearData[tech] = historical ? historical.percentage : (predicted ? predicted.predicted : null);
      yearData[`${tech}_predicted`] = predicted ? predicted.predicted : null;
    });
    return yearData;
  });

  // Calculate prediction insights
  const predictionInsights = topTechs.map(tech => {
    const currentData = data.filter(d => d.technology === tech && d.year === latestYear)[0];
    const futurePredictions = predictions.filter(p => p.technology === tech);
    const futureValue = futurePredictions[futurePredictions.length - 1]?.predicted || 0;
    const change = futureValue - (currentData?.percentage || 0);
    const changePercent = currentData ? (change / currentData.percentage) * 100 : 0;

    return {
      technology: tech,
      current: currentData?.percentage || 0,
      predicted: futureValue,
      change: changePercent,
      category: currentData?.category || 'Unknown',
    };
  }).sort((a, b) => b.change - a.change);

  return (
    <div className="space-y-6">
      {/* Header with Warning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Future Trend Predictions
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Linear regression forecasts for the next 2 years based on historical data
            </p>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">Disclaimer:</span> These predictions assume linear growth patterns based on historical trends.
              Actual market dynamics may vary due to technological disruptions, market shifts, and other unforeseen factors.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Predictions Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
            Historical Data & Future Predictions
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Solid lines show historical data, dashed lines represent predictions
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
              />
              <YAxis
                label={{ value: 'Adoption Rate (%)', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
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
                formatter={(value: any, name: string) => {
                  const isPredicted = name.includes('_predicted');
                  return [
                    `${value.toFixed(2)}%`,
                    isPredicted ? `${name.replace('_predicted', '')} (Predicted)` : name
                  ];
                }}
              />
              <Legend />
              {topTechs.map((tech, idx) => (
                <Line
                  key={tech}
                  type="monotone"
                  dataKey={tech}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ fill: COLORS[idx % COLORS.length], r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
              {topTechs.map((tech, idx) => (
                <Line
                  key={`${tech}_predicted`}
                  type="monotone"
                  dataKey={`${tech}_predicted`}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictionInsights.map((insight, idx) => (
          <motion.div
            key={insight.technology}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                  {insight.technology}
                </h5>
                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {insight.category}
                </span>
              </div>
              {insight.change > 0 ? (
                <ArrowUpRight className="w-6 h-6 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-6 h-6 text-rose-500" />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Current (2024)</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {insight.current.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Predicted (2026)</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {insight.predicted.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Expected Change</span>
                <span
                  className={`font-bold ${
                    insight.change > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {insight.change > 0 ? '+' : ''}{insight.change.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}