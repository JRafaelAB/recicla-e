# recicla-E: Pesquisa de conteúdo (fatos com fonte)

> Pesquisa web feita em 2026-11-13. Cada fato traz a frase sugerida para o app (PT-BR), o número com unidade, a fonte, a URL e uma nota de confiança.
>
> **Legenda de confiança**
> - **primária**: texto lido diretamente na fonte oficial (lei, órgão de governo, ONU/ITU, EPA, relatório da entidade gestora).
> - **primária (via trecho)**: número oficial, mas visto em trecho de busca ou em reprodução fiel; a página original não abriu durante a pesquisa. Vale reconferir antes de publicar.
> - **secundária**: imprensa ou blog citando a entidade, sem documento primário consultado.
> - **duvidosa**: sem fonte primária localizável ou com números conflitantes. Não usar.
>
> **Conversões**: 1 lb = 0,4536 kg. Conversões e divisões feitas por mim estão marcadas como "(cálculo próprio)".

---

## 0. Contexto Brasil

### 0.1 Marco legal (o que vale para cada categoria)

| Instrumento | O que cobre | Ponto-chave para o app | Fonte | Confiança |
|---|---|---|---|---|
| **Lei 12.305/2010 (PNRS)**, art. 33 | Logística reversa obrigatória para pilhas e baterias, lâmpadas fluorescentes/vapor de sódio e mercúrio/luz mista, e eletroeletrônicos | "Quem fabrica, importa e vende é obrigado a receber de volta. O consumidor faz a parte dele entregando no ponto certo." | https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12305.htm | primária (texto legal conhecido; o MMA cita no Panorama 2024) |
| **Decreto 10.240/2020** | Eletroeletrônicos **domésticos** de até 240 V e seus componentes (Anexo I: geladeira, micro-ondas, notebook, celular, TV, monitor, **carregadores, cabos, power banks**, controle remoto etc.) | **Exclui** (art. 5º) "pilhas, baterias ou lâmpadas não integrantes ou removíveis", que têm sistemas próprios. Também exclui equipamento corporativo/industrial. | https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/decreto/d10240.htm | primária |
| Decreto 10.240, art. 31 | Deveres do consumidor | Separar o eletrônico do resto do lixo; **remover dados pessoais antes do descarte**; entregar **desligado** no ponto de recebimento. | idem | primária |
| Decreto 10.240, arts. 11, 18 e 32 | Sem pagamento ao consumidor pela entrega. Ao entregar, a propriedade é transferida e o consumidor aceita que os dados ficam irrecuperáveis. | Útil para avisar: "apague seus dados antes, o ponto não devolve o aparelho". | idem | primária |
| Decreto 10.240, art. 48 §2º | Pelo menos **1 ponto de recebimento a cada 25 mil habitantes** nos municípios-alvo | Contexto de densidade de pontos | idem | primária |
| Decreto 10.240, Anexo II | Metas anuais, não cumulativas, em % do **peso** colocado no mercado em 2018: 2021: 1% (24 municípios); 2022: 3% (68); 2023: 6% (186); **2024: 12% (294)**; **2025: 17% (400)** | "A meta nacional para 2025 era recolher 17% do peso de eletroeletrônicos vendidos." | idem | primária |
| **Resolução CONAMA 401/2008** (alterada pela 424/2010) | Pilhas e baterias portáteis, botão, miniatura, chumbo-ácido, Ni-Cd, óxido de mercúrio | Art. 4º: lojas que vendem e assistências técnicas **devem receber** as usadas. Art. 19: pontos de recolhimento obrigatórios nos estabelecimentos. Art. 22: proíbe jogar a céu aberto, queimar, lançar em rios, terrenos baldios, bueiros etc. | https://www.poli.usp.br/wp-content/uploads/2018/10/CONAMA_RES_CONS_2008_401.pdf | primária (texto integral lido) |
| CONAMA 401, art. 7º | Limites para pilhas portáteis zinco-manganês e alcalinas: **Hg ≤ 0,0005%**, **Cd ≤ 0,002%**, **Pb ≤ 0,1%** em peso; pilha-botão/miniatura: Hg ≤ 2,0% | Pilha comum vendida legalmente no Brasil tem pouquíssimo mercúrio. O risco principal é outro (ver seção 1). | idem | primária |
| CONAMA 401, arts. 8º a 11 | Chumbo-ácido: Hg ≤ 0,005%, Cd ≤ 0,010%; **proibido aterro sanitário e incineração**; revendedor pode repassar direto ao reciclador licenciado | | idem | primária |
| Acordo Setorial de Lâmpadas (13/02/2015) | Lâmpadas fluorescentes, de vapor de sódio e mercúrio e de luz mista. Entidade gestora: **Reciclus** | LED **não** está no escopo do acordo | MMA, Panorama da Logística Reversa 2024: https://portal-api.sinir.gov.br/wp-content/uploads/2024/11/Apresentac%CC%A7a%CC%83o-14-anos-PNRS_Logistica-Reversa.pdf | primária |
| Acordo Setorial Baterias Chumbo-Ácido (14/08/2019) | Entidade gestora: **IBER** | | idem | primária |
| Acordo Setorial Eletroeletrônicos (31/10/2019) + Decreto 10.240 | Entidades gestoras: **ABREE** e **Green Eletron** | | idem | primária |
| Pilhas e baterias portáteis | Entidade gestora: **Green Eletron** (CONAMA 401 + IN IBAMA 8/2012) | | idem | primária |

### 0.2 Números Brasil e mundo

