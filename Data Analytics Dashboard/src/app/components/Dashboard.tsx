import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Brain, 
  Sparkles, 
  Search,
  Moon,
  Sun,
  Layers,
  Home,
  Settings,
  Bell,
  User
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { getProcessedData, getYears, getCategories, getTechnologies } from '../data/surveyData';
import { calculateGrowthRates, predictFutureTrends, clusterTechnologies } from '../utils/analytics';
import { Overview } from './Overview';
import { TrendsChart } from './TrendsChart';
import { EmergingTechnologies } from './EmergingTechnologies';
import { ClustersView } from './ClustersView';
import { PredictionsView } from './PredictionsView';
import { ComparisonTool } from './ComparisonTool';
import { motion } from 'motion/react';

export function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2020, 2024]);
  const [topN, setTopN] = useState(15);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'emerging' | 'clusters' | 'predictions' | 'compare'>('overview');

  const data = useMemo(() => getProcessedData(), []);
  const years = useMemo(() => getYears(), []);
  const categories = useMemo(() => getCategories(), []);
  const technologies = useMemo(() => getTechnologies(), []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesYear = item.year >= yearRange[0] && item.year <= yearRange[1];
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const matchesSearch = searchQuery === '' || item.technology.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesYear && matchesCategory && matchesSearch;
    });
  }, [data, yearRange, selectedCategories, searchQuery]);

  const growthData = useMemo(() => calculateGrowthRates(filteredData), [filteredData]);
  const predictions = useMemo(() => predictFutureTrends(filteredData, 2), [filteredData]);
  const clusters = useMemo(() => clusterTechnologies(filteredData, 5), [filteredData]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const navigationItems = [
    { id: 'overview' as const, label: 'Overview', icon: Home },
    { id: 'trends' as const, label: 'Trends', icon: TrendingUp },
    { id: 'emerging' as const, label: 'Emerging', icon: Sparkles },
    { id: 'clusters' as const, label: 'Clusters', icon: Layers },
    { id: 'predictions' as const, label: 'Predictions', icon: Brain },
    { id: 'compare' as const, label: 'Compare', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 border-r border-slate-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">TechTrend</h1>
              <p className="text-xs text-slate-400">Analytics Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              {navigationItems.find(item => item.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Action Buttons */}
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Admin User</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">admin@techtrend.io</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4">
          <div className="flex items-center gap-6">
            {/* Year Range */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Year Range:
              </label>
              <div className="flex gap-2 items-center">
                <select
                  value={yearRange[0]}
                  onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <span className="text-slate-400">to</span>
                <select
                  value={yearRange[1]}
                  onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Categories:
              </label>
              <div className="flex gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategories.includes(category)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Top N Slider */}
            <div className="flex items-center gap-3 ml-auto">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Show Top:
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={topN}
                onChange={(e) => setTopN(Number(e.target.value))}
                className="w-32 accent-indigo-600"
              />
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 w-8">
                {topN}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
          <div className="p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && <Overview data={filteredData} growthData={growthData} topN={topN} />}
              {activeTab === 'trends' && <TrendsChart data={filteredData} topN={topN} />}
              {activeTab === 'emerging' && <EmergingTechnologies growthData={growthData} data={filteredData} />}
              {activeTab === 'clusters' && <ClustersView clusters={clusters} />}
              {activeTab === 'predictions' && <PredictionsView data={filteredData} predictions={predictions} topN={topN} />}
              {activeTab === 'compare' && <ComparisonTool data={filteredData} technologies={technologies} />}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}