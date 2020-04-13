from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from apps.expedientes.models import Expediente, Instancia, Comentario, Objeto_de_Gasto, Prioridad, Estado
from .serializers import ExpedienteSerializer, InstanciaSerializer, ComentarioSerializer, Objeto_de_GastoSerializer, PrioridadSerializer, EstadoSerializer

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

class ComentarioListView(ListCreateAPIView):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

class ComentarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

class Objeto_de_GastoListView(ListCreateAPIView):
    queryset = Objeto_de_Gasto.objects.all()
    serializer_class = Objeto_de_GastoSerializer

class Objeto_de_GastoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Objeto_de_Gasto.objects.all()
    serializer_class = Objeto_de_GastoSerializer

class PrioridadListView(ListCreateAPIView):
    queryset = Prioridad.objects.all()
    serializer_class = PrioridadSerializer

class PrioridadDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Prioridad.objects.all()
    serializer_class = PrioridadSerializer

class EstadoListView(ListCreateAPIView):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer

class EstadoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer