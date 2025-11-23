export const toFiveStarScale = (value?: number | null): number => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return 0;
  }

  const safeValue = Math.max(0, value);
  const normalized = safeValue > 5 ? safeValue / 2 : safeValue;

  return Number(normalized.toFixed(1));
};
