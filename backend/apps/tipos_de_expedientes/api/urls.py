from django.urls import path
from .views import Tipo_de_expedienteListView, Tipo_de_expedienteDetailView
from .views import Tipo_de_expediente_detalleListView, Tipo_de_expediente_detalleDetailView

urlpatterns = [
    path('tipos_de_expedientes', Tipo_de_expedienteListView.as_view()),
    path('tipos_de_expedientes/<int:pk>/', Tipo_de_expedienteDetailView.as_view()),
    path('tipos_de_expedientes_detalles', Tipo_de_expediente_detalleListView.as_view()),
    path('tipos_de_expedientes_detalles/<int:pk>/', Tipo_de_expediente_detalleDetailView.as_view())
]