from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from myapp.models import Group, GroupMember, Channel, Course
from myapp.serializers import GroupSerializer, ChannelSerializer

class GroupListCreateView(generics.ListCreateAPIView):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Віддаємо тільки ті групи, до яких юзер має доступ
        return Group.objects.filter(members__user=self.request.user).distinct()

    def perform_create(self, serializer):
        # 1. Створюємо групу. Сигнал (який ми писали раніше) автоматом створить 2 дефолтні канали
        group = serializer.save(owner=self.request.user)
        
        # 2. Автоматом робимо творця адміном у GroupMember, інакше він сам не побачить свою групу
        GroupMember.objects.create(
            user=self.request.user, 
            group=group, 
            role=GroupMember.Role.ADMIN
        )

class GroupDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Знову ж таки, захист на рівні БД — чужі групи юзер не зможе ні прочитати, ні видалити
        return Group.objects.filter(members__user=self.request.user).distinct()

class ChannelCreateView(generics.CreateAPIView):
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Беремо ID групи з URL
        group_id = self.kwargs.get('group_id')
        
        # Перевіряємо, чи існує група і чи є юзер в ній
        group = get_object_or_404(Group, id=group_id, members__user=self.request.user)
        
        # Зберігаємо новий канал, жорстко прив'язуючи його до цієї групи
        serializer.save(group=group)

class AttachCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id, course_id):
        # Перевіряємо доступ до групи
        group = get_object_or_404(Group, id=group_id, members__user=request.user)
        
        # Шукаємо курс
        course = get_object_or_404(Course, id=course_id)
        
        # Лікуємо курс до групи (ManyToManyField дозволяє просто викликати .add())
        group.courses.add(course)
        
        return Response(
            {"message": f"Course '{course.title}' successfully attached to '{group.name}'"}, 
            status=status.HTTP_200_OK
        )