from django_filters import rest_framework as filters
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from ..models import Lote
from .serializers import LoteSerializer, LoteNewUpdateSerializer


class LoteFilter(filters.FilterSet):
    """
    Filtros para lotes.
    """
    descripcion = filters.CharFilter(field_name='descripcion', lookup_expr='icontains')
    fecha_creacion = filters.DateFromToRangeFilter(field_name='fecha_creacion')

    class Meta:
        model = Lote
        fields = ('dependencia_destino_id', 'fecha_creacion', 'descripcion')


class LoteListView(ListCreateAPIView):
    """
    Vista para lista de lotes, se permite la creacion de un lote en la misma vista.
    """
    queryset = Lote.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = LoteFilter

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return LoteNewUpdateSerializer
        return LoteSerializer


class LoteDetailView(RetrieveUpdateDestroyAPIView):
    """
    Vista para un lote dado un ID, se permite actualizar y eliminar en la misma vista.
    """
    queryset = Lote.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return LoteNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return LoteNewUpdateSerializer
        return LoteSerializer
