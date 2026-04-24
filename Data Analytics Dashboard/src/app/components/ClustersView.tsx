import { ClusterResult } from '../utils/analytics';
import { Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface ClustersViewProps {
  clusters: ClusterResult[];
}

const CLUSTER_COLORS = [
  { bg: 'bg-indigo-50 dark:bg-indigo-950/20', border: 'border-indigo-200 dark:border-indigo-800', icon: 'bg-indigo-600' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800', icon: 'bg-emerald-600' },
  { bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-800', icon: 'bg-rose-600' },
  { bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800', icon: 'bg-amber-600' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950/20', border: 'border-cyan-200 dark:border-cyan-800', icon: 'bg-cyan-600' },
];

export function ClustersView({ clusters }: ClustersViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Technology Stack Clusters
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              K-Means clustering reveals common technology combinations and patterns
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          {clusters.map((cluster, idx) => {
            const colors = CLUSTER_COLORS[idx % CLUSTER_COLORS.length];
            return (
              <div
                key={cluster.clusterId}
                className={`${colors.bg} rounded-lg p-4 border ${colors.border} text-center`}
              >
                <div className={`w-3 h-3 ${colors.icon} rounded-full mx-auto mb-2`} />
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {cluster.technologies.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Technologies</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Cluster Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clusters.map((cluster, idx) => {
          const colors = CLUSTER_COLORS[idx % CLUSTER_COLORS.length];
          return (
            <motion.div
              key={cluster.clusterId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className={`px-6 py-4 border-b border-slate-200 dark:border-slate-800 ${colors.bg}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center`}>
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      {cluster.label}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {cluster.technologies.length} technologies in this cluster
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {cluster.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
            Understanding Technology Clusters
          </h4>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Co-occurrence</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Technologies in the same cluster are frequently used together by developers in production environments.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Similarity Patterns</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Clustered technologies share similar growth patterns, popularity trends, and adoption rates over time.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Technology Ecosystems</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Each cluster often represents a distinct technology ecosystem, development stack, or application domain.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}