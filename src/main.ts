import { log } from "./ui/log.js";
import { initialBattle, step } from "./domain/combat.js";
import type { BattleState } from "./domain/combat.js";
import { mathRandom } from "./domain/random.js";

let state: BattleState = initialBattle();

function render(): void {
  const hpDisplay = document.getElementById("hp-display");
  if (hpDisplay) {
    hpDisplay.textContent = `Player HP: ${state.playerHp}  |  Enemy HP: ${state.enemyHp}  |  Turn: ${state.turn}`;
  }
  const attackButton = document.getElementById(
    "attack-button"
  ) as HTMLButtonElement | null;
  if (attackButton) {
    attackButton.disabled = state.finished;
  }
}

function renderInitialLog(): void {
  for (const line of state.log) {
    log(line);
  }
}

function clearLog(): void {
  const target = document.getElementById("log");
  if (target) {
    target.textContent = "";
  }
}

document.getElementById("attack-button")?.addEventListener("click", () => {
  const before = state;
  state = step(state, mathRandom);
  for (const line of state.log.slice(before.log.length)) {
    log(line);
  }
  render();
});

document.getElementById("reset-button")?.addEventListener("click", () => {
  state = initialBattle();
  clearLog();
  renderInitialLog();
  render();
});

renderInitialLog();
render();
