from django.urls import path
from .views import ExpedienteListView, ExpedienteDetailView
from .views import InstanciaListView, InstanciaDetailView


urlpatterns = [
	path('expedientes',ExpedienteListView.as_view()),
	path('expdedientes/<pk>',ExpedienteDetailView.as_view()),
	path('instancias', InstanciaListView.as_view()),
	path('instancias/<pk>', InstanciaDetailView.as_view()),
]