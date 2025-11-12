export function formatCLP(value) {
  const num = Number(value) || 0
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(num)
}