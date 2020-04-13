from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from apps.expedientes.models import Expediente, Instancia, Comentario, Objeto_de_Gasto
from .serializers import ExpedienteSerializer, InstanciaSerializer, ComentarioSerializer, Objeto_de_GastoSerializer

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
