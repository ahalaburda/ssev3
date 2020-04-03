from rest_framework.generics import ListAPIView, RetrieveAPIView
from ..models import Lote
from .serializers import LoteSerializer


class LoteListView(ListAPIView):
    queryset = Lote.objects.all()
    serializer_class = LoteSerializer


class LoteDetailView(RetrieveAPIView):
    queryset = Lote.objects.all()
    serializer_class = LoteSerializer