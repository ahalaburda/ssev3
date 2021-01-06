from django.urls import path
from .views import DependenciaListView
from .views import DependenciaDetailView
from .views import Dependencia_por_usuarioListView
from .views import Dependencia_por_usuarioDetailView

urlpatterns = [
    path('dependencias/', DependenciaListView.as_view(), name="dependencias"),
    path('dependencias/<pk>', DependenciaDetailView.as_view()),
    path('dependencias_por_usuarios/', Dependencia_por_usuarioListView.as_view(), name="dependencias_por_usuarios"),
    path('dependencias_por_usuarios/<pk>', Dependencia_por_usuarioDetailView.as_view())
]
