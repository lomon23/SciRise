from django.contrib import admin
from django.urls import path
from weather_app import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('weather', views.get_weather, name='weather'),
]
