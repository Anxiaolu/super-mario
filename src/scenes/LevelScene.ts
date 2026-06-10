import Phaser from 'phaser';
import { collectCoin, completeLevel, createGameState, damagePlayer } from '../game/gameState';
import { getTouchInputState } from '../game/touchControls';
import { parseLevel } from '../game/levelLoader';
import { applyKnockback, createPlayerMotionState, stepPlayerMotion, type PlayerMotionState } from '../game/playerController';
import { resolvePlayerEnemyCollision, stepEnemyPatrol } from '../game/enemies';
import { getLandingVelocityY, stepDynamicPlatform } from '../game/platforms';
import type {
  CoinData,
  GameState,
  LevelData,
  ParsedLevel,
  RuntimePlatform,
  RuntimeEnemy,
} from '../game/types';
import { gameHeight, gameWidth } from '../gameConfig';
import levelOneData from '../levels/level1.json';
import levelTwoData from '../levels/level2.json';

interface LevelSceneData {
  levelNumber?: number;
  score?: number;
  lives?: number;
}

interface PlayerRuntime {
  shape: Phaser.GameObjects.Rectangle;
  x: number;
  y: number;
  width: number;
  height: number;
  motion: PlayerMotionState;
  landingTween?: Phaser.Tweens.Tween;
}

interface PlatformRuntime {
  data: RuntimePlatform;
  shape: Phaser.GameObjects.Rectangle;
  previousX: number;
  previousY: number;
}

interface CoinRuntime {
  data: CoinData;
  shape: Phaser.GameObjects.Ellipse;
  collected: boolean;
}

interface EnemyRuntime {
  data: RuntimeEnemy;
  shape: Phaser.GameObjects.Ellipse;
}

interface KeyboardKeys {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keyA: Phaser.Input.Keyboard.Key;
  keyD: Phaser.Input.Keyboard.Key;
  keyW: Phaser.Input.Keyboard.Key;
}

const levels: Record<number, LevelData> = {
  1: levelOneData as LevelData,
  2: levelTwoData as LevelData,
};

const playerMotionConfig = {
  walkSpeed: 245,
  runSpeed: 310,
  groundAcceleration: 1600,
  airAcceleration: 900,
  groundDeceleration: 1900,
  airDeceleration: 480,
  gravity: 1650,
  jumpVelocity: -620,
  jumpCutoffVelocity: -260,
  coyoteTimeSeconds: 0.1,
  jumpBufferSeconds: 0.12,
  hardLandingVelocityY: 460,
  landingSlowSeconds: 0.08,
  knockbackVelocityX: 240,
  knockbackVelocityY: -320,
  knockbackControlLockSeconds: 0.18,
  invulnerabilitySeconds: 1.4,
};

export class LevelScene extends Phaser.Scene {
  private levelNumber = 1;
  private level!: ParsedLevel;
  private gameState!: GameState;
  private player!: PlayerRuntime;
  private platforms: PlatformRuntime[] = [];
  private coins: CoinRuntime[] = [];
  private enemies: EnemyRuntime[] = [];
  private keyboardKeys?: KeyboardKeys;
  private hudText?: Phaser.GameObjects.Text;
  private wasJumpDown = false;
  private isChangingScene = false;

  constructor() {
    super('LevelScene');
  }

  init(data: LevelSceneData): void {
    this.levelNumber = data.levelNumber ?? 1;
    this.gameState = {
      ...createGameState(this.levelNumber),
      score: data.score ?? 0,
      lives: data.lives ?? 3,
    };
    this.platforms = [];
    this.coins = [];
    this.enemies = [];
    this.wasJumpDown = false;
    this.isChangingScene = false;
  }

  create(): void {
    this.level = parseLevel(levels[this.levelNumber]);
    this.cameras.main.setBounds(0, 0, this.level.width, this.level.height);
    this.drawBackground();
    this.createPlatforms();
    this.createCoins();
    this.createEnemies();
    this.createGoal();
    this.createPlayer();
    this.createHud();
    this.createKeyboard();
  }

