import { applyButtonState, createInputState, type ButtonState, type InputState } from './inputState';

const buttonState: ButtonState = {
  left: false,
  right: false,
  jump: false,
  action: false,
};

let inputState = createInputState();

export function setupTouchControls(documentRef: Document = document, windowRef: Window = window): void {
  const buttons = [...documentRef.querySelectorAll<HTMLButtonElement>('[data-control]')];

  resetTouchState(buttons);

  buttons.forEach((button) => {
    const control = button.dataset.control;

    if (!isControlName(control)) {
      return;
    }

    const press = (event: PointerEvent): void => {
      event.preventDefault();
      buttonState[control] = true;
      button.classList.add('is-active');
      inputState = applyButtonState(inputState, buttonState);
    };

    const release = (event: PointerEvent): void => {
      event.preventDefault();
      buttonState[control] = false;
      button.classList.remove('is-active');
      inputState = applyButtonState(inputState, buttonState);
    };

    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
  });

  const resetAllButtons = (): void => {
    resetTouchState(buttons);
  };

  windowRef.addEventListener('pointerup', resetAllButtons);
  windowRef.addEventListener('pointercancel', resetAllButtons);
  windowRef.addEventListener('blur', resetAllButtons);
}

export function getTouchInputState(): InputState {
  return inputState;
}

function resetTouchState(buttons: Iterable<Pick<HTMLButtonElement, 'classList'>>): void {
  buttonState.left = false;
  buttonState.right = false;
  buttonState.jump = false;
  buttonState.action = false;
  inputState = applyButtonState(inputState, buttonState);

  for (const button of buttons) {
    button.classList.remove('is-active');
  }
}

function isControlName(value: string | undefined): value is keyof ButtonState {
  return value === 'left' || value === 'right' || value === 'jump' || value === 'action';
}
