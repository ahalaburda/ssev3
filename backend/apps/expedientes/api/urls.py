from django.urls import path
from .views import ExpedienteListView, ExpedienteDetailView
from .views import InstanciaListView, InstanciaDetailView
from .views import EstadoListView, EstadoDetailView


urlpatterns = [
	path('expedientes',ExpedienteListView.as_view()),
	path('expdedientes/<pk>',ExpedienteDetailView.as_view()),
	path('instancias', InstanciaListView.as_view()),
	path('instancias/<pk>', InstanciaDetailView.as_view()),
	path('estados', EstadoListView.as_view()),
	path('estados/<pk>', EstadoDetailView.as_view()),
]