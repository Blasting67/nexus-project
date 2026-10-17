/* ------------------------------------------------------------------ */
/* Contenido del módulo Blockchain y criptomonedas (tarjetas 1 a 9)    */
/* ------------------------------------------------------------------ */

import type { BcIconKey } from './BlockchainIcons'
import type { BlockchainToneKey } from './BlockchainCard'

/* Tarjeta 1: ¿Qué es Blockchain? */
export const WHAT_IS = {
  definitionTitle: 'Definición',
  definition: 'Blockchain parte de un registro digital distribuido, que entenderemos como un ecosistema tecnológico.',
  ecosystem: ['redes', 'nodos', 'protocolos de consenso', 'contratos inteligentes', 'criptoactivos', 'herramientas de interoperabilidad'],
  purpose: 'permiten registrar, validar y asegurar transacciones digitales sin necesidad de una autoridad central.',
  analogyTitle: 'Analogía',
  analogy: 'Es un cuaderno de apuntes que está copiado en miles de computadoras.',
  detail:
    'Cada vez que alguien anota algo (una transacción), todas las copias se actualizan. Si alguien intenta borrar o cambiar una página, las otras copias lo detectan.',
  hashTitle: 'Cada bloque tiene su hash',
  hashText: 'Es un identificador único del bloque. Cada bloque guarda el hash del anterior, así quedan encadenados.',
  usesTitle: '¿Para qué sirve?',
  uses: ['Enviar dinero sin bancos', 'Registrar propiedades sin notarios', 'Rastrear el origen de productos'],
}

/* Tarjeta 3: Conceptos básicos */
export interface Concept {
  id: string
  name: string
  meaning: string // frase corta
  detail: string // definición
  note?: string // dato adicional
  icon: BcIconKey
}

export const CONCEPTS: Concept[] = [
  {
    id: 'red',
    name: 'Redes',
    meaning: 'Conjunto de participantes',
    detail:
      'Conjunto de participantes que interactúan dentro de un mismo sistema blockchain y que operan bajo reglas criptográficas y protocolos.',
    icon: 'network',
  },
  {
    id: 'nodo',
    name: 'Nodos',
    meaning: 'Los árbitros de la red',
    detail:
      'Dispositivos o computadoras conectadas a la red que ejecutan el software del protocolo. Almacenan, validan y mantienen una copia del libro público de transacciones (ledger): dictan si las transacciones son válidas, verifican los bloques y transmiten información a otros nodos. Son los árbitros de la red.',
    note: 'No todos los nodos liberan bloques.',
    icon: 'node',
  },
  {
    id: 'minero',
    name: 'Minero',
    meaning: 'Nodo que compite por el siguiente bloque',
    detail:
      'Tipo especial de nodo que agrupa transacciones y compite por crear el siguiente bloque resolviendo un problema criptográfico (hash puzzle). El primero que lo logra publica el bloque a la red.',
    note: 'Si hay una discrepancia, esa publicación no es válida y la red la rechaza.',
    icon: 'miner',
  },
  {
    id: 'consenso',
    name: 'Protocolos de consenso',
    meaning: 'Reglas para ponerse de acuerdo',
    detail:
      'Conjunto de reglas y mecanismos algorítmicos que permiten a los nodos de la red ponerse de acuerdo sobre qué transacciones son válidas y en qué orden deben registrarse.',
    icon: 'consensus',
  },
  {
    id: 'contrato',
    name: 'Contratos inteligentes',
    meaning: 'Programas que se ejecutan solos',
    detail:
      'Programas autoejecutables almacenados en la blockchain que automatizan acuerdos, procesos o aplicaciones cuando se cumplen determinadas condiciones.',
    icon: 'contract',
  },
  {
    id: 'criptoactivo',
    name: 'Criptoactivos',
    meaning: 'Activos digitales de la red',
    detail:
      'Activos digitales que existen dentro del ecosistema blockchain, como criptomonedas y tokens, y que pueden representar valor económico, derechos de uso o funciones dentro de una red.',
    icon: 'asset',
  },
  {
    id: 'interoperabilidad',
    name: 'Interoperabilidad',
    meaning: 'Comunicación entre redes',
    detail:
      'Tecnologías y herramientas que permiten que diferentes redes blockchain puedan comunicarse, compartir información o transferir activos entre sí.',
    icon: 'bridge',
  },
]

