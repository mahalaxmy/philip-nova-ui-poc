import { useEffect, useState } from 'react'
import { Ico } from './Icons.jsx'
import {
  LANGUAGES,
  downloadBlob,
  formatWhen,
  generateSpeechWav,
  makeId,
  runTtsPipeline,
} from '../lib/engine.js'

const STEPS = [
  { id: 'prepare', label: 'Preparing text' },
  { id: 'synthesize', label: 'Generating speech' },
]

export default function TtsPanel({ onComplete, restore }) {
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('en-US')
  const [fileName, setFileName] = useState('')
  const [stage, setStage] = useState('idle')
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (restore?.text) {
      setText(restore.text)
      setLanguage(restore.language || 'en-US')
      setResult(restore)
      setStage('done')
    }
  }, [restore])

  async function onTextFile(file) {
    if (!file) return
    setFileName(file.name)
    const body = await file.text()
    setText(body)
  }

  async function generate() {
    if (!text.trim()) return
    setResult(null)
    const data = await runTtsPipeline(text.trim(), language, setStage)
    const item = {
      id: makeId('TTS'),
      type: 'tts',
      date: formatWhen(),
      ...data,
    }
    setResult(item)
    onComplete(item)
  }

  function handleDownloadAudio() {
    if (!result && !text.trim()) return
    const blob = result?.audioBlob || generateSpeechWav(result?.text || text, language)
    const fileName = `${result?.id || 'TTS'}_audio.wav`
    downloadBlob(fileName, blob)
  }

  const busy = stage !== 'idle' && stage !== 'done'
  const langLabel = LANGUAGES.find((l) => l.code === language)?.label || language

  return (
    <div className="panel">
      <section className="card workspace">
        <h2>Write or upload text</h2>
        <div className="field">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter or paste your text here…"
          />
        </div>
        <label className="dropzone" style={{ minHeight: 88 }}>
          <input type="file" accept=".txt,.md,.csv,.json" onChange={(e) => onTextFile(e.target.files?.[0])} />
          <div>
            <div className="drop-icon">{Ico.file}</div>
            <strong>Upload a text file</strong>
            <div>{fileName || 'TXT, MD, or script files'}</div>
          </div>
        </label>
        <div className="field">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" disabled={!text.trim() || busy} onClick={generate}>
          {busy ? 'SYNTHESIZING SPEECH…' : 'GENERATE SPEECH'}
        </button>

        {stage === 'idle' && (
          <div className="status-toast">
            Voice language: {langLabel}
          </div>
        )}

        {stage !== 'idle' && (
          <div className="gen-pop" key="tts-progress">
            <div className="viz">
              <div className={`orb ${busy ? 'busy' : ''}`}>{Ico.people}</div>
              <div className="wave">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} style={{ animationPlayState: busy ? 'running' : 'paused' }} />
                ))}
              </div>
            </div>
            <div className="steps">
              {STEPS.map((s) => {
                const idx = STEPS.findIndex((x) => x.id === stage)
                const self = STEPS.findIndex((x) => x.id === s.id)
                const cls = stage === 'done' || self < idx ? 'done' : stage === s.id ? 'active' : ''
                return (
                  <div className={`step ${cls}`} key={s.id}>
                    {s.label}
                    <div className="bar"><i /></div>
                  </div>
                )
              })}
            </div>
            <div className="status-toast" style={{ textAlign: 'center' }}>
              {stage === 'prepare' && 'Reading and normalizing your text…'}
              {stage === 'synthesize' && `Synthesizing speech in ${langLabel}…`}
              {stage === 'done' && 'Speech audio is ready for download.'}
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Speech Audio</h2>
        <div className="transcript" style={{ minHeight: 140 }}>
          {result?.preview || text || 'Your generated speech script will appear here.'}
        </div>
        <div className="actions" style={{ marginTop: 16 }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={!result && !text.trim()}
            onClick={handleDownloadAudio}
          >
            {Ico.download} Download Audio (.WAV)
          </button>
        </div>
      </section>
    </div>
  )
}