  update(_time: number, delta: number): void {
    if (this.isChangingScene) {
      return;
    }

    const deltaSeconds = Math.min(delta / 1000, 0.05);
    this.updatePlatforms(deltaSeconds);
    this.updatePlayer(deltaSeconds);
    this.updateEnemies(deltaSeconds);
    this.updateCoins();
    this.updateGoal();
    this.updateCamera();
    this.updateHud();
  }

  private drawBackground(): void {
    this.add.rectangle(this.level.width / 2, this.level.height / 2, this.level.width, this.level.height, 0x9bdcff);
    this.add.circle(160, 96, 42, 0xffe6a7, 0.95);

    for (let x = 180; x < this.level.width; x += 620) {
      this.add.ellipse(x, this.level.height - 76, 520, 170, 0x8bcf78);
      this.add.ellipse(x + 230, this.level.height - 44, 460, 130, 0x6fbf6a);
    }
  }

  private createPlatforms(): void {
    this.platforms = this.level.platforms.map((platform) => {
      const shape = this.add
        .rectangle(
          platform.x + platform.width / 2,
          platform.y + platform.height / 2,
          platform.width,
          platform.height,
          platform.kind === 'spring' ? 0xe9c46a : 0x7a9352,
        )
        .setStrokeStyle(4, platform.kind === 'spring' ? 0xa86f1f : 0x4b6835);

      return {
        data: platform,
        shape,
        previousX: platform.x,
        previousY: platform.y,
      };
    });
  }

  private createCoins(): void {
    this.coins = this.level.coins.map((coin) => {
      const shape = this.add.ellipse(coin.x, coin.y, 28, 28, 0xf6c85f).setStrokeStyle(4, 0xc28c37);
      return {
        data: coin,
        shape,
        collected: false,
      };
    });
  }

  private createEnemies(): void {
    this.enemies = this.level.enemies.map((enemy) => {
      const runtimeEnemy: RuntimeEnemy = {
        ...enemy,
        kind: enemy.kind ?? 'walker',
        direction: -1,
        defeated: false,
        hoverDirection: enemy.hoverDirection,
      };

      const fillColor =
        runtimeEnemy.kind === 'hopper' ? 0xa95f4b : runtimeEnemy.kind === 'flyer' ? 0x7b68ee : 0x5d6f3d;
      const strokeColor =
        runtimeEnemy.kind === 'hopper' ? 0x6d3728 : runtimeEnemy.kind === 'flyer' ? 0x4937a8 : 0x334225;
      const shape = this.add
        .ellipse(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width, enemy.height, fillColor)
        .setStrokeStyle(4, strokeColor);

      return {
        data: runtimeEnemy,
        shape,
      };
    });
  }

  private createGoal(): void {
    const { goal } = this.level;
    this.add.rectangle(goal.x + goal.width / 2, goal.y + goal.height / 2, goal.width, goal.height, 0xe9c46a);
    this.add.rectangle(goal.x + goal.width / 2, goal.y + 10, goal.width + 30, 20, 0xe76f51);
  }

  private createPlayer(): void {
    const spawn = this.level.playerSpawn;
    const width = 34;
    const height = 52;
    const shape = this.add
      .rectangle(spawn.x, spawn.y, width, height, 0xf36f45)
      .setStrokeStyle(4, 0x9f432f);

    this.player = {
      shape,
      x: spawn.x,
      y: spawn.y,
      width,
      height,
      motion: createPlayerMotionState(),
    };
  }

  private createHud(): void {
    this.hudText = this.add
      .text(18, 16, '', {
        fontFamily: 'Trebuchet MS, Noto Sans SC, sans-serif',
        fontSize: '24px',
        color: '#263238',
        backgroundColor: 'rgba(255, 248, 223, 0.78)',
        padding: { x: 12, y: 8 },
      })
      .setScrollFactor(0);
    this.updateHud();
  }

  private createKeyboard(): void {
    const keyboard = this.input.keyboard;

    if (!keyboard) {
      return;
    }

    this.keyboardKeys = {
      cursors: keyboard.createCursorKeys(),
      keyA: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      keyD: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      keyW: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    };
  }

