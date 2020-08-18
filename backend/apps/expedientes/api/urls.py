from django.urls import path
from .views import *

urlpatterns = [
    path('expedientes/', ExpedienteListView.as_view()),
    path('expedientes/<pk>', expedienteById, name='expediente_by_id'),
    path('expedientes_detalle/', ExpedienteDetail.as_view()),
    path('instancias/', InstanciaListView.as_view()),
    path('instancias/<pk>', InstanciaDetailView.as_view()),
    path('comentarios/', ComentarioListView.as_view()),
    path('comentarios/<pk>', ComentarioDetailView.as_view()),
    path('objetos_de_gastos/', Objeto_de_GastoListView.as_view()),
    path('objetos_de_gastos/<pk>', Objeto_de_GastoDetailView.as_view()),
    path('estados/', EstadoListView.as_view()),
    path('estados/<pk>', EstadoDetailView.as_view()),
    path('prioridades/', PrioridadListView.as_view()),
    path('prioridades/<pk>', PrioridadDetailView.as_view()),
]
