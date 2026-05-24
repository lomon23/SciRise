from django.urls import path
from rest_framework.routers import DefaultRouter

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views.auth.register import RegisterView
from .views.auth.login import LoginView
from .views.course.groups import GroupListCreateView, GroupDetailView, ChannelCreateView, AttachCourseView, JoinGroupView
from .views.course.courses import CourseFeedView, CourseListCreateView, CourseDetailView
from .views.course.chat import MessageListCreateView
from .views.course.courses import CourseViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'), # Твоя кастомна вюха
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('groups/', GroupListCreateView.as_view(), name='group-list-create'),
    path('groups/<int:pk>/', GroupDetailView.as_view(), name='group-detail'),
    
    # КАНАЛИ (Модалка: додати новий канал)
    path('groups/<int:group_id>/channels/', ChannelCreateView.as_view(), name='channel-create'),
    path('groups/<int:group_id>/join/', JoinGroupView.as_view(), name='group-join'),
    # КУРСИ (Модалка: прикріпити курс)
    path('groups/<int:group_id>/attach-course/<int:course_id>/', AttachCourseView.as_view(), name='attach-course'),

    path('courses/feed/', CourseFeedView.as_view(), name='course-feed'),
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),

# ЧАТ (Історія та відправка HTTP)
    path('channels/<int:channel_id>/messages/', MessageListCreateView.as_view(), name='channel-messages'),
] + router.urls