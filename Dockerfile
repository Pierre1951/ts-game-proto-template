FROM mcr.microsoft.com/playwright:v1.50.0-jammy

# 既存 Playwright イメージは pwuser/root が中心なので、devcontainer 規約に合わせ vscode ユーザー (uid 1000) を作成
# (1000:1000 が既存 user と衝突する場合は pwuser を削除/再番号する設計だが、jammy イメージの uid は 1001 のため衝突しない)
RUN groupadd --gid 1000 vscode \
    && useradd --uid 1000 --gid 1000 -m -s /bin/bash vscode

# 開発汎用ツール + sudo 設定
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git curl jq ripgrep fd-find tmux htop sudo \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/fdfind /usr/local/bin/fd \
    && echo 'vscode ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

# GitHub CLI (Playwright base には含まれない)
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
        -o /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
        > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends gh \
    && rm -rf /var/lib/apt/lists/*

# Node.js は Playwright イメージに既存 (v20+)。Claude Code CLI を global にインストール
RUN npm install -g @anthropic-ai/claude-code \
    && npm cache clean --force

# Playwright ブラウザを vscode ユーザー用に展開 (chromium のみ、CI と整合)
USER vscode
WORKDIR /home/vscode
RUN npx playwright install chromium

WORKDIR /workspace
