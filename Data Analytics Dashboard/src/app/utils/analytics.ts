import { ProcessedData } from '../data/surveyData';

export interface GrowthData {
  technology: string;
  growthRate: number;
  startPercentage: number;
  endPercentage: number;
  category: string;
  trend: 'emerging' | 'declining' | 'stable';
}

export interface PredictionData {
  technology: string;
  year: number;
  predicted: number;
  category: string;
}

export interface ClusterResult {
  clusterId: number;
  technologies: string[];
  centeroid: number[];
  label: string;
}

// Calculate growth rates between earliest and latest year
export function calculateGrowthRates(data: ProcessedData[]): GrowthData[] {
  const techMap = new Map<string, { years: number[], percentages: number[], category: string }>();
  
  // Group by technology
  data.forEach(item => {
    if (!techMap.has(item.technology)) {
      techMap.set(item.technology, { years: [], percentages: [], category: item.category });
    }
    const tech = techMap.get(item.technology)!;
    tech.years.push(item.year);
    tech.percentages.push(item.percentage);
  });

  const growthData: GrowthData[] = [];

  techMap.forEach((value, tech) => {
    const sortedIndices = value.years
      .map((year, idx) => ({ year, idx }))
      .sort((a, b) => a.year - b.year);
    
    const startIdx = sortedIndices[0].idx;
    const endIdx = sortedIndices[sortedIndices.length - 1].idx;
    
    const startPercentage = value.percentages[startIdx];
    const endPercentage = value.percentages[endIdx];
    const growthRate = ((endPercentage - startPercentage) / startPercentage) * 100;

    let trend: 'emerging' | 'declining' | 'stable' = 'stable';
    if (growthRate > 20) trend = 'emerging';
    else if (growthRate < -10) trend = 'declining';

    growthData.push({
      technology: tech,
      growthRate,
      startPercentage,
      endPercentage,
      category: value.category,
      trend,
    });
  });

  return growthData.sort((a, b) => b.growthRate - a.growthRate);
}

// Linear regression for predictions
export function predictFutureTrends(data: ProcessedData[], yearsAhead: number = 2): PredictionData[] {
  const techMap = new Map<string, { years: number[], percentages: number[], category: string }>();
  
  // Group by technology
  data.forEach(item => {
    if (!techMap.has(item.technology)) {
      techMap.set(item.technology, { years: [], percentages: [], category: item.category });
    }
    const tech = techMap.get(item.technology)!;
    tech.years.push(item.year);
    tech.percentages.push(item.percentage);
  });

  const predictions: PredictionData[] = [];

  techMap.forEach((value, tech) => {
    const { slope, intercept } = linearRegression(value.years, value.percentages);
    
    const maxYear = Math.max(...value.years);
    for (let i = 1; i <= yearsAhead; i++) {
      const futureYear = maxYear + i;
      const predicted = Math.max(0, slope * futureYear + intercept); // Ensure non-negative
      
      predictions.push({
        technology: tech,
        year: futureYear,
        predicted,
        category: value.category,
      });
    }
  });

  return predictions;
}

function linearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