/** Red, nodo y minero forman una jerarquía: cada uno está dentro del anterior. */
export const CONCEPT_HIERARCHY = ['red', 'nodo', 'minero']

/* Tarjeta 5: ¿Cómo se protege la información? */
export const PROTECTION = {
  intro:
    'Cada bloque de un ecosistema blockchain genera un hash criptográfico usando funciones matemáticas, y cada criptomoneda tiene su propia prueba de consenso según el ecosistema. La información se protege con tres mecanismos que trabajan juntos.',
  topics: [
    { id: 'hash', label: 'Hash', sub: 'La huella de cada bloque' },
    { id: 'chain', label: 'Orden de los bloques', sub: 'Encadenamiento criptográfico' },
    { id: 'signature', label: 'Integridad y firmas', sub: 'Clave pública y privada' },
  ],
  hash: {
    question: '¿Qué es un hash?',
    text: 'Se introduce a una "máquina" matemática una palabra, un archivo, una imagen o incluso un libro completo. Esa máquina lo convierte en una cadena de letras y números aparentemente aleatoria. Ese resultado es el hash.',
    inputs: ['Una palabra', 'Un archivo', 'Una imagen', 'Un libro completo'],
    machine: 'Función hash',
    machineSub: 'SHA-256',
    huella: 'Es como una huella digital: si cambias una letra del texto, la huella cambia por completo. Por eso es imposible alterar datos sin que se note.',
    properties: ['Misma entrada, mismo hash', 'Un cambio mínimo cambia todo el hash', 'Longitud fija: 64 caracteres con SHA-256'],
  },
  chain: {
    question: '¿Cómo se hace para que se respete el orden de los bloques?',
    text: 'El orden se respeta gracias al encadenamiento criptográfico: cada bloque contiene, dentro de su estructura, el hash del bloque anterior. Si alguien modificara un bloque anterior, su hash cambiaría y rompería toda la cadena posterior. Por eso el orden queda criptográficamente enlazado.',
    cost: 'Alterar un bloque implicaría rehacer todos los bloques posteriores, lo cual es computacionalmente inviable en redes grandes.',
  },
  signature: {
    question: '¿Qué impide que un nodo cambie una transacción y se la mande a sí mismo?',
    sub: 'Es decir, ¿cómo se asegura la integridad de los bloques?',
    text: 'La integridad se garantiza mediante firmas digitales y criptografía de clave pública. Cada transacción está firmada con la clave privada del dueño de los fondos.',
    verifyLabel: 'Cuando un nodo recibe una transacción:',
    verify: ['Verifica la firma digital', 'Usa la clave pública del emisor', 'Comprueba que la firma coincide con el mensaje'],
    rejected: 'Si alguien modifica la transacción (por ejemplo, cambia el destinatario), la firma deja de ser válida y los nodos de la red rechazan automáticamente la transacción.',
    ecdsa: 'Este mecanismo usa criptografía de curvas elípticas, como ECDSA (Elliptic Curve Digital Signature Algorithm).',
  },
}

/** Demostración del encadenamiento: cuatro bloques con transacciones sencillas (los hashes se calculan de verdad). */
export const CHAIN_BLOCKS = ['Ana → Luis · 2 BTC', 'Luis → Eva · 1 BTC', 'Eva → Marco · 0.5 BTC', 'Marco → Ana · 0.2 BTC']
export const CHAIN_ALTERED = 'Luis → Eva · 10 BTC'
export const CHAIN_STEPS = [
  { button: 'Alterar el bloque 2', text: 'Cada bloque guarda el hash del anterior, así el orden queda enlazado.' },
  { button: 'Recalcular el bloque 3', text: 'El hash del bloque 2 cambió, así que el bloque 3 ya no coincide: la cadena se rompe aquí.' },
  { button: 'Recalcular el bloque 4', text: 'Para disimularlo hay que recalcular el bloque 3, pero entonces cambia su hash y se rompe el enlace con el bloque 4.' },
  { button: 'Restaurar la cadena', text: 'La cadena vuelve a enlazar, pero hubo que rehacer todos los bloques posteriores. En una red grande, eso es computacionalmente inviable.' },
]

