from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from myapp.models import Course
from myapp.serializers import CourseSerializer

class CourseFeedView(generics.ListAPIView):
    """Публічна стрічка всіх доступних курсів"""
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Course.objects.filter(is_public=True).order_by('-created_at')

class CourseListCreateView(generics.ListCreateAPIView):
    """Мої курси (де я власник, або які прикріплені до моїх груп) та створення нових"""
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Course.objects.filter(
            Q(owner=user) | Q(groups__members__user=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Деталі курсу з його модулями та уроками"""
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Доступ є, якщо курс публічний, або я його створив, або я є в групі, до якої він прив'язаний
        user = self.request.user
        return Course.objects.filter(
            Q(is_public=True) | Q(owner=user) | Q(groups__members__user=user)
        ).distinct()