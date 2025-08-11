// src/services/differential-privacy.js

const DEBUG = process.env.DEBUG_FEDCAMPUS === '1';
const log = (...args) => DEBUG && console.log(...args);

// 安全 stringify：把 BigInt 打印成字符串，避免 JSON.stringify 报错
const safeStringify = (obj) =>
    JSON.stringify(
        obj,
        (k, v) => (typeof v === 'bigint' ? v.toString() + 'n' : v),
        2
    );

// 深拷贝且保留 BigInt（JSON 方案会丢 BigInt，所以手写递归）
const deepClonePreserveBigInt = (input) => {
  if (input === null || typeof input !== 'object') return input;
  if (Array.isArray(input)) return input.map(deepClonePreserveBigInt);
  const out = {};
  for (const k of Object.keys(input)) out[k] = deepClonePreserveBigInt(input[k]);
  return out;
};

// 简单拉普拉斯噪声（近似）
const laplace = (b = 1) => {
  const u = Math.random() - 0.5; // (-0.5, 0.5)
  return -b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
};

// 高斯噪声（Box–Muller）
const gaussian = (mean = 0, std = 1) => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * std;
};

class DifferentialPrivacy {
  /**
   * 对健康数据做差分隐私扰动
   * 约定：
   * - steps / flight_climbed：保持 number，加入小整数噪声
   * - sleep_duration：保持 BigInt（毫秒），加入 ±5 分钟以内噪声
   * - 浮点类：加入小高斯噪声
   * - 血压：两个值分别加入 ±3 以内整数噪声
   */
  static fuzzHealthData(healthData) {
    log('\n[DifferentialPrivacy] 开始差分隐私');
    log('📥 输入:', safeStringify(healthData));

    const fuzzed = deepClonePreserveBigInt(healthData);

    const intTypes = new Set(['steps', 'flight_climbed']);
    const floatTypes = new Set([
      'distances',
      'active_calories',
      'exercises',
      'heart_rate',
      'stress_level',
      'irregular_rhythm',
      'respiratory_rate',
    ]);

    // 整数类
    for (const t of intTypes) {
      if (!Array.isArray(fuzzed[t])) continue;
      fuzzed[t] = fuzzed[t].map((pt) => {
        const base = Number(pt?.data?.value ?? 0);
        const noise = Math.round(laplace(2)); // 规模可调整
        const v = Math.max(0, base + noise);
        return { ...pt, data: { ...pt.data, value: v } };
      });
    }

    // 睡眠（保持 BigInt）
    if (Array.isArray(fuzzed.sleep_duration)) {
      const MAX_NOISE_MS = 5 * 60 * 1000; // ±5 分钟
      fuzzed.sleep_duration = fuzzed.sleep_duration.map((pt) => {
        const base = pt?.data?.value ?? BigInt(0);
        const noiseMs = Math.floor(gaussian(0, MAX_NOISE_MS / 3)); // 3σ≈5min
        const v = base + BigInt(noiseMs);
        const nonNeg = v < 0n ? 0n : v;
        return { ...pt, data: { ...pt.data, value: nonNeg } };
      });
    }

    // 浮点类
    for (const t of floatTypes) {
      if (!Array.isArray(fuzzed[t])) continue;
      fuzzed[t] = fuzzed[t].map((pt) => {
        const base = Number(pt?.data?.value ?? 0);
        const noise = gaussian(0, Math.max(0.01, base * 0.02)); // 2% 相对噪声
        const v = Number.isFinite(base + noise) ? base + noise : base;
        return { ...pt, data: { ...pt.data, value: v } };
      });
    }

    // 血压
    if (Array.isArray(fuzzed.blood_pressure)) {
      fuzzed.blood_pressure = fuzzed.blood_pressure.map((pt) => {
        const s = Number(pt?.data?.systolic ?? 0);
        const d = Number(pt?.data?.diastolic ?? 0);
        const ns = Math.round(gaussian(0, 1)); // ~±3 以内
        const nd = Math.round(gaussian(0, 1));
        return {
          ...pt,
          data: {
            ...pt.data,
            systolic: Math.max(0, s + ns),
            diastolic: Math.max(0, d + nd),
          },
        };
      });
    }

    log('📤 输出:', safeStringify(fuzzed));
    log('[DifferentialPrivacy] 结束\n');
    return fuzzed;
  }
}

export default DifferentialPrivacy;
