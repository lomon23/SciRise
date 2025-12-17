from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import login
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from main.models import UserProfile

# Заміни на свій реальний CLIENT_ID з консолі Google
GOOGLE_CLIENT_ID = "497030789238-9jtgjhprgtv8a5en7uq55f211dcpsj6u.apps.googleusercontent.com"

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get('token')
    
    # 1. ДЕБАГ: Дивимось, чи прийшов токен взагалі
    print(f"Received token length: {len(token) if token else 'None'}")

    try:
        id_info = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        
        # 2. Отримуємо дані юзера
        email = id_info['email']
        first_name = id_info.get('given_name', '')
        last_name = id_info.get('family_name', '')
        
        # 3. Шукаємо або створюємо юзера в нашій базі
        # filter().first() безпечніше ніж get()
        user = User.objects.filter(email=email).first()
        
        if user:
            # Юзер вже є - просто логінимо
            login(request, user)
            return Response({'message': 'Login successful'})
        else:
            # Юзера немає - реєструємо
            username = email.split('@')[0] # Робимо нікнейм з пошти
            
            # Перевірка унікальності нікнейму (якщо раптом такий є)
            if User.objects.filter(username=username).exists():
                username = f"{username}_{id_info['sub'][-4:]}" # Додаємо цифри

            user = User.objects.create_user(
                username=username, 
                email=email, 
                first_name=first_name, 
                last_name=last_name
            )
            # Пароль не задаємо, бо вхід через Google (або set_unusable_password())
            user.set_unusable_password()
            user.save()
            
            # Профіль створиться автоматично через сигнали (ми це робили раніше)
            
            # Можна спробувати підтягнути аватарку з Google
            picture_url = id_info.get('picture')
            if picture_url:
                # Тут можна додати логіку завантаження картинки, якщо хочеш
                pass

            login(request, user)
            return Response({'message': 'User registered and logged in'})

    except ValueError as e:
        # 2. ДЕБАГ: Виводимо реальну помилку в консоль
        print(f"🔴 GOOGLE AUTH ERROR: {e}") 
        return Response({'error': str(e)}, status=400)