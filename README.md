# 吴致远 — 像素城市个人主页

一张可交互的赛博朋克像素主城，展示城市定向社、PolisSH、薯格工作室、客户项目与 Sugar Agent。

- `/`：唯一主城页面。固定玩家 HUD + 可拖动岛屿主城、地图目录、通讯终端、六座可点击地标与独立环境动画。
- `/timeline`、`/studio`、`/agent`、`/about`：兼容旧链接，返回主城。
- 旧版 `/legacy` 及专属场景代码已移除；正文内容保留。

## 启动与检查

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

访问终端显示的 Local URL。`npm test` 会执行生产构建及自动测试，`npm run lint` 检查代码，`npm run typecheck` 生成当前 Worker 运行时类型并做全项目类型检查。

## 场景、HUD 与内容配置

- `content/reference-city.ts`：玩家信息、1672×812 原图主城坐标、2392×1292 扩展世界、建筑入口、车辆/行人/船只路径、水域与建筑遮挡、招牌/窗户/信号灯。
- `content/city-camera.ts`：默认镜头、边界、拖拽阈值与边缘阻尼，纯函数可单元测试。
- `components/reference-city/useCityCamera.ts`：Pointer Events / 指针捕获、rAF 镜头、触控板平移、键盘访问、尺寸变化与手动复位。
- `content/city-paths.ts`：恒速路径采样，与渲染无关。
- `content/city-visitor.ts`：唯一的直升机邀请及表单文案、18 个表情、姓名与留言长度、跳伞时长、码头落点及步行路径。
- `components/reference-city/CityVisitor.tsx`：直升机邀请与留言窗口，邮件确认后进入城市；未配置时只有 localhost 可用明确标记的“不发送”演示。
- `components/reference-city/visitor-motion.ts`：跳伞、码头着陆、道路往返的纯函数，支持减少动态。
- `app/api/visitors/route.ts`、`server/visitor-mail.ts`：服务端邮件接口与校验；固定收件人，凭据不进入前端。
- `components/reference-city/ReferenceCity.tsx`：场景加载、入口、焦点管理、动画时钟与暂停。
- `components/reference-city/CityHud.tsx`：像素头像、玩家信息、主线目标、系统菜单和底部状态栏。
- `components/reference-city/CityArrival.tsx`：进入/刷新时播放一次分层云雾散开动画，完成后卸载；点击、拖动、滚轮或键盘操作会立即略过。
- `components/reference-city/scene-motion.ts`：独立精灵、步行帧、旋翼、水面折射、尾波与局部灯光。
- `components/reference-city/CityTerminal.tsx`：原生内容 dialog，Escape 返回，恢复入口焦点。
- `content/character-profile.ts`：角色名称、Lv.24、三枚身份标签、信条、六维属性、主线说明、四个地点直达，以及联系方式入口配置。属性 `axis` 控制顺时针位置，数值可超过 100：前三项满格、续航略低，饭量与夜猫指数在相对方向突破外圈，夜猫指数更高。
- `components/reference-city/CharacterProfile.tsx`、`app/character-profile.css`：左侧像素立绘 + 右侧角色档案，六维 SVG 图和游戏操作按钮。窄屏重新排版；笔记本短屏使用紧凑模式。
- `components/reference-city/CityLandmarkSigns.tsx`：Traveler Plaza 立面招牌与“关于我的工作室 ↗”入口牌，配置在 `content/reference-city.ts` 的 `landmarkSigns` / `studioEntrySign` / `campusSign` 中。新入口牌覆盖旧 00 招牌矩形，与双塔共用地图坐标；原始地图位图保持不变。
- `app/reference-city.css`：全屏地图、HUD、建筑轮廓高亮和移动端样式。
- `app/city-terminal.css`：独立内容终端样式。
- `app/city-visitor.css`：空中邀请、姓名与 18 表情留言窗和旅客状态。
- `content/site.ts`：项目文案、数据、季度、Agent、联系方式。
- `components/ProjectDetail.tsx`：项目正文，不与地图场景绑定。
- `content/polis-chapters.ts`：PolisSH 的两段产品简介、整体业务数据、10 个真实章节与其名称、主题、年月、街区、人数。第一季档案使用本次提供的精确人数 **950**（工作室回顾中的“近1000”概述未改）；旧的虚构 S1–S10 配置已移除。
- `components/reference-city/PolisChapters.tsx`、`app/polis-chapters.css`：默认选择第七季的章节选择器；正式季大圆节点、外传 / Lite / 北大合作篇小节点、120周年菱形节点。鼠标、左右切换按钮、方向键和 Home/End 均只更新下方唯一档案，章节切换不跳转页面、不改变详情页的纵向滚动。手机横向滑动章节，档案先显示主题数据再显示图片；ESC 返回主城。
- `content/studio-archive.ts`：“关于我的工作室”公会档案的独立配置，包含身份介绍、累计成果、品牌合作、9 条按日期排列的主线记录、5 个重点里程碑与 NOW 当前节点。`destination` 直达原有 C端 / B端 / AI 终端，不新增页面或任务机制。
- `components/reference-city/StudioArchive.tsx`、`app/studio-archive.css`：公会徽记、开放式存档统计、连续发光时间线、不同权重的节点与档案影像。样式仅作用于工作室详情，移动端收窄时间轴并重排图片，减少动态偏好停用当前节点的呼吸光。
- `components/Placeholder.tsx`：素材占位；`public/images/` 保存真实项目图片与二维码。

