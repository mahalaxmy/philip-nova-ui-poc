export const LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ar-SA', label: 'Arabic' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'pt-BR', label: 'Portuguese' },
  { code: 'zh-CN', label: 'Chinese (Mandarin)' },
]

export function generateAiSummary(fileName = '') {
  const lower = fileName.toLowerCase()
  if (lower.includes('japan') || lower.includes('jp')) {
    return {
      overview: 'APAC quarterly briefing reviewing regional expansion for Project Alpha. Performance indicates strong momentum with customer engagement tracking +12% above benchmark.',
      highlights: [
        'APAC regional operations exceeding market adoption benchmarks.',
        'Cross-border team checkpoints aligned for rollout next week.',
        'Bilingual briefing transcript and materials prepared for Tokyo stakeholders.',
      ],
      actionItems: [
        'Coordinate with Tokyo operations team for next-week milestone review.',
        'Distribute Japanese translated briefing deck to regional leads.',
      ],
      sentiment: 'Highly Positive',
      confidence: 97,
      topics: ['Project Alpha', 'APAC Expansion', 'Revenue Momentum'],
    }
  }
  if (lower.includes('chinese') || lower.includes('zh')) {
    return {
      overview: 'Greater China market trend review for Project Alpha. Revenue trajectory shows +10% above plan with solid demand indicators and high team readiness.',
      highlights: [
        'Revenue performance outperforming baseline forecast by +10%.',
        'Customer sentiment constructively positive across enterprise accounts.',
        'Clear alignment reached on upcoming development milestones.',
      ],
      actionItems: [
        'Finalize project schedule checkpoints for next week.',
        'Circulate translated Mandarin briefing recap to stakeholders.',
      ],
      sentiment: 'Constructive / Bullish',
      confidence: 95,
      topics: ['Project Alpha', 'Greater China', 'Demand Forecast'],
    }
  }
  return {
    overview: 'Executive briefing on Project Alpha market dynamics. Revenue performance is tracking 8% above forecast targets, supported by resilient and constructive client sentiment across core segments.',
    highlights: [
      'Project Alpha market trends and revenue tracking +8% above forecast.',
      'Customer sentiment remains constructive and supportive across accounts.',
      'Operational roadmap established with next-week checkpoints agreed.',
    ],
    actionItems: [
      'Document key decisions and schedule next-week project checkpoints.',
      'Compile and circulate translated briefing recap to team members.',
    ],
    sentiment: 'Positive (Constructive)',
    confidence: 96,
    topics: ['Project Alpha', 'Revenue +8%', 'Market Sentiment', 'Key Decisions'],
  }
}

const SAMPLE = {
  transcription: [
    { speaker: 'Speaker 1', text: 'Hello, this is a live briefing on Project Alpha market trend.' },
    { speaker: 'Speaker 2', text: 'I hear you. Let’s proceed with key decisions and next-week checkpoints.' },
    { speaker: 'Speaker 1', text: 'Revenue is tracking 8% above forecast. Customer sentiment remains constructive.' },
    { speaker: 'Speaker 2', text: 'Agreed. Capture action items and circulate the translated recap after this call.' },
  ],
  translation: [
    { speaker: 'Speaker 1', text: 'Hola, esta es una sesión en vivo sobre la tendencia de mercado de Project Alpha.' },
    { speaker: 'Speaker 2', text: 'Te escucho. Continuemos con las decisiones clave y los hitos de la próxima semana.' },
    { speaker: 'Speaker 1', text: 'Los ingresos van 8% por encima del pronóstico. El sentimiento del cliente sigue siendo constructivo.' },
    { speaker: 'Speaker 2', text: 'De acuerdo. Capturemos acciones y enviemos el resumen traducido después de la llamada.' },
  ],
  summary: generateAiSummary('Project_Alpha_briefing.wav'),
}

function hashString(value) {
  return [...String(value)].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
}

