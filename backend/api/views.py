from django.http import JsonResponse

def health(request):
    return JsonResponse({"status": "ok"})


def text(request):
    """表示用テキストを返す（フロントで3D表示する内容）"""
    return JsonResponse({"text": "Hello AI World"})
