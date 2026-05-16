# ThinkFast (SillyQ)

A distributed, real-time multiplayer quiz game playable over a local area network. Compete with friends to answer questions fastest — earlier correct answers earn more points.

---

## Features

- Real-time multiplayer over WebSockets (LAN only)
- Live chat with typing indicators
- Timestamp-based event ordering so the first correct answer is always rewarded fairly
- Opponent activity updates (who solved a question, who's typing an answer)

---

## Architecture

The server (`server.js`) acts as the single source of truth for all game state. Clients communicate with it exclusively via WebSocket messages encoded as JSON.

### Distributed Systems concepts demonstrated

**State synchronization** — all clients stay in sync by broadcasting state changes through the server rather than talking to each other directly.

**Happened-before / event ordering** — when two players submit an answer at nearly the same time, the server uses a timestamp-ordered priority queue to determine which event arrived first. A short `setTimeout` window (5 s) collects concurrent `check` events before processing them, ensuring the earlier timestamp wins and receives full points while later submissions receive reduced points (−50 per subsequent correct answer).

### WebSocket message types

| Type | Direction | Description |
|---|---|---|
| `name` | client → server | Register player name on connect |
| `next` | client ↔ server | Request / receive next question |
| `check` | client → server | Submit an answer for grading |
| `reply` | server → client | Answer result + points awarded |
| `message` | client ↔ server | Chat message |
| `typingMessage` | client ↔ server | Chat typing indicator |
| `typingAnswer` | client ↔ server | Answer typing indicator |
| `newClient` | server → client | Notify existing players of a new connection |
| `end` | server → client | Quiz complete notification |

---

## Prerequisites

- [Node.js and npm](https://nodejs.org/)

---

## Setup

```bash
# Install dependencies
npm install
```

---

## Running

```bash
node server.js
```

The server listens on **port 1234**. Open `http://localhost:1234` in any browser on the same network to play.

To play on two separate devices, both must be connected to the same local network. Other devices should navigate to `http://<host-machine-ip>:1234`.

---

## How to Play

1. Enter your name and click **Start Quiz!** to load the first question.
2. Type your answer in the answer box and click **Check** to submit.
3. Click **Next** to advance to the next question (you can skip questions).
4. The quiz ends after 10 questions. Your total score is shown at the end.

**Scoring:** each question starts at 1000 points. Every correct submission reduces the point value by 50, so answering first always earns the most.

---

## Project Structure

```
.
├── server.js      # Express + WebSocket server, game logic, priority queue
├── index.html     # Single-page frontend (HTML/CSS/Vanilla JS)
├── package.json
└── QUESTIONS.pdf  # Original project brief
```

---

## License

[MIT](LICENSE)
