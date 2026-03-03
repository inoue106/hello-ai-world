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
      <Scene3D searchParams={searchParams} overrideText={answer} />
      {answer && (
        <button
          onClick={() => setAnswer('')}
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 8,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
            zIndex: 10,
          }}
        >
          3Dテキストをリセット
        </button>
      )}
    </>
  );
}
