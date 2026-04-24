from django.urls import re_path
from users.views.consumers import ChatConsumer
from users.views.video_consumers import VideoConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/$', ChatConsumer.as_asgi()),
    re_path(r'ws/chat/video/$', VideoConsumer.as_asgi()), # Додай 'chat/' якщо фронт стукає туди
]