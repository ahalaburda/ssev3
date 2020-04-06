from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from ..models import Lote
from .serializers import LoteSerializer


class LoteListView(ListCreateAPIView):
    queryset = Lote.objects.all()
    serializer_class = LoteSerializer


class LoteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Lote.objects.all()
    serializer_class = LoteSerializer