# Claude Verify

> Claude Code 真伪鉴别工具 — 一键检测你的 Claude Code 是否为正版

基于 React + TypeScript 构建的精美单页应用，通过 9 项加权检测分析 API 响应，判断其是否来自真正的 Anthropic Claude Code。

## 功能特性

- **9 项加权检测**：签名长度、身份回答、Thinking 输出/身份、响应结构、系统提示词注入、工具支持、多轮对话、Output Config
- **内置 API 测试面板**：支持 Anthropic Messages API 和 OpenAI 兼容接口，直接发起请求并自动填充结果
- **手动验证模式**：粘贴 JSON 响应、签名、回答文本、Thinking 文本进行离线分析
- **评分系统**：85+ 正版（绿）/ 60-84 疑似（黄）/ <60 可能非正版（红）
- **快速验证 & 完整验证**两种模式
- **暗色模式**支持
- **响应式布局**，移动端友好
- **Docker 一键部署**

## 技术栈

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- Framer Motion（动画）
- Lucide React（图标）
- Docker + Nginx（生产部署）

## 快速开始

### 本地开发

```bash
npm install
npm run dev
```

### Docker 部署

```bash
docker compose build
docker compose up -d
# 访问 http://localhost:8080
```

## 项目结构

```
src/
├── core/
│   ├── types.ts             # TypeScript 类型定义
│   ├── checks.ts            # 9 项检测逻辑
│   └── api-client.ts        # API 请求与响应解析
├── hooks/
│   └── use-verification.ts  # 核心状态管理
├── components/
│   ├── Header.tsx           # 标题栏 + 暗色模式切换
│   ├── StatusCard.tsx       # 状态横幅（动画）
│   ├── ApiTestPanel.tsx     # 内置 API 测试面板
│   ├── ManualInputForm.tsx  # 手动输入表单
│   ├── ScoreGauge.tsx       # SVG 环形评分仪表
│   ├── ResultBadge.tsx      # 鉴定结果徽章
│   ├── ChecksList.tsx       # 检测项列表
│   └── Footer.tsx           # 操作按钮
└── App.tsx                  # 主页面组装
```

## 参考来源 & 鸣谢

本项目基于以下原始作品重构，感谢原作者的创意与实现：

- **原始网站**：[cctest.blueshirtmap.com](https://cctest.blueshirtmap.com/) — Claude Code 真伪鉴别在线工具
- **社区讨论**：[Linux.do 论坛帖子](https://linux.do/t/topic/1471272) — 项目发起与讨论

原版为纯 HTML/CSS/JS 实现，本项目使用 React + TypeScript 进行了完整重构，在保留全部检测逻辑的基础上升级了 UI 体验。

## License

MIT
