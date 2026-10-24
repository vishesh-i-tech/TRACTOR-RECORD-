'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Camera, 
  Sparkles, 
  X, 
  CheckCircle2, 
  ScanLine
} from 'lucide-react';
import { VOICE_SAMPLE_QUERIES } from '../data/mockData';

export default function VoiceAssistantModal({ isOpen, onClose, onApplyJobFromOcr }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [activeResponse, setActiveResponse] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setIsListening(false);
      setTranscript('');
      setActiveResponse(null);
      setOcrSuccess(false);
    }
  }, [isOpen]);

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleQuerySelect = (item) => {
    setTranscript(item.query);
    setActiveResponse(item);
    speakText(item.answer);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscript('Listening... Speak your query or field entry...');
      setTimeout(() => {
        setIsListening(false);
        const randomQuery = VOICE_SAMPLE_QUERIES[0];
        setTranscript(randomQuery.query);
        setActiveResponse(randomQuery);
        speakText(randomQuery.answer);
      }, 2000);
    }
  };

  const handleSimulateOcr = () => {
    setOcrScanning(true);
    setOcrSuccess(false);
    setTimeout(() => {
      setOcrScanning(false);
      setOcrSuccess(true);
      if (onApplyJobFromOcr) {
        onApplyJobFromOcr({
          customer: "Harpreet Singh Dhillon",
          machine: "Mahindra 575 DI",
          implement: "Rotavator (Shaktiman 7ft)",
          units: 5.0,
          rate: 1400,
          totalAmount: 7000,
          startMeter: 1842.5,
          endMeter: 1847.5,
          fieldLocation: "Rampur Farm East"
        });
      }
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Sparkles style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="modal-sheet-title">Voice Assistant & OCR</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ask financial queries or scan paper register slips</div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Center Mic */}
        <div style={{ padding: '24px 16px', borderRadius: 20, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: 20 }}>
          
          <button 
            onClick={toggleListening}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              margin: '0 auto',
              background: isListening ? '#ef4444' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening ? '0 0 25px rgba(239, 68, 68, 0.5)' : '0 8px 25px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            {isListening ? (
              <MicOff style={{ width: 32, height: 32 }} />
            ) : (
              <Mic style={{ width: 32, height: 32 }} />
            )}
          </button>

          <div style={{ marginTop: 12, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
            {isListening ? 'Listening...' : 'Tap Mic to Speak'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
            English, Hindi, Punjabi, or Regional dialects supported
          </div>

          {transcript && (
            <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: '#ffffff', border: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.8rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block', fontWeight: 600, marginBottom: 2 }}>Voice Transcript:</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>"{transcript}"</span>
            </div>
          )}

          {activeResponse && (
            <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: '#eff6ff', border: '1px solid #bfdbfe', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="badge-soft-blue" style={{ padding: '3px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                  AI Spoken Reply
                </span>
                <button
                  onClick={isSpeaking ? stopSpeech : () => speakText(activeResponse.answer)}
                  style={{ background: '#ffffff', border: '1px solid #bfdbfe', color: '#2563eb', padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}
                >
                  {isSpeaking ? <VolumeX style={{ width: 13, height: 13, color: '#ef4444' }} /> : <Volume2 style={{ width: 13, height: 13 }} />}
                  <span>{isSpeaking ? 'Stop' : 'Replay Audio'}</span>
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.5, fontWeight: 500 }}>
                {activeResponse.answer}
              </p>
            </div>
          )}
        </div>

        {/* Sample Queries */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles style={{ width: 14, height: 14, color: '#f59e0b' }} /> Frequent Questions (Tap to Ask):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {VOICE_SAMPLE_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuerySelect(q)}
                style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>{q.query}</span>
                <span style={{ color: '#2563eb', fontWeight: 800 }}>→</span>
              </button>
            ))}
          </div>
        </div>

        {/* OCR Section */}
        <div style={{ borderTop: '1px solid #edf2f7', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Camera style={{ width: 16, height: 16, color: '#06b6d4' }} /> Paper Register & Pump Slip OCR
            </span>
            <span className="badge-soft-green" style={{ padding: '3px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700 }}>
              AI Vision OCR
            </span>
          </div>

          <div style={{ padding: 14, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              <p style={{ color: '#0f172a', fontWeight: 700 }}>Take photo of handwriting or petrol slip</p>
              <p style={{ fontSize: '0.7rem' }}>AI automatically extracts farmer, hours, implements, and cost.</p>
            </div>

            <button
              onClick={handleSimulateOcr}
              disabled={ocrScanning}
              className="amount-chip-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563eb', color: '#ffffff', borderColor: '#2563eb' }}
            >
              {ocrScanning ? (
                <>
                  <ScanLine style={{ width: 14, height: 14 }} />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Camera style={{ width: 14, height: 14 }} />
                  <span>Scan Photo Demo</span>
                </>
              )}
            </button>
          </div>

          {ocrSuccess && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#065f46' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 style={{ width: 16, height: 16, color: '#10b981' }} />
                <span><strong>OCR Parsed:</strong> Harpreet Singh (Rotavator, 5 hrs, ₹7,000) autofilled!</span>
              </div>
              <button 
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: '#059669', textDecoration: 'underline', fontWeight: 700, cursor: 'pointer' }}
              >
                View →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
