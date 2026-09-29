# 旅客留言版地图的局部修订

模式：内置 imagegen（edit），使用现有截图裁片；未使用 CLI、外部图库或整图重绘替换。

最终资源：`public/city-v3/island-core-v3.webp`、`public/city-v3/island-world-v3.webp`。

后处理：`scripts/prepare-visitor-art.mjs`。生成结果缩放到原裁片坐标，限定矩形合成；月亮修复边缘羽化，核心区外其他原像素保持不变。v2 和原始参考图保留以便恢复。02 招牌生成图的白色上下边框已裁除。

## plaques

输入：`/Users/wuzhiyuan/Downloads/zhiyuan-product-portfolio/public/city-v3/island-core-v2.webp`

提示词：

> Edit this exact pixel city image in-place. Remove ONLY the small plaque reading '01 SPRING ISLAND' near top-left and the small plaque reading '03 COMMUNICATION ISLAND' at bottom-right. Seamlessly reconstruct the night sky/clouds and sea behind those two little plaques. ALL other pixels, signs, buildings, city layout, dimensions and lighting must stay exactly unchanged. No new words or objects. This is surgical asset repair, not a new rendition. Return same framing.

Generated images are saved to /Users/wuzhiyuan/.codex/generated_images/01a0c2ed-9ca0-7ab0-b9fc-809c11839349 as /Users/wuzhiyuan/.codex/generated_images/01a0c2ed-9ca0-7ab0-b9fc-809c11839349/exec-b791a6f3-3cbc-4bd0-9e27-5c6c4f304e2d.png

## campus

输入：`/Users/wuzhiyuan/Downloads/zhiyuan-product-portfolio/outputs/visitor-campus.png`

提示词：

> Surgical edit of this pixel game screenshot crop. Replace the text on the existing blue/cyan dark sign with EXACT Chinese text: '00 开端｜把热爱发扬光大'. Single line, clear readable Chinese characters, same cyan/white pixel lettering and existing rectangular neon sign. Keep sign position and fit text neatly. No other text, no year underneath. Preserve ALL scenery around the sign exactly: trees, pixel sidewalk, water, dark blues and pixel sharpness. Do not crop or zoom.

Generated images are saved to /Users/wuzhiyuan/.codex/generated_images/01a0c2ed-9ca0-7ab0-b9fc-809c11839349 as /Users/wuzhiyuan/.codex/generated_images/01a0c2ed-9ca0-7ab0-b9fc-809c11839349/exec-62d8d150-c8ce-4f72-bf50-bc45a1d0578e.png

## contact

输入：`/Users/wuzhiyuan/Downloads/zhiyuan-product-portfolio/outputs/visitor-contact.png`

提示词：

> Surgical edit of this pixel city screenshot crop. Fix ONLY the Chinese sign text. It must read EXACTLY '联系我' (three Chinese characters), followed by the existing separate cyan up-right arrow. Remove the erroneous extra fourth Chinese character. Keep the same dark rectangular sign, cyan glowing frame and white/cyan pixel typography. Preserve all building, trees, paving, shadows and all surrounding pixels; no crop, no zoom.

Generated images are saved to /Users/wuzhiyuan/.codex/generated_images/01a0c2ed-9ca0-7ab0-b9fc-809c11839349 as /Users/wuzhiyuan/.codex/generated_images/01a0c2ed-9ca0-7ab0-b9fc-809c11839349/exec-480ba110-9cce-49a1-8102-17c99e9d2baa.png

## partners

输入：`/Users/wuzhiyuan/Downloads/zhiyuan-product-portfolio/outputs/visitor-partners.png`

提示词：

> Surgical edit of this exact cropped pixel city sign. Change ONLY its luminous cyan/blue frame and lettering to luminous warm golden yellow (#ffd36b), matching a golden Partner House sign. Keep the EXACT existing text '02 | B端项目 | 定制化解决方案', including 02 and all Chinese characters unchanged. Keep dark navy fill, exact proportions, surrounding buildings/scenery pixel-identical. No crop, no zoom, no new text.

Generated images are saved to /Users/wuzhiyuan/.codex/generated_images/01a0c2ed-9ca0-7ab0-b9fc-809c11839349 as /Users/wuzhiyuan/.codex/generated_images/01a0c2ed-9ca0-7ab0-b9fc-809c11839349/exec-01fcba98-51c4-4323-a8ce-a556371de944.png

## moon

输入：`/Users/wuzhiyuan/Downloads/zhiyuan-product-portfolio/outputs/visitor-moon.png`

提示词：

> Surgical edit of this small pixel night-sky crop. Remove the large crescent moon AND its blue halo completely. Fill that area seamlessly with dark navy pixel night sky, tiny sparse stars, keeping existing cloud shapes along lower edge. Match surrounding blue night atmosphere. No new moon, no celestial focal point. Preserve same framing and all other details. Not a new illustration.

Generated images are saved to /Users/wuzhiyuan/.codex/generated_images/01a0c2ed-9ca0-7ab0-b9fc-809c11839349 as /Users/wuzhiyuan/.codex/generated_images/01a0c2ed-9ca0-7ab0-b9fc-809c11839349/exec-e7571fec-cfc6-4822-83a2-a7764d472963.png