### 工作室存档图片替换

在 `content/studio-archive.ts` 的 `journal.records[].media` 中填写 `src: "/images/studio/文件名.webp"`，图片放进 `public/images/studio/`。同步更新 `alt` 和 `label`；`format` 支持 `wide`、`panorama`、`portrait`。留空时显示明确的影像占位，填入地址后使用原生懒加载真实图片，并自动隐藏“待替换”提示。

本页共预留 6 张：PolisSH 第一季现场、五星社团证书 / 授奖、工作室团队、希尔顿「梧桐无同」、光影节「寻光奇遇记」、PolisSH 第七季现场。顶层数字是城市定向社 / PolisSH / 工作室的累计成果，不是仅成立公司之后的数据。

### PolisSH 每季图片替换

在 `content/polis-chapters.ts` 的对应章节 `media` 中配置 `hero.src`、`details[0].src`、`details[1].src` 和 `group.src`。可以沿用 `mediaFor(...)` 的占位，也可用显式媒体对象替换该季的 `media`；路径例如 `/images/polis/s1-cover.webp`，真实文件放在 `public/images/polis/`。空地址显示清晰占位，真实图片使用原生 lazy loading。每季均预留主视觉、游戏物料、游玩现场和团队合照；暂不需要合照时设 `group: null`。同步维护每张图片的 `label` / `alt`，不要修改章节事实来适配图片。

## 美术资源

- `public/images/profile/zhiyuan-pixel-v2.png`：当前角色立绘，使用用户提供的白色卫衣 / 黑框眼镜像素人物，经内置图像工具移除黑色背景，保留透明通道。完整提示词见 `content/character-cutout-prompt.md`。旧版 v1 作为备份保留，不再引用。

- `public/city-v3/island-core.webp`：用户参考图的原始主城，裁去上下 HUD，使用无损编码。仅几个移动角色的小区域由生成清理图补齐；建筑与招牌不重绘。
- `public/city-v3/reference-core.webp`：主城原图备份，自动测试逐像素核验所有非清理区域。
- `public/city-v3/island-world.webp`：固定主图位置后扩展的海域、天空、桥梁与远景；精确原图再独立覆盖于世界中心。
- `public/city-v3/island-core-v3.webp`：当前主图底板。移除两块英文岛屿牌、修正“联系我”、02 招牌改黄；底板旧校园文字已由 SVG“关于我的工作室”覆盖。逐像素测试保护未编辑区域。
- `public/city-v3/island-world-v3.webp`：当前外围。保留云、夜空、海面和桥梁的延伸，删除外围右上大月亮；主画面的小月亮不动。v2 资源保留作回退素材，不再被页面引用。
- `content/city-visitor-art-prompts.md`、`scripts/prepare-visitor-art.mjs`：上述修订的完整提示词和局部合成脚本。
- `public/city-v3/arrival-cloud.webp`：透明夜景像素云素材；四层 CSS 动画共用，HUD 始终固定在云层上方。
- `content/city-arrival-art-prompts.md`、`scripts/prepare-city-arrival.mjs`：上述新版素材的完整提示词和可复现的局部合成/编码流程。
- `public/city-v3/shanghai-ferry.png`：从参考图提取的透明 SHANGHAI 渡船精灵。
- `public/city-v2/actors.png`：独立 RGBA 精灵图集，含车辆、行人、船只和直升机。
- `content/island-art-prompts.md`：本轮内置图像生成的完整提示词与保真方法；上一轮图集来源在 `content/city-art-prompts.md`。
- `scripts/prepare-island-art.mjs`：无损裁图、局部清理合成、固定位置扩图输入及资源压缩；`scripts/prepare-city-art.mjs` 为先前图集工具。

