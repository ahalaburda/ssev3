from django.urls import path
from .views import LoteListView, LoteDetailView

urlpatterns = [
    path('lotes/', LoteListView.as_view(), name="lotes"),
    path('lotes/<pk>', LoteDetailView.as_view()),
]
