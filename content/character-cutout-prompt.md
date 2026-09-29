# 用户提供立绘：透明背景处理

方式：内置 image_gen 编辑，background-extraction，transparent_background=true；未使用 CLI。

输入：用户提供的黑框眼镜、白色卫衣像素人物图（1024 × 1536）。

输出：`public/images/profile/zhiyuan-pixel-v2.png`。旧版 v1 保留作备份，页面只引用 v2。

保留人物服装、姿态、地图和像素风，仅要求去除黑色背景；网页布局和其它内容不变。

## 完整提示词

```text
Use case: background-extraction
Input image 1: exact edit target, user-supplied full-body pixel-art character on solid black.
Primary request: Remove ONLY the flat black background and make it genuinely transparent (RGBA alpha 0). Deliver the exact existing character cut out, not a redesign.
Preserve invariants: identical character, face, black rectangular glasses, hairstyle, smile, cream/white hoodie, hoodie drawstrings, map held in left-side hand, black trousers, gray/white sneakers, pose, full-body scale and placement, all pixel colors and sharp stepped pixel edges. Preserve all dark hair, glasses frames, dark clothing and their existing black outlines as opaque foreground. Remove background in the empty gap between the legs and around hands/map as well. Do not erase dark garment pixels.
Composition: retain original 1024x1536 portrait framing; no clipping of hair or shoes.
Avoid: redraw, restyling, color correction, extra lighting, glow, shadow, props, text, border, backdrop, checkerboard painted into the image. Only the background becomes transparent.
```
