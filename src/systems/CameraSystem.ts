import * as Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants'

/**
 * 相机系统
 * 管理相机跟随玩家和单向卷轴（只允许向右滚动）
 */
export class CameraSystem {
  private scene: Phaser.Scene
  private mapWidth: number
  private target: Phaser.GameObjects.GameObject | null = null

  /** 相机曾经到达过的最大 x 偏移，用于限制不能往回走 */
  private maxScrollX = 0

  constructor(scene: Phaser.Scene, mapWidth: number) {
    this.scene = scene
    this.mapWidth = mapWidth
  }

  /**
   * 设置跟随目标并初始化相机边界
   */
  startFollow(target: Phaser.GameObjects.GameObject): void {
    this.target = target
    const cam = this.scene.cameras.main

    // 不调用 cam.startFollow，完全手动控制滚动避免冲突
    cam.setBounds(0, 0, this.mapWidth, GAME_HEIGHT)

    // 初始化 maxScrollX 为当前相机位置
    this.maxScrollX = cam.scrollX
  }

  /**
   * 每帧更新：水平方向限制为单向卷轴（只向右），取整避免像素抖动
   * scrollY 固定为 0（关卡高度适配屏幕）
   */
  update(): void {
    const cam = this.scene.cameras.main

    if (this.target?.active) {
      const target = this.target as Phaser.GameObjects.Sprite
      const targetX = Math.floor(target.x - GAME_WIDTH / 2)
      const clampedX = Phaser.Math.Clamp(targetX, this.maxScrollX, this.mapWidth - GAME_WIDTH)
      const snappedX = Math.round(clampedX)

      cam.scrollX = snappedX
      cam.scrollY = 0

      if (snappedX > this.maxScrollX) {
        this.maxScrollX = snappedX
      }
    }
  }
}
