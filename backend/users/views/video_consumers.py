import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get("user", AnonymousUser())
        if self.user.is_anonymous:
            await self.close()
        else:
            self.room_name = "video_room" # Можна потім зробити динамічним
            self.room_group_name = f"video_{self.room_name}"
            
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
            print(f"DEBUG: Video signaling connected: {self.user.username}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        # Пересилаємо сигнал (offer, answer, candidate) всім іншим у кімнаті
        # В ідеалі треба слати конкретному юзеру, але для MVP — шлемо всім, 
        # а фронт сам розбереться, чи це йому.
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "video_signal",
                "payload": data,
                "sender": self.user.username
            }
        )

    async def video_signal(self, event):
        # Не шлемо сигнал самому собі
        if event["sender"] != self.user.username:
            await self.send(text_data=json.dumps(event["payload"]))