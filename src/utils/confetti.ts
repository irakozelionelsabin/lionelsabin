import confetti from 'canvas-confetti';

export function fireConfetti(options?: confetti.Options) {
  try {
    confetti(options);
  } catch (err) {
    console.warn('Confetti effect ignored:', err);
  }
}
