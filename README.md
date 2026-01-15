# DevOrb 🔮

> 개발자를 위한 조용한 AI 데스크탑 동반자

화면 구석에 떠 있는 반투명 오브 형태의 미니멀 로봇 펫입니다. 포모도로 타이머와 연동하여 짧고 따뜻한 AI 코멘트를 제공합니다.

![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)
![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%202.0-orange)

## ✨ Features

- 🔮 **반투명 오브 UI** - 화면 구석에 항상 떠 있는 미니멀 디자인
- 👁️ **단일 눈 로봇 코어** - 감정 표현을 위한 애니메이션
- ⏱️ **포모도로 타이머** - Focus 25분 / Break 5분
- 🤖 **AI 코멘트** - GPT-4o-mini 기반 따뜻한 한마디
- 🖱️ **드래그 이동** - 원하는 위치로 자유롭게 이동
- 🍪 **간식 드롭** - 파일을 드래그하면 먹는 반응

## 🚀 Quick Start

### 자동 설치 (권장)

```bash
# Clone
git clone <repository-url>
cd mypet

# macOS/Linux
./setup.sh

# Windows
setup.bat
```

### 수동 설치

#### Prerequisites

1. **Rust** (1.77.2+)
   ```bash
   # macOS/Linux
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   
   # Windows: https://rustup.rs 에서 rustup-init.exe 다운로드
   ```

2. **Node.js** (18+)
   - https://nodejs.org 에서 다운로드

3. **System Dependencies (Linux only)**
   ```bash
   # Ubuntu/Debian
   sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
   
   # Fedora
   sudo dnf install webkit2gtk4.1-devel libappindicator-gtk3-devel librsvg2-devel
   ```

#### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## ⚙️ Configuration

### OpenAI API Key (Optional)

AI 코멘트 기능을 사용하려면:

```bash
# .env 파일 생성
echo "VITE_OPENAI_API_KEY=your-api-key" > .env
```

> API 키 없이도 앱은 정상 작동하며, 미리 정의된 메시지를 표시합니다.

## 📁 Project Structure

```
mypet/
├── src/                    # React Frontend
│   ├── components/         # UI 컴포넌트 (Orb, Timer, SpeechBubble)
│   ├── services/           # 비즈니스 로직 (timer, llm, state)
│   ├── hooks/              # 커스텀 훅 (useDrag)
│   └── styles/             # CSS 애니메이션
├── src-tauri/              # Rust Backend
│   ├── src/lib.rs          # Tauri 커맨드
│   └── tauri.conf.json     # 창 설정
├── setup.sh                # macOS/Linux 설치 스크립트
└── setup.bat               # Windows 설치 스크립트
```

## 📜 Philosophy

- 🤫 **조용함** - 개발자의 흐름을 방해하지 않음
- 🎯 **미니멀** - 게임이 아닌, 동반자
- 💡 **가벼움** - CPU/메모리 최소 점유
- 🌙 **차분함** - 집중 모드는 매우 고요하게

## License

MIT
