// 共享 AudioContext 单例，确保所有音效和音乐共用同一上下文

let ctx: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
  }
  return ctx
}

export function resumeAudioContext(): void {
  if (ctx && ctx.state === 'suspended') {
    ctx.resume()
  }
}