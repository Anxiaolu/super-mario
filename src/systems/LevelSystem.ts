import * as Phaser from 'phaser'
import { TILE_SIZE, COLLISION_TILES, TILE } from '../config/constants'
import { LevelData } from '../data/levels/types'

/**
 * 关卡构建系统
 * 根据 LevelData 创建 Tilemap 并放置背景装饰
 */
export class LevelSystem {
  private scene: Phaser.Scene
  private levelData: LevelData
  private mapWidth: number
  private mapHeight: number

  constructor(scene: Phaser.Scene, levelData: LevelData) {
    this.scene = scene
    this.levelData = levelData
    this.mapWidth = levelData.tiles[0].length * TILE_SIZE
    this.mapHeight = levelData.tiles.length * TILE_SIZE
  }

  /**
   * 构建 tilemap 并返回地面层和地图宽度
   */
  build(): { groundLayer: Phaser.Tilemaps.TilemapLayer; mapWidth: number } {
    // 用关卡数据创建 tilemap
    const map = this.scene.make.tilemap({
      data: this.levelData.tiles,
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    })

    // 添加 tileset，第一个参数是 tileset 名称，第二个是纹理 key
    const tileset = map.addTilesetImage(
      'mario-tiles',
      'mario-tileset',
      TILE_SIZE,
      TILE_SIZE
    )
    if (!tileset) {
      throw new Error('添加 tileset 失败')
    }

    // 创建渲染层
    const layer = map.createLayer(0, tileset, 0, 0)
    if (!layer) {
      throw new Error('创建 tilemap layer 失败')
    }
    // createLayer 可能返回 TilemapLayer | TilemapGPULayer，窄化到 TilemapLayer
    const groundLayer = layer instanceof Phaser.Tilemaps.TilemapLayer
      ? layer
      : (() => { throw new Error('不支持的 layer 类型') })()

    // 设置碰撞：使用碰撞瓦片集合
    groundLayer.setCollision([...COLLISION_TILES])

    // 设置物理世界边界
    this.scene.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight)

    // 放置背景装饰
    this.placeDecorations()

    return { groundLayer, mapWidth: this.mapWidth }
  }

  /**
   * 在背景层放置云朵、山丘、灌木
   * 位置参考原版超级马里奥兄弟 1-1 关
   */
  private placeDecorations(): void {
    const tiles = this.levelData.tiles
    const cols = tiles[0].length

    // 放置云朵：约每 20 列一个，高度在第 2-3 行
    for (let col = 8; col < cols; col += 20) {
      const cloudX = col * TILE_SIZE
      const cloudY = 2 * TILE_SIZE + Phaser.Math.Between(-1, 1) * TILE_SIZE
      this.scene.add.image(cloudX, cloudY, 'cloud-large').setOrigin(0, 0).setScrollFactor(0.8)

      // 第二朵小云
      if (col + 10 < cols) {
        const x2 = (col + 10) * TILE_SIZE
        const y2 = 3 * TILE_SIZE + Phaser.Math.Between(-1, 0) * TILE_SIZE
        this.scene.add.image(x2, y2, 'cloud-medium').setOrigin(0, 0).setScrollFactor(0.8)
      }
    }

    // 找到地面行（从下往上找第一个非空行）
    const groundRow = this.findGroundRow(tiles)

    // 放置山丘：在地面附近，约每 40 列一个大/小交替
    for (let col = 0; col < cols; col += 40) {
      const hillX = col * TILE_SIZE
      const hillY = groundRow * TILE_SIZE
      const isLarge = (col / 40) % 2 === 0
      const key = isLarge ? 'hill-large' : 'hill-small'
      const image = this.scene.add.image(hillX, hillY, key).setOrigin(0, 1).setScrollFactor(0.9)
      image.setDepth(-1)
    }

    // 放置灌木：在地面边缘，穿插在山丘之间
    for (let col = 16; col < cols; col += 30) {
      const bushX = col * TILE_SIZE
      const bushY = groundRow * TILE_SIZE
      const isLarge = col % 60 === 16
      const key = isLarge ? 'bush-large' : 'bush-small'
      const image = this.scene.add.image(bushX, bushY, key).setOrigin(0, 1).setScrollFactor(0.9)
      image.setDepth(-1)
    }
  }

  /**
   * 从下往上找到第一个有地面瓦片的行号
   */
  private findGroundRow(tiles: number[][]): number {
    for (let row = tiles.length - 1; row >= 0; row--) {
      for (let col = 0; col < tiles[row].length; col++) {
        if (tiles[row][col] === TILE.GROUND) {
          return row
        }
      }
    }
    // 兜底：返回倒数第二行
    return tiles.length - 2
  }
}
