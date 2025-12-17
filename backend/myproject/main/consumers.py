import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # Приєднуємось до групи
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Від'єднуємось
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Отримуємо повідомлення від WebSocket (з фронтенду)
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender_id']

        # Зберігаємо в БД
        await self.save_message(sender_id, message)

        # Відправляємо всім у кімнаті
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id
            }
        )

    # Відправка повідомлення назад на фронтенд
    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id
        }))

    @database_sync_to_async
    def save_message(self, sender_id, message):
        user = User.objects.get(id=sender_id)
        room = ChatRoom.objects.get(id=self.room_id)
        Message.objects.create(sender=user, room=room, content=message)