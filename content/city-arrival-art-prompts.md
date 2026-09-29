# 云雾入城与边缘延展（2026-09-28）

使用内置 image_gen 模式。保留上一版素材，当前页面使用下列新版文件。

- `public/city-v3/island-core-v2.webp`：只替换校园主招牌与原年份小牌两处，原图其余像素保持不变。
- `public/city-v3/island-world-v2.webp`：更清晰的夜空云层、海面纹理和右侧桥梁延展，在主图外侧用 100px 过渡衔接旧边缘。
- `public/city-v3/arrival-cloud.webp`：真实透明通道的夜景像素云，供四个独立 CSS 动画层复用。
- 确定性裁切、遮罩与格式转换：`scripts/prepare-city-arrival.mjs`。
- 入口动画：`components/reference-city/CityArrival.tsx`，每次加载播放，任何点击/拖动/滚轮/键盘输入可立即略过；尊重 prefers-reduced-motion。

## 招牌局部编辑提示词

```text
Use case: text-localization / precise-object-edit.
Input image 1 is the exact edit target, a small pixel-art campus sign crop. Preserve EXACT framing and 272:100 aspect ratio, all pixels of surrounding trees, pavement, posts, cyan light, and the primary rectangular sign. Change ONLY two things:
1. Replace the main sign text with exactly "开端：从社团到工作室", ten Chinese characters plus colon, cyan-white clean legible Chinese text centered within the original neon rectangular sign frame. Spell exactly 开 端 ： 从 社 团 到 工 作 室. No additional words or punctuation.
2. Remove the ENTIRE small lower "2023" rectangle, including its border and digits. Seamlessly restore the green campus plants/path behind where that secondary plaque was. Do not leave an empty small plaque. Keep the large primary sign frame, trees, road and all other surroundings completely unchanged. Pixel-art night palette unchanged. No zoom, no new symbols.
```
## 外围场景编辑提示词

```text
Use case: precise-object-edit / environment extension refinement.
Image 1 is the existing full pixel-art city world canvas, aspect ratio 1705:922. Preserve the exact framing and all city islands, buildings, typography, roads and every landmark. Do not zoom or move the main composition. Modify ONLY the OUTER BORDER around the main city: top 0-170px, left 0-257px, right 1448-1705px, bottom 752-922px, seamlessly matching the adjacent original scene. Make these margins a visible continuous extension, NOT black void: richly layered indigo/blue/violet pixel clouds across the upper night sky, small restrained stars between clouds; cobalt deep sea with clearly visible detailed pixel ripples, violet and cyan reflected lights across left/right/bottom margins. Maintain the same pixel size and lighting level as adjacent core ocean, no dark vignette fading outer edge to black. The existing magenta suspension bridge exiting upper right must continue across the right margin naturally as a connected bridge with matched pylons, cables, piers and reflection. A subtle low distant quay at its far right end is okay. NO new islands, landmark buildings, text, boats, cars or UI, NO duplicate skyline, NO second city. The main protected city rectangle at x257..1448,y171..751 must remain unchanged, especially island silhouettes and every sign. The edges should feel like the SAME night sky and sea extending to infinity, with continuous cloud banks and ocean ripple texture, not a framing border. Output same aspect ratio.
```

## 云雾生成提示词

```text
Use case: stylized-concept.
Asset type: transparent foreground cloud bank sprite for the opening reveal of a cyberpunk pixel-art city webpage.
Create ONE broad, irregular dense bank of night clouds and sea mist, wide landscape 3:2 framing. Fully transparent background outside the cloud silhouette, real alpha, no checkerboard baked in. Cloud fills most of the canvas with irregular feathered wisps near edges and an opaque dense center. Rich layered billowing navy, slate blue, lavender and muted cyan highlights, nocturnal rather than white daytime clouds. Clearly deliberate high-quality 2D pixel-art texture, small blocky stepped edges and internal pixel shading, matching a detailed night city game map. Dense enough to hide the map initially, with wispy translucent edges for a natural reveal as several cloud layers slide apart. No scene, no horizon, no city, no sea, no stars, no text, no borders. Single isolated cloud bank only, not a sprite sheet, not photorealistic.
```
