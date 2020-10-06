from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from apps.dependencias.models import Dependencia, Dependencia_por_usuario
from .serializers import DependenciaSerializer, Dependencia_por_usuarioSerializer, \
    Dependencia_por_usuarioNewUpdateSerializer


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


class Dependencia_por_usuarioListView(ListCreateAPIView):
    """
    Lista para todas las dependencias por usuario. Se permite la creacion de una nueva dependencia por usuaro en
    la misma vista.
    """
    queryset = Dependencia_por_usuario.objects.all()

    # si es post se utiliza el serializer para actualizar, si no, simplemente el destinado a listar.
    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return Dependencia_por_usuarioNewUpdateSerializer
        return Dependencia_por_usuarioSerializer


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
