# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Phaser 4 超级马里奥兄弟风格平台游戏，全部资源（纹理、动画、音效）在运行时程序化生成，无外部素材文件。

## 常用命令

```bash
npm run dev       # Vite 开发服务器
npm run build     # tsc 类型检查 + Vite 构建
npm run lint      # ESLint
npm run preview   # 预览生产构建
npx tsc -b        # 仅类型检查
npx playwright test           # E2E 测试（需先启动 dev server）
npx playwright test --ui      # E2E 测试 UI 模式
```

## 架构

### 场景流程

```
BootScene → GameScene + UIScene (并行运行)
```

- **BootScene**: 生成所有纹理、动画后跳转到 GameScene
- **GameScene**: 核心玩法场景，掌管实体创建、物理碰撞、关卡流程
- **UIScene**: HUD 覆盖层，监听 `update-hud` 全局事件刷新分数/金币/时间，用 Graphics 像素字渲染

### 核心类

| 类 | 文件 | 职责 |
|---|---|---|
| `Mario` | `src/entities/Mario.ts` | 玩家角色，继承 Arcade.Sprite，管理 powerState（small/big/fire）、输入响应、可变高度跳跃、动画 |
| `InputSystem` | `src/systems/InputSystem.ts` | 键盘输入封装（方向键移动、Space 跳跃、Shift 加速跑、Z 发射） |
| `LevelSystem` | `src/systems/LevelSystem.ts` | 根据 LevelData 创建 Tilemap、放置云朵/山丘/灌木装饰 |
| `CollisionSystem` | `src/systems/CollisionSystem.ts` | 注册所有碰撞/overlap，处理踩敌、顶砖、拾取道具、连击加分 |
| `CameraSystem` | `src/systems/CameraSystem.ts` | 单向卷轴相机（只能向右），手动设置 scrollX 避免插值抖动 |
| `ScoreSystem` | `src/systems/ScoreSystem.ts` | 分数/金币/生命/时间管理，通过 `registry` 跨关卡持久化，通过 `game.events` 同步到 HUD |
| `SoundGenerator` | `src/assets/audio/SoundGenerator.ts` | Web Audio API 单例，程序化生成 8-bit 音效 |
| `Goomba` / `Koopa` | `src/entities/` | 敌人，继承 Arcade.Sprite，自主管理移动和状态 |

### 数据流

- **跨场景状态**: 通过 `scene.registry` 持久化 score/coins/lives/levelIndex，场景重启后恢复
- **HUD 更新**: `ScoreSystem` → `game.events.emit('update-hud', {type, value})` → `UIScene` 监听重绘
- **关卡加载**: `src/data/levels/index.ts` 导出 `LEVELS` 数组，`getLevel(index)` 按索引取关卡

### 关卡数据格式

`LevelData`（`src/data/levels/types.ts`）包含：
- `tiles: number[][]` — 2D 瓦片数组，数字对应 `TILE` 常量
- `metadata.enemies` — 敌人出生位置和类型
- `metadata.flagpoleX`, `playerStartX/Y` — 旗杆和玩家出生坐标

### 运行时资源生成

所有纹理在 `BootScene.create()` 中程序化生成，位于 `src/assets/textures/`：
- `MarioTextures.ts` — 马里奥各状态像素帧（10x16 小马里奥，12x32 大马里奥）
- `EnemyTextures.ts` — Goomba、Koopa 帧
- `ItemTextures.ts` — 蘑菇、金币、火焰花、星星
- `TileTextures.ts` — 砖块、问号块、地面、管道、城堡等瓦片
- `TilesetGenerator.ts` — 将所有瓦片纹理合成为 GameScene 使用的 tileset
- `EffectTextures.ts` — 得分文字、砖块碎片
- `BackgroundTextures.ts` — 云朵、山丘、灌木

`src/assets/animations/` 中的文件创建 Phaser 动画（walk、jump、turn 等帧序列）。

### 技术要点

- **物理引擎**: Arcade Physics，重力 1600
- **像素艺术**: `pixelArt: true`，缩放 3x（`Scale.FIT`），256x240 基础分辨率
- **渲染**: Canvas 渲染器（`Phaser.AUTO`），通过 `createCanvas` 绘制像素纹理
- **Node 版本**: 24.13.0（见 `.nvmrc`）
