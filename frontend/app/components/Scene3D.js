'use client';

import { Suspense, useEffect, useState } from 'react';
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

export default function Scene3D({ searchParams = {} }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const textFromUrl = searchParams?.text;

  useEffect(() => {
    const doFetch = (lat, lng) => {
      const params = new URLSearchParams();
      if (textFromUrl) {
        params.set('text', textFromUrl);
      } else if (lat != null && lng != null) {
        params.set('lat', String(lat));
        params.set('lng', String(lng));
      }
      const url = `${apiUrl}/api/text${params.toString() ? `?${params}` : ''}`;
      return fetch(url, { credentials: 'include' });
    };

    if (textFromUrl) {
      doFetch()
        .then((res) => {
          if (res?.status === 401) {
            window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname + window.location.search);
            return;
          }
          return res?.json();
        })
        .then((data) => {
          if (!data) return;
          setText(data.text ?? '');
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setText(textFromUrl || 'Hello AI World');
          setLoading(false);
        });
      return;
    }

    if (!navigator.geolocation) {
      doFetch()
        .then((res) => {
          if (res?.status === 401) {
            window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname + window.location.search);
            return;
          }
          return res?.json();
        })
        .then((data) => {
          if (!data) return;
          setText(data.text ?? '');
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setText('Hello AI World');
          setLoading(false);
        });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        doFetch(latitude, longitude)
          .then((res) => {
            if (res?.status === 401) {
              window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname + window.location.search);
              return;
            }
            return res?.json();
          })
          .then((data) => {
            if (!data) return;
            setText(data.text ?? '');
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setText('Hello AI World');
            setLoading(false);
          });
      },
      () => {
        doFetch()
          .then((res) => {
            if (res?.status === 401) {
              window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname + window.location.search);
              return;
            }
            return res?.json();
          })
          .then((data) => {
            if (!data) return;
            setText(data.text ?? '');
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setText('Hello AI World');
            setLoading(false);
          });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, [apiUrl, textFromUrl]);

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
