export function generateMockData() {
  const generateTimeSeries = (length: number, min: number, max: number) => {
    return Array.from({ length }, () => Math.random() * (max - min) + min)
  }

  return {
    perception: {
      cpu: generateTimeSeries(24, 20, 80),
      memory: generateTimeSeries(24, 30, 70),
      dataRate: generateTimeSeries(24, 10, 90),
    },
    memory: {
      usage: generateTimeSeries(24, 40, 90),
      hitRate: generateTimeSeries(24, 60, 95),
      latency: generateTimeSeries(24, 1, 10),
    },
    action: {
      executed: generateTimeSeries(24, 50, 200),
      successRate: generateTimeSeries(24, 80, 100),
      errors: generateTimeSeries(24, 0, 20),
    },
    evolver: {
      learningRate: generateTimeSeries(24, 0.1, 0.9),
      updates: generateTimeSeries(24, 10, 100),
      improvement: generateTimeSeries(24, 0, 1),
    },
    treasury: {
      balance: generateTimeSeries(24, 1000, 10000),
      transactions: generateTimeSeries(24, 10, 100),
      allocation: generateTimeSeries(24, 0, 100),
    },
  }
} 