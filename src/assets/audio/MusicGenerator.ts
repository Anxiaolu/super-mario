// Web Audio API 背景音乐生成器（单例模式，复用共享 AudioContext）

import { getAudioContext } from './AudioContextSingleton'

type Note = [freq: number, dur: number] // freq=0 表示休止符

const SQUARE = 'square' as const
const BPM = 180
const BEAT = 60 / BPM
const HALF = BEAT / 2
const QUARTER = BEAT / 4

// 音符频率
const C4 = 262; const E4 = 330; const G4 = 392
const A4 = 440; const B4 = 494
const C5 = 523; const D5 = 587; const E5 = 659; const F5 = 698; const G5 = 784
const A5 = 880
const Bb4 = 466; const Eb5 = 622
const R = 0

/** 地上关卡主题曲 */
const OVERWORLD_MELODY: Note[] = [
  [E5, HALF], [E5, HALF], [R, HALF], [E5, HALF],
  [R, HALF], [C5, HALF], [E5, HALF], [G5, BEAT],
  [R, BEAT], [G4, BEAT], [R, BEAT],
  [C5, BEAT * 1.5], [R, HALF], [G4, BEAT * 1.5], [R, HALF],
  [E4, BEAT * 1.5], [R, HALF], [A4, HALF], [B4, HALF],
  [Bb4, HALF], [A4, BEAT],
  [G4, QUARTER], [E5, QUARTER], [G5, QUARTER],
  [A5, HALF], [F5, HALF], [G5, HALF],
  [R, HALF], [E5, HALF], [C5, HALF], [D5, HALF], [B4, BEAT],
  [R, BEAT],
  [C5, BEAT * 1.5], [R, HALF], [G4, BEAT * 1.5], [R, HALF],
  [E4, BEAT * 1.5], [R, HALF], [A4, HALF], [B4, HALF],
  [Bb4, HALF], [A4, BEAT],
  [G4, QUARTER], [E5, QUARTER], [G5, QUARTER],
  [A5, HALF], [F5, HALF], [G5, HALF],
  [R, HALF], [E5, HALF], [C5, HALF], [D5, HALF], [B4, BEAT],
  [R, BEAT],
]

/** 城堡关卡主题曲（紧张的重复低音） */
const CASTLE_MELODY: Note[] = [
  [C4, QUARTER], [C5, QUARTER], [R, QUARTER], [C4, QUARTER],
  [Bb4, QUARTER], [C4, QUARTER], [R, QUARTER], [C5, QUARTER],
  [C4, QUARTER], [D5, QUARTER], [C4, QUARTER], [Eb5, QUARTER],
  [C4, QUARTER], [C5, QUARTER], [Bb4, QUARTER], [C4, QUARTER],
  [C4, QUARTER], [R, QUARTER], [R, QUARTER], [C4, QUARTER],
  [C4, QUARTER], [R, QUARTER], [R, QUARTER], [C4, QUARTER],
]

/** 地下关卡主题曲 */
const UNDERGROUND_MELODY: Note[] = [
  [C5, QUARTER], [D5, QUARTER], [Eb5, QUARTER], [C5, QUARTER],
  [C5, QUARTER], [D5, QUARTER], [Eb5, QUARTER], [C5, QUARTER],
  [D5, QUARTER], [Eb5, QUARTER], [F5, HALF],
  [D5, QUARTER], [Eb5, QUARTER], [F5, HALF],
  [R, QUARTER],
  [F5, QUARTER], [G5, QUARTER], [F5, QUARTER], [Eb5, QUARTER],
  [C5, QUARTER], [D5, QUARTER], [Eb5, HALF],
  [R, QUARTER],
]

export type MusicTheme = 'overworld' | 'underground' | 'castle'

export class MusicGenerator {
  private static instance: MusicGenerator | null = null
    private currentTheme: MusicTheme | null = null
  private isPlaying = false
  private loopTimer: ReturnType<typeof setTimeout> | null = null
  private readonly VOLUME = 0.06

  private constructor() {}

  static getInstance(): MusicGenerator {
    if (!MusicGenerator.instance) {
      MusicGenerator.instance = new MusicGenerator()
    }
    return MusicGenerator.instance
  }

  
  /** 开始播放指定主题的 BGM */
  play(theme: MusicTheme): void {
    if (this.isPlaying && this.currentTheme === theme) return

    this.stop()
    this.currentTheme = theme
    this.isPlaying = true
    this.scheduleLoop()
  }

  /** 停止播放 */
  stop(): void {
    this.isPlaying = false
    this.currentTheme = null
    if (this.loopTimer !== null) {
      clearTimeout(this.loopTimer)
      this.loopTimer = null
    }
  }

  /** 调度一整轮旋律 */
  private scheduleLoop(): void {
    if (!this.isPlaying || !this.currentTheme) return

    const melody = this.currentTheme === 'underground' ? UNDERGROUND_MELODY
      : this.currentTheme === 'castle' ? CASTLE_MELODY
      : OVERWORLD_MELODY
    const ctx = getAudioContext()
    const now = ctx.currentTime
    let timeOffset = 0

    for (const [freq, dur] of melody) {
      if (freq > 0) {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        osc.type = SQUARE
        osc.frequency.setValueAtTime(freq, now + timeOffset)
        gainNode.gain.setValueAtTime(this.VOLUME, now + timeOffset)
        gainNode.gain.linearRampToValueAtTime(0, now + timeOffset + dur - 0.01)
        osc.connect(gainNode).connect(ctx.destination)
        osc.start(now + timeOffset)
        osc.stop(now + timeOffset + dur)
      }
      timeOffset += dur
    }

    // 计算一整轮的总时长并调度下一轮
    const loopDuration = timeOffset * 1000
    this.loopTimer = setTimeout(() => this.scheduleLoop(), loopDuration)
  }
}
