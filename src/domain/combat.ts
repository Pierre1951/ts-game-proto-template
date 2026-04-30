/**
 * ダイスロール 1 ターン制バトルの最小実装。
 * 派生プロジェクトはこのファイルを置き換えて独自のゲームロジックを実装する。
 *
 * 設計原則:
 * - 純粋関数 (DOM / window / Math.random / Date.now を直接参照しない)
 * - 副作用 (乱数) は引数経由で注入 (`Random`)
 * - 状態は `readonly` で immutable
 */

import type { Random } from "./random.js";
import { rollD6 } from "./random.js";

export interface BattleState {
  readonly playerHp: number;
  readonly enemyHp: number;
  readonly turn: number;
  readonly log: readonly string[];
  readonly finished: boolean;
}

/** 初期状態 (Player HP 20 / Enemy HP 15) を返す。 */
export function initialBattle(): BattleState {
  return {
    playerHp: 20,
    enemyHp: 15,
    turn: 0,
    log: ["Battle start! Player HP=20 vs Enemy HP=15"],
    finished: false,
  };
}

/**
 * 1 ターン進行。
 * Player が d6 を振って Enemy に damage、Enemy が生き残っていれば反撃で d6 を振って Player に damage。
 * 既に finished の場合は同じ参照を返す (idempotent)。
 */
export function step(state: BattleState, rng: Random): BattleState {
  if (state.finished) return state;

  const playerDmg = rollD6(rng);
  const newEnemyHp = Math.max(0, state.enemyHp - playerDmg);
  const enemyDmg = newEnemyHp > 0 ? rollD6(rng) : 0;
  const newPlayerHp = Math.max(0, state.playerHp - enemyDmg);

  const messages: string[] = [
    `Turn ${state.turn + 1}: Player rolls ${playerDmg} -> Enemy HP ${state.enemyHp} -> ${newEnemyHp}`,
  ];
  if (enemyDmg > 0) {
    messages.push(
      `         Enemy rolls ${enemyDmg} -> Player HP ${state.playerHp} -> ${newPlayerHp}`
    );
  }

  const finished = newPlayerHp === 0 || newEnemyHp === 0;
  if (finished) {
    messages.push(newEnemyHp === 0 ? "Player wins!" : "Player loses...");
  }

  return {
    playerHp: newPlayerHp,
    enemyHp: newEnemyHp,
    turn: state.turn + 1,
    log: [...state.log, ...messages],
    finished,
  };
}
