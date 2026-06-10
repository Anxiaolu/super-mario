export interface Vector2 {
  x: number;
  y: number;
}

export interface Rect extends Vector2 {
  width: number;
  height: number;
}

export interface PlatformData extends Rect {
  id: string;
  kind?: 'static' | 'moving' | 'spring';
  moveAxis?: 'x' | 'y';
  moveMin?: number;
  moveMax?: number;
  moveSpeed?: number;
  bounceVelocity?: number;
}

export interface CoinData extends Vector2 {
  id: string;
  value: number;
}

export interface EnemyData extends Rect {
  id: string;
  patrolMinX: number;
  patrolMaxX: number;
  speed: number;
}

export interface LevelData {
  id: string;
  name: string;
  width: number;
  height: number;
  playerSpawn: Vector2;
  goal?: Rect;
  platforms: PlatformData[];
  coins: CoinData[];
  enemies: EnemyData[];
}

export interface ParsedLevel extends Omit<LevelData, 'goal' | 'platforms'> {
  goal: Rect;
  platforms: RuntimePlatform[];
}

export interface RuntimePlatform extends PlatformData {
  kind: 'static' | 'moving' | 'spring';
  direction?: -1 | 1;
}

export type GameStatus = 'playing' | 'game-over' | 'completed';

export interface GameState {
  currentLevel: number;
  score: number;
  lives: number;
  status: GameStatus;
  collectedCoinIds: string[];
}

export interface RuntimeEnemy extends EnemyData {
  direction: -1 | 1;
  defeated: boolean;
}

export interface PlayerEnemyContact {
  velocityY: number;
  bottom: number;
}

export type PlayerEnemyCollisionResult =
  | { type: 'stomp'; enemy: RuntimeEnemy }
  | { type: 'hurt'; enemy: RuntimeEnemy };
