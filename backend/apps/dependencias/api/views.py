from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from apps.dependencias.models import Dependencia, Dependencia_por_usuario
from .serializers import DependenciaSerializer, Dependencia_por_usuarioSerializer, \
    Dependencia_por_usuarioNewUpdateSerializer


class DependenciaListView(ListCreateAPIView):
    queryset = Dependencia.objects.all()
    serializer_class = DependenciaSerializer


class DependenciaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Dependencia.objects.all()
    serializer_class = DependenciaSerializer


class Dependencia_por_usuarioListView(ListCreateAPIView):
    queryset = Dependencia_por_usuario.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return Dependencia_por_usuarioNewUpdateSerializer
        return Dependencia_por_usuarioSerializer


class Dependencia_por_usuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Dependencia_por_usuario.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return Dependencia_por_usuarioNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return Dependencia_por_usuarioNewUpdateSerializer
        return Dependencia_por_usuarioSerializer
