export const useThreshold = (_tolerance: number) => {
  const tolerance = ref(_tolerance);
  const accumulated = ref(0);

  const threshold = (delta: number) => {
    accumulated.value += delta;
    if (Math.abs(accumulated.value) < tolerance.value) {
      return 0;
    }

    return delta;
  };

  const resetThreshold = () => {
    accumulated.value = 0;
  };

  return {
    threshold,
    resetThreshold,
  };
};
