# 岛屿主城美术与保真说明

模式：内置 image_gen。主城不是重新想象的生成图，而是用户参考图的原始画面（去除顶部 70px 和底部 HUD），只把几个移动角色所在小区域替换成清理后的生成像素。

- 主城：`public/city-v3/island-core.webp`，无损编码；测试逐像素核验所有非清理区域。
- 参考备份：`public/city-v3/reference-core.webp`。
- 扩展世界：`public/city-v3/island-world.webp`，固定原图位置的外围扩图；页面再覆盖原始主城，避免任何建筑或文字漂移。
- 渡船精灵：`public/city-v3/shanghai-ferry.png`，真实透明背景。
- 其他动态精灵复用 `public/city-v2/actors.png`。

外围生成曾经过构图试稿，最终改用固定原图嵌入位置的扩图画布，避免接缝与第二条重复天际线。原始生成文件保留在 Codex generated_images 目录。

## 1. islandCleanupPrompt

```text
Use case: precise-object-edit.
Input image 1: edit target, a supplied 1672x941 pixel city screenshot. Make a clean animation background plate, KEEP THE EXACT SAME dimensions/aspect, framing, building placement, islands, roads, skyline, colors, signs and every letter. Do NOT redraw or restyle the city. Change ONLY the tiny moving objects: remove all boats on the water, cars on streets/bridges, small pedestrians, and the little character on the upper left island's circular platform. Seamlessly reconstruct water/road/pavement behind them. Keep static architecture, piers, helipad H, every sign including 关于我, PolisSH Tower, Partner House, Agent Studio, 起点：复旦大学城市定向社, 2023, 联系我故, 01 SPRING ISLAND, 03 COMMUNICATION ISLAND, and all upper skyline letter art absolutely unchanged. Keep the top/bottom HUD as in the source; those will be cropped by the application. NO composition changes, NO new islands, NO new text, NO border, NO zoom. Production background for an animated website; removal-only retouch.
```

## 2. islandFerryPrompt

```text
Use case: background-extraction.
Image 1 is the source. Extract ONLY the large dark blue passenger ship with the word SHANGHAI in the lower-left water (roughly x130-355,y654-788). Preserve its EXACT pixel art appearance, width/height proportion, perspective, black navy hull, pink neon lower line, yellow lit windows, masts and the legible text SHANGHAI. Isolate that single ship onto a genuinely transparent background, snug but with ~8% clear margin, no water, no shadow, no wakes, no scenery, no other boat, no new details. Single right-facing vessel, not a sprite sheet. Do not change the ship's design. Production live sprite for an animated pixel map.
```

## 3. islandAnchoredPrompt

```text
Use case: precise-object-edit / OUTPAINT ONLY.
Image 1 is the actual edit target canvas, 2392x1292. A protected original city rectangle occupies x360 to2032, y240 to1052. All surrounding solid dark navy area is an EMPTY BORDER TO FILL. DO NOT resize, move, zoom, redraw, erase or reinterpret the existing protected city rectangle. Preserve all pixels, building geometry, lettering, colors, island arrangement, landmark sizes, camera angle EXACTLY. Fill ONLY the empty solid navy margins seamlessly outward from the image edges: continue the pixel night ocean left/right/bottom with matching water ripple scale and density and flowing neon reflections; top margin continues the existing dark night sky and low blue mist above the existing skyline, NO second skyline. Extend the cut-off magenta bridge at the right boundary naturally into the right margin, dwindling to a quiet distant quay. Add at most one very small low-contrast empty dock at the far left or bottom periphery. This outer ring is low-focus atmospheric water, night clouds, distant small lights, no new important buildings, no islands, no labels, no boats, no cars, no people. Eliminate the original rectangle's thin cyan top/bottom edge lines as they are UI artifacts, and blend the border seamlessly so there is NO visible pasted rectangular edge. Do not touch ANY city pixels away from those first/last edge rows. Output the same wide 2392x1292 framing; original protected image remains EXACTLY in the same location and size with the same aspect ratio. This is NOT a new composition; fill the existing blank frame only.
```
