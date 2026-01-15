# DevOrb - Project Plan

## PROJECT OVERVIEW

DevOrb는 데스크탑 화면 구석에 표시되는 작은 AI 동반자(반투명 오브 + 단일 눈 코어)입니다.
포모도로 집중 시간/휴식 시간/장시간 작업 여부를 기준으로,
LLM을 사용해 짧고 따뜻하며 개발자 친화적인 코멘트를 제공합니다.
게임이 아니라, 개발자의 작업을 방해하지 않는 "조용한 AI 데스크탑 동반자"입니다.

---

## PRODUCT SPECIFICATION

### 1) CHARACTER & BEHAVIOR
- 화면 구석에 항상 떠 있는 80~120px 크기의 반투명 오브 UI
- 내부에 단일 눈(돔 형태) 로봇 코어 존재
- 기본 idle animation은 매우 느리고 가벼움 (hover motion, eye blink)
- 클릭 시: 쓰다듬기 → 코어 밝기 증가 + 작게 튐
- 드래그로 화면 위치 이동 가능
- 간식(energy pellet) 드롭 시 → 먹는 짧은 반응
- 절대 화면 중앙으로 이동하지 않음 (방해 금지)
- 애니메이션은 CSS / Lottie / sprite animation 중 하나

### 2) LLM INTERACTION
- LLM은 gpt-4o-mini 또는 유사 모델 사용
- 대사는 항상 1~2문장
- 말투는: 조용함, 따뜻함, 개발자에게 부담 없는 톤
- 말하는 타이밍(중요):
    - A. 포모도로 집중 시간이 끝날 때
    - B. 휴식 시간이 끝날 때
    - C. 개발자가 1시간 이상 입력(작업)한 경우
- 그 외의 상황에서는 절대 말하지 않음

#### LLM 프롬프트 템플릿:
```
당신은 데스크탑 화면에 떠 있는 작은 로봇 오브 펫입니다.
개발자를 도우며 짧고 따뜻하게 말합니다. 1~2문장만 출력하세요.
현재 상황:
- focus_minutes: {x}
- rest_minutes: {y}
- session_count_today: {z}
- current_time: {t}
개발자의 흐름을 방해하지 않고, 휴식/집중을 자연스럽게 권하는 한마디를 하세요.
```

### 3) PRODUCT PHILOSOPHY (중요)
- 게임처럼 느껴지면 안 됨
- "항상 옆에 있는 조용한 AI 동반자"가 목적
- 집중 모드는 매우 차분하게
- 쉬는 시간엔 살짝 활기만
- 상호작용은 짧아야 하고 의미를 크게 요구하지 않아야 함
- 앱의 모든 반응은 부드럽고 최소한일 것

### 4) CORE FEATURES (MVP)
- [x] 포모도로 타이머 (Focus/Break)
- [x] DevOrb 오브 UI (always-on-top + transparent window)
- [x] 애니메이션 3종: idle, happy, snack
- [x] LLM 코멘트 3 상황 지원
- [x] 쓰다듬기(클릭) 반응
- [x] 간식 드롭 반응
- [x] 애플리케이션 드래그 이동
- [x] 상태 저장: ~/.devorb/state.json

### 5) OS & FRAMEWORK
- Tauri 2.0 기반 (가벼움)
- macOS / Windows / Linux 지원
- 항상-on-top 창 + 투명창 지원
- 로컬 파일에 JSON 저장

### 6) DATA STRUCTURE
```json
{
  "mood": "neutral",
  "energy": 70,
  "focus_sessions": 5,
  "rest_sessions": 4,
  "last_focus_minutes": 25
}
```

### 7) NON-GOALS (구현 금지)
- 레벨 시스템 X
- 복잡한 게임 X
- 장문 AI 대사 X
- 전체 화면 팝업 X
- 과도한 알림/사운드 X
- 앱이 사용자 흐름을 방해하는 액션 X

---

## DEVELOPMENT REQUIREMENTS

### ARCHITECT
- Tauri 기반 구조 설계 ✅
- 투명 창/움직임/always-on-top 구현 ✅
- animation layer와 logic layer 분리 ✅
- LLM 서비스 및 타이머 모듈 구조화 ✅

### UI/UX
- 오브 디자인: 반투명 gradient orb ✅
- 내부 core-eye 애니메이션 ✅
- idle/happy/snack animation ✅
- 드래그 핸들러 UI ✅
- 말풍선 스타일 대사 컴포넌트 ✅

### CODE
- Tauri 프로젝트 생성 ✅
- transparent, frameless window 설정 ✅
- core animations 구현 ✅
- 포모도로 타이머 구현 ✅
- LLM API 연동 ✅
- snack drop detection ✅
- click/touch event ✅
- state.json 읽기/쓰기 ✅

---

## PROJECT STRUCTURE

```
mypet/
├── src/                    # React Frontend
│   ├── App.tsx             # Main orchestration
│   ├── components/
│   │   ├── Orb.tsx         # 오브 UI
│   │   ├── SpeechBubble.tsx
│   │   └── Timer.tsx
│   ├── services/
│   │   ├── timer.ts        # 포모도로 로직
│   │   ├── llm.ts          # LLM API
│   │   └── state.ts        # 상태 저장
│   ├── hooks/
│   │   └── useDrag.ts      # 드래그 이동
│   └── styles/
│       └── orb.css         # 애니메이션
├── src-tauri/              # Rust Backend
│   ├── src/lib.rs          # Tauri 커맨드
│   └── tauri.conf.json     # 창 설정
├── setup.sh                # macOS/Linux 설치
├── setup.bat               # Windows 설치
├── run.sh                  # macOS/Linux 실행
└── run.bat                 # Windows 실행
```

---

## GUIDELINES
- 전체 코드는 가능한 한 간결하고 모듈화
- 생산성 방해하는 요소 절대 금지
- 펫은 귀엽되 "어른 개발자 감성에 맞는 미니멀 로봇 스타일"
- 개발자 경험 최우선: CPU/메모리 최소 점유
