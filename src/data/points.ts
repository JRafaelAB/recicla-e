/** Opening hours: days 0=Dom..6=Sáb; open/close are whole hours. */
export interface Hours {
  days: number[]
  open: number
  close: number
}

export interface Point {
  id: number
  name: string
  neighborhood: string
  address: string
  phone: string
  distanceKm: number
  /** Accepted sub-type ids. */
  accepts: string[]
  hours: Hours[]
  /** Position on the illustrated map, normalized 0–100 (x: west→east, y: north→south). */
  map: { x: number; y: number }
}

const MON_FRI = [1, 2, 3, 4, 5]
const MON_SAT = [1, 2, 3, 4, 5, 6]
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]

/** Fixed user location (Funcionários) for the illustrated map. */
export const USER_LOCATION = { neighborhood: 'Funcionários', map: { x: 52, y: 60 } }

// Fictional points in real Belo Horizonte neighborhoods (spec Mock Data).
// Addresses and phones are fictional; the UI labels them "Ponto fictício (demonstração)".
export const POINTS: Point[] = [
  {
    id: 1, name: 'Coleta Verde Savassi', neighborhood: 'Savassi',
    address: 'Rua das Acácias, 120 – Savassi', phone: '(31) 3000-0001', distanceKm: 0.8,
    accepts: ['pilha', 'bateria-litio', 'celular', 'cabos', 'lampada-fluorescente', 'lampada-led'],
    hours: [{ days: MON_FRI, open: 8, close: 18 }, { days: [6], open: 8, close: 12 }],
    map: { x: 55, y: 63 },
  },
  {
    id: 2, name: 'Recicla Centro', neighborhood: 'Centro',
    address: 'Rua do Ipê-Amarelo, 45 – Centro', phone: '(31) 3000-0002', distanceKm: 1.6,
    accepts: ['pilha', 'celular', 'notebook', 'desktop', 'tv-lcd', 'tv-led', 'cabos'],
    hours: [{ days: MON_FRI, open: 9, close: 17 }],
    map: { x: 49, y: 51 },
  },
  {
    id: 3, name: 'Coleta Lourdes', neighborhood: 'Lourdes',
    address: 'Rua dos Jacarandás, 310 – Lourdes', phone: '(31) 3000-0003', distanceKm: 1.9,
    accepts: ['pilha', 'lampada-fluorescente', 'lampada-led'],
    hours: [{ days: MON_SAT, open: 8, close: 14 }],
    map: { x: 43, y: 57 },
  },
  {
    id: 4, name: 'Santa Efigênia Eletro', neighborhood: 'Santa Efigênia',
    address: 'Rua das Quaresmeiras, 88 – Santa Efigênia', phone: '(31) 3000-0004', distanceKm: 2.4,
    accepts: ['bateria-litio', 'celular', 'notebook', 'desktop', 'tv-tubo', 'tv-lcd', 'tv-led', 'cabos'],
    hours: [{ days: MON_FRI, open: 8, close: 18 }],
    map: { x: 62, y: 54 },
  },
  {
    id: 5, name: 'Ponto Verde Cidade Nova', neighborhood: 'Cidade Nova',
    address: 'Rua dos Girassóis, 700 – Cidade Nova', phone: '(31) 3000-0005', distanceKm: 5.2,
    accepts: ['geladeira', 'linhabranca-outros', 'notebook', 'desktop', 'tv-tubo', 'tv-lcd', 'tv-led'],
    hours: [{ days: MON_FRI, open: 8, close: 16 }],
    map: { x: 68, y: 36 },
  },
  {
    id: 6, name: 'Buritis Recicla', neighborhood: 'Buritis',
    address: 'Rua das Paineiras, 515 – Buritis', phone: '(31) 3000-0006', distanceKm: 6.1,
    accepts: ['pilha', 'bateria-litio', 'celular', 'cabos'],
    hours: [{ days: MON_SAT, open: 9, close: 17 }],
    map: { x: 30, y: 70 },
  },
  {
    id: 7, name: 'Central de Coleta Pampulha', neighborhood: 'Pampulha',
    address: 'Rua das Garças, 1000 – Pampulha', phone: '(31) 3000-0007', distanceKm: 9.4,
    accepts: [
      'pilha', 'bateria-litio', 'bateria-automotiva', 'celular', 'notebook', 'desktop', 'geladeira',
      'linhabranca-outros', 'tv-tubo', 'tv-lcd', 'tv-led', 'lampada-fluorescente', 'lampada-led', 'cabos',
    ],
    hours: [{ days: ALL_DAYS, open: 8, close: 17 }],
    map: { x: 38, y: 22 },
  },
  {
    id: 8, name: 'Pampulha Lâmpadas & Pilhas', neighborhood: 'Pampulha',
    address: 'Rua dos Bem-te-vis, 230 – Pampulha', phone: '(31) 3000-0008', distanceKm: 9.8,
    accepts: ['pilha', 'bateria-litio', 'lampada-fluorescente', 'lampada-led'],
    hours: [{ days: MON_FRI, open: 9, close: 15 }],
    map: { x: 46, y: 18 },
  },
  {
    id: 9, name: 'Barreiro Coleta', neighborhood: 'Barreiro',
    address: 'Rua das Mangueiras, 64 – Barreiro', phone: '(31) 3000-0009', distanceKm: 12.3,
    accepts: ['celular', 'notebook', 'desktop', 'geladeira', 'linhabranca-outros', 'tv-tubo', 'tv-lcd', 'tv-led'],
    hours: [{ days: MON_FRI, open: 8, close: 17 }],
    map: { x: 16, y: 86 },
  },
  {
    id: 10, name: 'Venda Nova Eletro', neighborhood: 'Venda Nova',
    address: 'Rua dos Sabiás, 402 – Venda Nova', phone: '(31) 3000-0010', distanceKm: 13.7,
    accepts: ['celular', 'notebook', 'desktop', 'geladeira', 'linhabranca-outros', 'cabos'],
    hours: [{ days: MON_SAT, open: 8, close: 16 }],
    map: { x: 50, y: 6 },
  },
]
