/**
 * 表示用テキストを返す。
 * - ?text=xxx で上書き可能
 * - ?lat=...&lng=... がある場合: 現在地の今日・明日の天気を Gemini 3 で生成して返す
 */
import { GoogleGenAI } from '@google/genai';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

/** 緯度経度から都道府県・市町村を取得（Nominatim 逆ジオコーディング） */
async function fetchLocationName(lat, lng) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    addressdetails: '1',
    'accept-language': 'ja',
  });
  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { 'User-Agent': 'HelloAIWorld-Weather/1.0' },
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const addr = data?.address;
  if (!addr) return null;
  let prefecture = addr.province || addr.state || '';
  if (!prefecture && data.display_name) {
    const match = data.display_name.match(/[一-龥]+(?:都|道|府|県)/);
    if (match) prefecture = match[0];
  }
  const municipality = addr.city || addr.town || addr.village || addr.suburb || addr.county || '';
  const parts = [prefecture, municipality].filter(Boolean);
  return parts.length ? parts.join('') : null;
}

async function fetchWeather(lat, lng) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    daily: 'weathercode,temperature_2m_max,temperature_2m_min',
    timezone: 'Asia/Tokyo',
    forecast_days: '2',
  });
  const res = await fetch(`${OPEN_METEO_URL}?${params}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('天気の取得に失敗しました');
  return res.json();
}

function weathercodeToLabel(code) {
  const map = {
    0: '晴れ', 1: 'おおむね晴れ', 2: 'ところにより曇り', 3: '曇り',
    45: '霧', 48: '霧', 51: 'きり雨', 53: 'きり雨', 55: 'きり雨',
    61: '雨', 63: '雨', 65: '強い雨', 66: 'にわか雨', 67: 'にわか強い雨',
    71: '雪', 73: '雪', 75: '強い雪', 77: '雪', 80: 'にわか雨',
    81: 'にわか雨', 82: 'にわか強い雨', 85: 'にわか雪', 86: 'にわか強い雪',
    95: '雷', 96: '雷とひょう', 99: '雷とひょう',
  };
  return map[Number(code)] ?? '不明';
}

async function getWeatherTextFromGemini(weatherJson, locationName) {
  const apiKey = process.env.GEMINI_API_KEY;
  const daily = weatherJson.daily;
  const t1 = weathercodeToLabel(daily.weathercode[0]);
  const t2 = weathercodeToLabel(daily.weathercode[1]);
  const min1 = daily.temperature_2m_min[0];
  const max1 = daily.temperature_2m_max[0];
  const min2 = daily.temperature_2m_min[1];
  const max2 = daily.temperature_2m_max[1];
  const placePrefix = locationName ? `${locationName}の` : '';

  if (!apiKey) {
    return `${placePrefix}今日は${t1}（${min1}〜${max1}℃）明日は${t2}（${min2}〜${max2}℃）`;
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `以下の天気データを元に、今日と明日の天気を1〜2文の簡潔な日本語でまとめてください。
3D表示用なので改行は入れず、短く。温度は摂氏で。
${locationName ? `冒頭に「${locationName}の」という形で場所を含めてください。` : ''}

${JSON.stringify(weatherJson.daily, null, 2)}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  const text =
    response?.text?.trim() ||
    response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return text || '天気を取得しました';
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const textParam = searchParams.get('text')?.trim();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  let value = 'Hello AI World';

  if (textParam) {
    try {
      value = decodeURIComponent(textParam);
    } catch {
      value = textParam;
    }
  } else if (lat != null && lng != null && lat !== '' && lng !== '') {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (Number.isFinite(latNum) && Number.isFinite(lngNum)) {
      try {
        const [weatherJson, locationName] = await Promise.all([
          fetchWeather(latNum, lngNum),
          fetchLocationName(latNum, lngNum),
        ]);
        value = await getWeatherTextFromGemini(weatherJson, locationName ?? undefined);
      } catch (err) {
        value = `天気の取得に失敗しました（${err.message}）`;
      }
    }
  }

  return Response.json({ text: value });
}
