import { test, expect } from '@playwright/test'

const GAME_URL = 'http://localhost:5173'

// 游戏加载等待时间(ms)
const GAME_LOAD_WAIT = 3000

/**
 * 模拟按住键一段时间
 */
async function holdKey(page: import('@playwright/test').Page, key: string, durationMs: number): Promise<void> {
  await page.keyboard.down(key)
  await page.waitForTimeout(durationMs)
  await page.keyboard.up(key)
}

/**
 * 模拟组合键：按住 modifier 同时按住 actionKey
 */
async function holdKeys(
  page: import('@playwright/test').Page,
  keys: string[],
  durationMs: number,
): Promise<void> {
  for (const key of keys) {
    await page.keyboard.down(key)
  }
  await page.waitForTimeout(durationMs)
  for (const key of keys) {
    await page.keyboard.up(key)
  }
}

test.describe('Phaser 马里奥游戏 - 完整 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(GAME_URL)
    // 等待 Phaser 场景加载完成
    await page.waitForTimeout(GAME_LOAD_WAIT)
  })

  // ===== 1. 游戏加载 =====

  test('1. 游戏初始加载画面', async ({ page }) => {
    const canvas = page.locator('#game canvas')
    await expect(canvas).toBeVisible()

    await page.screenshot({ path: 'test-results/01-initial-load.png' })

    // 验证 canvas 有合理尺寸
    const box = await canvas.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(100)
    expect(box!.height).toBeGreaterThan(100)
  })

  // ===== 2. 马里奥移动 =====

  test('2. 马里奥向右移动', async ({ page }) => {
    // 向右走 400ms
    await holdKey(page, 'ArrowRight', 400)
    await page.screenshot({ path: 'test-results/02-move-right.png' })
  })

  test('3. 马里奥向左移动', async ({ page }) => {
    // 先向右走一段距离
    await holdKey(page, 'ArrowRight', 400)
    // 再向左走
    await holdKey(page, 'ArrowLeft', 400)
    await page.screenshot({ path: 'test-results/03-move-left.png' })
  })

  // ===== 3. 跳跃测试 =====

  test('4. 单次跳跃', async ({ page }) => {
    // 按空格跳跃
    await page.keyboard.press('Space')
    // 等待在空中时截图
    await page.waitForTimeout(150)
    await page.screenshot({ path: 'test-results/04-jump.png' })

    // 等待落地
    await page.waitForTimeout(400)
  })

  test('5. 二段跳', async ({ page }) => {
    // 第一次跳跃
    await page.keyboard.press('Space')
    await page.waitForTimeout(100)
    // 第二次跳跃（二段跳）
    await page.keyboard.press('Space')
    // 在最高点附近截图
    await page.waitForTimeout(150)
    await page.screenshot({ path: 'test-results/05-double-jump.png' })

    // 等待落地
    await page.waitForTimeout(500)
  })

  // ===== 4. 加速跑 =====

  test('6. Shift 加速跑', async ({ page }) => {
    // Shift + 右方向键加速跑
    await holdKeys(page, ['Shift', 'ArrowRight'], 500)
    await page.screenshot({ path: 'test-results/06-run-right.png' })
  })

  // ===== 5. 走到敌人位置并踩踏 =====

  test('7. 走向敌人并踩踏', async ({ page }) => {
    // 第一个 goomba 在 x=22, playerStart 在 x=3
    // 每个 tile 16px, 需要走约 19 tiles
    // 步行速度 80px/s, 每帧约 16ms
    // 向右走约 1.5s 到达第一个敌人附近
    await holdKey(page, 'ArrowRight', 1200)

    // 跳跃踩踏
    await page.keyboard.press('Space')
    await page.waitForTimeout(300)

    await page.screenshot({ path: 'test-results/07-stomp-enemy.png' })

    // 等待落地
    await page.waitForTimeout(300)
  })

  // ===== 6. HUD 验证 =====

  test('8. HUD 显示（分数、金币、时间）', async ({ page }) => {
    // HUD 在 canvas 内渲染，无法直接读取文本
    // 但可以截图确认 HUD 区域可见
    const canvas = page.locator('#game canvas')
    await expect(canvas).toBeVisible()

    await page.screenshot({ path: 'test-results/08-hud-display.png' })

    // 进行一些操作后再截图 HUD，确认 HUD 更新
    await holdKey(page, 'ArrowRight', 800)
    await page.keyboard.press('Space')
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/08b-hud-after-play.png' })
  })

  // ===== 7. 顶砖块 =====

  test('9. 顶问号砖块', async ({ page }) => {
    // 问号砖块在列 16-23，行 9
    // 走到该位置下方然后跳跃
    await holdKey(page, 'ArrowRight', 600)

    // 跳跃顶砖
    await page.keyboard.press('Space')
    await page.waitForTimeout(200)
    await page.screenshot({ path: 'test-results/09-hit-block.png' })

    await page.waitForTimeout(400)
  })

  // ===== 8. 掉落坑洞 =====

  test('10. 掉落坑洞死亡', async ({ page }) => {
    // 第一个坑洞在列 69-70
    // 需要跑过管道等障碍到达坑洞
    // 快速跑
    await holdKeys(page, ['Shift', 'ArrowRight'], 3000)
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/10-fall-death.png' })
  })

  // ===== 9. 到达旗杆 =====

  test('11. 加速跑到旗杆', async ({ page }) => {
    // 旗杆在列 148，玩家从列 3 出发
    // 跑步速度 130px/s，约 145 tiles * 16px = 2320px
    // 时间约 2320/130 = ~18s，但实际有碰撞和跳跃
    // 使用加速跑
    await holdKeys(page, ['Shift', 'ArrowRight'], 5000)
    // 中途跳跃避开障碍
    await page.keyboard.press('Space')
    await page.waitForTimeout(300)
    await holdKeys(page, ['Shift', 'ArrowRight'], 5000)
    await page.keyboard.press('Space')
    await page.waitForTimeout(300)
    await holdKeys(page, ['Shift', 'ArrowRight'], 5000)
    await page.keyboard.press('Space')
    await page.waitForTimeout(300)
    await holdKeys(page, ['Shift', 'ArrowRight'], 5000)

    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/11-flagpole.png' })
  })

  // ===== 10. 综合交互测试 =====

  test('12. 综合操作：移动+跳跃+踩敌+顶砖', async ({ page }) => {
    // 走到第一个问号砖下方
    await holdKey(page, 'ArrowRight', 500)
    // 跳跃顶砖
    await page.keyboard.press('Space')
    await page.waitForTimeout(500)
    // 继续走
    await holdKey(page, 'ArrowRight', 500)
    // 跳过管道
    await page.keyboard.press('Space')
    await page.waitForTimeout(300)
    await page.keyboard.press('Space') // 二段跳
    await page.waitForTimeout(500)
    // 继续走
    await holdKey(page, 'ArrowRight', 800)

    await page.screenshot({ path: 'test-results/12-combo-interaction.png' })
  })
})
