export interface InputState {
  moveX: -1 | 0 | 1;
  jump: boolean;
  action: boolean;
}

export interface ButtonState {
  left: boolean;
  right: boolean;
  jump: boolean;
  action: boolean;
}

export function createInputState(): InputState {
  return {
    moveX: 0,
    jump: false,
    action: false,
  };
}

export function applyButtonState(state: InputState, buttons: ButtonState): InputState {
  const moveX = getMoveDirection(buttons.left, buttons.right);

  return {
    ...state,
    moveX,
    jump: buttons.jump,
    action: buttons.action,
  };
}

export function getOrientationHint(width: number, height: number): string | null {
  return height > width ? '请旋转设备进入横屏游玩' : null;
}

function getMoveDirection(left: boolean, right: boolean): -1 | 0 | 1 {
  if (left === right) {
    return 0;
  }

  return left ? -1 : 1;
}
