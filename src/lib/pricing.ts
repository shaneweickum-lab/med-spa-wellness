export const INTAKE_FEE_CENTS = Number(process.env.NEXT_PUBLIC_INTAKE_FEE_CENTS ?? 4900)
export const INTAKE_FEE_LABEL = `$${(INTAKE_FEE_CENTS / 100).toFixed(2)}`
