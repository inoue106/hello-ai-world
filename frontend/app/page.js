import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('./components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#888' }}>
      読み込み中...
    </div>
  ),
});

export default function Home() {
  return <Scene3D />;
}
