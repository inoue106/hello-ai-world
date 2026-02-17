'use client';

import { signOut } from 'next-auth/react';

export default function Header() {
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
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
