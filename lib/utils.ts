export function formatCurrency(value: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // Fallback to manual formatting if Intl.NumberFormat fails
    const formattedValue = value.toFixed(2);
    return `$${formattedValue}`;
  }
}