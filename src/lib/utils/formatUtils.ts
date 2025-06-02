/**
 * Utility functions for formatting numbers and values
 */

/**
 * Format count numbers for display (e.g., 1200 -> "1.2K", 1000000 -> "1M")
 */
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}
