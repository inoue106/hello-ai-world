'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text3D, Center, OrbitControls } from '@react-three/drei';

const fontUrl = 'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json';

function TextMesh({ text }) {
  return (
    <Center>
      <Text3D
        font={fontUrl}
        size={0.5}
        height={0.12}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelSegments={3}
      >
        {text}
        <meshNormalMaterial />
      </Text3D>
    </Center>
  );
}

function Scene({ text }) {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <OrbitControls enableZoom enablePan />
      <Suspense fallback={null}>
        <TextMesh text={text} />
      </Suspense>
    </>
  );
}

export default function Scene3D() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetch(`${apiUrl}/api/text/`)
      .then((res) => res.json())
      .then((data) => {
        setText(data.text ?? '');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setText('Hello AI World');
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#888' }}>
        読み込み中...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Scene text={text} />
      </Canvas>
      {error && (
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', color: '#c44', fontSize: 12 }}>
          API: {error}（フォールバック表示）
        </div>
      )}
    </div>
  );
}