export function detectLanguageMix(fileName = '') {
  const name = fileName.toLowerCase()
  if (name.includes('zh') || name.includes('chinese') || name.includes('mandarin')) {
    return [
      { code: 'zh', label: 'Chinese', percent: 62 },
      { code: 'en', label: 'English', percent: 24 },
      { code: 'ja', label: 'Japanese', percent: 9 },
      { code: 'es', label: 'Spanish', percent: 5 },
    ]
  }
  if (name.includes('japan') || name.includes('japanese') || /(?:^|[^a-z])jp(?:[^a-z]|$)/.test(name)) {
    return [
      { code: 'ja', label: 'Japanese', percent: 58 },
      { code: 'en', label: 'English', percent: 27 },
      { code: 'zh', label: 'Chinese', percent: 11 },
      { code: 'ko', label: 'Korean', percent: 4 },
    ]
  }
  if (name.includes('hindi') || /(?:^|[^a-z])hi(?:[^a-z]|$)/.test(name)) {
    return [
      { code: 'hi', label: 'Hindi', percent: 54 },
      { code: 'en', label: 'English', percent: 32 },
      { code: 'zh', label: 'Chinese', percent: 8 },
      { code: 'ja', label: 'Japanese', percent: 6 },
    ]
  }
  const shift = hashString(fileName) % 7
  return [
    { code: 'en', label: 'English', percent: 52 + shift },
    { code: 'zh', label: 'Chinese', percent: 23 - Math.floor(shift / 2) },
    { code: 'ja', label: 'Japanese', percent: 16 - Math.floor(shift / 3) },
    { code: 'es', label: 'Spanish', percent: 9 - Math.ceil(shift / 3) },
  ].map((row, _, all) => {
    const total = all.reduce((sum, item) => sum + item.percent, 0)
    return { ...row, percent: Math.max(1, Math.round((row.percent / total) * 100)) }
  })
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatWhen(date = new Date()) {
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

export function makeId(prefix) {
  const d = new Date()
  const stamp = `${String(d.getDate()).padStart(2, '0')}_${d.toLocaleString('en', { month: 'short' })}`
  return `${prefix}_${stamp}_${Math.floor(Math.random() * 90 + 10)}`
}

export async function runSttPipeline(fileName, onStage) {
  onStage('upload')
  await wait(1200)
  onStage('transcribe')
  await wait(1500)
  onStage('translate')
  await wait(1200)
  onStage('summarize')
  await wait(1300)
  onStage('done')
  return {
    fileName,
    ...SAMPLE,
    summary: generateAiSummary(fileName),
    languages: detectLanguageMix(fileName),
  }
}

export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function createWavBlob(samples, sampleRate = 22050) {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)

  const writeStr = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + samples.length * 2, true)
  writeStr(8, 'WAVE')

  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)

  writeStr(36, 'data')
  view.setUint32(40, samples.length * 2, true)

  let offset = 44
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

export function generateSpeechWav(text, lang = 'en-US') {
  const sampleRate = 22050
  const words = (text || 'Philip Nova speech synthesis').trim().split(/\s+/)
  if (words.length === 0) {
    return createWavBlob(new Float32Array(sampleRate), sampleRate)
  }

  const formants = {
    a: [750, 1200, 2400],
    e: [500, 1900, 2600],
    i: [320, 2200, 2900],
    o: [550, 950, 2400],
    u: [340, 850, 2250],
    default: [500, 1500, 2500],
  }

  const chunks = []

  words.forEach((rawWord, wordIdx) => {
    const clean = rawWord.toLowerCase().replace(/[^a-z0-9]/g, '')
    const isQuestion = rawWord.includes('?')
    const isPunct = /[.,;!?]/.test(rawWord)
    const wordLen = Math.max(2, clean.length)
    const wordDuration = Math.min(0.65, Math.max(0.18, wordLen * 0.055))
    const numSamples = Math.floor(wordDuration * sampleRate)
    const samples = new Float32Array(numSamples)

    const vowels = clean.split('').filter((c) => 'aeiou'.includes(c))
    const v1 = formants[vowels[0]] || formants.default
    const v2 = formants[vowels[vowels.length - 1]] || v1

    const progress = wordIdx / words.length
    let baseF0 = 135 - progress * 20
    if (isQuestion && wordIdx === words.length - 1) baseF0 += 35

    let phase = 0

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      const wordProg = i / numSamples

      const microPitch = baseF0 + Math.sin(wordProg * Math.PI) * 12
      phase += (2 * Math.PI * microPitch) / sampleRate

      let glottal = 0
      for (let h = 1; h <= 12; h++) {
        glottal += Math.sin(phase * h) / Math.pow(h, 0.75)
      }

      const f1 = v1[0] + (v2[0] - v1[0]) * wordProg
      const f2 = v1[1] + (v2[1] - v1[1]) * wordProg
      const f3 = v1[2] + (v2[2] - v1[2]) * wordProg

      const r1 = Math.sin(2 * Math.PI * f1 * t) * 0.5
      const r2 = Math.sin(2 * Math.PI * f2 * t) * 0.3
      const r3 = Math.sin(2 * Math.PI * f3 * t) * 0.15
      const vocalResonance = (r1 + r2 + r3) * 0.8

      let noise = 0
      if (wordProg < 0.22 && !'aeiou'.includes(clean[0] || '')) {
        noise = (Math.random() * 2 - 1) * 0.35 * (1 - wordProg / 0.22)
      }

      let env = 1
      const attack = 0.15
      const release = 0.2
      if (wordProg < attack) {
        env = 0.5 * (1 - Math.cos((Math.PI * wordProg) / attack))
      } else if (wordProg > 1 - release) {
        env = 0.5 * (1 - Math.cos((Math.PI * (1 - wordProg)) / release))
      }

      samples[i] = (glottal * 0.28 * vocalResonance + noise * 0.4) * env
    }

    chunks.push(samples)
    const pauseDur = isPunct ? 0.22 : 0.06
    chunks.push(new Float32Array(Math.floor(pauseDur * sampleRate)))
  })

  const totalLen = chunks.reduce((acc, c) => acc + c.length, 0)
  const full = new Float32Array(totalLen)
  let offset = 0
  for (const c of chunks) {
    full.set(c, offset)
    offset += c.length
  }

  let max = 0
  for (let i = 0; i < full.length; i++) {
    const abs = Math.abs(full[i])
    if (abs > max) max = abs
  }
  if (max > 0) {
    const scale = 0.88 / max
    for (let i = 0; i < full.length; i++) {
      full[i] *= scale
    }
  }

  return createWavBlob(full, sampleRate)
}