| Frase sugerida (PT-BR) | Número | Fonte | URL | Confiança |
|---|---|---|---|---|
| "Em 2022, o Brasil gerou cerca de 2,4 milhões de toneladas de lixo eletrônico." | 2.443 kt (≈2,4 bilhões de kg), ano 2022 | Global E-waste Monitor 2024 (ITU/UNITAR), perfil do país; ITU confirma 2,4 bilhões de kg | https://globalewaste.org/statistics/country/brazil/2022 ; https://www.itu.int/net/epub/TSB/2025-Management-of-waste-electrical-and-electronic-equipment-in-Latin-America-Current-situation-and-outlook/files/basic-html/page10.html | primária (o total foi confirmado na página da ITU) |
| "Cada brasileiro gerou em média 11,4 kg de lixo eletrônico em 2022." | 11,4 kg/hab/ano | GEM 2024, perfil Brasil | https://globalewaste.org/statistics/country/brazil/2022 | primária (via trecho; a página dava timeout) |
| "Só cerca de 3% do lixo eletrônico brasileiro tem coleta e reciclagem documentadas." | 3% (≈79 kt) documentado como coletado formalmente, ano 2022 | GEM 2024, perfil Brasil | idem | primária (via trecho). Cite sempre "GEM 2024, dado de 2022". Muitas matérias repetem "3%" sem fonte. |
| "O Brasil é o 2º maior gerador das Américas, atrás só dos EUA." | EUA 7,2 bi kg; Brasil 2,4 bi kg | ITU, 2025 (Gestão de REEE na América Latina) | URL ITU acima | primária |
| "Nas Américas, a média é 14,1 kg por pessoa, e 30% é coletado e reciclado." | 14,1 kg/hab; 4,2 kg/hab coletados; 30% | UNITAR, press release GEM 2024; ITU GEM2024 Highlights | https://unitar.org/about/news-stories/press/global-e-waste-monitor-2024-electronic-waste-rising-five-times-faster-documented-e-waste-recycling | primária |
| "Em 2022, o mundo gerou 62 bilhões de kg de lixo eletrônico, 7,8 kg por pessoa. Só 22,3% foi reciclado de forma documentada." | 62 bi kg; 7,8 kg/hab; 22,3% (13,8 bi kg) | ITU, GEM 2024, página oficial e Highlights | https://www.itu.int/en/ITU-D/Environment/Pages/Publications/The-Global-E-waste-Monitor-2024.aspx | primária |
| "A geração de lixo eletrônico cresce quase 5 vezes mais rápido que a reciclagem documentada." | fator ≈5 (2010 a 2022) | ITU GEM 2024 | idem | primária |
| "Todo ano, a gestão inadequada do lixo eletrônico libera no ambiente 58 toneladas de mercúrio e 45 mil toneladas de plásticos com retardantes de chama bromados." | 58.000 kg Hg/ano; 45 milhões kg de plástico com BFR/ano | ITU, GEM2024 Highlights (PDF lido) | https://www.itu.int/en/ITU-D/Environment/Documents/Publications/2024/GEM2024%20Highlights.pdf | primária |
| "Os metais no lixo eletrônico de 2022 valiam US$ 91 bilhões, mas só US$ 28 bilhões foram recuperados." | US$ 91 bi contidos; US$ 28 bi recuperados | ITU, GEM2024 Highlights | idem | primária |
| "Em 2030, a projeção é de 82 bilhões de kg por ano." | 82 bi kg | ITU GEM 2024 | idem | primária |
| "87% dos brasileiros guardam algum eletrônico sem uso em casa." | 87%; 31% guardam há mais de 1 ano; 33% nunca ouviram falar de pontos de entrega | Pesquisa Green Eletron/Radar Pesquisas 2021 (2.075 entrevistas) | https://tecnoblog.net/noticias/brasil-recicla-apenas-3-de-seu-lixo-eletronico-aponta-pesquisa/ | secundária (a imprensa cita o relatório da Green Eletron; o MMA reproduz "quase 90%" e "30% por mais de um ano" no Panorama 2024) |
| "72% dos brasileiros têm celular velho guardado em casa." | 72% | Mesma pesquisa Green Eletron 2021 | https://convergenciadigital.com.br/mercado/lixo-eletrnico-72-dos-brasileiros-guardam-celulares-velhos | secundária |
| "Em 2022, a ABREE tinha 4.997 pontos de recebimento em 1.370 municípios." | 4.997 pontos; 1.370 municípios; 15.350 t (2022) | Relatório Anual ABREE 2022 | https://abree.org.br/pagina/download/6323 | primária (via trecho) |
| "Em 2023, a Green Eletron reciclou mais de 4,2 mil toneladas de eletrônicos e 160 toneladas de pilhas." | 4.200 t eletrônicos; 160 t pilhas | Release DHL/Green Eletron, nov. 2024 | https://www.dhl.com/br-pt/home/imprensa/arquivo-de-imprensa/2024/com-novo-desenho-dhl-supply-chain-torna-a-logistica-reversa-de-eletroeletronicos-da-green-eletron-mais-eficiente.html | secundária |

---

## 1. Pilhas (comuns, zinco-carbono e alcalinas)

