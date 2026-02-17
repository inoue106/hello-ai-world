/** 表示用テキストを返す（フロントで3D表示する内容） */
export async function GET() {
  return Response.json({ text: 'Hello AI World' });
}