  private updatePlayer(deltaSeconds: number): void {
    const input = this.readInput();
    const jumpPressed = input.jump && !this.wasJumpDown;
    const previousY = this.player.y;
    const wasGrounded = this.player.motion.onGround;

    this.wasJumpDown = input.jump;
    this.player.motion = stepPlayerMotion(
      this.player.motion,
      {
        moveX: input.moveX,
        jumpPressed,
        jumpHeld: input.jump,
        actionHeld: input.action,
      },
      {
        deltaSeconds,
        nowSeconds: this.time.now / 1000,
        isGrounded: wasGrounded,
      },
      playerMotionConfig,
    );

    this.player.x += this.player.motion.velocityX * deltaSeconds;
    this.player.x = clamp(this.player.x, this.player.width / 2, this.level.width - this.player.width / 2);
    this.player.y += this.player.motion.velocityY * deltaSeconds;
    this.player.motion.onGround = false;
    this.resolvePlatformLanding(previousY);
    this.updateLandingFeedback();

    if (this.player.y > this.level.height + 140) {
      this.hurtPlayer();
    }

    this.player.shape.setPosition(this.player.x, this.player.y);
    this.player.shape.setAlpha(this.getPlayerAlpha());
  }

  private readInput(): { moveX: -1 | 0 | 1; jump: boolean; action: boolean } {
    const touchInput = getTouchInputState();
    const keyboard = this.keyboardKeys;

    if (!keyboard) {
      return touchInput;
    }

    const left = touchInput.moveX < 0 || keyboard.cursors.left.isDown || keyboard.keyA.isDown;
    const right = touchInput.moveX > 0 || keyboard.cursors.right.isDown || keyboard.keyD.isDown;
    const jump = touchInput.jump || keyboard.cursors.space.isDown || keyboard.cursors.up.isDown || keyboard.keyW.isDown;
    const action = touchInput.action || keyboard.cursors.shift.isDown;

    return {
      moveX: left === right ? 0 : left ? -1 : 1,
      jump,
      action,
    };
  }

  private resolvePlatformLanding(previousY: number): void {
    const previousBottom = previousY + this.player.height / 2;
    const nextBottom = this.player.y + this.player.height / 2;

    for (const platform of this.platforms) {
      const data = platform.data;
      const overlapsX =
        this.player.x + this.player.width / 2 > data.x &&
        this.player.x - this.player.width / 2 < data.x + data.width;
      const crossesTop = previousBottom <= data.y && nextBottom >= data.y;

      if (this.player.motion.velocityY >= 0 && overlapsX && crossesTop) {
        if (this.player.motion.velocityY < 0) {
          continue;
        }

        this.player.y = data.y - this.player.height / 2;
        this.player.x += data.x - platform.previousX;
        this.player.motion.velocityY = data.kind === 'spring'
          ? getLandingVelocityY(data, playerMotionConfig.jumpVelocity)
          : 0;
        this.player.motion.onGround = true;
        return;
      }
    }
  }

  private updatePlatforms(deltaSeconds: number): void {
    for (const platform of this.platforms) {
      platform.previousX = platform.data.x;
      platform.previousY = platform.data.y;
      platform.data = stepDynamicPlatform(platform.data, deltaSeconds);
      platform.shape.setPosition(
        platform.data.x + platform.data.width / 2,
        platform.data.y + platform.data.height / 2,
      );
    }
  }

  private updateEnemies(deltaSeconds: number): void {
    for (const enemy of this.enemies) {
      if (enemy.data.defeated) {
        continue;
      }

      enemy.data = stepEnemyPatrol(enemy.data, deltaSeconds, this.time.now / 1000);
      enemy.shape.setPosition(enemy.data.x + enemy.data.width / 2, enemy.data.y + enemy.data.height / 2);

      if (rectsOverlap(this.getPlayerRect(), enemy.data)) {
        const result = resolvePlayerEnemyCollision(
          {
            velocityY: this.player.motion.velocityY,
            bottom: this.player.y + this.player.height / 2,
          },
          enemy.data,
        );

        if (result.type === 'stomp') {
          enemy.data = result.enemy;
          enemy.shape.destroy();
          this.player.motion.velocityY = -430;
          this.gameState = {
            ...this.gameState,
            score: this.gameState.score + 50,
          };
        } else {
          this.hurtPlayer();
        }
      }
    }
  }