/* Tarjeta 4: Criptomonedas y tokens */
export const CRYPTO_TOKENS = {
  question: '¿Cuál es la diferencia entre criptoactivos y criptomonedas?',
  answer: 'El concepto de criptoactivo es mucho más amplio que el de criptomoneda.',
  familyTitle: 'Criptoactivos',
  family: [
    { id: 'crypto', name: 'Criptomonedas', note: 'Reserva de valor', highlight: true },
    { id: 'token', name: 'Tokens', note: 'Tienen una función', highlight: false },
    { id: 'stable', name: 'Stablecoins', note: '', highlight: false },
    { id: 'nft', name: 'NFTs', note: '', highlight: false },
    { id: 'tokenized', name: 'Activos tokenizados', note: '', highlight: false },
  ],
  crypto: {
    name: 'Criptomoneda',
    text: 'Reserva de valor (Bitcoin, Ethereum). No depende de un banquero, un banco ni de la política.',
    limit: 'Solo hay una cantidad específica de criptomonedas: no pueden crearse más.',
    active: 20000,
    activeLabel: 'criptomonedas activas en 2026',
  },
  token: {
    name: 'Token',
    text: 'Activo digital que, a diferencia de una criptomoneda, tiene una función específica.',
    rows: [
      { label: 'Función', value: 'Específica dentro de una red o aplicación' },
      { label: 'Dónde vive', value: 'Sobre otra blockchain' },
    ],
  },
  featuresTitle: 'Características de las criptomonedas',
  features: ['Emisión limitada', 'Descentralizadas', 'Sin intermediarios', 'No se pueden confiscar'],
}

/* Tarjeta 2: Carteras */
export const WALLETS_INTRO =
  'Las plataformas que permiten almacenar el valor de un criptoactivo se conocen como billeteras o carteras.'

export interface Wallet {
  id: string
  name: string
  summary: string
  rows: Array<{ label: string; value: string; risk?: boolean }>
  icon: BcIconKey
}

export const WALLETS: Wallet[] = [
  {
    id: 'hot',
    name: 'Caliente',
    summary: 'Sobre una plataforma o app',
    icon: 'phone',
    rows: [
      { label: 'Qué es', value: 'Billetera sobre una plataforma o app, como Bitso.' },
      { label: 'Riesgo', value: 'Como cualquier software, es susceptible a ataques o robo.', risk: true },
    ],
  },
  {
    id: 'cold',
    name: 'Fría',
    summary: 'Dispositivo físico',
    icon: 'usb',
    rows: [
      { label: 'Qué es', value: 'Dispositivo físico, como una unidad USB, donde también se pueden almacenar criptoactivos.' },
      { label: 'Acceso', value: 'Requiere al menos 12 palabras clave (estándar BIP-39) para acceder a la información.' },
      { label: 'Riesgo', value: 'Si se olvidan algunas de las palabras, no podrán recuperarse.', risk: true },
    ],
  },
  {
    id: 'exchange',
    name: 'Exchange',
    summary: 'Plataforma con más funciones',
    icon: 'bank',
    rows: [
      { label: 'Qué es', value: 'Además de guardar criptoactivos como una cartera caliente, permite otras funciones.' },
      { label: 'Incluye', value: 'Trading, lending y más.' },
      { label: 'Ejemplo', value: 'Binance.' },
    ],
  },
]

export const PLATFORMS: Array<{ name: string; tone: BlockchainToneKey }> = [
  { name: 'Binance', tone: 'amber' },
  { name: 'Coinbase', tone: 'sky' },
  { name: 'Metamask', tone: 'rose' },
  { name: 'Bitso', tone: 'emerald' },
  { name: 'Kraken', tone: 'violet' },
]

