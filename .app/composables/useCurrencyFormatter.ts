export function useCurrencyFormatter(locale = 'pt-BR', currency = 'BRL') {
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value)
  }

  return { formatCurrency, currency }
}
