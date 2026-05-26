from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from myapp.models import Group, BoardWidget
from myapp.serializers import BoardWidgetSerializer

class BoardWidgetListCreateView(generics.ListCreateAPIView):
    """Отримання всіх віджетів дошки або створення нового"""
    serializer_class = BoardWidgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        return BoardWidget.objects.filter(group_id=group_id)

    def perform_create(self, serializer):
        group_id = self.kwargs.get('group_id')
        group = get_object_or_404(Group, id=group_id)
        # TODO: Можна додати перевірку, чи є юзер в цій групі
        serializer.save(group=group)

class BoardWidgetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Оновлення (перетягування, ресайз) або видалення віджета"""
    queryset = BoardWidget.objects.all()
    serializer_class = BoardWidgetSerializer
    permission_classes = [IsAuthenticated]