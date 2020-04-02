from rest_framework.generics import ListAPIView, RetrieveAPIView

from apps.expedientes.models import Expediente
from .serializers import ExpedienteSerializer

class ExpedienteListView(ListAPIView):
	queryset = Expediente.objects.all()
	serializer_class = ExpedienteSerializer

class ExpedienteDetailView(RetrieveAPIView):
	queryset = Expediente.objects.all()
	serializer_class = ExpedienteSerializer

