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
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt.trim(),
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
    return Response.json(
      { error: `エラーが発生しました: ${error.message}` },
      { status: 500 }
    );
  }
}
