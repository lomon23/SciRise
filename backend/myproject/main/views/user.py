from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from main.serializers import UserSerializer
from django.contrib.auth import update_session_auth_hash # Щоб не вилогінювало при зміні паролю

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return

@api_view(['GET', 'PATCH', 'DELETE']) # Додали DELETE
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        # 1. Зміна основних даних
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()

        # 2. Зміна паролю (якщо прислали)
        if 'password' in request.data and request.data['password']:
            user.set_password(request.data['password'])
            user.save()
            update_session_auth_hash(request, user) # Оновлюємо сесію, щоб не викинуло

        # 3. Оновлення профілю
        profile = user.profile
        if 'bio' in request.data: profile.bio = request.data['bio']
        if 'avatar' in request.FILES: profile.avatar = request.FILES['avatar']
        profile.save()
        
        return Response(UserSerializer(user).data)

    elif request.method == 'DELETE':
        user.delete() # Видаляє юзера і профіль каскадно
        return Response({"message": "Account deleted"}, status=204)