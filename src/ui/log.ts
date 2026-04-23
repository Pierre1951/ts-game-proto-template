/**
 * ブラウザ上でテキストログを表示するための薄い UI 層。
 * 検証結果を時系列に並べる目的にだけ使います。
 */
export function log(message: string): void {
  const target = document.getElementById("log");
  if (!target) {
    return;
  }
  const line = document.createElement("div");
  line.textContent = message;
  target.appendChild(line);
}
