# Zhiyuan Wu — AI Product Portfolio

面向 2027 秋招的产品作品集，围绕两个可交互体验展开：

- Sugar Studio / 薯格工作室：PolisSH 城市游戏与 B 端产品案例
- Sugar Agent：多成员、多智能体 AI 工作平台

## 启动

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

浏览器访问终端显示的 Local URL。生产构建检查：

```bash
npm run build
```

## 内容与素材

- `content/site.ts`：全部项目文案、数字、季度、Agent、Workflow、工具与联系信息
- `app/globals.css`：全站视觉与响应式样式
- `public/`：社交分享图及后续真实图片 / 二维码
- `components/`：导航、占位素材、探索印章系统

页面中的素材占位块均标注了建议替换内容。替换真实图片时，可在 `content/site.ts` 中补充路径，并将 `Placeholder` 组件替换为 Next.js `Image`；默认启用浏览器 lazy loading。

## 隐私说明

V1 仅使用 Mock Data / Demo Workspace，不调用任何 LLM、飞书、企业微信、1688 或 Codex 接口，不包含私有数据或密钥。
