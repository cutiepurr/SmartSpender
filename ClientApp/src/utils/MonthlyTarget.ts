interface MonthlyTarget {
  id: string | undefined,
  email: string,
  year: number | undefined,
  month: number | undefined,
  amount: number,
  until: string | undefined
}

export type { MonthlyTarget };