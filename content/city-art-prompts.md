# 新版城市美术记录

模式：内置 image_gen（非 CLI / API）。参考图由用户提供。

环境：`public/city-v2/environment.webp`，仅对生成结果做 WebP 压缩，不是旧版画布截图。
角色：`public/city-v2/actors.png`，保留原始透明通道，通过独立精灵动画绘制。

## 场景底图提示词

Use case: precise-object-edit.
Asset type: production background plate for a layered interactive pixel-art city website.
Input image 1 is the exact visual reference AND edit target. Faithfully preserve this particular city, not a reinterpretation.

Make a clean environment plate of the city shown in this image. Remove the browser tab strip and address bar (the top 86 px of the reference); the resulting image is ONLY the scene below, in approximately 1.448:1 landscape aspect ratio. Fill the complete frame with this scene, no border.
Remove UI overlays: the top-left personal header, the entire top-right map/task/backpack/avatar toolbar, the narrow far-left vertical banner, bottom-left instructions/version text, and bottom-right mini-map/coordinates. Reconstruct the city/water behind these overlays.
Remove all moving entities: ALL little cars, taxis, buses, pedestrians/characters, boats, their wakes, and any aircraft. Leave roads, crossings, sidewalks and water naturally continuous and empty, ready for independent animated sprites. Keep every static building, tree, lamppost, staircase, plaza, shop, bridge and sign.

Critical invariants: match the reference architecture silhouette, proportions, locations, perspective, color and light exactly. Cyan multi-tier ZHIYUAN/about-me building upper-left with luminous roof cube and steps; Fudan pale paired towers and deep campus courtyard/fountain center-top; elaborate cyan AI lab with huge holographic brain upper-right; broad bright magenta POLISSH city play center bottom-left; golden-window stepped business tower bottom-center; lattice communications tower and LINK terminal bottom-right; curved island seawalls, lower-right suspension bridge, dense small buildings and cherry trees. Same fine-grained high-detail 2.5D pixel illustration, same deep blue night, saturated cyan and pink neon, golden windows, rich reflected colored lights in the surrounding water. Do NOT simplify into geometric blocks, low-poly objects, or coarse pixel icons.
Keep architectural signage readable: “关于我”, “ZHIYUAN”, “复旦大学”, “核心经历”, “FUDAN”, “AI Agent 工作台”, “PolisSH”, “CITY PLAY”, “PolisSH 系列”, “B端客户与项目”, “联系我”, “LINK”, and existing small shop signs. Keep these signs as physical parts of the buildings. Do not introduce new labels.
No static characters or vehicles anywhere, no browser chrome, no floating application HUD, no mini-map. No redesign of roads, buildings, waterfront or lighting. High resolution and intricate pixel detail.

## 动态精灵图集提示词

Use case: stylized-concept. Asset type: a production transparent sprite atlas for the attached pixel city environment.
Input image 1 is a STYLE AND CAMERA REFERENCE ONLY. Create NEW isolated moving-entity sprites that visually belong in exactly this city: fine pixel-art, rich tiny details, oblique elevated 2.5D game camera, deep blue night shadows, cyan/pink reflections and warm little window lights.
Output a square 1024x1024 genuinely transparent RGBA sprite sheet arranged on an EXACT 4-column by 4-row grid. Each of the 16 cells is 256x256 pixels. Center each complete sprite exactly at the center of its cell (128,128 relative to its cell). No visible grid, no labels, no text, no background, no road, no ground tiles, no large shadows or glow outside the sprite, no outline boxes. Plenty of transparent padding between sprites. Every sprite stays strictly within its own cell.
Row 1, four little detailed city cars all approximately 150 pixels wide within their cells: column 1 magenta sedan facing right (east), column 2 cyan sedan facing left (west), column 3 yellow taxi facing down (south, seen from elevated front), column 4 blue sedan facing up (north, elevated rear).
Row 2, four walking animation frames of the SAME small pixel pedestrian wearing a teal jacket, dark trousers, small backpack, black hair. Full body, approximately 100px tall. Same elevated side/three-quarter view facing right. Frame 1 left leg forward, frame 2 legs passing, frame 3 right leg forward, frame 4 legs passing. Identical character size and center in all four cells. No chibi oversize head, realistic tiny game pedestrian proportions.
Row 3, boats with warm lit passenger windows and magenta/cyan trim: column 1 elegant little ferry facing right, column 2 same ferry facing left, column 3 small blue speedboat facing right, column 4 same speedboat facing left. About 190 pixels wide per sprite. No water or wakes, those are animated in code.
Row 4: column 1 detailed blue-gray helicopter fuselage facing right, column 2 same fuselage facing left, both with tail fin, windows and landing skids but NO main rotor blades (rotor will animate separately), approximately 180 pixels wide. Column 3 a cyan city bus facing right, column 4 same bus facing left, each approximately 170px wide.
All sprites must have identical pixel illustration craft to the reference scene, NOT vector icons, NOT smooth 3D renders, NOT coarse geometric placeholders. Truly transparent background, including empty space inside helicopter skids.
