from django.urls import path, include
from django.contrib import admin
from django.conf import settings             # <--- Імпорт
from django.conf.urls.static import static   # <--- Імпорт
urlpatterns = [
    path('admin/', admin.site.urls),   
    path('', include('main.urls'))
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)