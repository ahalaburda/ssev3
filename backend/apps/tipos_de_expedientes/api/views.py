from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from ..models import Tipo_de_expediente, Tipo_de_expediente_detalle
from .serializers import Tipo_de_expedienteSerializer, Tipo_de_expediente_detalleSerializer

class Tipo_de_expedienteListView(ListCreateAPIView):
    queryset = Tipo_de_expediente.objects.all()
    serializer_class = Tipo_de_expedienteSerializer

class Tipo_de_expedienteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Tipo_de_expediente.objects.all()
    serializer_class = Tipo_de_expedienteSerializer

class Tipo_de_expediente_detalleListView(ListCreateAPIView):
    queryset = Tipo_de_expediente_detalle.objects.all()
    serializer_class = Tipo_de_expediente_detalleSerializer

class Tipo_de_expediente_detalleDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Tipo_de_expediente_detalle.objects.all()
    serializer_class = Tipo_de_expediente_detalleSerializer
