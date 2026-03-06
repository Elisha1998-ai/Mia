/**
 * Utility functions for color manipulation
 */

/**
 * Converts a hex color to RGB
 */
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Converts RGB to Hex
 */
function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Adjusts the brightness of a hex color
 * @param hex The hex color
 * @param percent Positive for lighter, negative for darker
 */
export function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  
  const adjust = (val: number) => {
    const amount = Math.round(2.55 * percent);
    return Math.max(0, Math.min(255, val + amount));
  };

  return rgbToHex(adjust(r), adjust(g), adjust(b));
}

/**
 * Generates an RGBA string from a hex color
 */
export function hexToRgba(hex: string, opacity: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
