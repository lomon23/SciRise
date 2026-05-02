import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get("user", AnonymousUser())

        if self.user.is_anonymous:
            await self.accept() 
            await self.send(text_data=json.dumps({"message": "AUTH_FAILED"}))
            await self.close()
        else:
            self.room_group_name = "scirise_global"
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
            print(f"DEBUG: Successful connect for {self.user.username}")

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')

        # Відправляємо групі повідомлення разом з ніком
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": self.user.username, # Беремо нік з CustomUser
            }
        )

    async def chat_message(self, event):
        # Відправляємо в сокет готовий JSON
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "username": event["username"],
        }))
        #rtrgg
