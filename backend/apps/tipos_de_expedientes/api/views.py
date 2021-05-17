from django_filters import rest_framework as filters
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from ..models import Tipo_de_expediente, Tipo_de_expediente_detalle
from .serializers import Tipo_de_expedienteSerializer, Tipo_de_expediente_detalleSerializer, \
    Tipo_de_expediente_detalleNewUpdateSerializer
from rest_framework.response import Response


class TipoDeExpedienteFilter (filters.FilterSet):

    desc = filters.CharFilter(field_name='descripcion', lookup_expr='exact')
    estado = filters.BooleanFilter(field_name='activo', lookup_expr='exact')

    class Meta:
        model = Tipo_de_expediente
        fields = ('desc', 'estado')

class Tipo_de_expedienteListView(ListCreateAPIView):
    """
    Vista para lista de tipos de expedientes, se permite crear un nuevo tipo expediente en la misma vista.
    Esta vista estara cacheada.
    """
    queryset = Tipo_de_expediente.objects.all().order_by('descripcion')
    serializer_class = Tipo_de_expedienteSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = TipoDeExpedienteFilter


class Tipo_de_expedienteDetailView(RetrieveUpdateDestroyAPIView):
    """
    Vista para un tipo de expediente dado un ID, se permite actualizar y eliminar en la misma vista.
    """
    queryset = Tipo_de_expediente.objects.all()
    serializer_class = Tipo_de_expedienteSerializer


class Tipo_de_expediente_detalleFilter(filters.FilterSet):
    """
    Filtros para detalle tipo de expedientes.
    """
    class Meta:
        model = Tipo_de_expediente_detalle
        fields = ('tipo_de_expediente_id', 'dependencia_id', 'orden')


class Tipo_de_expediente_detalleListView(ListCreateAPIView):
    """
    Vista para lista de detalle tipo expediente, se permite crear en la misma vista.
    """
    queryset = Tipo_de_expediente_detalle.objects.all().order_by('orden')
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = Tipo_de_expediente_detalleFilter

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return Tipo_de_expediente_detalleNewUpdateSerializer
        return Tipo_de_expediente_detalleSerializer


class Tipo_de_expediente_detalleDetailView(RetrieveUpdateDestroyAPIView):
    """
    Vista para un detalle tipo expediente dado un ID, se permite actualizar y eliminar.
    """
    queryset = Tipo_de_expediente_detalle.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return Tipo_de_expediente_detalleNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return Tipo_de_expediente_detalleNewUpdateSerializer
        return Tipo_de_expediente_detalleSerializer


#Vista para Tipos de Expedientes sin paginar
class TipoDeExpedientesSinPagListView(ListAPIView):
    queryset = Tipo_de_expediente.objects.all().order_by('descripcion').exclude(activo="False")
    serializer_class = Tipo_de_expedienteSerializer

    def list(self, request, *args, **kwargs):
        filtered_list = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(filtered_list, many=True)
        return Response(serializer.data)
