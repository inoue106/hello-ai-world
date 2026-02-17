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
  return (
    <>
      <Header />
      <Scene3D searchParams={searchParams} />
    </>
  );
}
