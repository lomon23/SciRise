from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views.auth.register import RegisterView
from .views.auth.login import LoginView



urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'), # Твоя кастомна вюха
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]