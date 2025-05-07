export class ColorUtils {
  static interpolateColor = (percentage: number) => {
    // Ensure percentage is between 0 and 1
    percentage = Math.max(0, Math.min(1, percentage));

    const colors = [
      { pct: 0.0, color: { r: 255, g: 107, b: 107 } }, // Red
      { pct: 0.5, color: { r: 255, g: 179, b: 71 } }, // Amber
      { pct: 1.0, color: { r: 107, g: 203, b: 119 } }, // Green
    ];

    let lower = colors[0];
    let upper = colors[colors.length - 1];

    for (let i = 1; i < colors.length; i++) {
      if (percentage < colors[i].pct) {
        upper = colors[i];
        lower = colors[i - 1];
        break;
      }
    }

    const range = upper.pct - lower.pct;
    const rangePct = range === 0 ? 0 : (percentage - lower.pct) / range;

    const r = Math.round(
      lower.color.r + (upper.color.r - lower.color.r) * rangePct
    );
    const g = Math.round(
      lower.color.g + (upper.color.g - lower.color.g) * rangePct
    );
    const b = Math.round(
      lower.color.b + (upper.color.b - lower.color.b) * rangePct
    );

    return `rgb(${r},${g},${b})`;
  };
}
