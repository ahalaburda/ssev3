from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from apps.expedientes.models import Expediente, Instancia
from .serializers import ExpedienteSerializer, InstanciaSerializer


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
