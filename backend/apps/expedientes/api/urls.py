from django.urls import path

from .views import ExpedienteListView
from .views import ExpedienteDetailView


urlpatterns = [
	path('expedientes',ExpedienteListView.as_view()),
	path('expdedientes/<pk>',ExpedienteDetailView.as_view()),

]