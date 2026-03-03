'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function Header({ onAnswerReceived }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'エラーが発生しました');
      }

      const data = await response.json();
      if (onAnswerReceived) {
        onAnswerReceived(data.answer);
      }
      setPrompt('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          flex: 1,
          display: 'flex',
          gap: '8px',
          maxWidth: '600px',
          pointerEvents: 'auto',
        }}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="プロンプトを入力..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 8,
            color: '#fff',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          style={{
            padding: '8px 16px',
            background: loading || !prompt.trim() 
              ? 'rgba(255,255,255,0.1)' 
              : 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 8,
            color: '#fff',
            cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
            fontSize: 14,
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? '送信中...' : '送信'}
        </button>
      </form>
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '16px',
            marginTop: '8px',
            padding: '8px 12px',
            background: 'rgba(255,0,0,0.2)',
            border: '1px solid rgba(255,0,0,0.5)',
            borderRadius: 8,
            color: '#ff6b6b',
            fontSize: 12,
            pointerEvents: 'auto',
          }}
        >
          {error}
        </div>
      )}
      <div style={{ pointerEvents: 'auto' }}>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 8,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
