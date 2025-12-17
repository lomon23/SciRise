from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from main.models import Note
from main.serializers import NoteSerializer

# --- МАГІЧНИЙ ФІКС 403 (Custom Auth) ---
# Цей клас вимикає перевірку CSRF тільки для цих API запитів
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Пропускаємо перевірку

# 1. ОТРИМАТИ СПИСОК (GET /api/notes/all/)
@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def list_notes(request):
    notes = Note.objects.filter(user=request.user).order_by('-updated_at')
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)

# 2. СТВОРИТИ НОТАТКУ (POST /api/notes/create/)
@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def create_note(request):
    # Створюємо нотатку з дефолтним Markdown-заголовком
    default_title = "Untitled"
    note = Note.objects.create(
        user=request.user, 
        title=default_title, 
        content=f"# {default_title}" # <--- Додали це
    )
    serializer = NoteSerializer(note)
    return Response(serializer.data)

# 3. ОТРИМАТИ ОДНУ (GET /api/notes/<id>/)
@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_note(request, note_id):
    note = get_object_or_404(Note, pk=note_id, user=request.user)
    serializer = NoteSerializer(note)
    return Response(serializer.data)

# 4. ОНОВИТИ/АВТОЗБЕРЕЖЕННЯ (PATCH /api/notes/<id>/update/)
@api_view(['PATCH'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def update_note(request, note_id):
    note = get_object_or_404(Note, pk=note_id, user=request.user)
    serializer = NoteSerializer(note, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

# 5. ВИДАЛИТИ (DELETE /api/notes/<id>/delete/)
@api_view(['DELETE'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def delete_note(request, note_id):
    note = get_object_or_404(Note, pk=note_id, user=request.user)
    note.delete()
    return Response(status=204)