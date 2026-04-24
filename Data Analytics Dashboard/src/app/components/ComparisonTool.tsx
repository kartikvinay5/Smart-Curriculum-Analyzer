import { useState } from 'react';
import { ProcessedData } from '../data/surveyData';
import { GitCompare, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface ComparisonToolProps {
  data: ProcessedData[];
  technologies: string[];
}

const COMPARISON_COLORS = [
  '#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'
];

export function ComparisonTool({ data, technologies }: ComparisonToolProps) {
  const [selectedTechs, setSelectedTechs] = useState<string[]>(['JavaScript', 'Python']);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTechnologies = technologies.filter(tech =>
    tech.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedTechs.includes(tech)
  );

  const addTechnology = (tech: string) => {
    if (selectedTechs.length < 6 && !selectedTechs.includes(tech)) {
      setSelectedTechs([...selectedTechs, tech]);
      setSearchQuery('');
    }
  };

  const removeTechnology = (tech: string) => {
    setSelectedTechs(selectedTechs.filter(t => t !== tech));
  };

  // Prepare comparison data
  const years = Array.from(new Set(data.map(d => d.year))).sort();
  const comparisonData = years.map(year => {
    const yearData: any = { year };
    selectedTechs.forEach(tech => {
      const techData = data.find(d => d.technology === tech && d.year === year);
      yearData[tech] = techData ? techData.percentage : null;
    });
    return yearData;
  });

  // Calculate comparison metrics
  const comparisonMetrics = selectedTechs.map(tech => {
    const techData = data.filter(d => d.technology === tech).sort((a, b) => a.year - b.year);
    const current = techData[techData.length - 1]?.percentage || 0;
    const start = techData[0]?.percentage || 0;
    const growth = ((current - start) / start) * 100;
    const avg = techData.reduce((sum, d) => sum + d.percentage, 0) / techData.length;
    const category = techData[0]?.category || 'Unknown';

    return {
      technology: tech,
      current,
      growth,
      average: avg,
      category,
    };
  });

  // Latest year data for bar chart
  const latestYear = Math.max(...years);
  const latestComparison = selectedTechs.map(tech => {
    const techData = data.find(d => d.technology === tech && d.year === latestYear);
    return {
      technology: tech,
      percentage: techData?.percentage || 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Technology Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GitCompare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
              Technology Comparison
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select up to 6 technologies to compare side by side
            </p>
          </div>
        </div>

        {/* Selected Technologies */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Selected Technologies
          </label>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedTechs.map((tech, idx) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-md"
                  style={{ backgroundColor: COMPARISON_COLORS[idx % COMPARISON_COLORS.length] }}
                >
                  <span>{tech}</span>
                  <button
                    onClick={() => removeTechnology(tech)}
                    className="w-5 h-5 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Add Technology */}
        {selectedTechs.length < 6 && (
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Add Technology
            </label>
            <input
              type="text"
              placeholder="Search and add technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto z-10">
                {filteredTechnologies.slice(0, 10).map(tech => (
                  <button
                    key={tech}
                    onClick={() => addTechnology(tech)}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {selectedTechs.length >= 2 && (
        <>
          {/* Trend Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                Trend Comparison Over Time
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Compare adoption rate trends from 2020 to 2024
              </p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#64748b' }} />
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
                    formatter={(value: any) => [`${value.toFixed(2)}%`, '']}
                  />
                  <Legend />
                  {selectedTechs.map((tech, idx) => (
                    <Line
                      key={tech}
                      type="monotone"
                      dataKey={tech}
                      stroke={COMPARISON_COLORS[idx % COMPARISON_COLORS.length]}
                      strokeWidth={3}
                      dot={{ fill: COMPARISON_COLORS[idx % COMPARISON_COLORS.length], r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Current Comparison Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                Current Adoption Rates ({latestYear})
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Side-by-side comparison of current market adoption
              </p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={latestComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="technology" stroke="#64748b" tick={{ fill: '#64748b' }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: '12px',
                    }}
                    formatter={(value: any) => [`${value.toFixed(2)}%`, 'Adoption Rate']}
                  />
                  <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                    {latestComparison.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COMPARISON_COLORS[index % COMPARISON_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Comparison Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisonMetrics.map((metric, idx) => (
              <motion.div
                key={metric.technology}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COMPARISON_COLORS[idx % COMPARISON_COLORS.length] }}
                  />
                  <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                    {metric.technology}
                  </h5>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Rate</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {metric.current.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">5-Year Growth</span>
                    <span
                      className={`font-bold ${
                        metric.growth > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {metric.growth > 0 ? '+' : ''}{metric.growth.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Average (5yr)</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {metric.average.toFixed(1)}%
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {metric.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {selectedTechs.length < 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-50 dark:bg-slate-900 rounded-xl p-16 text-center border-2 border-dashed border-slate-300 dark:border-slate-700"
        >
          <GitCompare className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Select at least 2 technologies
          </h4>
          <p className="text-slate-600 dark:text-slate-400">
            Add technologies above to start comparing their trends, growth rates, and metrics
          </p>
        </motion.div>
      )}
    </div>
  );
}