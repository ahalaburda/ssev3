from django.urls import path
from .views import Tipo_de_expedienteListView, Tipo_de_expedienteDetailView
from .views import Tipo_de_expediente_detalleListView, Tipo_de_expediente_detalleDetailView
from .views import TipoDeExpedientesSinPagListView

urlpatterns = [
    path('tipos_de_expedientes/', Tipo_de_expedienteListView.as_view(), name="tipos_de_expedientes"),
    path('tipos_de_expedientes/<pk>', Tipo_de_expedienteDetailView.as_view()),
    path('tipos_de_expedientes_detalles/', Tipo_de_expediente_detalleListView.as_view(), name="tipo_expediente_detalle"),
    path('tipos_de_expedientes_detalles/<pk>', Tipo_de_expediente_detalleDetailView.as_view()),
    path('tipos_de_expedientes_sin_pag/', TipoDeExpedientesSinPagListView.as_view())
]
