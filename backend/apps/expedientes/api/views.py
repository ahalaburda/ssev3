from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from apps.expedientes.models import Expediente, Instancia, Estado
from .serializers import ExpedienteSerializer, InstanciaSerializer, EstadoSerializer


class ExpedienteListView(ListCreateAPIView):
    queryset = Expediente.objects.all()
    serializer_class = ExpedienteSerializer


class ExpedienteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Expediente.objects.all()
    serializer_class = ExpedienteSerializer


class InstanciaListView(ListCreateAPIView):
    queryset = Instancia.objects.all()
    serializer_class = InstanciaSerializer


class InstanciaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Instancia.objects.all()
    serializer_class = InstanciaSerializer


class EstadoListView(ListCreateAPIView):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer


class EstadoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer