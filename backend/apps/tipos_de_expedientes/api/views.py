from django_filters import rest_framework as filters
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from ..models import Tipo_de_expediente, Tipo_de_expediente_detalle
from .serializers import Tipo_de_expedienteSerializer, Tipo_de_expediente_detalleSerializer, \
    Tipo_de_expediente_detalleNewUpdateSerializer




class Tipo_de_expedienteListView(ListCreateAPIView):
    queryset = Tipo_de_expediente.objects.all()
    serializer_class = Tipo_de_expedienteSerializer


class Tipo_de_expedienteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Tipo_de_expediente.objects.all()
    serializer_class = Tipo_de_expedienteSerializer

class Tipo_de_expediente_detalleFilter(filters.FilterSet):
    class Meta:
        model = Tipo_de_expediente_detalle
        fields = ('tipo_de_expediente_id', 'orden', 'dependencia_id__descripcion')

class Tipo_de_expediente_detalleListView(ListCreateAPIView):
    queryset = Tipo_de_expediente_detalle.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = Tipo_de_expediente_detalleFilter
    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return Tipo_de_expediente_detalleNewUpdateSerializer
        return Tipo_de_expediente_detalleSerializer


class Tipo_de_expediente_detalleDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Tipo_de_expediente_detalle.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return Tipo_de_expediente_detalleNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return Tipo_de_expediente_detalleNewUpdateSerializer
        return Tipo_de_expediente_detalleSerializer
