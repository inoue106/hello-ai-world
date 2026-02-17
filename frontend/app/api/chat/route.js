/**
 * プロンプトを入力し、AI（Gemini）に問い合わせて回答を返す
 */
import { GoogleGenAI } from '@google/genai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  // 認証チェック
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return Response.json({ error: 'プロンプトが入力されていません' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'GEMINI_API_KEYが設定されていません' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    /** 環境変数 GEMINI_WEB_SEARCH=true のときのみ Google 検索グラウンディングを有効にする（デフォルトは無効） */
    const useWebSearch = process.env.GEMINI_WEB_SEARCH === 'true';
    const config = useWebSearch ? { tools: [{ googleSearch: {} }] } : undefined;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt.trim(),
      ...(config && { config }),
    });

    const text =
      response?.text?.trim() ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return Response.json({ error: 'AIからの応答がありませんでした' }, { status: 500 });
    }

    return Response.json({ answer: text });
  } catch (error) {
    console.error('Chat API error:', error);

    const status = error?.status ?? (error?.code === 429 ? 429 : 500);
    if (status === 429) {
      return Response.json(
        {
          error:
            'APIの利用枠を超えました。プラン・請求を確認するか、しばらく時間をおいて再試行してください。' +
            '（Google検索を無効にする場合は GEMINI_WEB_SEARCH=false を設定すると消費を抑えられます）',
        },
        { status: 429 }
      );
    }

    return Response.json(
      { error: `エラーが発生しました: ${error?.message ?? String(error)}` },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