/* Tarjeta 6: Las 5 capas de Blockchain */
export interface Layer {
  id: string
  name: string
  label: string // nombre en inglés
  does: string
  includes: string[]
  example: string
  analogy: string
}

export const LAYERS: Layer[] = [
  {
    id: 'datos',
    name: 'Datos',
    label: 'Data layer',
    does: 'Es la base de la blockchain, donde se almacenan los datos de los bloques y las transacciones. Garantiza la integridad y la inmutabilidad de los datos.',
    includes: ['Estructura de bloques', 'Transacciones', 'Hashes criptográficos', 'Firmas digitales', 'Merkle Trees'],
    example: 'En Bitcoin, un bloque contiene: hash del bloque anterior, lista de transacciones, raíz de Merkle, timestamp y nonce.',
    analogy: 'El papel del cuaderno',
  },
  {
    id: 'red',
    name: 'Red',
    label: 'Network layer',
    does: 'Gestiona la comunicación entre nodos en una red peer-to-peer. Esta capa permite que la blockchain sea descentralizada.',
    includes: ['Propagación de transacciones', 'Propagación de bloques', 'Descubrimiento de nodos', 'Sincronización de la red'],
    example: 'En Ethereum, miles de nodos intercambian información constantemente para mantener el libro mayor actualizado.',
    analogy: 'Los mensajeros',
  },
  {
    id: 'consenso',
    name: 'Consenso',
    label: 'Consensus layer',
    does: 'Define cómo la red se pone de acuerdo sobre qué bloque es válido. Evita problemas como el doble gasto (double spending).',
    includes: ['Proof of Work', 'Proof of Stake', 'Delegated Proof of Stake', 'BFT (Byzantine Fault Tolerance)'],
    example: 'Bitcoin utiliza Proof of Work y Ethereum utiliza Proof of Stake.',
    analogy: 'La votación',
  },
  {
    id: 'incentivos',
    name: 'Incentivos',
    label: 'Incentive layer',
    does: 'Define las recompensas económicas que motivan a los participantes de la red. Mantiene segura la red económicamente.',
    includes: ['Recompensas por bloque', 'Tarifas de transacción', 'Penalizaciones'],
    example: 'Los mineros de Bitcoin reciben la recompensa del bloque y las comisiones de las transacciones.',
    analogy: 'El premio',
  },
  {
    id: 'aplicacion',
    name: 'Aplicación',
    label: 'Application layer',
    does: 'Es la capa donde los usuarios interactúan con la blockchain.',
    includes: ['dApps', 'Smart contracts', 'Wallets', 'Exchanges descentralizados', 'NFTs', 'DAOs'],
    example: 'Lenguajes y herramientas típicas: Solidity y MetaMask.',
    analogy: 'Las apps',
  },
]

/* Tarjeta 7: Estándares de redes */
export interface NetworkStandard {
  id: string
  label: string
  chain: string // blockchain en la que funciona
  glyph: string
  what: string
  meaning?: string
  examples: string[]
  traits: Array<{ text: string; kind: 'pro' | 'con' | 'info' }>
}

export const STANDARDS_INTRO =
  'Términos como ERC20, TRC20, BEP20 o BTC son comunes cuando se habla de blockchain: son estándares de redes o protocolos para mover criptoactivos. Indican en qué blockchain (en qué red) se usa un criptoactivo y cómo se envían las operaciones.'

