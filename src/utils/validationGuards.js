export function isNumeric(val) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}

export function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}