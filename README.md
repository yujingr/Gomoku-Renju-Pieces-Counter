# 五子棋/连珠练习数棋工具 Gomoku/Renju Pieces Counter

![Screenshot](/ReadMeImages/ScreenShot.png)

## 中文

这个仓库包含了一个用于练习五子棋/连珠的实践工具，旨在帮助初学者识别并计算游戏中的不同棋子配置，如活四、冲四、活三等。通过使用本工具，玩家可以更好地理解游戏策略和提高自己的下棋技能。

推荐使用方式：用于训练数棋的，仅作为新手提升五子棋棋力的第一步。 比如一步一步跟着已有的练习题/棋面走，观察棋面每次落子的变化. 另外，可以观察每次落子可能形成的棋型变化，学习如何最大化自己的优势，减少对手的优势。

### 功能介绍

- **棋盘显示与交互**：动态生成 15x15 的棋盘，玩家可以通过点击棋盘上的格子放置棋子。
- **计算棋型**：自动计算并展示当前棋盘状态下的所有棋型，包括活四、冲四、活三、眠三、活二和眠二。
- **悬停预览**：鼠标悬停在棋盘上的空格时，可以预览在此位置落子后的棋型变化。
- **语言切换**：支持中英文切换，方便不同语言用户使用。
- **状态回退**：提供“回撤”按钮，允许玩家撤销最近的落子。
- **重置棋盘**：提供“重置”按钮，随时清空棋盘并重新开始练习。

### 使用说明

1. 直接打开`index.html`文件，在浏览器中加载棋盘界面。
2. 通过点击棋盘上的格子来放置棋子，黑白交替进行。
3. 观察下方信息栏，了解当前棋盘状态下各种棋型的数量和具体位置。
4. 使用“回撤”按钮撤销最近的一步操作。
5. 鼠标悬停在棋盘上的空格，预览该位置落子后的潜在棋型变化。
6. 点击“重置”按钮清空棋盘。
7. 点击“语言”按钮切换界面语言。

## English: Gomoku/Renju Pieces Counter

This repository contains a practice tool for Gomoku/Renju, aimed at helping beginners identify and count different configurations of pieces in the game, such as open fours, closed fours, open threes, etc. By using this tool, players can better understand game strategies and improve their playing skills.

Recommended usage: For practicing counting pieces, as a first step for beginners to improve their Gomoku skills. For example, follow the existing practice questions/boards step by step, observe the changes of the board after each move. Also, observe the potential configuration changes after each move, and learn how to maximize your advantage and minimize your opponent's advantage.

### Features

- **Board Display and Interaction**: Dynamically generates a 15x15 board where players can place pieces by clicking on the grid.
- **Configuration Calculation**: Automatically calculates and displays all configurations present in the current board state, including open fours, closed fours, open threes, closed threes, open twos, and closed twos.
- **Hover Preview**: Hovering over an empty space on the board previews the potential configuration changes if a piece were placed there.
- **Language Toggle**: Supports switching between Chinese and English for ease of use by different language speakers.
- **State Reversion**: Offers a "Revert" button, allowing players to undo their most recent move.
- **Board Reset**: Provides a "Reset" button to clear the board and start the practice over.

### Instructions

1. Download the repo, unzip, and open the `index.html` file directly to load the board interface in your browser.
2. Place pieces on the board by clicking on the grid, alternating between black and white.
3. Observe the information bar on the right to learn about the number and specific locations of various configurations in the current board state.
4. Use the "Revert" button to undo the most recent action.
5. Hover over an empty space on the board to preview potential configuration changes if a piece were placed there.
6. Click the "Reset" button to clear the board.
7. Click the "Language" button to toggle the interface language.
