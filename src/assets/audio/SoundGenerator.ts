// Web Audio API 8-bit 音效生成器（单例模式，复用共享 AudioContext）

import { getAudioContext } from './AudioContextSingleton'

export class SoundGenerator {
  private static instance: SoundGenerator | null = null

  private constructor() {}

  static getInstance(): SoundGenerator {
    if (!SoundGenerator.instance) {
      SoundGenerator.instance = new SoundGenerator()
    }
    return SoundGenerator.instance
  }

  // 单音辅助方法
  private playTone(type: OscillatorType, startFreq: number, endFreq: number, duration: number, volume = 0.15): void {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + duration)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration + 0.02)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration + 0.02)
  }

  // 多音符辅助方法
  private playNotes(notes: number[], noteDuration: number, type: OscillatorType = 'square', volume = 0.12): void {
    const ctx = getAudioContext()
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * noteDuration)
      gain.gain.setValueAtTime(volume, ctx.currentTime + i * noteDuration)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * noteDuration + noteDuration)
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + i * noteDuration)
      osc.stop(ctx.currentTime + i * noteDuration + noteDuration)
    })
  }

  // 跳跃音效：快速上升频率扫描
  playJump(): void {
    this.playTone('square', 300, 600, 0.08, 0.15)
  }

  // 金币音效：988Hz -> 1319Hz
  playCoin(): void {
    this.playTone('square', 988, 1319, 0.1, 0.15)
  }

  // 踩敌音效：短促低频
  playStomp(): void {
    this.playTone('square', 400, 100, 0.06, 0.15)
  }

  // 变大音效：上升音阶
  playPowerup(): void {
    this.playNotes([523, 659, 784, 1047], 0.08)
  }

  // 死亡音效：下降音调
  playDie(): void {
    this.playTone('square', 600, 100, 0.5, 0.15)
  }

  // 碰头音效：短促低音
  playBump(): void {
    this.playTone('square', 200, 100, 0.05, 0.15)
  }

  // 砖块破碎音效
  playBreak(): void {
    this.playTone('sawtooth', 300, 50, 0.1, 0.12)
  }

  // 1UP 音效：快速上升音阶
  play1Up(): void {
    this.playNotes([262, 330, 392, 523, 659, 784], 0.06)
  }

  // 通关旗杆音效
  playFlagpole(): void {
    this.playNotes([523, 659, 784, 1047, 784, 1047, 1319], 0.1)
  }

  // 火球发射音效
  playFireball(): void {
    this.playTone('square', 800, 200, 0.08, 0.1)
  }
}
