from django.urls import path
from . import views

urlpatterns = [
    path('api/register/', views.register_api, name='register_api'),
    path('api/login/', views.login_api, name='login_api'),
    path('api/notes/all/', views.list_notes, name='list_notes'),
    path('api/notes/create/', views.create_note, name='create_note'),
    
    # Робота з конкретною нотаткою
    path('api/notes/<int:note_id>/', views.get_note, name='get_note'),
    path('api/notes/<int:note_id>/update/', views.update_note, name='update_note'),
    path('api/notes/<int:note_id>/delete/', views.delete_note, name='delete_note'),
]

