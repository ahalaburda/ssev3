from django.urls import path
from .views import *

urlpatterns = [
    path('expedientes/', ExpedienteListView.as_view(), name="expedientes"),
    path('expedientes/<pk>', ExpedienteDetailView.as_view()),
    path('instancias/', LastInstanciaListView.as_view(), name="instancias"),
    path('instancias/expedientes/<user_id>', InstanciaExpedienteList.as_view()),
    path('instancias/<pk>', InstanciaDetailView.as_view()),
    path('comentarios/', ComentarioListView.as_view(), name="comentarios"),
    path('comentarios/<pk>', ComentarioDetailView.as_view()),
    path('objetos_de_gastos/', Objeto_de_GastoListView.as_view(), name="objetos_de_gastos"),
    path('objetos_de_gastos/<pk>', Objeto_de_GastoDetailView.as_view()),
    path('objetos_de_gastos_no_pag/', Objeto_de_Gasto_NoPag_ListView.as_view()),
    path('estados/', EstadoListView.as_view(), name="estados"),
    path('estados/<pk>', EstadoDetailView.as_view()),
    path('prioridades/', PrioridadListView.as_view(), name="prioridades"),
    path('prioridades/<pk>', PrioridadDetailView.as_view()),
    path('instancias_por_expediente/', ExpedienteInstanciasList.as_view()),
    path('instancias_por_dependencia/<dependencia>/<estado>/<anho>', InstanciasMEList.as_view())
]
