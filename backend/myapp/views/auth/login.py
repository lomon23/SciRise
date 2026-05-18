from rest_framework_simplejwt.views import TokenObtainPairView
from myapp.serializers import MyTokenObtainPairSerializer

class LoginView(TokenObtainPairView):
    # Тепер логін буде повертати не тільки токени, а й email, role та ім'я
    serializer_class = MyTokenObtainPairSerializer