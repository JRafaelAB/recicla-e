// Approved Content Catalog (spec CAT-R1..R6). Every entry comes from
// .specs/features/recicla-e-prototype/research.md and cites it via `researchRef`.
// Claims listed in research.md §11 are excluded (CAT-R2).

export interface Source {
  id: string
  name: string
  url: string
}

export interface PerUnit {
  value: number
  unit: 'mg' | 'g' | 'kg'
  substance: string
  qualifier: 'cerca de' | 'até'
}

export interface Fact {
  id: string
  text: string
  subtypes: string[]
  sourceId: string
  researchRef: string
  /** Only on the CAT-R4 multipliable values. */
  perUnit?: PerUnit
}

export interface Tip {
  id: string
  text: string
  subtypes: string[]
  sourceId: string
  researchRef: string
}

export interface Guide {
  subtypeId: string
  porQueNaoGuardar: string
  comoDescartar: string
  /** Brazilian reverse-logistics stream. */
  stream: string
  comoLevar: string
  danoAmbiental: string
  factIds: string[]
  sourceIds: string[]
  researchRef: string
}

export interface Justification {
  text: string
  sourceId: string
  researchRef: string
}

export interface Note {
  id: string
  title: string
  text: string
  sourceId: string
  researchRef: string
}

export interface Multipliable extends PerUnit {
  subtypeId: string
  factId: string
}

