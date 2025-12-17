from django.urls import path
from . import views
from .views import ai
urlpatterns = [
    path('api/register/', views.register_api, name='register_api'),
    path('api/login/', views.login_api, name='login_api'),
    path('api/notes/all/', views.list_notes, name='list_notes'),
    path('api/notes/create/', views.create_note, name='create_note'),
    
    # Робота з конкретною нотаткою
    path('api/notes/<int:note_id>/', views.get_note, name='get_note'),
    path('api/notes/<int:note_id>/update/', views.update_note, name='update_note'),
    path('api/notes/<int:note_id>/delete/', views.delete_note, name='delete_note'),
    path('api/user/me/', views.current_user, name='current_user'),    
    path('api/chat/recent/', views.get_recent_chats, name='get_recent_chats'), # Новий
    path('api/users/search/', views.search_users, name='search_users'),       # Новий
    path('api/chat/start/<int:user_id>/', views.start_chat, name='start_chat'),
    path('api/chat/<int:room_id>/messages/', views.get_chat_history, name='get_chat_history'),
    path('api/auth/google/', views.google_login, name='google_login'),
    path('api/ai/edit/', ai.ai_edit_note, name='ai_edit_note'),
]