export const STANDARDS: NetworkStandard[] = [
  {
    id: 'erc20',
    label: 'ERC20',
    chain: 'Ethereum',
    glyph: 'Ξ',
    what: 'Estándar de tokens que funciona en la blockchain de Ethereum.',
    meaning: 'ERC = Ethereum Request for Comment · 20 = número del estándar',
    examples: ['Tether (USDT ERC20)', 'USD Coin', 'Chainlink'],
    traits: [
      { text: 'Seguridad alta', kind: 'pro' },
      { text: 'Red muy usada', kind: 'pro' },
      { text: 'Comisiones (gas) normalmente más caras', kind: 'con' },
    ],
  },
  {
    id: 'trc20',
    label: 'TRC20',
    chain: 'TRON',
    glyph: 'T',
    what: 'Estándar de tokens que funciona en la blockchain de TRON.',
    examples: ['Tether (USDT TRC20)', 'BitTorrent (BTT)'],
    traits: [
      { text: 'Confirmaciones rápidas', kind: 'pro' },
      { text: 'Muy usado para enviar USDT entre exchanges', kind: 'pro' },
    ],
  },
  {
    id: 'bep20',
    label: 'BEP20',
    chain: 'BNB Smart Chain',
    glyph: 'B',
    what: 'Estándar de tokens de la BNB Smart Chain, creada por Binance.',
    examples: ['Tether (USDT BEP20)', 'Binance Coin (BNB)'],
    traits: [
      { text: 'Comisiones bajas', kind: 'pro' },
      { text: 'Compatible con muchas apps DeFi', kind: 'pro' },
      { text: 'Muy popular en el ecosistema de Binance', kind: 'pro' },
    ],
  },
  {
    id: 'btc',
    label: 'BTC',
    chain: 'Bitcoin',
    glyph: '₿',
    what: 'Es simplemente la red original de Bitcoin.',
    examples: [],
    traits: [
      { text: 'Blockchain más antigua', kind: 'info' },
      { text: 'Muy segura', kind: 'pro' },
      { text: 'No usa estándares de token como ERC20', kind: 'info' },
      { text: 'Las transacciones suelen ser más lentas que otras redes', kind: 'con' },
    ],
  },
]

export const STANDARDS_EXAMPLE = {
  title: 'Ejemplo práctico',
  text: 'Quieres enviar Tether (USDT) y puedes enviarlo por distintas redes: ERC20, TRC20 o BEP20. El USDT es el mismo valor, pero puede enviarse por diferentes ecosistemas blockchain.',
  question: '¿Hay dos estándares para Tether?',
  answer: 'Tether tiene más estándares; los más conocidos son ERC20 y TRC20.',
}

/* Tarjeta 8: Pruebas de consenso */
export type Rating = 1 | 2 | 3 | 4 | 5
export const RATING_LABEL = ['', 'Muy baja', 'Baja', 'Media', 'Alta', 'Muy alta']

export const CONSENSUS_INTRO = {
  text: 'Es el mecanismo que utilizan las redes blockchain para que todos los nodos de la red se pongan de acuerdo sobre cuál es el siguiente bloque válido que se agregará a la cadena.',
  mapTitle: 'Los cinco mecanismos más conocidos',
}

export const CONSENSUS_PROBLEMS = {
  lead: 'El consenso evita varios problemas críticos:',
  items: [
    { title: 'Doble gasto', english: 'Double spending', text: 'Evita que una misma criptomoneda se gaste dos veces.' },
    { title: 'Conflictos entre nodos', english: '', text: 'Todos los nodos deben tener la misma historia de transacciones.' },
    { title: 'Ataques maliciosos', english: '', text: 'Impide que un actor cambie bloques antiguos o falsifique transacciones.' },
    { title: 'Colisiones de bloques', english: '', text: 'Define qué bloque es válido si varios nodos proponen bloques al mismo tiempo.' },
  ],
}

export interface ConsensusMechanism {
  id: string
  name: string // abreviatura
  full: string // nombre completo en español
  english: string
  how: string // frase corta
  usedBy: string[]
  usedByNote?: string
  description: string
  stepsLabel: string
  steps: string[]
  ordered: boolean // pasos numerados o viñetas
  note?: string
  traits: Array<{ text: string; kind: 'pro' | 'con' }>
  analogy?: string
  example: string // el de la tabla de comparación
  energy: Rating
  speed: Rating
  decentralization: Rating
  tone: BlockchainToneKey
}

