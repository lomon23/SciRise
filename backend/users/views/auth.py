from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from ..serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] 

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny] 
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return response

class RefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

class LogoutView(APIView):
    permission_classes = [IsAuthenticated] 
    def post(self, request):
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)