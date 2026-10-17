import { useEffect, useState } from 'react'
import { Ico } from './Icons.jsx'
import {
  formatWhen,
  generateAiSummary,
  makeId,
  runSttPipeline,
} from '../lib/engine.js'

const STEPS = [
  { id: 'upload', label: 'Uploading audio' },
  { id: 'transcribe', label: 'Generating transcription' },
  { id: 'translate', label: 'Translating' },
  { id: 'summarize', label: 'Generating AI summary' },
]

export default function SttPanel({ onComplete, restore }) {
  const [file, setFile] = useState(null)
  const [over, setOver] = useState(false)
  const [stage, setStage] = useState('idle')
  const [result, setResult] = useState(null)
  const [tab, setTab] = useState('summary')

  useEffect(() => {
    if (restore?.transcription) {
      setResult(restore)
      setStage('done')
      setFile({ name: restore.fileName })
    }
  }, [restore])

  async function processFile(nextFile) {
    if (!nextFile) return
    setFile(nextFile)
    setResult(null)
    setStage('upload')
    const data = await runSttPipeline(nextFile.name, setStage)
    const item = {
      id: makeId('STT'),
      type: 'stt',
      date: formatWhen(),
      ...data,
    }
    setResult(item)
    onComplete(item)
  }

  function onDrop(e) {
    e.preventDefault()
    setOver(false)
    processFile(e.dataTransfer.files?.[0])
  }

  const busy = stage !== 'idle' && stage !== 'done'
  const summary = result?.summary || (result ? generateAiSummary(result.fileName || '') : null)
  const lines = Array.isArray(result?.[tab])
    ? result[tab]
    : Array.isArray(result?.transcription)
      ? result.transcription
      : []

  return (
    <div className="panel">
      <section className="card workspace">
        <h2>Audio intake</h2>
        <label
          className={`dropzone ${over ? 'over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
        >
          <input type="file" accept="audio/*,.mp3,.wav,.m4a,.ogg" onChange={(e) => processFile(e.target.files?.[0])} />
          <div>
            <div className="drop-icon">{Ico.upload}</div>
            <strong>UPLOAD AUDIO FILE</strong>
            <div>Drag and drop or browse</div>
            {file && <div className="file-pill" style={{ marginTop: 10 }}>{file.name}</div>}
          </div>
        </label>
        {stage !== 'idle' && (
          <div className="gen-pop" key="stt-progress">
            <div className="viz">
              <div className={`orb ${busy ? 'busy' : ''}`}>{Ico.mic}</div>
              <div className="wave">
                {Array.from({ length: 10 }).map((_, i) => <span key={i} style={{ animationPlayState: busy ? 'running' : 'paused' }} />)}
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
              {stage === 'upload' && 'Uploading and preparing waveform…'}
              {stage === 'transcribe' && 'Listening and generating transcription…'}
              {stage === 'translate' && 'Translating the conversation…'}
              {stage === 'summarize' && 'Synthesizing AI summary & key insights…'}
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-top-head">
          <h2>Transcription & Intelligence</h2>
        </div>

        <div className="tabs">
          <button className={tab === 'summary' ? 'active' : ''} onClick={() => setTab('summary')}>AI Summary</button>
          <button className={tab === 'transcription' ? 'active' : ''} onClick={() => setTab('transcription')}>Transcription</button>
          <button className={tab === 'translation' ? 'active' : ''} onClick={() => setTab('translation')}>Translated</button>
        </div>

        <div className="panel-viewport">
          {!result && <p className="empty">Upload audio to generate AI summary and live transcript.</p>}

          {result && tab === 'summary' && summary && (
            <div className="ai-summary-tab">
              <div className="summary-banner">
                <span className="summary-sparkle">✨</span>
                <div>
                  <strong>Executive Brief</strong>
                  <p className="summary-overview">{summary.overview}</p>
                </div>
              </div>

              <div className="summary-section">
                <h4>Key Highlights</h4>
                <ul className="summary-bullets">
                  {summary.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div className="summary-section">
                <h4>Action Items & Decisions</h4>
                <ul className="action-bullets">
                  {summary.actionItems.map((a, i) => (
                    <li key={i}>
                      <span className="check-ico">✓</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {result && (tab === 'transcription' || tab === 'translation') && (
            <div className="dialogue-list">
              {lines.map((l, i) => (
                <div className="dialogue-row" key={i}>
                  <span className="speaker-tag">{l.speaker}</span>
                  <span className="dialogue-text">{l.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
