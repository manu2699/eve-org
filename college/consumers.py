from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
  def connect(self):
    print("connected", self.channel_name)
    async_to_sync(self.channel_layer.group_add)("chat", self.channel_name)
    self.accept()

  def disconnect(self, close_code):
    print("disconnected", close_code)
    async_to_sync(self.channel_layer.group_discard)("chat", self.channel_name)

  def send_message(self, event):
    self.send(text_data=event["text"])

class RoomConsumer(WebsocketConsumer):
  def connect(self):
    self.roomName = self.scope['url_route']['kwargs']['name']
    print(self.roomName)
    async_to_sync(self.channel_layer.group_add)( self.roomName, self.channel_name)
    self.accept()

  def disconnect(self, close_code):
    async_to_sync(self.channel_layer.group_discard)( self.roomName, self.channel_name)

  def send_message(self, event):
    self.send(text_data=event["text"])