桌面默认镜头完整呈现左上关于我小岛、中间主大陆、右下通讯小岛；四周可露出的世界不是空带，而是扩展海面与夜景。手机使用可读的大场景尺度，顶部地图目录可直接进入任何地点。世界只使用 `translate3d + scale` 移动，不操作网页滚动；六个建筑入口和动态层共享同一坐标系。

鼠标/触摸拖动超过 6 CSS 像素才进入平移，较小抖动仍算点击；拖拽结束会提交最后一帧并停在原处，不添加惯性或自动回中心。接近世界边界时减速，边界是硬限制，不暴露画布外空白。触控板/滚轮可平移，Ctrl/Meta+滚轮保留浏览器缩放；焦点在地图时方向键平移，Home 或底部“主城视角”手动复位。拖动和尺寸变化不移动 HUD。

建筑悬停或键盘聚焦时，显示轮廓、地面光和进入提示，底部当前区域同步更新。地图菜单支持 Escape / 点击外部收起。动画可以手动暂停；系统减少动态偏好、后台标签页、打开内容终端时也会暂停。局部霓虹与窗户使用低频缓变，不使用快速闪烁。静态模式保留所有功能。

每次完整加载/刷新，云雾先覆盖地图，素材就绪后约 3.5 秒向四角散开。没有使用 localStorage 记忆，因此刷新仍会播放；打开/关闭项目弹窗不会重播。云雾不捕获输入，首次操作即略过；`prefers-reduced-motion` 用户直接看到静态地图。

6 个环境彩蛋及旁白框已删除。直升机留言邀请常驻，不再定时消失；直升机在主城内部平滑往返，邀请与精灵共用时钟。点击后依次填写名字或昵称、选择 18 个表情之一、填写留言；提交获得邮件服务确认后，旅客从当前直升机位置跳伞，降落西南码头再沿道路散步。最多保留本次浏览的 3 位旅客，刷新清空，不构成公共留言墙。名字只随邮件发送，不展示于地图。减少动态时直接出现于码头；暂停按钮统一控制动画。原来的六个主项目入口保留。

“关于我”已改为角色档案。四个主线地点按钮直接切换现有内容终端，关闭后仍回到原始地图入口，不创建重复页面。“联系方式”直接打开现有“联系我”详情，不启动邮件客户端。

## 留言邮件配置（启用前必读）

目前没有发送凭据，因此不会实际发邮件，也不会显示虚假的“发送成功”。收件人已固定为 `15216632116@163.com`，不能由浏览器更改。

1. 在 Resend 创建只用于发信的 API key，并验证你拥有的发件域名。这里的 163 邮箱是**收件人**，不是发件域名；无需提供你的 163 邮箱密码。
2. 本地复制 `.dev.vars.example` 为 `.dev.vars`，填写 `RESEND_API_KEY` 与 `CITY_MAIL_FROM`（例如 `城市旅客 <city@你的已验证域名>`），重启 `npm run dev`。不要把真实凭据发到聊天或提交 Git；`.dev.vars*` 已被忽略。
3. 线上在当前 Worker 的服务器 secrets 中设置同名变量，再按既有部署流程发布；本地文件不会自动成为线上凭据。不要放在 `NEXT_PUBLIC_` / `VITE_` 变量、页面配置或仓库里。
4. 配置好后，通过直升机提交一条测试留言，并到 163 收件箱 / 垃圾箱核验。接口的 `accepted` 仅表示邮件服务已接收，不保证已经送达收件箱。

接口实时调用 Resend，无数据库、无后台队列；异常保留草稿，可重试。重试使用同一幂等键和相同内容。失败或未配置时不触发正式入城；只有本地有“本地体验跳伞 · 不发送留言”，方便美术与交互测试。

已有同源检查、18 表情白名单、1–32 字姓名 / 昵称限制、1–280 字留言限制、4KB 请求体限制、蜜罐及每个 Worker 实例每 IP 10 分钟 5 次的基础限制。正式公开大流量之前，建议在边缘增加全局限流 / 人机验证；目前的内存限流不是跨实例的全局反垃圾系统。

官方配置参考：[Resend 发信 API](https://resend.com/docs/api-reference/emails/send-email)、[发件域名验证](https://resend.com/docs/dashboard/domains/introduction)、[Cloudflare Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)。

## 隐私

项目案例演示仍仅使用 Mock Data / Demo Workspace，不调用 LLM、飞书、企业微信、1688 或 Codex。只有访客主动提交的姓名 / 昵称、表情和留言会经过服务端与邮件服务私密发给站主；不公开展示、不记录 IP 到邮件、不打印留言到服务日志。前端展示告知与同意说明，不含私有数据或密钥。
