from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from apps.dependencias.models import Dependencia, Dependencia_por_usuario
from .serializers import DependenciaSerializer, Dependencia_por_usuarioSerializer, \
    Dependencia_por_usuarioNewUpdateSerializer
from rest_framework.response import Response
from django_filters import rest_framework as filters


class DependenciaListView(ListCreateAPIView):
    """
    Lista de todas las dependencias. Se permite se permite la creacion de una nueva dependencia en la misma vista.
    """
    queryset = Dependencia.objects.all()
    serializer_class = DependenciaSerializer


class DependenciaDetailView(RetrieveUpdateDestroyAPIView):
    """
    Vista para una sola dependencia de acuerdo a su ID, se permite actualizar y eliminar en la misma vista.
    """
    queryset = Dependencia.objects.all()
    serializer_class = DependenciaSerializer


class Dependencia_por_usuarioFilter(filters.FilterSet):
    class Meta:
        model = Dependencia_por_usuario
        fields = ('usuario_id', 'dependencia_id')


class Dependencia_por_usuarioListView(ListCreateAPIView):
    """
    Lista para todas las dependencias por usuario. Se permite la creacion de una nueva dependencia por usuaro en
    la misma vista.
    """
    queryset = Dependencia_por_usuario.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = Dependencia_por_usuarioFilter

    # si es post se utiliza el serializer para actualizar, si no, simplemente el destinado a listar.
    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return Dependencia_por_usuarioNewUpdateSerializer
        return Dependencia_por_usuarioSerializer

    def list(self, request, *args, **kwargs):
        filtered_list = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(filtered_list, many=True)
        return Response(serializer.data)


class Dependencia_por_usuarioDetailView(RetrieveUpdateDestroyAPIView):
    """
    Vista para una sola dependencia por usuario de acuerdo a su ID, se permite actualizar y eliminar en la misma vista.
    """
    queryset = Dependencia_por_usuario.objects.all()

    # de la misma manera para el metodo de la clase anterior.
    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return Dependencia_por_usuarioNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return Dependencia_por_usuarioNewUpdateSerializer
        return Dependencia_por_usuarioSerializer

#Vista sin paginacion de las Dependencias
class DependenciasSinPaginarListView(ListAPIView):
    queryset = Dependencia.objects.all().order_by('descripcion')
    serializer_class = DependenciaSerializer

    def list(self, request, *args, **kwargs):
        filtered_list = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(filtered_list, many=True)
        return Response(serializer.data)
