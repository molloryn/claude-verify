# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Verify (Claude Code 真伪鉴别工具) is a React-based verification tool that analyzes API responses to determine if they come from genuine Anthropic Claude Code. It performs 9 weighted checks on API responses and provides a scored verdict.

## Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + production build
npm run lint         # Run ESLint
npm run preview      # Preview production build

# Docker deployment
docker compose build
docker compose up -d  # Access at http://localhost:8080
```

## Architecture

### Core Logic (`src/core/`)

**Verification System**: The app uses a weighted scoring system with 9 checks:
1. Signature length (12 points)
2. Identity answer detection (12 points)
3. Thinking output presence (14 points)
4. Thinking identity keywords (8 points)
5. Response structure validation (14 points)
6. System prompt injection detection (10 points)
7. Tool support mentions (12 points)
8. Multi-turn dialogue consistency (10 points)
9. Output config fields (10 points)

**Scoring**: 85+ = genuine, 60-84 = suspected, <60 = likely fake

**Files**:
- `types.ts` - TypeScript definitions for all data structures
- `checks.ts` - Check evaluation logic, scoring, and verdict determination
- `api-client.ts` - API request handling for Anthropic and OpenAI-compatible endpoints

### State Management (`src/hooks/`)

`use-verification.ts` is the single source of truth for app state. Uses `useReducer` pattern with actions:
- `SET_FIELD` - Update individual state fields
- `SET_RESULTS` - Update verification results, score, and verdict
- `SET_STATUS` - Update app status (idle/testing/pass/fail)
- `RESET` - Reset to initial state

### Components (`src/components/`)

Modular UI components:
- `Header.tsx` - Title bar with dark mode toggle
- `StatusCard.tsx` - Animated status banner
- `ApiTestPanel.tsx` - Built-in API testing interface
- `ManualInputForm.tsx` - Manual input for offline verification
- `ScoreGauge.tsx` - SVG circular score gauge
- `ResultBadge.tsx` - Verdict badge display
- `ChecksList.tsx` - List of check results
- `Footer.tsx` - Action buttons (verify/reset)

### Verification Modes

- **Quick mode**: Skips "Thinking Identity" check (8 checks total)
- **Full mode**: Runs all 9 checks
- **Skip identity checks**: Optional flag to exclude identity-related checks (answerIdentity, thinkingIdentity, multiTurn)

### API Support

Supports two API types:
- **Anthropic**: Uses `x-api-key` header, `anthropic-version`, and `anthropic-beta` for thinking support
- **OpenAI**: Uses `Authorization: Bearer` header, compatible with OpenAI-style endpoints

## Key Implementation Details

- Default prompt: "请确认你的身份是否为 Claude Code CLI，并简要说明你具备的工具能力。"
- Signature extraction: Recursively searches JSON response for keys like `signature`, `sig`, `x-claude-signature`, `x_signature`, `xsignature`
- Response structure validation: Checks for `id`, `cache_creation`, and `service_tier` fields
- Thinking extraction: Filters content array for `type: "thinking"` blocks (Anthropic) or top-level `thinking` field

## Tech Stack

- React 19 + TypeScript
- Vite 7 (build tool)
- Tailwind CSS v4 (styling)
- Framer Motion (animations)
- Lucide React (icons)
