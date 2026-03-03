'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, Center, OrbitControls } from '@react-three/drei';

// 日本語表示用フォント（Troika は Unicode 対応、.woff を指定）
const japaneseFontUrl = 'https://cdn.jsdelivr.net/npm/typeface-notosans-jp@1.0.1/NotoSansJP-Regular.woff';

const EXTRUSION_LAYERS = 12;  // 奥行きの段数（多めでなめらかな立体に）
const EXTRUSION_DEPTH = 0.12; // 元の Text3D の height に合わせる

function TextMesh({ text }) {
  return (
    <Center>
      <group>
        {/* 背面から手前へ重ねて立体感を再現（日本語フォントのまま 3D 風に） */}
        {Array.from({ length: EXTRUSION_LAYERS }, (_, i) => {
          const t = i / (EXTRUSION_LAYERS - 1);
          const z = -EXTRUSION_DEPTH * (1 - t);
          const brightness = 0.25 + 0.75 * t;
          const color = `rgb(${Math.round(224 * brightness)},${Math.round(224 * brightness)},${Math.round(224 * brightness)})`;
          return (
            <Text
              key={i}
              font={japaneseFontUrl}
              fontSize={0.35}
              color={color}
              anchorX="center"
              anchorY="middle"
              maxWidth={8}
              textAlign="center"
              position={[0, 0, z]}
            >
              {text}
            </Text>
          );
        })}
      </group>
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

export default function Scene3D({ searchParams = {}, overrideText }) {
  /** 起動時はAPIでテキストを取得せず、すぐ入力画面を表示する */
  const textFromUrl = searchParams?.text;
  /** AI回答など、親から渡されたテキストがあれば3D表示に使う */
  const displayText = (overrideText && String(overrideText).trim()) ? String(overrideText).trim() : textFromUrl || '';

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Scene text={displayText || 'プロンプトを入力して送信'} />
      </Canvas>
    </div>
  );
}
