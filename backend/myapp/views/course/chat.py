from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from myapp.models import Message, Channel
from myapp.serializers import MessageSerializer

class MessageListCreateView(generics.ListCreateAPIView):
    """Отримання історії чату та збереження нового повідомлення"""
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        channel_id = self.kwargs.get('channel_id')
        # Перевіряємо, чи має юзер доступ до групи, в якій знаходиться цей канал
        channel = get_object_or_404(Channel, id=channel_id, group__members__user=self.request.user)
        
        # Віддаємо останні 50 повідомлень (від найновіших до найстаріших)
        # На фронті їх треба буде реверснути, щоб нові були знизу
        return Message.objects.filter(channel=channel).order_by('-created_at')[:50]

    def perform_create(self, serializer):
        channel_id = self.kwargs.get('channel_id')
        channel = get_object_or_404(Channel, id=channel_id, group__members__user=self.request.user)
        # Зберігаємо з прив'язкою до каналу і поточного юзера
        serializer.save(author=self.request.user, channel=channel)