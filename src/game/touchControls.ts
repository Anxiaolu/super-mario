import { applyButtonState, createInputState, type ButtonState, type InputState } from './inputState';

const buttonState: ButtonState = {
  left: false,
  right: false,
  jump: false,
  action: false,
};

let inputState = createInputState();

export function setupTouchControls(documentRef: Document = document): void {
  const buttons = documentRef.querySelectorAll<HTMLButtonElement>('[data-control]');

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
}

export function getTouchInputState(): InputState {
  return inputState;
}

function isControlName(value: string | undefined): value is keyof ButtonState {
  return value === 'left' || value === 'right' || value === 'jump' || value === 'action';
}