**Substâncias**
- Alcalina: zinco (≈10–25%), dióxido de manganês (≈35–42%), **hidróxido de potássio (KOH) aquoso, corrosivo** (≈5–15%), aço, grafite. Fontes: FISPQ Elgin (https://fabesul.com.br/HabilB2B/Catalogo/21119-FISPQ.pdf) e SDS Duracell. Confiança: primária (ficha de segurança do fabricante, via trecho).
- Mercúrio, cádmio e chumbo são limitados por lei a traços: Hg ≤ 0,0005%, Cd ≤ 0,002%, Pb ≤ 0,1% (CONAMA 401, art. 7º). Pilhas falsificadas ou contrabandeadas podem não cumprir esses limites, mas não achei dado quantitativo sobre isso.
- Pilha-botão e miniatura podem ter até 2% de Hg (CONAMA 401). Hoje a maioria das pilhas-botão é de lítio (EPA, https://www.epa.gov/recycle/used-household-batteries).

**Risco de guardar em casa**
- Com o tempo, a pilha pode **vazar KOH**, que é cáustico e irrita pele, olhos e vias respiratórias. Segundo a ficha Elgin, o vazamento é de cerca de 2 a 20 ml, conforme o tamanho da pilha. As fichas indicam neutralizar o líquido com ácido fraco (como vinagre ou ácido bórico). Confiança: primária (FISPQ, via trecho).
- A Green Eletron orienta guardar as pilhas usadas em recipiente com tampa, em lugar seco e arejado, longe de calor e umidade (secundária, via matéria de imprensa).
- Fogo: risco baixo para pilhas AA/AAA. Pilhas de 9 V têm os dois polos lado a lado e podem dar curto se encostarem em metal. Não achei fonte primária brasileira para isso, então só use como dica genérica do tipo "isole os polos".

**Descarte correto no Brasil**
- Fluxo: **logística reversa de pilhas e baterias** (CONAMA 401 + PNRS). Entidade gestora: **Green Eletron**, com Pontos de Entrega Voluntária (PEVs) no varejo. Lojas que vendem pilhas são obrigadas a receber (art. 4º e art. 19).
- Preparação: juntar as pilhas num pote plástico com tampa e, se tiver 9 V ou pilha de lítio misturada, **isolar os polos com fita isolante**. Não abrir nem amassar as pilhas.
- Proibido: jogar a céu aberto, queimar, jogar em rios, terrenos baldios ou bueiros (CONAMA 401, art. 22).
- Nuance: nos EUA a EPA diz que, na maioria das cidades, a pilha alcalina pode ir no lixo comum. **No Brasil, isso não vale como orientação**: a PNRS inclui pilhas na logística reversa obrigatória, então o app deve sempre recomendar o ponto de coleta.

**Fatos quantitativos**

| Frase (PT-BR) | Número | Fonte | URL | Confiança |
|---|---|---|---|---|
| "Pilhas vendidas no Brasil podem ter no máximo 0,0005% de mercúrio." | 0,0005% em peso | CONAMA 401/2008, art. 7º | link CONAMA acima | primária |
| "O vazamento de uma pilha alcalina pode liberar de 2 a 20 ml de líquido corrosivo." | 2–20 ml de solução de KOH | FISPQ Elgin pilha alcalina | https://fabesul.com.br/HabilB2B/Catalogo/21119-FISPQ.pdf | primária (via trecho) |
| "Em 2010, cerca de 2,3 milhões de kg de pilhas foram recolhidos no Brasil." | 2,3 milhões kg (2010) | MMA, Panorama 2024 (citando Green Eletron) | link Panorama acima | primária (repete a entidade) |
| "Em 2023, a Green Eletron reciclou 160 toneladas de pilhas." | 160 t | release DHL/Green Eletron | link DHL acima | secundária |
| Impacto por unidade | **Sem número confiável por pilha.** A afirmação "1 pilha contamina X mil litros" não tem fonte primária (ver Claims to avoid). | | | |

---

## 2. Baterias

### 2a. Lítio (celular, notebook, power bank)

**Substâncias**: cobalto (≈3,5 g na bateria de um celular, UNEP 2009), níquel, lítio, cobre, e eletrólito com solvente orgânico **inflamável**. Laptops usam bateria de Li-íon com cerca de 65 g de Co por bateria (UNEP 2009, figura 2).

**Risco de fogo e explosão**
- "Mesmo baterias usadas podem ter energia suficiente para ferir ou iniciar incêndios." Quando vão para o lixo comum ou para a reciclagem municipal, podem ser amassadas no caminhão ou na triagem e pegar fogo (EPA, https://www.epa.gov/recycle/used-lithium-ion-batteries). Confiança: primária.
- Baterias de Li-íon "podem se tornar risco de incêndio se quebradas, dobradas ou esmagadas" e soltam faíscas se os terminais se tocarem (EPA, https://www.epa.gov/recycle/used-household-batteries). Confiança: primária.
- **Bateria estufada**: o inchaço "indica dano à bateria e é um potencial risco de incêndio". Se não houver ameaça imediata de fogo, guarde num lugar seguro, como um balde com areia ou areia de gato, longe de materiais inflamáveis, e procure o fabricante, a loja ou o programa de resíduos perigosos. Se houver risco de fogo, chame os bombeiros (193 no Brasil; a EPA cita o 911). Fonte: EPA FAQ, https://www.epa.gov/recycle/frequent-questions-lithium-ion-batteries. Confiança: primária.
- A EPA recomenda guardar em temperatura ambiente e evitar calor ou frio extremos por longos períodos (mesma fonte).
- Incêndios em instalações de resíduos: um relatório da EPA de 2021 (EPA 530-R-21-002) identificou cerca de 245 incêndios causados ou suspeitos de serem causados por baterias de lítio em 64 instalações dos EUA entre 2013 e 2020. Os aparelhos mais comuns eram celulares, tablets e notebooks, e o relatório considera o problema subnotificado. URL: https://www.epa.gov/system/files/documents/2021-08/lithium-ion-battery-report-update-7.01_508.pdf. Confiança: primária (via trecho; a imprensa varia entre "mais de 240" e "250").

**Descarte correto no Brasil**
- **Bateria solta** (removível): fluxo de **pilhas e baterias** (CONAMA 401 / Green Eletron). O Decreto 10.240 exclui baterias removíveis. Alguns coletores de pilhas não aceitam bateria de celular, então confira no ponto.
- **Bateria embutida** no aparelho (celular, notebook, power bank): entregue o **aparelho inteiro** no ponto de eletroeletrônicos (Decreto 10.240; power bank aparece no Anexo I). Não tente tirar a bateria.
- Preparação (EPA): **fita isolante nos terminais** (qualquer fita não metálica serve, mas a isolante é a preferida) **ou** cada bateria num saquinho plástico separado. Nunca no lixo comum nem na coleta seletiva. Bateria estufada: não perfure, não carregue, não aperte.

### 2b. Chumbo-ácido (automotiva)

**Substâncias**: chumbo e compostos de chumbo, e **ácido sulfúrico**. Composição média: 52% chumbo, 30% solução ácida, 6% plástico (IBER, reproduzido pelo MMA). Segundo a EPA, uma bateria pode ter até 18 lb (≈8,2 kg) de chumbo e cerca de 1 galão (≈3,8 L) de ácido sulfúrico corrosivo.

**Risco em casa**: vazamento de ácido (queimadura) e chumbo, que é neurotóxico (OMS). É **resíduo perigoso Classe I** (MMA/IBER). Risco de fogo baixo fora do uso. Hidrogênio na recarga é conhecimento técnico geral, mas não achei fonte primária nesta pesquisa.

**Descarte correto**: devolver na **loja ou oficina onde trocou a bateria** (CONAMA 401, art. 4º; acordo setorial IBER). Por lei, não pode ir para aterro nem incinerador (CONAMA 401, art. 10). Transporte em pé, sem tombar, sem retirar o ácido (o art. 11 restringe o transporte de bateria sem eletrólito).

**Fatos quantitativos (baterias)**

| Frase (PT-BR) | Número | Fonte | URL | Confiança |
|---|---|---|---|---|
| "A bateria de lítio de um celular contém cerca de 3,5 g de cobalto." | 3,5 g Co | UNEP/Umicore, *Recycling: From E-waste to Resources*, 2009, p. 7 | https://www.nswai.org/docs/Recycling_From_e-waste_to_resources.pdf | primária (PDF lido) |
| "Uma bateria de notebook tem cerca de 65 g de cobalto." | 65 g Co | UNEP 2009, figura 2 | idem | primária |
| "Baterias de chumbo-ácido têm potencial de reciclagem de 99%." | 99% | IBER, via MMA, Panorama 2024 | link Panorama | primária (entidade setorial) |
| "Uma bateria de carro é cerca de 52% chumbo, 30% solução ácida e 6% plástico." | 52/30/6% do peso | IBER via MMA | idem | primária |
| "Uma bateria automotiva pesa em média 18 kg." | 18 kg (peso médio usado pelo IBER) | Relatório anual IBER 2024 (publicado no SINIR) | https://portal-api.sinir.gov.br/wp-content/uploads/2026/02/Relatorio_Anual_MMA_2024_oficial_final.pdf | primária |
| "Em 2024, 353 mil toneladas de baterias de chumbo-ácido tiveram destinação correta verificada no Brasil." | 353.215 t (2024) | Relatório IBER 2024 | idem | primária |
| "Meta de recolhimento de baterias chumbo-ácido no Brasil: 85% (2022)." | 60% (2019) → 85% (2022), Brasil | Acordo Setorial, tabela 3 do relatório IBER | idem | primária |
| "Uma bateria de chumbo-ácido pode ter até 8 kg de chumbo." | até 18 lb ≈ 8,2 kg (cálculo próprio) | EPA | https://www.epa.gov/recycle/used-household-batteries | primária |
| "Cerca de 245 incêndios em instalações de lixo nos EUA (2013–2020) foram ligados a baterias de lítio." | ≈245 incêndios, 64 instalações | EPA 2021 | link acima | primária (via trecho) |

---

## 3. Celulares

**Substâncias**: mais de 40 elementos da tabela periódica. Metais são em média 23% do peso do aparelho (a maior parte é cobre), e o resto é plástico e cerâmica (UNEP 2009). Inclui ouro, prata, paládio, cobre, estanho, cobalto e índio, além de retardantes de chama bromados e solda com chumbo em aparelhos antigos (o GEM 2024 trata BFR e chumbo de forma genérica). A bateria de Li-íon é o principal risco de fogo.

**Risco de guardar em casa**: bateria envelhecida pode **estufar** e pegar fogo (ver 2a). Também há exposição de dados pessoais se o aparelho for perdido ou repassado.

**Descarte correto**
- Fluxo: **eletroeletrônicos** (Decreto 10.240; ABREE / Green Eletron). Lojas de operadoras e varejistas costumam ter coletor.
- Preparação: **fazer backup e restaurar o aparelho para as configurações de fábrica** (o art. 31 do Decreto 10.240 obriga o consumidor a remover os dados); tirar chip e cartão de memória; sair das contas (Google/Apple) para liberar o bloqueio; entregar desligado. Se a bateria estiver estufada, ponha num saquinho e avise no ponto. Não force a abertura.

**Fatos quantitativos**

| Frase (PT-BR) | Número | Fonte | URL | Confiança |
|---|---|---|---|---|
| "Um celular tem em média 250 mg de prata, 24 mg de ouro, 9 mg de paládio e 9 g de cobre." | Ag 250 mg; Au 24 mg; Pd 9 mg; Cu 9 g por aparelho | UNEP/Umicore 2009, p. 7 | https://www.nswai.org/docs/Recycling_From_e-waste_to_resources.pdf | primária (dados de 2007–2008) |
| "Uma tonelada de celulares (sem bateria) contém cerca de 340 g de ouro, 3,5 kg de prata, 140 g de paládio e 130 kg de cobre." | por tonelada de aparelhos | UNEP 2009, p. 7 | idem | primária |
| "Metais são cerca de 23% do peso de um celular." | 23% | UNEP 2009 | idem | primária |
| "Para cada 1 milhão de celulares reciclados, dá para recuperar cerca de 16 t de cobre, 350 kg de prata, 34 kg de ouro e 15 kg de paládio." | 35.000 lb Cu, 772 lb Ag, 75 lb Au, 33 lb Pd (conversão própria para kg) | EPA (estimativa USGS de 2006) | https://www.epa.gov/recycle/electronics-donation-and-recycling | primária (estimativa antiga) |
| "Produzir 1 tonelada de ouro de mineração emite cerca de 17 mil toneladas de CO₂." | ≈16.991 t CO₂/t Au | UNEP 2009, fig. 3 (EcoInvent 2.0) | idem UNEP | primária. Dá uma derivação por aparelho: 24 mg Au × 17 kg CO₂/g ≈ 0,4 kg CO₂ evitados **só pelo ouro**, se todo o ouro for recuperado e substituir ouro de mina (cálculo próprio, otimista; usar com ressalva) |
| "72% dos brasileiros têm celular velho guardado." | 72% | Green Eletron 2021 | link acima | secundária |

---

## 4. Computadores e notebooks

**Substâncias**: placas com chumbo (solda antiga), retardantes de chama bromados nos plásticos, metais preciosos. Monitores LCD antigos e telas de notebooks com backlight CCFL (fabricados até cerca de 2009–2010) têm **mercúrio**, até cerca de 5 mg por lâmpada de backlight (relatório final de pesquisa financiada pela EPA/NCER). O notebook tem bateria de Li-íon (risco de fogo, ver 2a).

**Risco em casa**: bateria do notebook estufada (tampa ou touchpad levantando) é sinal de perigo. Dados pessoais no disco.

**Descarte correto**
- Fluxo: **eletroeletrônicos** (Decreto 10.240: notebook, tablet, monitor, impressora, roteador estão no Anexo I).
- Preparação: backup; **apagar o disco** (formatar ou usar a função de reset do sistema; retirar o HD/SSD se preferir); entregar desligado e com a bateria no lugar, se for embutida. Bateria removível estufada vai no saco plástico com fita nos terminais.

**Fatos quantitativos**

| Frase (PT-BR) | Número | Fonte | URL | Confiança |
|---|---|---|---|---|
| "Um PC ou notebook tem em média cerca de 1 g de prata, 220 mg de ouro, 80 mg de paládio e 500 g de cobre." | Ag 1.000 mg; Au 220 mg; Pd 80 mg; Cu 500 g por unidade | UNEP/Umicore 2009, fig. 2 | link UNEP | primária (média de 2007) |
| "Um computador de mesa tem cerca de 6 kg de ferro e aço." | ≈6 kg Fe/aço | UNEP 2009, p. 7 | idem | primária |
| "Reciclar 1 milhão de notebooks economiza a energia que mais de 3.500 casas americanas usam em um ano." | 3.500 casas/ano por 1 milhão de laptops | EPA (estimativa USGS 2006) | https://www.epa.gov/recycle/electronics-donation-and-recycling | primária (antiga; casas dos EUA, não do Brasil) |
| "Cada lâmpada de backlight de um monitor LCD antigo pode ter até 5 mg de mercúrio." | até 5 mg Hg por lâmpada CCFL | EPA NCER, relatório final de projeto | https://cfpub.epa.gov/ncer_abstracts/index.cfm/fuseaction/display.abstractDetail/abstract_id/9847/report/F | primária (pesquisa) |
| Impacto em CO₂ por notebook reciclado | **Sem número primário confiável por unidade.** | | | |

---

## 5. Geladeiras e linha branca

**Substâncias**
- **Gás refrigerante** do circuito: em aparelhos antigos, CFC-12 (destrói a camada de ozônio; GWP 10.900); depois HFC-134a (GWP 1.430); nos mais novos, hidrocarbonetos de baixo GWP (< 25, inflamáveis, como isobutano).
- **Agente expansor da espuma isolante** nas paredes: CFC-11 (GWP 4.750) nos antigos, depois HCFC-141b (GWP 725), HFC-245fa (GWP 1.030) e hidrocarbonetos.
- Também óleo do compressor, interruptores de mercúrio e PCBs em aparelhos antigos.
- Fonte (gases e GWPs): EPA, *The Benefits of EPA's RAD Program* (2020), https://www.epa.gov/system/files/documents/2022-05/RAD_Communicating_RAD_Program_Benefits_2020.pdf. Confiança: primária (PDF lido). Os GWPs são de 100 anos, do IPCC AR4.
- Brasil: a CONAMA 267/2000 restringiu a importação de CFC-12 e zerou o volume até 2007. A CONAMA 340/2003 manda enviar o CFC-12 recolhido a centros de regeneração licenciados. O MMA lista CFC-11 e HCFC-141b como agentes de espuma e CFC-12 e HFC-134a como fluidos que exigem destinação final (https://www.gov.br/mma/pt-br/assuntos/mudanca-do-clima/ozonio/folder-bra14g72-_final.pdf). Confiança: primária (via trecho). **Não verifiquei** qual fração das geladeiras brasileiras atuais usa R-600a nem a carga típica em gramas.

**Risco de guardar em casa**: baixo risco tóxico imediato. Geladeira parada ocupa espaço e pode virar criadouro de mosquito (sem fonte primária aqui). Criança pode ficar presa num modelo antigo com trava mecânica (conhecimento geral, sem fonte nesta pesquisa). O dano maior vem do **descarte errado**: cortar a tubulação ou triturar a espuma libera os gases.

**Descarte correto**
- Fluxo: **eletroeletrônicos** (Decreto 10.240: refrigerador, micro-ondas e máquina de lavar estão no Anexo I). Por ser volumosa, normalmente é preciso agendar a coleta com o varejista na compra do aparelho novo ou com a entidade gestora (ABREE). Em BH, as URPVs **não** recebem eletroeletrônicos.
- Preparação: esvaziar, descongelar e secar; fechar a porta com fita; **não cortar canos, não retirar o compressor, não "vender o motor"**, porque isso solta o gás. Transportar em pé.

**Fatos quantitativos**

| Frase (PT-BR) | Número | Fonte | URL | Confiança |
|---|---|---|---|---|
| "O gás CFC-12 de geladeiras antigas aquece o planeta 10.900 vezes mais que o CO₂." | GWP100 = 10.900 | EPA RAD 2020 (IPCC AR4) | link RAD | primária |
| "O CFC-11 da espuma isolante tem poder de aquecimento 4.750 vezes maior que o CO₂." | GWP100 = 4.750 | idem | idem | primária |
| "O HFC-134a, usado depois do CFC, ainda tem GWP de 1.430." | 1.430 | idem | idem | primária |
| "Descartar corretamente uma geladeira antiga (com CFC) evita a emissão de cerca de 3,9 toneladas de CO₂ equivalente, só pelo gás e pela espuma." | Por 1.000 geladeiras com mais de 20 anos: gás refrigerante 1.940 t CO₂e + espuma 1.920 t CO₂e → ≈3,86 t CO₂e por unidade (cálculo próprio) | EPA RAD 2020, tabela "1,000 Old Refrigerators" | idem | primária. **Vale só para aparelho com CFC-12/CFC-11** (antigos, fabricados aproximadamente antes dos anos 2000). Não use para geladeira nova. |
| "Reciclar 1.000 geladeiras antigas evita 8.279 t CO₂e no total." | 8.279 t CO₂e por 1.000 (≈8,3 t por unidade) | EPA RAD 2020 | idem | primária. Inclui 4.260 t de energia economizada por tirar o aparelho velho de uso (supõe 854 kWh/ano e 6,71 anos de vida restante, na rede elétrica dos EUA). **Não aplicar** à rede brasileira, que é mais limpa. Prefira o número de 3,9 t acima. |
| "Em média, recuperam-se cerca de 170 g de gás refrigerante e 260 g de agente da espuma por geladeira." | 0,37 lb gás; 0,58 lb agente expansor (cálculo próprio em gramas) | EPA RAD Annual Report 2007 | https://www.epa.gov/sites/default/files/documents/RAD_2007_Annual_Report.pdf | primária (via trecho; dado antigo dos EUA) |
| "De 2006 a 2021, o programa RAD da EPA reciclou 9,4 milhões de aparelhos e evitou 40,3 milhões de t CO₂e." | 9,4 mi aparelhos; 40,3 Mt CO₂e; 1,28 bi lb de metal | EPA RAD 2020/2021 | link RAD | primária |

---

## 6. TVs e monitores

### CRT (tubo)
- **Chumbo** no vidro do tubo: "TVs e monitores coloridos contêm em média quatro libras de chumbo" (≈1,8 kg), conforme o tamanho e o modelo (EPA, https://www.epa.gov/hw/final-rule-streamlined-management-requirements-recycling-used-cathode-ray-tubes-crts-and-glass). Confiança: primária.
- O vidro pode ter até 25% de chumbo, e um aparelho pode ter de 15 a 90 lb de vidro (release antigo da EPA). Confiança: primária, porém antiga.
- Risco em casa: o tubo é de vácuo e pode implodir se quebrar. Isso é conhecimento técnico, sem fonte primária localizada nesta pesquisa. Não abrir.

### LCD / LED
- LCD fabricado até cerca de 2009 usa backlight CCFL com **mercúrio**, até 5 mg por lâmpada (EPA NCER). Telas com backlight de LED não têm mercúrio, segundo a Sony e a Purdue. Confiança: primária/secundária.
- As duas ainda têm placas com metais, possível solda com chumbo e plásticos com BFR (GEM 2024, de forma genérica).

**Descarte correto**: fluxo de **eletroeletrônicos** (Decreto 10.240: TV e monitor estão no Anexo I). Transporte sem quebrar a tela. **Não desmontar** o CRT nem o backlight do LCD.

**Fatos quantitativos**

| Frase (PT-BR) | Número | Fonte | URL | Confiança |
|---|---|---|---|---|
| "Uma TV ou monitor de tubo tem em média 1,8 kg de chumbo." | 4 lb ≈ 1,8 kg Pb | EPA | link acima | primária |
| "Telas LCD antigas podem ter até 5 mg de mercúrio em cada lâmpada interna." | ≤ 5 mg Hg por CCFL | EPA NCER | link NCER | primária (pesquisa) |
| Impacto em CO₂ por TV reciclada | **Sem número primário por unidade.** | | | |

---

## 7. Lâmpadas

### Fluorescentes (compacta e tubular)
- **Mercúrio**. Segundo a ENERGY STAR (EPA), uma CFL tem em média 4 mg de Hg (https://www.energystar.gov/sites/default/files/asset/document/Fact_Sheet_Mercury.pdf). A EPA também diz que é "menos de 1/100 do mercúrio de um termômetro" (https://www.epa.gov/cfl/cleaning-broken-cfl). Um artigo NEMA/ACEEE de 2008 informa que CFLs antigas tinham de 5 a 8 mg, e que as tubulares tinham média estimada de 3 a 4 mg. Confiança: primária/secundária.
- Limites da Convenção de Minamata (Anexo A), reproduzidos no relatório Reciclus 2022: CFL com mais de 5 mg por queimador; tubular trifósforo com menos de 60 W e mais de 5 mg; tubular de halofosfato com até 40 W e mais de 10 mg (https://portal-api.sinir.gov.br/wp-content/uploads/2024/09/Relatorio_RECICLUS_2022___Ano_6.pdf). Confiança: primária (via trecho). São **limites** legais, não o conteúdo típico de cada lâmpada.
- **Risco em casa (lâmpada quebrada)**, conforme a EPA: tire pessoas e animais do cômodo; **ventile por 5 a 10 minutos**; desligue o ar-condicionado ou o aquecimento central; **não use aspirador** (só no fim, se sobrar vidro, com a janela aberta); recolha com papelão e fita adesiva; limpe com pano úmido; guarde tudo em pote de vidro com tampa ou saco fechado e leve para fora; lave as mãos; mantenha o cômodo arejado por algumas horas. Confiança: primária.
- Contexto: a Convenção de Minamata decidiu eliminar as CFLs até o fim de 2025 (COP4, 2022) e as fluorescentes tubulares até 2027 (COP5, 2023). Fonte: CLASP (https://www.clasp.ngo/updates/cop5-decision/). Confiança: secundária (ONG); a decisão oficial está no site da Convenção.

### LED
- Sem mercúrio. Tem componentes eletrônicos (chips e metais). **Não está no acordo setorial da Reciclus**, que cobre só fluorescentes, vapor de sódio e mercúrio, e luz mista. O Decreto 10.240 exclui "lâmpadas não integrantes". Por isso, **não há um fluxo nacional obrigatório claro para lâmpada LED solta**: alguns varejistas e prefeituras recebem. Confiança: primária (escopo dos instrumentos); a lacuna é uma conclusão minha.

**Descarte correto (fluorescente)**: **Programa Reciclus**. O ponto mais próximo aparece no site da Reciclus pelo CEP. Para consumidor doméstico, não há custo nem limite (secundária). Preparação: **não quebrar**; levar na embalagem original ou embrulhada em jornal ou papelão; tubular inteira, sem fita no vidro inteiro.
**Destino do mercúrio**: segundo a Reciclus via MMA, vidro e pó fosfórico vão para cerâmica, metais para fundição, plástico é granulado, e o **mercúrio vai para aterro Classe I**. Não diga ao usuário que o mercúrio é "reciclado".

**Fatos quantitativos**

| Frase (PT-BR) | Número | Fonte | URL | Confiança |
|---|---|---|---|---|
| "Uma lâmpada fluorescente compacta tem, em média, cerca de 4 mg de mercúrio." | 4 mg Hg | ENERGY STAR (EPA) | link acima | primária |
| "A quantidade é menos de 1% do mercúrio de um termômetro antigo." | < 1/100 | EPA | https://www.epa.gov/cfl/cleaning-broken-cfl | primária |
| "De 2017 a meados de 2024, o Programa Reciclus deu destino correto a quase 40 milhões de lâmpadas." | 39,9 milhões de unidades | Reciclus via imprensa | https://abcdoabc.com.br/quase-40-milhoes-de-lampadas-fluorescentes-tiveram-descarte-adequado-no-brasil/ | secundária |
| "Minas Gerais tem 365 pontos Reciclus em 182 municípios." | 365 pontos; 182 municípios (meta de +250 em 2026) | Diário do Comércio | https://diariodocomercio.com.br/negocios/reciclus-expande-pontos-coleta-lampadas-minas-gerais/ | secundária |
| Pontos Reciclus no país | 2.520 / 3.873 / 3.878 (números conflitantes por data) | eCycle, FIEPR | — | duvidosa; use "milhares de pontos" ou consulte o site |
| "Ao reciclar 1 lâmpada, você evita que ~4 mg de mercúrio cheguem ao solo/ar" | 4 mg | derivado de ENERGY STAR | — | aceitável como "até ~4 mg" (média de CFL). Não multiplique por litros de água. |

---

## 8. Cabos e carregadores

**Substâncias**: cobre (condutor); capa de PVC (pode ter aditivos de chumbo em cabos antigos, sem fonte quantitativa encontrada); retardantes de chama bromados em carcaças. Carregadores têm placa eletrônica. **Power banks são baterias de lítio** e entram na categoria 2a.

**Riscos**: guardar em casa é de baixo risco. Carregadores danificados podem aquecer (sem fonte primária localizada). O dano maior é a **queima a céu aberto de cabos para tirar o cobre**: a OMS aponta a queima e o aquecimento a céu aberto como "as atividades mais perigosas, por causa da fumaça tóxica", que inclui dioxinas, e diz que crianças e gestantes são as mais vulneráveis (https://www.who.int/news-room/fact-sheets/detail/electronic-waste-(e-waste)). Confiança: primária (genérica, sem quantidade por cabo).

**Descarte correto**: fluxo de **eletroeletrônicos** (o Anexo I do Decreto 10.240 lista carregadores, cabos, power banks, fones e controles). Preparação: enrolar e prender com elástico ou fita; separar power bank e baterias com fita nos terminais.

**Fatos quantitativos**

| Frase (PT-BR) | Número | Fonte | URL | Confiança |
|---|---|---|---|---|
| "Reciclar 1 kg de alumínio usa 1/10 da energia da produção primária e evita 2 kg de CO₂." | ≤ 10% da energia; 2 kg CO₂/kg Al | UNEP 2009, p. 8 | link UNEP | primária (vale para o alumínio, não diretamente para o cabo) |
| "A produção primária de cobre emite cerca de 3,4 t de CO₂ por tonelada." | 3,4 t CO₂/t Cu | UNEP 2009, fig. 3 | idem | primária. **Não achei** a massa típica de cobre por cabo ou carregador, então não há número por unidade. |
| "A queima de cabos libera fumaça tóxica." | qualitativo | OMS | link OMS | primária |

---

## 9. Belo Horizonte (contexto; os pontos do app são fictícios)

| Fato | Fonte | URL | Confiança |
|---|---|---|---|
| A SLU **não recolhe** eletroeletrônicos na coleta domiciliar. "Lâmpadas, pilhas e baterias, assim como eletroeletrônicos, devem ser objetos de logística reversa." | SLU, Perguntas frequentes | https://prefeitura.pbh.gov.br/slu/perguntas-frequentes | primária |
| "A coleta de eletrônicos não é responsabilidade da SLU", embora a SLU incentive o descarte correto (out. 2021) | PBH, notícia | https://prefeitura.pbh.gov.br/noticias/prefeitura-de-bh-apoia-acao-para-recebimento-de-residuos-eletronicos | primária |
| BH tem **35 URPVs** (Unidades de Recebimento de Pequenos Volumes) em todas as regionais. Elas recebem até 1 m³/dia de entulho, poda, móveis velhos, madeira, pneus e metais. **Não recebem** "eletroeletrônicos, pilhas, baterias, lâmpadas", resíduos tóxicos, lixo doméstico etc. Funcionam de segunda a sexta, das 7h às 18h, e no fim de semana das 7h40 às 16h. | SLU, BH Cidade Limpa; notícia de jan. 2025 | https://prefeitura.pbh.gov.br/slu/bh-cidade-limpa ; https://prefeitura.pbh.gov.br/noticias/urpvs-da-prefeitura-sao-alternativas-corretas-aos-bota-fora-irregulares-em-bh | primária |
| Pilhas e baterias **não** vão na coleta seletiva ponto a ponto. É proibido depositar materiais tóxicos nos contêineres. | SLU | https://prefeitura.pbh.gov.br/slu/bh-cidade-limpa | primária |
| A SLU orienta procurar lojas e "pontos de recolhimento gratuito" de pilhas, baterias, lâmpadas, eletrodomésticos e informática na página de produtos eletrônicos. | SLU | https://prefeitura.pbh.gov.br/slu/informacoes/descarte/outros-materiais-produtos_eletronicos | primária (link citado pela SLU; a página não foi aberta) |
| Em out. 2021 houve o drive-thru da ABREE ("Mês do Descarte Consciente") em 3 locais de BH, com SLU, governo de MG e MMA, incluindo o Centro Mineiro de Referência em Resíduos (Esplanada). | PBH | link da notícia de 2021 acima | primária |
| A Câmara Municipal debateu pontos de coleta de informática em dez. 2024, sem confirmação de implantação. | CMBH | https://www.cmbh.mg.gov.br/print/comunica%C3%A7%C3%A3o/not%C3%ADcias/2024/12/bh-pode-ter-pontos-de-coleta-de-materiais-de-inform%C3%A1tica-descartados | secundária |

**Implicação para o app**: um ponto fictício chamado "URPV" não deve aceitar eletrônicos, porque isso contradiz a realidade de BH. Prefira nomes como "Ponto de Entrega Voluntária (PEV)", "loja parceira" ou "ecoponto da entidade gestora".

---

## 10. Escala de perigo proposta (1–5)

**Critérios**
- **T (toxicidade, 0–3)**: 0 = nada relevante; 1 = substâncias encapsuladas ou de baixa toxicidade, ou risco só corrosivo e local; 2 = metais pesados ou gases nocivos em pequena quantidade ou bem encapsulados; 3 = grande massa de metal tóxico (Pb/Hg) ou liberação fácil na casa ou no ambiente.
- **F (fogo/explosão, 0–2)**: 0 = desprezível; 1 = possível mas incomum (curto-circuito, gás inflamável em circuito fechado, implosão); 2 = alto (fuga térmica de lítio, sobretudo se danificado ou estufado).
- **Nível = T + F**, limitado a 1–5.

| Categoria | T | F | Nível | Justificativa (1 linha) |
|---|---|---|---|---|
| Pilhas comuns/alcalinas | 1 | 1 | **2** | Hg/Cd/Pb limitados a traços por lei; o risco real é o vazamento de KOH corrosivo, e pilhas de 9 V podem dar curto. |
| Baterias de lítio (celular/notebook/power bank) | 2 | 2 | **4–5 (usar 5)** | Fuga térmica e incêndio mesmo "descarregada" (EPA), mais Co/Ni e eletrólito inflamável. Bateria estufada é o item mais perigoso de guardar em casa. Arredondei para 5 pelo risco de fogo. |
| Bateria chumbo-ácido (automotiva) | 3 | 1 | **4** | Até ~8 kg de chumbo e ~3,8 L de ácido sulfúrico (EPA), resíduo Classe I; o risco de fogo fora de uso é baixo. |
| Celulares | 2 | 2 | **4** | Bateria de Li-íon embutida (principal causa de incêndios em instalações de resíduos, segundo a EPA) e metais e BFR em pequena quantidade. |
| Computadores/Notebooks | 2 | 2 (notebook) / 0 (desktop) | **4** (notebook) / **2** (desktop) | Bateria de Li-íon maior no notebook; chumbo na solda, BFR e mercúrio em telas CCFL antigas. |
| Geladeiras e linha branca | 2 | 1 | **3** | CFC/HFC com GWP de 1.430 a 10.900 liberados se a tubulação ou a espuma forem rompidas; os modelos novos usam hidrocarboneto inflamável. Pouco risco tóxico para o morador. |
| TV/monitor CRT | 3 | 1 | **4** | ~1,8 kg de chumbo no vidro (EPA) e tubo de vácuo que pode implodir se quebrar. |
| TV/monitor LCD com CCFL (≈ até 2009) | 2 | 0 | **2** | Até 5 mg de Hg por lâmpada de backlight, só liberado se desmontado ou quebrado. |
| TV/monitor LED | 1 | 0 | **1** | Sem mercúrio; metais e BFR encapsulados na placa. |
| Lâmpada fluorescente | 3 | 0 | **3** | ~4 mg de Hg que vira **vapor dentro de casa** na hora em que a lâmpada quebra, com protocolo de limpeza da EPA. Quantidade pequena, mas a exposição é direta. |
| Lâmpada LED | 1 | 0 | **1** | Sem mercúrio; só componentes eletrônicos. |
| Cabos e carregadores | 1 | 0 | **1** | Baixo risco em casa; o dano vem da queima de cabos para tirar cobre (OMS). **Power bank = lítio → nível 5.** |

Se o app mostrar **um número por categoria**: Pilhas 2 · Baterias 5 · Celulares 4 · Computadores/Notebooks 4 · Geladeiras 3 · TVs/Monitores 4 (pelo CRT; mostrar 1–2 para LED/LCD) · Lâmpadas 3 (fluorescente; LED = 1) · Cabos/Carregadores 1.

---

## 11. Claims to avoid (não usar ou usar com ressalva)

1. **"1 pilha contamina 20 mil litros de água"** (e as variações "600 mil litros" para pilha-botão, "1 milhão de litros", "contamina o solo por 50 anos"). Não achei estudo primário nem checagem. Os números variam de 1.000 a 600.000 litros conforme o site. O estudo da SBQ só mostra que pilhas liberam metais em água em laboratório, sem volume por pilha. **Duvidosa.** Alternativa: "Pilhas vazam substâncias corrosivas e metais que não devem ir para o solo nem para a água."
2. **"O Brasil é o 5º maior produtor de lixo eletrônico do mundo."** O GEM não publica ranking oficial. A posição é derivada por terceiros, embora o MMA repita a frase no Panorama 2024. Prefira "2º maior das Américas, atrás dos EUA" (ITU). **Secundária/derivada.**
3. **"Desperdiçamos 7% do ouro do mundo"** (MMA, Panorama 2024, sem estudo citado). A versão que circula internacionalmente é "até 7% do ouro do mundo pode estar contido no lixo eletrônico", que é diferente de "desperdiçado". **Duvidosa na formulação.**
4. **"75% de toda a energia da indústria vai para extração e refino de matéria-prima"** (atribuída à Ellen MacArthur Foundation pelo MMA). Não verifiquei a fonte original. **Duvidosa.**
5. **"Brasil recicla só 3%"** sem fonte nem ano. O número correto e citável é "3% documentado como coletado formalmente em 2022 (Global E-waste Monitor 2024)". A ABREE fala em ~10% em outro recorte, então não misture as fontes.
6. **"41 milhões de toneladas de refrigerantes recapturados"**: leitura truncada de um resumo da UNITAR. Não confirmei no relatório. **Não usar.**
7. **"O mercúrio das lâmpadas é reciclado e reaproveitado."** Segundo a Reciclus/MMA, o mercúrio vai para aterro Classe I. Diga "é separado e isolado com segurança".
8. **"TV de LED/LCD não tem nada tóxico."** LCDs com CCFL (até cerca de 2009) têm mercúrio, e todas as telas têm placas com metais e BFR.
9. **"Pilha alcalina pode ir no lixo comum"** (orientação da EPA para os EUA). No Brasil, pilhas estão na logística reversa obrigatória: oriente sempre o ponto de coleta.
10. **Aplicar o "8,3 t CO₂e por geladeira" da EPA a qualquer geladeira.** Esse número supõe aparelho com mais de 20 anos, com CFC, e inclui economia de energia na rede dos EUA. Para geladeiras brasileiras novas (HFC ou hidrocarboneto), o benefício climático por unidade é muito menor, e não tenho número.
11. **Números da EPA para "1 milhão de celulares"** são estimativa do USGS de 2006, com aparelhos antigos. Use "estimativa" e evite precisão falsa por unidade (por exemplo, "você recuperou 0,034 g de ouro").
12. **"1 litro de óleo contamina 25 mil litros de água"** (Sabesp, citada pelo MMA). Não é tema de e-waste e é do mesmo tipo de afirmação viral. Não reaproveitar como modelo para pilhas.
13. **Número de pontos Reciclus/ABREE** ("2.520", "3.873", "~7 mil pontos em 1.500 municípios"): variam por data e fonte. Use "milhares de pontos no país" ou cite o ano.

---

## 12. Lacunas (categorias sem bom número de impacto por unidade)

- **Pilhas**: não há impacto por pilha com base primária. Use números de massa e de lei (limites da CONAMA, 2–20 ml de KOH) e números agregados.
- **Cabos e carregadores**: falta a massa de cobre por cabo ou carregador e o CO₂ por unidade. Só existe o fator do cobre primário (3,4 t CO₂/t, UNEP 2009).
- **TVs/monitores LCD/LED e notebooks**: não há CO₂ ou energia por unidade com fonte primária. Há conteúdo de metais (UNEP) e de chumbo (CRT, EPA).
- **Geladeiras modernas (R-600a/HFC)**: não há carga típica em gramas nem CO₂e por unidade para o mercado brasileiro. O número de 3,9 t CO₂e da EPA vale só para aparelhos com CFC.
- **Celulares**: é a categoria com melhores dados por unidade (UNEP 2009: mg de Au/Ag/Pd, g de Cu e Co), mas eles são de 2007–2009.
- **Baterias chumbo-ácido**: bons dados (composição, 99% recicláveis, 18 kg em média, até 8 kg de Pb).
- **Lâmpadas fluorescentes**: bom dado por unidade (≈4 mg de Hg).
