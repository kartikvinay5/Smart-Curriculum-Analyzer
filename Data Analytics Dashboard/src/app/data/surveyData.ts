// Mock Stack Overflow Developer Survey Data (2020-2024)
// Simulating real survey data with technologies, frameworks, and tools

export interface TechnologyData {
  technology: string;
  year: number;
  count: number;
  totalResponses: number;
  category: string;
}

export interface ProcessedData {
  technology: string;
  year: number;
  percentage: number;
  category: string;
}

// Simulated survey data based on real Stack Overflow trends
const rawSurveyData: TechnologyData[] = [
  // JavaScript - consistently popular
  { technology: 'JavaScript', year: 2020, count: 12500, totalResponses: 20000, category: 'Language' },
  { technology: 'JavaScript', year: 2021, count: 13200, totalResponses: 21000, category: 'Language' },
  { technology: 'JavaScript', year: 2022, count: 13800, totalResponses: 21500, category: 'Language' },
  { technology: 'JavaScript', year: 2023, count: 14200, totalResponses: 22000, category: 'Language' },
  { technology: 'JavaScript', year: 2024, count: 14500, totalResponses: 22500, category: 'Language' },

  // Python - growing rapidly
  { technology: 'Python', year: 2020, count: 11000, totalResponses: 20000, category: 'Language' },
  { technology: 'Python', year: 2021, count: 12300, totalResponses: 21000, category: 'Language' },
  { technology: 'Python', year: 2022, count: 13600, totalResponses: 21500, category: 'Language' },
  { technology: 'Python', year: 2023, count: 14800, totalResponses: 22000, category: 'Language' },
  { technology: 'Python', year: 2024, count: 15900, totalResponses: 22500, category: 'Language' },

  // TypeScript - emerging strongly
  { technology: 'TypeScript', year: 2020, count: 7800, totalResponses: 20000, category: 'Language' },
  { technology: 'TypeScript', year: 2021, count: 9200, totalResponses: 21000, category: 'Language' },
  { technology: 'TypeScript', year: 2022, count: 10800, totalResponses: 21500, category: 'Language' },
  { technology: 'TypeScript', year: 2023, count: 12400, totalResponses: 22000, category: 'Language' },
  { technology: 'TypeScript', year: 2024, count: 14000, totalResponses: 22500, category: 'Language' },

  // Rust - emerging
  { technology: 'Rust', year: 2020, count: 1200, totalResponses: 20000, category: 'Language' },
  { technology: 'Rust', year: 2021, count: 1800, totalResponses: 21000, category: 'Language' },
  { technology: 'Rust', year: 2022, count: 2500, totalResponses: 21500, category: 'Language' },
  { technology: 'Rust', year: 2023, count: 3400, totalResponses: 22000, category: 'Language' },
  { technology: 'Rust', year: 2024, count: 4600, totalResponses: 22500, category: 'Language' },

  // Go - steady growth
  { technology: 'Go', year: 2020, count: 2400, totalResponses: 20000, category: 'Language' },
  { technology: 'Go', year: 2021, count: 2900, totalResponses: 21000, category: 'Language' },
  { technology: 'Go', year: 2022, count: 3500, totalResponses: 21500, category: 'Language' },
  { technology: 'Go', year: 2023, count: 4200, totalResponses: 22000, category: 'Language' },
  { technology: 'Go', year: 2024, count: 5000, totalResponses: 22500, category: 'Language' },

  // Java - declining
  { technology: 'Java', year: 2020, count: 9000, totalResponses: 20000, category: 'Language' },
  { technology: 'Java', year: 2021, count: 8700, totalResponses: 21000, category: 'Language' },
  { technology: 'Java', year: 2022, count: 8300, totalResponses: 21500, category: 'Language' },
  { technology: 'Java', year: 2023, count: 7900, totalResponses: 22000, category: 'Language' },
  { technology: 'Java', year: 2024, count: 7500, totalResponses: 22500, category: 'Language' },

  // PHP - declining
  { technology: 'PHP', year: 2020, count: 5000, totalResponses: 20000, category: 'Language' },
  { technology: 'PHP', year: 2021, count: 4600, totalResponses: 21000, category: 'Language' },
  { technology: 'PHP', year: 2022, count: 4200, totalResponses: 21500, category: 'Language' },
  { technology: 'PHP', year: 2023, count: 3800, totalResponses: 22000, category: 'Language' },
  { technology: 'PHP', year: 2024, count: 3400, totalResponses: 22500, category: 'Language' },

  // C# - stable
  { technology: 'C#', year: 2020, count: 6200, totalResponses: 20000, category: 'Language' },
  { technology: 'C#', year: 2021, count: 6400, totalResponses: 21000, category: 'Language' },
  { technology: 'C#', year: 2022, count: 6500, totalResponses: 21500, category: 'Language' },
  { technology: 'C#', year: 2023, count: 6600, totalResponses: 22000, category: 'Language' },
  { technology: 'C#', year: 2024, count: 6700, totalResponses: 22500, category: 'Language' },

  // React - dominant framework
  { technology: 'React', year: 2020, count: 10200, totalResponses: 20000, category: 'Web' },
  { technology: 'React', year: 2021, count: 11000, totalResponses: 21000, category: 'Web' },
  { technology: 'React', year: 2022, count: 11800, totalResponses: 21500, category: 'Web' },
  { technology: 'React', year: 2023, count: 12600, totalResponses: 22000, category: 'Web' },
  { technology: 'React', year: 2024, count: 13400, totalResponses: 22500, category: 'Web' },

  // Vue.js - growing
  { technology: 'Vue.js', year: 2020, count: 4200, totalResponses: 20000, category: 'Web' },
  { technology: 'Vue.js', year: 2021, count: 4800, totalResponses: 21000, category: 'Web' },
  { technology: 'Vue.js', year: 2022, count: 5400, totalResponses: 21500, category: 'Web' },
  { technology: 'Vue.js', year: 2023, count: 6000, totalResponses: 22000, category: 'Web' },
  { technology: 'Vue.js', year: 2024, count: 6600, totalResponses: 22500, category: 'Web' },

  // Angular - declining
  { technology: 'Angular', year: 2020, count: 5400, totalResponses: 20000, category: 'Web' },
  { technology: 'Angular', year: 2021, count: 5200, totalResponses: 21000, category: 'Web' },
  { technology: 'Angular', year: 2022, count: 4900, totalResponses: 21500, category: 'Web' },
  { technology: 'Angular', year: 2023, count: 4600, totalResponses: 22000, category: 'Web' },
  { technology: 'Angular', year: 2024, count: 4300, totalResponses: 22500, category: 'Web' },

  // Svelte - emerging
  { technology: 'Svelte', year: 2020, count: 800, totalResponses: 20000, category: 'Web' },
  { technology: 'Svelte', year: 2021, count: 1400, totalResponses: 21000, category: 'Web' },
  { technology: 'Svelte', year: 2022, count: 2100, totalResponses: 21500, category: 'Web' },
  { technology: 'Svelte', year: 2023, count: 2900, totalResponses: 22000, category: 'Web' },
  { technology: 'Svelte', year: 2024, count: 3800, totalResponses: 22500, category: 'Web' },

  // Next.js - rapidly growing
  { technology: 'Next.js', year: 2020, count: 3200, totalResponses: 20000, category: 'Web' },
  { technology: 'Next.js', year: 2021, count: 4500, totalResponses: 21000, category: 'Web' },
  { technology: 'Next.js', year: 2022, count: 6000, totalResponses: 21500, category: 'Web' },
  { technology: 'Next.js', year: 2023, count: 7800, totalResponses: 22000, category: 'Web' },
  { technology: 'Next.js', year: 2024, count: 9800, totalResponses: 22500, category: 'Web' },

  // Docker - growing steadily
  { technology: 'Docker', year: 2020, count: 7200, totalResponses: 20000, category: 'Cloud' },
  { technology: 'Docker', year: 2021, count: 8100, totalResponses: 21000, category: 'Cloud' },
  { technology: 'Docker', year: 2022, count: 9000, totalResponses: 21500, category: 'Cloud' },
  { technology: 'Docker', year: 2023, count: 9900, totalResponses: 22000, category: 'Cloud' },
  { technology: 'Docker', year: 2024, count: 10800, totalResponses: 22500, category: 'Cloud' },

  // Kubernetes - growing
  { technology: 'Kubernetes', year: 2020, count: 3800, totalResponses: 20000, category: 'Cloud' },
  { technology: 'Kubernetes', year: 2021, count: 4600, totalResponses: 21000, category: 'Cloud' },
  { technology: 'Kubernetes', year: 2022, count: 5500, totalResponses: 21500, category: 'Cloud' },
  { technology: 'Kubernetes', year: 2023, count: 6500, totalResponses: 22000, category: 'Cloud' },
  { technology: 'Kubernetes', year: 2024, count: 7600, totalResponses: 22500, category: 'Cloud' },

  // AWS - dominant cloud
  { technology: 'AWS', year: 2020, count: 8500, totalResponses: 20000, category: 'Cloud' },
  { technology: 'AWS', year: 2021, count: 9200, totalResponses: 21000, category: 'Cloud' },
  { technology: 'AWS', year: 2022, count: 9900, totalResponses: 21500, category: 'Cloud' },
  { technology: 'AWS', year: 2023, count: 10600, totalResponses: 22000, category: 'Cloud' },
  { technology: 'AWS', year: 2024, count: 11300, totalResponses: 22500, category: 'Cloud' },

  // Azure - growing
  { technology: 'Azure', year: 2020, count: 5200, totalResponses: 20000, category: 'Cloud' },
  { technology: 'Azure', year: 2021, count: 5900, totalResponses: 21000, category: 'Cloud' },
  { technology: 'Azure', year: 2022, count: 6700, totalResponses: 21500, category: 'Cloud' },
  { technology: 'Azure', year: 2023, count: 7600, totalResponses: 22000, category: 'Cloud' },
  { technology: 'Azure', year: 2024, count: 8500, totalResponses: 22500, category: 'Cloud' },

  // TensorFlow - AI/ML
  { technology: 'TensorFlow', year: 2020, count: 3400, totalResponses: 20000, category: 'AI' },
  { technology: 'TensorFlow', year: 2021, count: 4000, totalResponses: 21000, category: 'AI' },
  { technology: 'TensorFlow', year: 2022, count: 4600, totalResponses: 21500, category: 'AI' },
  { technology: 'TensorFlow', year: 2023, count: 5300, totalResponses: 22000, category: 'AI' },
  { technology: 'TensorFlow', year: 2024, count: 6100, totalResponses: 22500, category: 'AI' },

  // PyTorch - AI/ML growing faster
  { technology: 'PyTorch', year: 2020, count: 2800, totalResponses: 20000, category: 'AI' },
  { technology: 'PyTorch', year: 2021, count: 3800, totalResponses: 21000, category: 'AI' },
  { technology: 'PyTorch', year: 2022, count: 5000, totalResponses: 21500, category: 'AI' },
  { technology: 'PyTorch', year: 2023, count: 6500, totalResponses: 22000, category: 'AI' },
  { technology: 'PyTorch', year: 2024, count: 8200, totalResponses: 22500, category: 'AI' },

  // React Native - mobile
  { technology: 'React Native', year: 2020, count: 3600, totalResponses: 20000, category: 'Mobile' },
  { technology: 'React Native', year: 2021, count: 4100, totalResponses: 21000, category: 'Mobile' },
  { technology: 'React Native', year: 2022, count: 4600, totalResponses: 21500, category: 'Mobile' },
  { technology: 'React Native', year: 2023, count: 5100, totalResponses: 22000, category: 'Mobile' },
  { technology: 'React Native', year: 2024, count: 5600, totalResponses: 22500, category: 'Mobile' },

  // Flutter - mobile emerging
  { technology: 'Flutter', year: 2020, count: 2200, totalResponses: 20000, category: 'Mobile' },
  { technology: 'Flutter', year: 2021, count: 3100, totalResponses: 21000, category: 'Mobile' },
  { technology: 'Flutter', year: 2022, count: 4200, totalResponses: 21500, category: 'Mobile' },
  { technology: 'Flutter', year: 2023, count: 5500, totalResponses: 22000, category: 'Mobile' },
  { technology: 'Flutter', year: 2024, count: 7000, totalResponses: 22500, category: 'Mobile' },

  // PostgreSQL - database
  { technology: 'PostgreSQL', year: 2020, count: 6800, totalResponses: 20000, category: 'Database' },
  { technology: 'PostgreSQL', year: 2021, count: 7500, totalResponses: 21000, category: 'Database' },
  { technology: 'PostgreSQL', year: 2022, count: 8300, totalResponses: 21500, category: 'Database' },
  { technology: 'PostgreSQL', year: 2023, count: 9200, totalResponses: 22000, category: 'Database' },
  { technology: 'PostgreSQL', year: 2024, count: 10100, totalResponses: 22500, category: 'Database' },

  // MongoDB - database
  { technology: 'MongoDB', year: 2020, count: 5600, totalResponses: 20000, category: 'Database' },
  { technology: 'MongoDB', year: 2021, count: 6100, totalResponses: 21000, category: 'Database' },
  { technology: 'MongoDB', year: 2022, count: 6600, totalResponses: 21500, category: 'Database' },
  { technology: 'MongoDB', year: 2023, count: 7100, totalResponses: 22000, category: 'Database' },
  { technology: 'MongoDB', year: 2024, count: 7600, totalResponses: 22500, category: 'Database' },

  // GraphQL - API
  { technology: 'GraphQL', year: 2020, count: 2400, totalResponses: 20000, category: 'Web' },
  { technology: 'GraphQL', year: 2021, count: 3200, totalResponses: 21000, category: 'Web' },
  { technology: 'GraphQL', year: 2022, count: 4100, totalResponses: 21500, category: 'Web' },
  { technology: 'GraphQL', year: 2023, count: 5100, totalResponses: 22000, category: 'Web' },
  { technology: 'GraphQL', year: 2024, count: 6200, totalResponses: 22500, category: 'Web' },
];

export function getSurveyData(): TechnologyData[] {
  return rawSurveyData;
}

export function getProcessedData(): ProcessedData[] {
  return rawSurveyData.map(item => ({
    technology: item.technology,
    year: item.year,
    percentage: (item.count / item.totalResponses) * 100,
    category: item.category,
  }));
}

export function getYears(): number[] {
  return [2020, 2021, 2022, 2023, 2024];
}

export function getCategories(): string[] {
  return ['Language', 'Web', 'Cloud', 'AI', 'Mobile', 'Database'];
}

export function getTechnologies(): string[] {
  const uniqueTechs = new Set(rawSurveyData.map(d => d.technology));
  return Array.from(uniqueTechs).sort();
}
