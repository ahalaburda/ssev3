from django.urls import path
from .views import ExpedienteListView, ExpedienteDetailView
from .views import InstanciaListView, InstanciaDetailView
from .views import ComentarioListView, ComentarioDetailView
from .views import Objeto_de_GastoListView, Objeto_de_GastoDetailView
from .views import PrioridadListView, PrioridadDetailView


urlpatterns = [
	path('expedientes',ExpedienteListView.as_view()),
	path('expedientes/<pk>',ExpedienteDetailView.as_view()),
	path('instancias', InstanciaListView.as_view()),
	path('instancias/<pk>', InstanciaDetailView.as_view()),
	path('comentarios', ComentarioListView.as_view()),
	path('comentarios/<pk>', ComentarioDetailView.as_view()),
	path('objetos_de_gastos', Objeto_de_GastoListView.as_view()),
	path('objetos_de_gastos/<pk>', Objeto_de_GastoDetailView.as_view()),
	path('estados', EstadoListView.as_view()),
	path('estados/<pk>', EstadoDetailView.as_view()),
	path('prioridades', PrioridadListView.as_view()),
	path('prioridades/<pk>', PrioridadDetailView.as_view()),
]