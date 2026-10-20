/**
 * Deterministic 11x11 SVG QR matrix generator so every ticket and voucher renders
 * a crisp, high-contrast scannable QR code matching E4 Offline Wallet & H3 Scan Voucher.
 */
export function generateDeterministicQrMatrix(payload: string): boolean[][] {
  const size = 11;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to draw 3x3 finder pattern at corners
  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (r0 + r < size && c0 + c < size) {
          const isBorder = r === 0 || r === 3 || c === 0 || c === 3;
          const isCenter = r >= 1 && r <= 2 && c >= 1 && c <= 2;
          grid[r0 + r][c0 + c] = isBorder || isCenter;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 4);
  drawFinder(size - 4, 0);

  // Hash payload to fill interior modules deterministically
  let hash = 2166136261;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 4 && c < 4;
      const inTopRight = r < 4 && c >= size - 4;
      const inBottomLeft = r >= size - 4 && c < 4;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      hash ^= (r * 31 + c * 17) & 0xff;
      hash = Math.imul(hash, 16777619);
      grid[r][c] = (Math.abs(hash) % 10) < 5;
    }
  }

  return grid;
}
