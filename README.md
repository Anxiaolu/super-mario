# Super Mario Bros — Phaser 4

Phaser 4 超级马里奥兄弟风格平台游戏。全部资源（纹理、动画、音效）在运行时程序化生成，无外部素材文件。

## 操作说明

| 按键 | 功能 |
|------|------|
| 方向键 ← → | 移动 |
| Space | 跳跃（可变高度：松开截断上升） |
| Shift | 加速跑 |
| Z | 发射火球（需火焰马里奥状态） |
| ↓ | 蹲下（大/火焰马里奥） |

## 开发

```bash
npm install       # 安装依赖（Node 24.13.0）
npm run dev       # Vite 开发服务器
npm run build     # tsc 类型检查 + Vite 构建
npm run lint      # ESLint
npm run preview   # 预览生产构建
```

## 测试

```bash
npm run test:e2e       # E2E 测试（需先启动 dev server）
npm run test:e2e:ui    # E2E 测试 UI 模式
```

## 架构

```
src/
  scenes/      — Phaser 场景（BootScene → GameScene + UIScene）
  entities/    — 游戏实体（Mario, Goomba, Koopa, Bowser 等）
  systems/     — 可复用子系统（Input, Level, Collision, Camera, Score）
  assets/      — 程序化纹理/动画/音效生成
  data/levels/ — 关卡数据（World 1-1 ~ 1-4）
  config/      — 游戏配置和常量
```

场景间通信：
- `scene.registry` — 跨关卡持久化（score/coins/lives/levelIndex）
- `game.events` — HUD 更新广播
- `scene.events` — 场景内实体通信