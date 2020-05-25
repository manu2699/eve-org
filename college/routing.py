from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    # url(r'^ws/chat/(?P<room_name>[^/]+)/$', consumers.ChatConsumer),ezvzev
    url(r'^ws/chat/$', consumers.ChatConsumer),
]