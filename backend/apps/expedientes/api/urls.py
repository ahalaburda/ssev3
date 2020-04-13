from django.urls import path
from .views import ExpedienteListView, ExpedienteDetailView
from .views import InstanciaListView, InstanciaDetailView
from .views import EstadoListView, EstadoDetailView

from .views import ExpedienteListView, ExpedienteDetailView
from .views import ComentarioListView, ComentarioDetailView
from .views import Objeto_de_GastoListView, Objeto_de_GastoDetailView

urlpatterns = [
	path('expedientes',ExpedienteListView.as_view()),
	path('expedientes/<pk>',ExpedienteDetailView.as_view()),
	path('comentarios', ComentarioListView.as_view()),
	path('comentarios/<pk>', ComentarioDetailView.as_view()),
	path('objetos_de_gastos', Objeto_de_GastoListView.as_view()),
	path('objetos_de_gastos/<pk>', Objeto_de_GastoDetailView.as_view()),
]