export const COINS_PER_USD = 100;
export const IQD_PER_USD = 1320;

export function usdToIQD(usd: number): number {
  return Math.round(usd * IQD_PER_USD);
}

export function coinsToIQD(coins: number): number {
  return Math.round((coins / COINS_PER_USD) * IQD_PER_USD);
}

export function formatIQD(amount: number): string {
  return `${Math.round(amount).toLocaleString('en-US')} د.ع`;
}