export const CONSENSUS: ConsensusMechanism[] = [
  {
    id: 'pow',
    name: 'PoW',
    full: 'Prueba de Trabajo',
    english: 'Proof of Work',
    how: 'Mineros compiten resolviendo problemas',
    usedBy: ['Bitcoin', 'Litecoin', 'Dogecoin'],
    usedByNote: 'entre otros',
    description: 'Los nodos llamados mineros compiten resolviendo un problema matemático complejo.',
    stepsLabel: 'El primero que lo resuelve:',
    steps: ['Propone el bloque', 'Los demás nodos lo verifican', 'Se añade a la cadena', 'Recibe una recompensa'],
    ordered: true,
    traits: [
      { text: 'Muy seguro', kind: 'pro' },
      { text: 'Difícil de atacar', kind: 'pro' },
      { text: 'Consume mucha energía', kind: 'con' },
      { text: 'Escalabilidad limitada', kind: 'con' },
    ],
    analogy: 'Es como una competencia de cálculo matemático donde gana quien resuelve primero el problema.',
    example: 'Bitcoin',
    energy: 5,
    speed: 2,
    decentralization: 5,
    tone: 'amber',
  },
  {
    id: 'pos',
    name: 'PoS',
    full: 'Prueba de Participación',
    english: 'Proof of Stake',
    how: 'Validadores apuestan sus monedas',
    usedBy: ['Ethereum', 'Cardano', 'Avalanche'],
    usedByNote: 'entre otros',
    description: 'En lugar de minar, los participantes bloquean (stake) sus criptomonedas como garantía.',
    stepsLabel: 'El sistema elige un validador para liberar el siguiente bloque según:',
    steps: ['Cantidad de monedas en stake', 'Tiempo participando', 'Reputación del nodo'],
    ordered: false,
    note: 'Si el nodo actúa mal, pierde parte de su dinero (slashing).',
    traits: [
      { text: 'Mucho más eficiente energéticamente', kind: 'pro' },
      { text: 'Más rápido que PoW', kind: 'pro' },
      { text: 'Menos hardware requerido', kind: 'pro' },
    ],
    example: 'Ethereum',
    energy: 2,
    speed: 3,
    decentralization: 4,
    tone: 'violet',
  },
  {
    id: 'dpos',
    name: 'DPoS',
    full: 'Prueba de Participación Delegada',
    english: 'Delegated Proof of Stake',
    how: 'Votación de validadores',
    usedBy: ['EOS', 'TRON'],
    description: 'Los usuarios delegan la validación de bloques en validadores elegidos por votación.',
    stepsLabel: 'Proceso:',
    steps: ['Los usuarios votan', 'Se eligen validadores', 'Los validadores liberan bloques'],
    ordered: true,
    traits: [
      { text: 'Muy rápido', kind: 'pro' },
      { text: 'Alta capacidad de transacciones', kind: 'pro' },
      { text: 'Menos descentralización', kind: 'con' },
      { text: 'Existen riesgos de concentración de poder', kind: 'con' },
    ],
    example: 'TRON',
    energy: 1,
    speed: 4,
    decentralization: 3,
    tone: 'rose',
  },
  {
    id: 'poa',
    name: 'PoA',
    full: 'Prueba de Autoridad',
    english: 'Proof of Authority',
    how: 'Nodos autorizados',
    usedBy: ['VeChain', 'BNB Chain'],
    usedByNote: 'y otras; se usa en redes privadas y blockchain empresariales',
    description: 'Los bloques los liberan nodos autorizados previamente.',
    stepsLabel: 'Funcionamiento:',
    steps: ['No compiten', 'Solo participan nodos de confianza'],
    ordered: false,
    traits: [
      { text: 'Muy rápido', kind: 'pro' },
      { text: 'Muy eficiente', kind: 'pro' },
      { text: 'No es totalmente descentralizado', kind: 'con' },
    ],
    example: 'VeChain',
    energy: 1,
    speed: 5,
    decentralization: 2,
    tone: 'sky',
  },
  {
    id: 'poh',
    name: 'PoH',
    full: 'Prueba de Historia',
    english: 'Proof of History',
    how: 'Secuencia de tiempo verificable',
    usedBy: ['Solana'],
    usedByNote: 'únicamente',
    description:
      'El sistema crea una secuencia criptográfica de tiempo verificable. Esto permite que los nodos sepan cuándo ocurrió cada transacción sin tener que preguntarse entre ellos.',
    stepsLabel: '',
    steps: [],
    ordered: false,
    traits: [
      { text: 'Muy alta velocidad en transacciones', kind: 'pro' },
      { text: 'Muy eficiente', kind: 'pro' },
    ],
    example: 'Solana',
    energy: 2,
    speed: 5,
    decentralization: 3,
    tone: 'emerald',
  },
]

