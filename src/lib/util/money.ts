import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number | any // Allow BigNumber objects
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

/**
 * Extract numeric value from Medusa v2 BigNumber objects
 */
const getNumericValue = (value: any): number => {
  if (value === null || value === undefined) return 0
  // Check for BigNumber object with numeric_ property
  if (typeof value === "object" && "numeric_" in value) {
    return Number(value.numeric_)
  }
  // Check for raw_ property (alternative BigNumber format)
  if (typeof value === "object" && "raw_" in value && value.raw_?.value) {
    return Number(value.raw_.value)
  }
  // Plain number
  if (typeof value === "number") return value
  // String number
  if (typeof value === "string") {
    const parsed = Number(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  const numericAmount = getNumericValue(amount)

  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(numericAmount)
    : numericAmount.toString()
}
