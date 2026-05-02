from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from users.models import Profile
from users.serializers import ProfileSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated] # Доступ тільки з токеном

    def get_object(self):
        # Повертає дані профілю поточного юзера
        return self.request.user.profile