export const CONSENSUS_TABLE = {
  title: 'Comparación de los principales mecanismos',
  columns: ['Consenso', 'Ejemplo', 'Energía', 'Velocidad', 'Descentralización'],
}

/* Tarjeta 9: Bitcoin, el oro digital */
export const BITCOIN = {
  maxMillions: 21,
  circulatingMillions: 19.99,
  updated: 'abril de 2026',
  topics: [
    { id: 'data', label: 'Escasez y datos clave', sub: '21 millones, casi todos ya existen' },
    { id: 'halving', label: 'Emisión y halving', sub: 'La recompensa se reduce a la mitad' },
    { id: 'why', label: '¿Por qué vale tanto?', sub: 'Seguridad económica y escasez' },
  ],
  intro:
    'Hasta abril de 2026 existen aproximadamente 19.99 millones de bitcoins en circulación. El límite máximo absoluto, programado, es de 21 millones: no se pueden emitir más. Se espera que el último se mine alrededor del año 2140.',
  facts: [
    { label: 'Suministro', value: '21 millones de BTC', note: 'límite máximo programado' },
    { label: 'En circulación', value: '~19.99 millones de BTC', note: 'abril de 2026' },
    { label: 'Por minar', value: '~1 millón de BTC', note: '' },
    { label: 'BTC perdidos', value: '2 a 3 millones', note: 'irrecuperables' },
    { label: 'Satoshi Nakamoto', value: '~1.1 millones de BTC', note: 'posiblemente un seudónimo' },
    { label: 'Último bitcoin', value: '~2140', note: 'año en que se espera minarlo' },
  ],
  halving: {
    text: 'El pago por minado se reduce a la mitad (halving) aproximadamente cada cuatro años, lo que hace que la criptomoneda sea deflacionaria por diseño.',
    facts: [
      { label: 'Se liberan bloques', value: 'cada 10 minutos' },
      { label: 'Recompensa actual', value: '3.125 BTC' },
      { label: 'Halving', value: 'cada ~4 años' },
    ],
    steps: [
      { year: '2009', reward: 50, current: false, next: false },
      { year: '2012', reward: 25, current: false, next: false },
      { year: '2016', reward: 12.5, current: false, next: false },
      { year: '2020', reward: 6.25, current: false, next: false },
      { year: '2024', reward: 3.125, current: true, next: false },
      { year: '~2028', reward: 1.5625, current: false, next: true },
    ],
  },
  why: {
    question: '¿Por qué Bitcoin vale tanto si su prueba de consenso (PoW) es sumamente contaminante?',
    lead: 'Hay varias razones. Aunque Proof of Work es de las pruebas de consenso menos eficientes, atacar la red es extremadamente caro.',
    attackTitle: 'Ataque del 51 %',
    attack: 'Para alterar la blockchain de Bitcoin, un atacante tendría que controlar más del 50 % del poder de cómputo global de la red. Esto implicaría:',
    costs: ['Comprar enormes cantidades de hardware', 'Pagar electricidad masiva', 'Competir contra miles de mineros'],
    secure: 'Por eso es extremadamente seguro: la dificultad es económica.',
    goldTitle: 'Por qué se le llama "oro digital"',
    gold: ['Es la primera criptomoneda', 'Existe muy poca emisión: 21 millones como máximo'],
  },
}