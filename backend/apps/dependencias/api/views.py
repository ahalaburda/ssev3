from rest_framework.generics import ListAPIView, RetrieveAPIView

from apps.dependencias.models import Dependencia, Dependencia_por_usuario
from .serializers import DependenciaSerializer, Dependencia_por_usuarioSerializer

class DependenciaListView(ListAPIView):
    queryset = Dependencia.objects.all()
    serializer_class = DependenciaSerializer

class DependenciaDetailView(RetrieveAPIView):
    queryset = Dependencia.objects.all()
    serializer_class = DependenciaSerializer

class Dependencia_por_usuarioListView(ListAPIView):
    queryset = Dependencia_por_usuario.objects.all()
    serializer_class = Dependencia_por_usuarioSerializer

class Dependencia_por_usuarioDetailView(RetrieveAPIView):
    queryset = Dependencia_por_usuario.objects.all()
    serializer_class = Dependencia_por_usuarioSerializer