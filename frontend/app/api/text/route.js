/** 表示用テキストを返す。?text=xxx で上書き可能 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text')?.trim();
  let value = 'Hello AI World';
  if (text) {
    try {
      value = decodeURIComponent(text);
    } catch {
      value = text;
    }
  }
  return Response.json({ text: value });
}
