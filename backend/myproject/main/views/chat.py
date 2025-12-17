from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.db.models import Q, Max
from main.models import ChatRoom, Message

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return

# 1. ОТРИМАТИ МОЇ АКТИВНІ ЧАТИ (Ліва панель)
@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_recent_chats(request):
    # Знаходимо кімнати, де є я
    rooms = ChatRoom.objects.filter(participants=request.user)
    
    # Сортуємо по даті останнього повідомлення
    rooms = rooms.annotate(last_msg_time=Max('messages__timestamp')).order_by('-last_msg_time')

    data = []
    for room in rooms:
        # Знаходимо співрозмовника (це не я)
        other_user = room.participants.exclude(id=request.user.id).first()
        if not other_user: continue # Пропускаємо биті чати

        # Останнє повідомлення для прев'ю
        last_msg = room.messages.order_by('-timestamp').first()
        preview = last_msg.content[:30] if last_msg else "No messages yet"
        
        avatar_url = None
        if hasattr(other_user, 'profile') and other_user.profile.avatar:
            avatar_url = other_user.profile.avatar.url

        data.append({
            'room_id': room.id,
            'user_id': other_user.id,
            'username': other_user.username,
            'avatar': avatar_url,
            'last_message': preview,
            'timestamp': last_msg.timestamp if last_msg else None
        })
    
    return Response(data)

# 2. ПОШУК ЮЗЕРІВ (Глобальний)
@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.GET.get('q', '')
    if not query:
        return Response([])

    # Шукаємо по username, імені або прізвищу
    users = User.objects.filter(
        Q(username__icontains=query) | 
        Q(first_name__icontains=query) | 
        Q(last_name__icontains=query)
    ).exclude(id=request.user.id)[:20] # Ліміт 20 результатів

    data = []
    for u in users:
        avatar_url = None
        if hasattr(u, 'profile') and u.profile.avatar:
            avatar_url = u.profile.avatar.url
        
        data.append({
            'id': u.id,
            'username': u.username,
            'full_name': f"{u.first_name} {u.last_name}".strip(),
            'avatar': avatar_url
        })
        
    return Response(data)

# ... start_chat та get_chat_history залишаються без змін ...
@csrf_exempt
@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def start_chat(request, user_id):
    try:
        other_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    chats = ChatRoom.objects.filter(is_group=False, participants=request.user).filter(participants=other_user)
    if chats.exists():
        chat = chats.first()
    else:
        chat = ChatRoom.objects.create(is_group=False)
        chat.participants.add(request.user, other_user)
    
    return Response({'room_id': chat.id})

@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_chat_history(request, room_id):
    try:
        chat = ChatRoom.objects.get(id=room_id)
    except ChatRoom.DoesNotExist:
        return Response({'error': 'Chat not found'}, status=404)
        
    if request.user not in chat.participants.all():
        return Response({'error': 'Access denied'}, status=403)

    messages = Message.objects.filter(room_id=room_id).order_by('timestamp')
    data = [{'id': m.id, 'sender_id': m.sender.id, 'content': m.content, 'timestamp': m.timestamp} for m in messages]
    return Response(data)