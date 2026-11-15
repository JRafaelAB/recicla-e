const MG: Record<'mg' | 'g' | 'kg', number> = { mg: 1, g: 1000, kg: 1_000_000 }

/** "0,8 km" */
export function km(n: number): string {
  return `${n.toFixed(1).replace('.', ',')} km`
}

/** Amount in the most readable mass unit, pt-BR decimal comma: quantity(1200, 'mg') -> "1,2 g". */
export function quantity(value: number, unit: 'mg' | 'g' | 'kg'): string {
  const mg = Math.round(value * MG[unit])
  const [v, u] = mg >= MG.kg ? [mg / MG.kg, 'kg'] : mg >= MG.g ? [mg / MG.g, 'g'] : [mg, 'mg']
  return `${String(Math.round(v * 10) / 10).replace('.', ',')} ${u}`
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const pad = (n: number) => String(n).padStart(2, '0')

/** "Seg, 16/11" */
export function dayLabel(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${pad(date.getDate())}/${pad(date.getMonth() + 1)}`
}
