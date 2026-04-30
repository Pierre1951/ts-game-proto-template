/**
 * 注入可能な乱数インターフェース。domain 層では Math.random() を直接呼ばず、
 * Random を引数で受け取ることでテストの決定性を確保する。
 */
export interface Random {
  /** [0, 1) の擬似乱数を返す */
  next(): number;
}

/** 本番用: ブラウザの Math.random() を使う */
export const mathRandom: Random = {
  next: () => Math.random(),
};

/**
 * テスト用: 線形合同法 (LCG) によるシード対応の Random 実装。
 * 同じシードからは同じ系列を生成するため、決定性テストに利用。
 */
export function seeded(seed: number): Random {
  let state = seed;
  return {
    next: () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 0x100000000;
    },
  };
}

/** 1〜6 の整数を返す (d6 ロール) */
export function rollD6(rng: Random): number {
  return Math.floor(rng.next() * 6) + 1;
}
