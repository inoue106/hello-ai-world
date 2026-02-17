'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';

const Scene3D = dynamic(() => import('./components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#888' }}>
      読み込み中...
    </div>
  ),
});

export default function Home({ searchParams }) {
  const [answer, setAnswer] = useState('');

  const handleAnswerReceived = (answerText) => {
    setAnswer(answerText);
  };

  return (
    <>
      <Header onAnswerReceived={handleAnswerReceived} />
      <Scene3D searchParams={searchParams} />
      {answer && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px',
            background: 'rgba(0,0,0,0.8)',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            fontSize: '16px',
            lineHeight: '1.6',
            zIndex: 10,
            maxHeight: '40vh',
            overflowY: 'auto',
          }}
        >
          <div style={{ marginBottom: '8px', fontSize: '12px', color: '#888' }}>
            AI回答:
          </div>
          <div>{answer}</div>
          <button
            onClick={() => setAnswer('')}
            style={{
              marginTop: '12px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 6,
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            閉じる
          </button>
        </div>
      )}
    </>
  );
}
