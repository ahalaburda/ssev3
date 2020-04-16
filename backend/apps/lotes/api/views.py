from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from ..models import Lote
from .serializers import LoteSerializer, LoteNewUpdateSerializer


class LoteListView(ListCreateAPIView):
    queryset = Lote.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return LoteNewUpdateSerializer
        return LoteSerializer


class LoteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Lote.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return LoteNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return LoteNewUpdateSerializer
        return LoteSerializer