export const SOURCES: Source[] = [
  { id: 'pnrs', name: 'Lei 12.305/2010 (Política Nacional de Resíduos Sólidos)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12305.htm' },
  { id: 'dec-10240', name: 'Decreto 10.240/2020', url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/decreto/d10240.htm' },
  { id: 'conama-401', name: 'Resolução CONAMA 401/2008', url: 'https://www.poli.usp.br/wp-content/uploads/2018/10/CONAMA_RES_CONS_2008_401.pdf' },
  { id: 'mma-panorama', name: 'MMA, Panorama da Logística Reversa 2024', url: 'https://portal-api.sinir.gov.br/wp-content/uploads/2024/11/Apresentac%CC%A7a%CC%83o-14-anos-PNRS_Logistica-Reversa.pdf' },
  { id: 'gem-brasil', name: 'Global E-waste Monitor 2024 (ITU/UNITAR), perfil do Brasil', url: 'https://globalewaste.org/statistics/country/brazil/2022' },
  { id: 'itu-latam', name: 'ITU, Gestão de REEE na América Latina (2025)', url: 'https://www.itu.int/net/epub/TSB/2025-Management-of-waste-electrical-and-electronic-equipment-in-Latin-America-Current-situation-and-outlook/files/basic-html/page10.html' },
  { id: 'itu-gem', name: 'ITU, Global E-waste Monitor 2024', url: 'https://www.itu.int/en/ITU-D/Environment/Pages/Publications/The-Global-E-waste-Monitor-2024.aspx' },
  { id: 'itu-gem-highlights', name: 'ITU, Global E-waste Monitor 2024: Highlights', url: 'https://www.itu.int/en/ITU-D/Environment/Documents/Publications/2024/GEM2024%20Highlights.pdf' },
  { id: 'elgin-fispq', name: 'FISPQ Elgin, pilha alcalina', url: 'https://fabesul.com.br/HabilB2B/Catalogo/21119-FISPQ.pdf' },
  { id: 'epa-household-batteries', name: 'EPA, Used Household Batteries', url: 'https://www.epa.gov/recycle/used-household-batteries' },
  { id: 'epa-lithium', name: 'EPA, Used Lithium-Ion Batteries', url: 'https://www.epa.gov/recycle/used-lithium-ion-batteries' },
  { id: 'epa-lithium-faq', name: 'EPA, Frequent Questions on Lithium-Ion Batteries', url: 'https://www.epa.gov/recycle/frequent-questions-lithium-ion-batteries' },
  { id: 'epa-lithium-fires', name: 'EPA, relatório sobre incêndios por baterias de lítio (2021)', url: 'https://www.epa.gov/system/files/documents/2021-08/lithium-ion-battery-report-update-7.01_508.pdf' },
  { id: 'unep-2009', name: 'UNEP/Umicore, Recycling: From E-waste to Resources (2009)', url: 'https://www.nswai.org/docs/Recycling_From_e-waste_to_resources.pdf' },
  { id: 'iber-2024', name: 'IBER, Relatório Anual 2024 (SINIR)', url: 'https://portal-api.sinir.gov.br/wp-content/uploads/2026/02/Relatorio_Anual_MMA_2024_oficial_final.pdf' },
  { id: 'epa-ncer', name: 'EPA NCER, relatório final de pesquisa sobre telas LCD', url: 'https://cfpub.epa.gov/ncer_abstracts/index.cfm/fuseaction/display.abstractDetail/abstract_id/9847/report/F' },
  { id: 'epa-rad', name: "EPA, The Benefits of EPA's RAD Program (2020)", url: 'https://www.epa.gov/system/files/documents/2022-05/RAD_Communicating_RAD_Program_Benefits_2020.pdf' },
  { id: 'epa-crt', name: 'EPA, regra sobre reciclagem de tubos de raios catódicos (CRT)', url: 'https://www.epa.gov/hw/final-rule-streamlined-management-requirements-recycling-used-cathode-ray-tubes-crts-and-glass' },
  { id: 'energystar-mercury', name: 'ENERGY STAR (EPA), ficha sobre mercúrio em CFLs', url: 'https://www.energystar.gov/sites/default/files/asset/document/Fact_Sheet_Mercury.pdf' },
  { id: 'epa-cfl', name: 'EPA, Cleaning Up a Broken CFL', url: 'https://www.epa.gov/cfl/cleaning-broken-cfl' },
  { id: 'who-ewaste', name: 'OMS, Electronic waste (e-waste)', url: 'https://www.who.int/news-room/fact-sheets/detail/electronic-waste-(e-waste)' },
  { id: 'slu-faq', name: 'SLU/PBH, Perguntas frequentes', url: 'https://prefeitura.pbh.gov.br/slu/perguntas-frequentes' },
  { id: 'slu-cidade-limpa', name: 'SLU/PBH, BH Cidade Limpa', url: 'https://prefeitura.pbh.gov.br/slu/bh-cidade-limpa' },
]

const ELETRO = [
  'celular', 'notebook', 'desktop', 'geladeira', 'linhabranca-outros', 'tv-tubo', 'tv-lcd', 'tv-led', 'cabos',
]
const ALL = [
  'pilha', 'bateria-litio', 'bateria-automotiva', ...ELETRO, 'lampada-fluorescente', 'lampada-led',
]

export const FACTS: Fact[] = [
  // §1 Pilhas
  { id: 'pilha-mercurio', subtypes: ['pilha'], sourceId: 'conama-401', researchRef: '§1 fatos, linha 1',
    text: 'Pilhas comuns vendidas no Brasil podem ter no máximo 0,0005% de mercúrio em peso.' },
  { id: 'pilha-vazamento', subtypes: ['pilha'], sourceId: 'elgin-fispq', researchRef: '§1 fatos, linha 2',
    text: 'O vazamento de uma pilha alcalina pode liberar de 2 a 20 ml de líquido corrosivo, conforme o tamanho da pilha.' },
  { id: 'pilha-recolhidas-2010', subtypes: ['pilha'], sourceId: 'mma-panorama', researchRef: '§1 fatos, linha 3',
    text: 'Em 2010, cerca de 2,3 milhões de kg de pilhas foram recolhidos no Brasil.' },

  // §2a Lítio
  { id: 'litio-energia', subtypes: ['bateria-litio'], sourceId: 'epa-lithium', researchRef: '§2a risco de fogo, item 1',
    text: 'Mesmo baterias de lítio usadas podem ter energia suficiente para ferir ou iniciar incêndios.' },
  { id: 'litio-estufada', subtypes: ['bateria-litio', 'celular', 'notebook'], sourceId: 'epa-lithium-faq', researchRef: '§2a risco de fogo, item 3',
    text: 'Bateria estufada indica dano à bateria e é um potencial risco de incêndio.' },
  { id: 'litio-incendios', subtypes: ['bateria-litio', 'celular', 'notebook'], sourceId: 'epa-lithium-fires', researchRef: '§2 fatos, linha 9',
    text: 'Nos EUA, cerca de 245 incêndios em 64 instalações de resíduos, entre 2013 e 2020, foram causados ou suspeitos de serem causados por baterias de lítio.' },
  { id: 'notebook-cobalto', subtypes: ['bateria-litio', 'notebook'], sourceId: 'unep-2009', researchRef: '§2 fatos, linha 2',
    text: 'Uma bateria de notebook tem cerca de 65 g de cobalto (UNEP, 2009).' },
  { id: 'powerbank-decreto', subtypes: ['bateria-litio', 'cabos'], sourceId: 'dec-10240', researchRef: '§0.1 Decreto 10.240, Anexo I',
    text: 'Carregadores, cabos e power banks estão na lista de eletroeletrônicos da logística reversa (Decreto 10.240/2020).' },

  // §2b Chumbo-ácido
  { id: 'automotiva-chumbo', subtypes: ['bateria-automotiva'], sourceId: 'epa-household-batteries', researchRef: '§2 fatos, linha 8',
    text: 'Uma bateria de chumbo-ácido pode ter até 8 kg de chumbo.',
    perUnit: { value: 8, unit: 'kg', substance: 'chumbo', qualifier: 'até' } },
  { id: 'automotiva-composicao', subtypes: ['bateria-automotiva'], sourceId: 'mma-panorama', researchRef: '§2 fatos, linha 4',
    text: 'Uma bateria de carro é cerca de 52% chumbo, 30% solução ácida e 6% plástico.' },
  { id: 'automotiva-reciclagem', subtypes: ['bateria-automotiva'], sourceId: 'mma-panorama', researchRef: '§2 fatos, linha 3',
    text: 'Baterias de chumbo-ácido têm potencial de reciclagem de 99%.' },
  { id: 'automotiva-2024', subtypes: ['bateria-automotiva'], sourceId: 'iber-2024', researchRef: '§2 fatos, linha 6',
    text: 'Em 2024, 353 mil toneladas de baterias de chumbo-ácido tiveram destinação correta verificada no Brasil.' },

  // §3 Celulares
  { id: 'celular-cobre', subtypes: ['celular'], sourceId: 'unep-2009', researchRef: '§3 fatos, linha 1',
    text: 'Um celular contém cerca de 9 g de cobre (estimativa UNEP, 2009).',
    perUnit: { value: 9, unit: 'g', substance: 'cobre', qualifier: 'cerca de' } },
  { id: 'celular-cobalto', subtypes: ['celular'], sourceId: 'unep-2009', researchRef: '§2 fatos, linha 1',
    text: 'A bateria de lítio de um celular contém cerca de 3,5 g de cobalto (estimativa UNEP, 2009).',
    perUnit: { value: 3.5, unit: 'g', substance: 'cobalto', qualifier: 'cerca de' } },
  { id: 'celular-preciosos', subtypes: ['celular'], sourceId: 'unep-2009', researchRef: '§3 fatos, linha 1',
    text: 'Um celular tem em média 250 mg de prata, 24 mg de ouro e 9 mg de paládio (UNEP, dados de 2007–2008).' },
  { id: 'celular-metais-peso', subtypes: ['celular'], sourceId: 'unep-2009', researchRef: '§3 fatos, linha 3',
    text: 'Metais são cerca de 23% do peso de um celular.' },

  // §4 Computadores e notebooks
  { id: 'pc-metais', subtypes: ['notebook', 'desktop'], sourceId: 'unep-2009', researchRef: '§4 fatos, linha 1',
    text: 'Um PC ou notebook tem em média cerca de 1 g de prata, 220 mg de ouro, 80 mg de paládio e 500 g de cobre (UNEP, média de 2007).' },
  { id: 'desktop-ferro', subtypes: ['desktop'], sourceId: 'unep-2009', researchRef: '§4 fatos, linha 2',
    text: 'Um computador de mesa tem cerca de 6 kg de ferro e aço.' },
  { id: 'ccfl-mercurio', subtypes: ['tv-lcd', 'notebook'], sourceId: 'epa-ncer', researchRef: '§4 fatos, linha 4; §6 fatos, linha 2',
    text: 'Telas LCD antigas (fabricadas até cerca de 2009) podem ter até 5 mg de mercúrio em cada lâmpada interna.' },

  // §5 Geladeiras e linha branca
  { id: 'cfc12', subtypes: ['geladeira'], sourceId: 'epa-rad', researchRef: '§5 fatos, linha 1',
    text: 'O gás CFC-12 de geladeiras antigas aquece o planeta 10.900 vezes mais que o CO₂.' },
  { id: 'cfc11', subtypes: ['geladeira'], sourceId: 'epa-rad', researchRef: '§5 fatos, linha 2',
    text: 'O CFC-11 da espuma isolante de geladeiras antigas tem poder de aquecimento 4.750 vezes maior que o CO₂.' },
  { id: 'hfc134a', subtypes: ['geladeira'], sourceId: 'epa-rad', researchRef: '§5 fatos, linha 3',
    text: 'O HFC-134a, usado depois do CFC, ainda aquece o planeta 1.430 vezes mais que o CO₂.' },
  { id: 'geladeira-cfc-co2e', subtypes: ['geladeira'], sourceId: 'epa-rad', researchRef: '§5 fatos, linha 4',
    text: 'Descartar corretamente uma geladeira antiga com CFC (fabricada aproximadamente antes dos anos 2000) evita a emissão de cerca de 3,9 toneladas de CO₂ equivalente, só pelo gás e pela espuma.' },
  { id: 'linhabranca-decreto', subtypes: ['geladeira', 'linhabranca-outros'], sourceId: 'dec-10240', researchRef: '§5 descarte correto',
    text: 'Geladeira, micro-ondas e máquina de lavar estão na lista de eletroeletrônicos da logística reversa obrigatória (Decreto 10.240/2020).' },
  { id: 'metais-valor', subtypes: ELETRO, sourceId: 'itu-gem-highlights', researchRef: '§0.2, linha 8',
    text: 'Os metais no lixo eletrônico do mundo em 2022 valiam US$ 91 bilhões, mas só US$ 28 bilhões foram recuperados.' },

  // §6 TVs e monitores
  { id: 'crt-chumbo', subtypes: ['tv-tubo'], sourceId: 'epa-crt', researchRef: '§6 fatos, linha 1',
    text: 'Uma TV ou monitor de tubo tem em média cerca de 1,8 kg de chumbo, conforme o tamanho e o modelo.',
    perUnit: { value: 1.8, unit: 'kg', substance: 'chumbo', qualifier: 'cerca de' } },
  { id: 'telas-placas', subtypes: ['tv-tubo', 'tv-lcd', 'tv-led'], sourceId: 'itu-gem', researchRef: '§6 LCD / LED',
    text: 'Todas as telas, inclusive as LED, têm placas com metais e plásticos com retardantes de chama bromados.' },
  { id: 'mercurio-bfr-mundo', subtypes: ELETRO, sourceId: 'itu-gem-highlights', researchRef: '§0.2, linha 7',
    text: 'Todo ano, a gestão inadequada do lixo eletrônico libera no ambiente 58 toneladas de mercúrio e 45 mil toneladas de plásticos com retardantes de chama bromados.' },

  // §7 Lâmpadas
  { id: 'cfl-mercurio', subtypes: ['lampada-fluorescente'], sourceId: 'energystar-mercury', researchRef: '§7 fatos, linha 1',
    text: 'Uma lâmpada fluorescente compacta tem, em média, cerca de 4 mg de mercúrio.',
    perUnit: { value: 4, unit: 'mg', substance: 'mercúrio', qualifier: 'cerca de' } },
  { id: 'cfl-termometro', subtypes: ['lampada-fluorescente'], sourceId: 'epa-cfl', researchRef: '§7 fatos, linha 2',
    text: 'O mercúrio de uma lâmpada fluorescente compacta é menos de 1% do mercúrio de um termômetro antigo.' },
  { id: 'cfl-destino-mercurio', subtypes: ['lampada-fluorescente'], sourceId: 'mma-panorama', researchRef: '§7 destino do mercúrio',
    text: 'Na reciclagem de lâmpadas, o mercúrio é separado e isolado com segurança em aterro Classe I.' },
  { id: 'led-fora-reciclus', subtypes: ['lampada-led'], sourceId: 'mma-panorama', researchRef: '§0.1 Acordo Setorial de Lâmpadas; §7 LED',
    text: 'A lâmpada LED não está no acordo setorial de lâmpadas (Reciclus), que cobre fluorescentes, vapor de sódio e mercúrio e luz mista.' },

  // §8 Cabos e carregadores
  { id: 'cabos-queima', subtypes: ['cabos'], sourceId: 'who-ewaste', researchRef: '§8 riscos; §8 fatos, linha 3',
    text: 'A queima de cabos a céu aberto para tirar o cobre libera fumaça tóxica. Crianças e gestantes são as mais vulneráveis.' },
  { id: 'cobre-co2', subtypes: ['cabos'], sourceId: 'unep-2009', researchRef: '§8 fatos, linha 2',
    text: 'A produção primária de cobre emite cerca de 3,4 t de CO₂ por tonelada de cobre.' },
]

export const MULTIPLIABLE: Multipliable[] = [
  { subtypeId: 'lampada-fluorescente', factId: 'cfl-mercurio', substance: 'mercúrio', value: 4, unit: 'mg', qualifier: 'cerca de' },
  { subtypeId: 'tv-tubo', factId: 'crt-chumbo', substance: 'chumbo', value: 1.8, unit: 'kg', qualifier: 'cerca de' },
  { subtypeId: 'bateria-automotiva', factId: 'automotiva-chumbo', substance: 'chumbo', value: 8, unit: 'kg', qualifier: 'até' },
  { subtypeId: 'celular', factId: 'celular-cobre', substance: 'cobre', value: 9, unit: 'g', qualifier: 'cerca de' },
  { subtypeId: 'celular', factId: 'celular-cobalto', substance: 'cobalto', value: 3.5, unit: 'g', qualifier: 'cerca de' },
]

export const TIPS: Tip[] = [
  { id: 'tip-dados', subtypes: ['celular', 'notebook', 'desktop'], sourceId: 'dec-10240', researchRef: '§0.1 Decreto 10.240, art. 31',
    text: 'Antes de descartar celular ou computador, faça backup e apague seus dados. A lei pede que você remova seus dados pessoais.' },
  { id: 'tip-desligado', subtypes: ELETRO, sourceId: 'dec-10240', researchRef: '§0.1 Decreto 10.240, art. 31',
    text: 'Entregue o eletrônico desligado e separado do resto do lixo.' },
  { id: 'tip-sem-volta', subtypes: ELETRO, sourceId: 'dec-10240', researchRef: '§0.1 Decreto 10.240, arts. 11, 18 e 32',
    text: 'O ponto de coleta não devolve o aparelho e os dados ficam irrecuperáveis. Apague tudo antes de entregar.' },
  { id: 'tip-fita-polos', subtypes: ['pilha', 'bateria-litio'], sourceId: 'epa-household-batteries', researchRef: '§1 descarte; §2a preparação',
    text: 'Passe fita isolante nos polos das baterias, ou coloque cada uma num saquinho plástico, antes de levar ao ponto.' },
  { id: 'tip-estufada', subtypes: ['bateria-litio', 'celular', 'notebook'], sourceId: 'epa-lithium-faq', researchRef: '§2a risco de fogo, item 3',
    text: 'Bateria estufada? Não perfure, não carregue e não aperte. Guarde num balde com areia, longe de materiais inflamáveis.' },
  { id: 'tip-bombeiros', subtypes: ['bateria-litio', 'celular', 'notebook'], sourceId: 'epa-lithium-faq', researchRef: '§2a risco de fogo, item 3',
    text: 'Se uma bateria estufada ameaçar pegar fogo, ligue para os bombeiros: 193.' },
  { id: 'tip-litio-lixo', subtypes: ['bateria-litio', 'celular', 'notebook'], sourceId: 'epa-lithium', researchRef: '§2a risco de fogo, item 1',
    text: 'Nunca jogue bateria de lítio no lixo comum: ela pode ser amassada no caminhão ou na triagem e pegar fogo.' },
  { id: 'tip-lojas-pilhas', subtypes: ['pilha', 'bateria-litio', 'bateria-automotiva'], sourceId: 'conama-401', researchRef: '§0.1 CONAMA 401, art. 4º',
    text: 'Lojas que vendem pilhas e baterias, e as assistências técnicas, devem receber as usadas.' },
  { id: 'tip-bateria-carro', subtypes: ['bateria-automotiva'], sourceId: 'conama-401', researchRef: '§2b descarte correto',
    text: 'Bateria de carro se devolve na loja ou oficina onde você trocou. Leve em pé, sem tombar e sem tirar o ácido.' },
  { id: 'tip-lampada-quebrou', subtypes: ['lampada-fluorescente'], sourceId: 'epa-cfl', researchRef: '§7 risco em casa',
    text: 'Lâmpada fluorescente quebrou? Tire pessoas e animais do cômodo e ventile por 5 a 10 minutos. Não use aspirador.' },
  { id: 'tip-geladeira-canos', subtypes: ['geladeira'], sourceId: 'epa-rad', researchRef: '§5 risco; §5 descarte correto',
    text: 'Geladeira velha: não corte os canos nem triture a espuma. Isso solta gases que aquecem o planeta.' },
  { id: 'tip-slu', subtypes: ALL, sourceId: 'slu-faq', researchRef: '§9, linha 1',
    text: 'Em BH, a coleta domiciliar da SLU não recolhe eletrônicos, lâmpadas, pilhas nem baterias. Leve a um ponto de coleta.' },
  { id: 'tip-coleta-seletiva', subtypes: ['pilha', 'bateria-litio', 'bateria-automotiva'], sourceId: 'slu-cidade-limpa', researchRef: '§9, linha 4',
    text: 'Pilhas e baterias não vão na coleta seletiva de BH.' },
  { id: 'tip-pnrs', subtypes: ALL, sourceId: 'pnrs', researchRef: '§0.1 Lei 12.305/2010, art. 33',
    text: 'Quem fabrica, importa e vende é obrigado a receber de volta. Você faz a sua parte entregando no ponto certo.' },
  { id: 'tip-brasil-3', subtypes: ELETRO, sourceId: 'gem-brasil', researchRef: '§0.2, linha 3',
    text: 'Só cerca de 3% do lixo eletrônico brasileiro teve coleta e reciclagem documentadas em 2022 (Global E-waste Monitor 2024).' },
  { id: 'tip-brasil-kg', subtypes: ELETRO, sourceId: 'gem-brasil', researchRef: '§0.2, linha 2',
    text: 'Em 2022, cada brasileiro gerou em média 11,4 kg de lixo eletrônico.' },
  { id: 'tip-americas', subtypes: ELETRO, sourceId: 'itu-latam', researchRef: '§0.2, linha 4',
    text: 'O Brasil é o 2º maior gerador de lixo eletrônico das Américas, atrás só dos EUA.' },
]

const ELETRO_STREAM = 'Logística reversa de eletroeletrônicos (ABREE e Green Eletron)'

export const GUIDES: Guide[] = [
  {
    subtypeId: 'pilha',
    porQueNaoGuardar: 'Com o tempo, a pilha pode vazar um líquido corrosivo que irrita pele, olhos e vias respiratórias.',
    comoDescartar: 'Leve a um ponto de coleta de pilhas. Lojas que vendem pilhas devem receber as usadas. No Brasil, pilha não vai para o lixo comum.',
    stream: 'Logística reversa de pilhas e baterias (Green Eletron)',
    comoLevar: 'Junte as pilhas num pote plástico com tampa. Se tiver pilha de lítio misturada, isole os polos com fita isolante. Não abra nem amasse.',
    danoAmbiental: 'Pilhas vazam substâncias corrosivas e metais que não devem ir para o solo nem para a água.',
    factIds: ['pilha-vazamento', 'pilha-mercurio'],
    sourceIds: ['conama-401', 'elgin-fispq'],
    researchRef: '§1',
  },
  {
    subtypeId: 'bateria-litio',
    porQueNaoGuardar: 'Mesmo usada, a bateria de lítio pode ter energia para ferir ou iniciar um incêndio. Bateria estufada é o item mais perigoso de guardar em casa.',
    comoDescartar: 'Bateria solta vai para o ponto de pilhas e baterias. Bateria embutida (celular, notebook, power bank): entregue o aparelho inteiro no ponto de eletroeletrônicos, sem tentar tirar a bateria.',
    stream: 'Logística reversa de pilhas e baterias (bateria solta) ou de eletroeletrônicos (bateria embutida)',
    comoLevar: 'Fita isolante nos terminais ou cada bateria num saquinho plástico separado. Bateria estufada: não perfure, não carregue, não aperte.',
    danoAmbiental: 'Tem cobalto, níquel e eletrólito inflamável. No lixo comum, pode ser amassada no caminhão ou na triagem e pegar fogo.',
    factIds: ['litio-energia', 'litio-estufada', 'litio-incendios'],
    sourceIds: ['epa-lithium', 'epa-lithium-faq', 'dec-10240'],
    researchRef: '§2a',
  },
  {
    subtypeId: 'bateria-automotiva',
    porQueNaoGuardar: 'Pode vazar ácido sulfúrico, que queima a pele, e contém chumbo, que é neurotóxico. É resíduo perigoso Classe I.',
    comoDescartar: 'Devolva na loja ou oficina onde trocou a bateria. Por lei, ela não pode ir para aterro nem incinerador.',
    stream: 'Logística reversa de baterias chumbo-ácido (IBER)',
    comoLevar: 'Transporte em pé, sem tombar e sem retirar o ácido.',
    danoAmbiental: 'Chumbo e ácido sulfúrico fazem dela um resíduo perigoso, que só pode ir para reciclador licenciado.',
    factIds: ['automotiva-chumbo', 'automotiva-reciclagem'],
    sourceIds: ['conama-401', 'mma-panorama', 'epa-household-batteries'],
    researchRef: '§2b',
  },
  {
    subtypeId: 'celular',
    porQueNaoGuardar: 'A bateria envelhecida pode estufar e pegar fogo. E seus dados ficam expostos se o aparelho for perdido ou repassado.',
    comoDescartar: 'Entregue num ponto de eletroeletrônicos. Lojas de operadoras e varejistas costumam ter coletor.',
    stream: ELETRO_STREAM,
    comoLevar: 'Faça backup e restaure as configurações de fábrica. Tire o chip e o cartão de memória, saia das suas contas e entregue desligado. Bateria estufada: ponha num saquinho e avise no ponto.',
    danoAmbiental: 'Tem metais como ouro, prata, cobre e cobalto, e plásticos com retardantes de chama bromados.',
    factIds: ['celular-cobre', 'celular-cobalto', 'celular-preciosos'],
    sourceIds: ['dec-10240', 'unep-2009', 'epa-lithium-faq'],
    researchRef: '§3',
  },
  {
    subtypeId: 'notebook',
    porQueNaoGuardar: 'A bateria de lítio do notebook é grande e pode estufar: tampa ou touchpad levantando é sinal de perigo. O disco guarda seus dados.',
    comoDescartar: 'Entregue num ponto de eletroeletrônicos, com a bateria no lugar se ela for embutida.',
    stream: ELETRO_STREAM,
    comoLevar: 'Faça backup e apague o disco (formate ou use o reset do sistema). Entregue desligado. Bateria removível estufada vai num saco plástico, com fita nos terminais.',
    danoAmbiental: 'Tem chumbo na solda, retardantes de chama nos plásticos e, em telas antigas, mercúrio.',
    factIds: ['pc-metais', 'notebook-cobalto', 'ccfl-mercurio'],
    sourceIds: ['dec-10240', 'unep-2009', 'epa-ncer'],
    researchRef: '§4',
  },
  {
    subtypeId: 'desktop',
    porQueNaoGuardar: 'O disco guarda seus dados pessoais, e as placas têm chumbo na solda e retardantes de chama nos plásticos.',
    comoDescartar: 'Entregue num ponto de eletroeletrônicos.',
    stream: ELETRO_STREAM,
    comoLevar: 'Faça backup e apague o disco, ou retire o HD/SSD. Entregue desligado.',
    danoAmbiental: 'Placas com chumbo na solda, plásticos com retardantes de chama bromados e metais preciosos.',
    factIds: ['pc-metais', 'desktop-ferro'],
    sourceIds: ['dec-10240', 'unep-2009'],
    researchRef: '§4',
  },
  {
    subtypeId: 'geladeira',
    porQueNaoGuardar: 'O risco tóxico em casa é baixo, mas a geladeira parada ocupa espaço. O perigo real está no descarte errado, que solta os gases do circuito e da espuma.',
    comoDescartar: 'Agende a coleta com a loja na compra do aparelho novo ou com a entidade gestora (ABREE). Em BH, as URPVs não recebem eletroeletrônicos.',
    stream: ELETRO_STREAM,
    comoLevar: 'Esvazie, descongele e seque. Feche a porta com fita. Não corte canos nem retire o compressor. Transporte em pé.',
    danoAmbiental: 'Aparelhos antigos têm gases CFC, que destroem a camada de ozônio e aquecem o planeta. Os mais novos usam HFC, que ainda aquece o planeta, ou hidrocarbonetos inflamáveis.',
    factIds: ['cfc12', 'geladeira-cfc-co2e'],
    sourceIds: ['epa-rad', 'mma-panorama', 'dec-10240', 'slu-cidade-limpa'],
    researchRef: '§5',
  },
  {
    subtypeId: 'linhabranca-outros',
    porQueNaoGuardar: 'Lavadora, micro-ondas e fogão elétrico parados ocupam espaço e não podem ir para o lixo comum nem para a coleta da SLU.',
    comoDescartar: 'Por serem volumosos, normalmente é preciso agendar a coleta com o varejista ou com a entidade gestora (ABREE). Em BH, as URPVs não recebem eletroeletrônicos.',
    stream: ELETRO_STREAM,
    comoLevar: 'Esvazie e seque o aparelho e prenda portas e tampas com fita.',
    danoAmbiental: 'Têm metais e plásticos. No mundo, a maior parte do valor dos metais do lixo eletrônico não é recuperada.',
    factIds: ['linhabranca-decreto', 'metais-valor'],
    sourceIds: ['dec-10240', 'slu-faq', 'itu-gem-highlights'],
    researchRef: '§5; §9',
  },
  {
    subtypeId: 'tv-tubo',
    porQueNaoGuardar: 'O vidro do tubo tem chumbo. Não abra nem desmonte o aparelho.',
    comoDescartar: 'Entregue num ponto de eletroeletrônicos.',
    stream: ELETRO_STREAM,
    comoLevar: 'Transporte sem quebrar a tela. Não desmonte o tubo.',
    danoAmbiental: 'O vidro do tubo concentra chumbo, um metal neurotóxico.',
    factIds: ['crt-chumbo'],
    sourceIds: ['epa-crt', 'dec-10240'],
    researchRef: '§6 CRT',
  },
  {
    subtypeId: 'tv-lcd',
    porQueNaoGuardar: 'Telas LCD antigas têm lâmpadas internas com mercúrio, que só sai se a tela quebrar ou for desmontada.',
    comoDescartar: 'Entregue num ponto de eletroeletrônicos.',
    stream: ELETRO_STREAM,
    comoLevar: 'Transporte sem quebrar a tela. Não desmonte a iluminação interna.',
    danoAmbiental: 'Mercúrio nas lâmpadas internas, placas com metais e plásticos com retardantes de chama.',
    factIds: ['ccfl-mercurio', 'telas-placas'],
    sourceIds: ['epa-ncer', 'itu-gem', 'dec-10240'],
    researchRef: '§6 LCD / LED',
  },
  {
    subtypeId: 'tv-led',
    porQueNaoGuardar: 'O risco em casa é baixo, mas a TV parada ocupa espaço e tem placas com metais.',
    comoDescartar: 'Entregue num ponto de eletroeletrônicos.',
    stream: ELETRO_STREAM,
    comoLevar: 'Transporte sem quebrar a tela.',
    danoAmbiental: 'Placas com metais e plásticos com retardantes de chama bromados.',
    factIds: ['telas-placas'],
    sourceIds: ['itu-gem', 'dec-10240'],
    researchRef: '§6 LCD / LED',
  },
  {
    subtypeId: 'lampada-fluorescente',
    porQueNaoGuardar: 'Se quebrar dentro de casa, o mercúrio da lâmpada vira vapor no ar do cômodo.',
    comoDescartar: 'Leve a um ponto do Programa Reciclus. O ponto mais próximo aparece no site da Reciclus pelo CEP.',
    stream: 'Logística reversa de lâmpadas (Reciclus)',
    comoLevar: 'Não quebre. Leve na embalagem original ou embrulhada em jornal ou papelão. Tubular vai inteira, sem fita no vidro.',
    danoAmbiental: 'O mercúrio é tóxico. No destino certo, ele é separado e isolado com segurança em aterro Classe I.',
    factIds: ['cfl-mercurio', 'cfl-termometro', 'cfl-destino-mercurio'],
    sourceIds: ['energystar-mercury', 'epa-cfl', 'mma-panorama'],
    researchRef: '§7 fluorescentes',
  },
  {
    subtypeId: 'lampada-led',
    porQueNaoGuardar: 'O risco em casa é baixo: a lâmpada LED tem só componentes eletrônicos.',
    comoDescartar: 'A LED não entra no programa Reciclus. Alguns varejistas e prefeituras recebem: confira no ponto antes de levar.',
    stream: 'Sem fluxo nacional obrigatório claro; alguns varejistas e prefeituras recebem',
    comoLevar: 'Leve a lâmpada inteira, embrulhada em papel.',
    danoAmbiental: 'Tem chips e metais, que não devem ir para o lixo comum.',
    factIds: ['led-fora-reciclus'],
    sourceIds: ['mma-panorama', 'dec-10240'],
    researchRef: '§7 LED',
  },
  {
    subtypeId: 'cabos',
    porQueNaoGuardar: 'Guardar em casa é de baixo risco. Só não guarde power banks junto: eles são baterias de lítio.',
    comoDescartar: 'Entregue num ponto de eletroeletrônicos. Cabos e carregadores estão na lista da logística reversa.',
    stream: ELETRO_STREAM,
    comoLevar: 'Enrole e prenda com elástico ou fita. Separe power banks e baterias, com fita nos terminais.',
    danoAmbiental: 'Queimar cabos a céu aberto para tirar o cobre libera fumaça tóxica, perigosa sobretudo para crianças e gestantes.',
    factIds: ['cabos-queima', 'powerbank-decreto'],
    sourceIds: ['dec-10240', 'who-ewaste'],
    researchRef: '§8',
  },
]

// Danger-level justifications, from research.md §10 (Escala educativa recicla-E).
export const LEVEL_JUSTIFICATION: Record<string, Justification> = {
  pilha: { sourceId: 'conama-401', researchRef: '§10, linha Pilhas',
    text: 'Mercúrio, cádmio e chumbo são limitados a traços por lei. O risco real é o vazamento de líquido corrosivo, e pilhas de 9 V podem dar curto.' },
  'bateria-litio': { sourceId: 'epa-lithium', researchRef: '§10, linha Baterias de lítio',
    text: 'Fuga térmica e incêndio mesmo quando parece descarregada, mais cobalto, níquel e eletrólito inflamável. Bateria estufada é o item mais perigoso de guardar em casa: nível elevado a 5 pelo risco de fogo.' },
  'bateria-automotiva': { sourceId: 'epa-household-batteries', researchRef: '§10, linha Bateria chumbo-ácido',
    text: 'Até cerca de 8 kg de chumbo e 3,8 L de ácido sulfúrico, resíduo perigoso Classe I. O risco de fogo fora de uso é baixo.' },
  celular: { sourceId: 'epa-lithium-fires', researchRef: '§10, linha Celulares',
    text: 'Bateria de lítio embutida, principal causa de incêndios em instalações de resíduos segundo a EPA, mais metais e retardantes de chama em pequena quantidade.' },
  notebook: { sourceId: 'epa-lithium', researchRef: '§10, linha Computadores/Notebooks',
    text: 'Bateria de lítio maior, chumbo na solda, retardantes de chama e mercúrio em telas antigas.' },
  desktop: { sourceId: 'itu-gem', researchRef: '§10, linha Computadores/Notebooks',
    text: 'Sem bateria de lítio grande, o risco de fogo é desprezível. Tem chumbo na solda e retardantes de chama nos plásticos.' },
  geladeira: { sourceId: 'epa-rad', researchRef: '§10, linha Geladeiras e linha branca',
    text: 'Gases CFC e HFC, com poder de aquecimento de 1.430 a 10.900 vezes o do CO₂, escapam se a tubulação ou a espuma forem rompidas. Os modelos novos usam gás inflamável. Pouco risco tóxico para o morador.' },
  'linhabranca-outros': { sourceId: 'dec-10240', researchRef: '§10, linha Geladeiras e linha branca',
    text: 'Mesmo nível da linha branca: pouco risco tóxico para o morador, mas são aparelhos grandes com componentes elétricos, que vão para a logística reversa.' },
  'tv-tubo': { sourceId: 'epa-crt', researchRef: '§10, linha TV/monitor CRT',
    text: 'Cerca de 1,8 kg de chumbo no vidro e um tubo de vácuo que pode implodir se quebrar.' },
  'tv-lcd': { sourceId: 'epa-ncer', researchRef: '§10, linha TV/monitor LCD com CCFL',
    text: 'Até 5 mg de mercúrio por lâmpada interna, liberado só se a tela for desmontada ou quebrada.' },
  'tv-led': { sourceId: 'itu-gem', researchRef: '§10, linha TV/monitor LED',
    text: 'Sem mercúrio. Metais e retardantes de chama ficam encapsulados na placa.' },
  'lampada-fluorescente': { sourceId: 'energystar-mercury', researchRef: '§10, linha Lâmpada fluorescente',
    text: 'Cerca de 4 mg de mercúrio, que vira vapor dentro de casa na hora em que a lâmpada quebra. Quantidade pequena, mas a exposição é direta.' },
  'lampada-led': { sourceId: 'mma-panorama', researchRef: '§10, linha Lâmpada LED',
    text: 'Sem mercúrio; só componentes eletrônicos.' },
  cabos: { sourceId: 'who-ewaste', researchRef: '§10, linha Cabos e carregadores',
    text: 'Baixo risco em casa. O dano vem da queima de cabos para tirar o cobre. Power bank é bateria de lítio, nível 5.' },
}

export const PNRS_CARD: Note = {
  id: 'pnrs-card',
  title: 'O que é logística reversa?',
  text: 'É o caminho de volta do produto depois do uso. Pela Política Nacional de Resíduos Sólidos (Lei 12.305/2010), quem fabrica, importa e vende pilhas, baterias, lâmpadas fluorescentes e eletroeletrônicos é obrigado a receber de volta. Você faz a sua parte entregando no ponto certo.',
  sourceId: 'pnrs',
  researchRef: '§0.1 Lei 12.305/2010, art. 33',
}

export const URPV_NOTE: Note = {
  id: 'urpv-note',
  title: 'URPVs de BH',
  text: 'As URPVs de BH não recebem eletrônicos, pilhas nem lâmpadas. Leve esses itens a um ponto de coleta.',
  sourceId: 'slu-cidade-limpa',
  researchRef: '§9, linha 3',
}
