import os
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from google import genai
from google.genai import types

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return

# Отримуємо ключ
try:
    API_KEY = getattr(settings, 'GEMINI_API_KEY', os.environ.get("GEMINI_API_KEY"))
except:
    API_KEY = None

# --- ГОЛОВНА ЗМІНА ---
# Використовуємо експериментальну версію.
# Вона є у вашому списку і зазвичай відкрита для Free Tier без картки.
MODEL_ID = "gemini-2.0-flash-exp" 

@csrf_exempt
@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def ai_edit_note(request):
    if not API_KEY:
         return Response({'error': 'Server Error: API Key missing'}, status=500)

    text = request.data.get('text', '')
    instruction = request.data.get('instruction', 'Fix grammar')
    
    if not text:
        return Response({'error': 'No text provided'}, status=400)

    try:
        # Ініціалізація клієнта
        client = genai.Client(api_key=API_KEY)
        
        # Виклик моделі
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=f"Instruction: {instruction}\nText to edit:\n{text}",
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=5000,
            )
        )
        
        if not response.text:
             return Response({'error': 'AI returned empty result'}, status=400)

        return Response({'result': response.text})

    except Exception as e:
        err_msg = str(e)
        print(f"\n🔴 AI ERROR ({MODEL_ID}): {err_msg}\n")
        
        if "429" in err_msg:
             return Response({'error': 'AI Limit Exceeded. Please try again in 1 minute.'}, status=429)
        if "404" in err_msg:
             return Response({'error': f'Model {MODEL_ID} not found. Check API Key permissions.'}, status=404)
             
        return Response({'error': 'AI Service unavailable'}, status=503)