// K-Means clustering for technology stacks
export function clusterTechnologies(data: ProcessedData[], k: number = 4): ClusterResult[] {
  // Create feature vectors: [avg_percentage, growth_rate, variance]
  const techMap = new Map<string, { percentages: number[], category: string }>();
  
  data.forEach(item => {
    if (!techMap.has(item.technology)) {
      techMap.set(item.technology, { percentages: [], category: item.category });
    }
    techMap.get(item.technology)!.percentages.push(item.percentage);
  });

  const features: { tech: string; vector: number[]; category: string }[] = [];
  
  techMap.forEach((value, tech) => {
    const avg = value.percentages.reduce((a, b) => a + b, 0) / value.percentages.length;
    const growth = value.percentages.length > 1 
      ? ((value.percentages[value.percentages.length - 1] - value.percentages[0]) / value.percentages[0]) * 100
      : 0;
    const variance = calculateVariance(value.percentages);
    
    features.push({
      tech,
      vector: [avg, growth, variance],
      category: value.category,
    });
  });

  // Normalize features
  const normalized = normalizeFeatures(features.map(f => f.vector));
  const normalizedFeatures = features.map((f, i) => ({ ...f, vector: normalized[i] }));

  // K-Means clustering
  const clusters = kMeans(normalizedFeatures, k);
  
  // Label clusters based on characteristics
  return clusters.map((cluster, idx) => {
    const label = getClusterLabel(cluster.technologies, techMap);
    return {
      ...cluster,
      label,
    };
  });
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

function normalizeFeatures(vectors: number[][]): number[][] {
  if (vectors.length === 0) return [];
  
  const numFeatures = vectors[0].length;
  const mins = new Array(numFeatures).fill(Infinity);
  const maxs = new Array(numFeatures).fill(-Infinity);
  
  vectors.forEach(vector => {
    vector.forEach((value, i) => {
      mins[i] = Math.min(mins[i], value);
      maxs[i] = Math.max(maxs[i], value);
    });
  });
  
  return vectors.map(vector =>
    vector.map((value, i) => {
      const range = maxs[i] - mins[i];
      return range === 0 ? 0 : (value - mins[i]) / range;
    })
  );
}

function kMeans(
  features: { tech: string; vector: number[]; category: string }[],
  k: number,
  maxIterations: number = 100
): ClusterResult[] {
  // Initialize centroids randomly
  const centroids = features
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, k)
    .map(f => [...f.vector]);

  let assignments = new Array(features.length).fill(0);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    const newAssignments = features.map(f => {
      let minDist = Infinity;
      let minIdx = 0;
      
      centroids.forEach((centroid, idx) => {
        const dist = euclideanDistance(f.vector, centroid);
        if (dist < minDist) {
          minDist = dist;
          minIdx = idx;
        }
      });
      
      return minIdx;
    });
    
    // Check convergence
    if (JSON.stringify(assignments) === JSON.stringify(newAssignments)) {
      break;
    }
    
    assignments = newAssignments;
    
    // Update centroids
    for (let i = 0; i < k; i++) {
      const clusterPoints = features.filter((_, idx) => assignments[idx] === i);
      if (clusterPoints.length > 0) {
        const numFeatures = centroids[i].length;
        centroids[i] = new Array(numFeatures).fill(0);
        
        clusterPoints.forEach(point => {
          point.vector.forEach((value, featureIdx) => {
            centroids[i][featureIdx] += value / clusterPoints.length;
          });
        });
      }
    }
  }
  
  // Build result
  const clusters: ClusterResult[] = [];
  for (let i = 0; i < k; i++) {
    const clusterTechs = features
      .filter((_, idx) => assignments[idx] === i)
      .map(f => f.tech);
    
    clusters.push({
      clusterId: i,
      technologies: clusterTechs,
      centeroid: centroids[i],
      label: `Cluster ${i + 1}`,
    });
  }
  
  return clusters;
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(
    a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
  );
}

function getClusterLabel(
  technologies: string[],
  techMap: Map<string, { percentages: number[]; category: string }>
): string {
  if (technologies.length === 0) return 'Empty Cluster';
  
  // Determine dominant category
  const categories = technologies.map(tech => techMap.get(tech)?.category || 'Unknown');
  const categoryCount = new Map<string, number>();
  categories.forEach(cat => {
    categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
  });
  
  const dominantCategory = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Calculate average popularity
  const avgPopularity = technologies.reduce((sum, tech) => {
    const percentages = techMap.get(tech)?.percentages || [];
    const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    return sum + avg;
  }, 0) / technologies.length;
  
  const popularityLevel = avgPopularity > 30 ? 'Popular' : avgPopularity > 15 ? 'Growing' : 'Emerging';
  
  return `${popularityLevel} ${dominantCategory} Stack`;
}

// Calculate year-over-year growth
export function calculateYoYGrowth(data: ProcessedData[]): Map<string, number[]> {
  const techMap = new Map<string, { years: number[], percentages: number[] }>();
  
  data.forEach(item => {
    if (!techMap.has(item.technology)) {
      techMap.set(item.technology, { years: [], percentages: [] });
    }
    const tech = techMap.get(item.technology)!;
    tech.years.push(item.year);
    tech.percentages.push(item.percentage);
  });

  const yoyGrowth = new Map<string, number[]>();

  techMap.forEach((value, tech) => {
    const sorted = value.years
      .map((year, idx) => ({ year, percentage: value.percentages[idx] }))
      .sort((a, b) => a.year - b.year);
    
    const growthRates: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const growth = ((sorted[i].percentage - sorted[i - 1].percentage) / sorted[i - 1].percentage) * 100;
      growthRates.push(growth);
    }
    
    yoyGrowth.set(tech, growthRates);
  });

  return yoyGrowth;
}
