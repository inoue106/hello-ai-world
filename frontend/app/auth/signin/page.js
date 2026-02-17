'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <h1 style={{ color: '#fff', marginBottom: 8, fontSize: 24 }}>Hello AI World</h1>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>サインインしてください</p>
      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl })}
        style={{
          padding: '12px 24px',
          fontSize: 16,
          background: '#fff',
          color: '#333',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        Google でサインイン
      </button>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>読み込み中...</div>}>
      <SignInContent />
    </Suspense>
  );
}
