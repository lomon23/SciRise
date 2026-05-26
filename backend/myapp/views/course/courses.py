from rest_framework import generics, viewsets, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.shortcuts import get_object_or_404

from myapp.models import Course, Module, Lesson
from myapp.serializers import CourseSerializer, LessonSerializer


# ==========================================
# КУРСИ
# ==========================================

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
        ).prefetch_related('modules__lessons').distinct()

    def perform_create(self, serializer):
        # 1. Створюємо курс і призначаємо власника
        course = serializer.save(owner=self.request.user)
        
        # 2. ОДРАЗУ створюємо дефолтний модуль, щоб було куди додавати лекції
        Module.objects.create(
            course=course,
            title="Розділ 1. Вступ",
            order=1
        )

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Деталі курсу з його модулями та уроками"""
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Course.objects.filter(
            Q(is_public=True) | Q(owner=user) | Q(groups__members__user=user)
        ).distinct()
    
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().prefetch_related('modules__lessons')
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# ==========================================
# ЛЕКЦІЇ
# ==========================================

class LessonCreateView(generics.CreateAPIView):
    """Створення лекції всередині конкретного модуля"""
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        module_id = self.kwargs.get('module_id')
        module = get_object_or_404(Module, id=module_id)
        
        # Захист: тільки власник курсу може додавати лекції
        if module.course.owner != self.request.user:
            raise PermissionDenied("Ви не є власником цього курсу.")
            
        serializer.save(module=module)

class LessonUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """Редагування та видалення конкретної лекції"""
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if self.get_object().module.course.owner != self.request.user:
            raise PermissionDenied("Ви не є власником цього курсу.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.module.course.owner != self.request.user:
            raise PermissionDenied("Ви не є власником цього курсу.")
        instance.delete()