  private updateCoins(): void {
    for (const coin of this.coins) {
      if (coin.collected) {
        continue;
      }

      const coinRect = {
        x: coin.data.x - 14,
        y: coin.data.y - 14,
        width: 28,
        height: 28,
      };

      if (rectsOverlap(this.getPlayerRect(), coinRect)) {
        coin.collected = true;
        coin.shape.destroy();
        this.gameState = collectCoin(this.gameState, coin.data);
      }
    }
  }

  private updateGoal(): void {
    if (rectsOverlap(this.getPlayerRect(), this.level.goal)) {
      this.isChangingScene = true;
      this.gameState = completeLevel(this.gameState);

      if (this.gameState.status === 'completed') {
        this.scene.start('CompleteScene', {
          score: this.gameState.score,
          title: '两关通关',
          message: '点击重新开始',
        });
        return;
      }

      this.scene.start('LevelScene', {
        levelNumber: this.gameState.currentLevel,
        score: this.gameState.score,
        lives: this.gameState.lives,
      });
    }
  }

  private updateCamera(): void {
    const maxScrollX = Math.max(0, this.level.width - gameWidth);
    this.cameras.main.scrollX = clamp(this.player.x - gameWidth * 0.36, 0, maxScrollX);
    this.cameras.main.scrollY = Math.max(0, this.level.height - gameHeight);
  }

  private updateHud(): void {
    this.hudText?.setText(
      `金币 ${this.gameState.score}  生命 ${this.gameState.lives}  第 ${this.gameState.currentLevel} 关`,
    );
  }

  private hurtPlayer(): void {
    if (this.player.motion.invulnerableUntilSeconds > this.time.now / 1000 || this.isChangingScene) {
      return;
    }

    const nearestEnemy = this.findNearestEnemyX();
    this.gameState = damagePlayer(this.gameState);

    if (this.gameState.status === 'game-over') {
      this.isChangingScene = true;
      this.scene.start('CompleteScene', {
        score: this.gameState.score,
        title: '旅程结束',
        message: '点击重新挑战',
      });
      return;
    }

    this.player.motion = applyKnockback(
      this.player.motion,
      {
        sourceX: nearestEnemy,
        playerX: this.player.x,
        nowSeconds: this.time.now / 1000,
      },
      playerMotionConfig,
    );
  }

  private getPlayerRect(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.player.x - this.player.width / 2,
      y: this.player.y - this.player.height / 2,
      width: this.player.width,
      height: this.player.height,
    };
  }

  private getPlayerAlpha(): number {
    const nowSeconds = this.time.now / 1000;

    if (this.player.motion.invulnerableUntilSeconds <= nowSeconds) {
      return 1;
    }

    const blinkOn = Math.floor(nowSeconds * 18) % 2 === 0;
    return blinkOn ? 0.35 : 0.95;
  }

  private updateLandingFeedback(): void {
    if (!this.player.motion.hardLanding) {
      return;
    }

    this.player.motion.hardLanding = false;
    this.player.landingTween?.stop();
    this.player.shape.setScale(1.1, 0.84);
    this.player.landingTween = this.tweens.add({
      targets: this.player.shape,
      scaleX: 1,
      scaleY: 1,
      duration: 120,
      ease: 'Quad.Out',
    });
  }

  private findNearestEnemyX(): number {
    const activeEnemies = this.enemies.filter((enemy) => !enemy.data.defeated);

    if (activeEnemies.length === 0) {
      return this.player.x < this.level.width / 2 ? this.player.x + 1 : this.player.x - 1;
    }

    return activeEnemies.reduce((nearest, enemy) => {
      const nearestDistance = Math.abs(nearest - this.player.x);
      const currentDistance = Math.abs(enemy.data.x - this.player.x);

      return currentDistance < nearestDistance ? enemy.data.x : nearest;
    }, activeEnemies[0].data.x);
  }
}

function rectsOverlap(
  first: { x: number; y: number; width: number; height: number },
  second: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    first.x < second.x + second.width &&
    first.x + first.width > second.x &&
    first.y < second.y + second.height &&
    first.y + first.height > second.y
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