export async function runTtsPipeline(text, language, onStage) {
  onStage('prepare')
  await wait(800)
  onStage('synthesize')
  await wait(1400)
  onStage('done')
  const utterance = `${text.slice(0, 180)}${text.length > 180 ? '…' : ''}`
  const wavBlob = generateSpeechWav(text, language)
  const audioUrl = URL.createObjectURL(wavBlob)
  const durationSec = Math.max(3, Math.round(text.split(/\s+/).length * 0.45))
  return {
    text,
    language,
    preview: utterance,
    duration: durationSec,
    audioBlob: wavBlob,
    audioUrl,
  }
}

export function linesToText(lines) {
  return lines.map((l) => `${l.speaker}: ${l.text}`).join('\n')
}

export function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function buildSummaryExport(item) {
  const s = item.summary || generateAiSummary(item.fileName)
  return [
    'PHILIP NOVA — AI Executive Summary',
    `Source: ${item.fileName}`,
    `Date: ${item.date}`,
    '',
    '=== EXECUTIVE OVERVIEW ===',
    s.overview,
    '',
    '=== KEY HIGHLIGHTS ===',
    ...(s.highlights || []).map((h) => `• ${h}`),
    '',
    '=== ACTION ITEMS & DECISIONS ===',
    ...(s.actionItems || []).map((a) => `[✓] ${a}`),
    '',
    `Sentiment: ${s.sentiment}`,
    `Confidence: ${s.confidence}%`,
    `Topics: ${(s.topics || []).join(', ')}`,
  ].join('\n')
}

export function buildSttExport(item) {
  const s = item.summary || generateAiSummary(item.fileName)
  return [
    'PHILIP NOVA — Speech Intelligence Pack',
    `Source: ${item.fileName}`,
    `Created: ${item.date}`,
    '',
    '=== AI EXECUTIVE SUMMARY ===',
    s.overview,
    '',
    'Key Highlights:',
    ...(s.highlights || []).map((h) => `• ${h}`),
    '',
    'Action Items:',
    ...(s.actionItems || []).map((a) => `[ ] ${a}`),
    '',
    `Sentiment: ${s.sentiment} | Confidence: ${s.confidence}%`,
    `Topics: ${(s.topics || []).join(', ')}`,
    '',
    '=== TRANSCRIPTION ===',
    linesToText(item.transcription),
    '',
    '=== TRANSLATION ===',
    linesToText(item.translation),
    '',
    '=== LANGUAGE BREAKDOWN ===',
    (item.languages || []).map((l) => `${l.label}: ${l.percent}%`).join('\n'),
  ].join('\n')
}

export function speak(text, lang) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  window.speechSynthesis.speak(u)
}

export function stopSpeak() {
  window.speechSynthesis?.cancel()
}
