from django_filters import rest_framework as filters
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from ..models import Tipo_de_expediente, Tipo_de_expediente_detalle
from .serializers import Tipo_de_expedienteSerializer, Tipo_de_expediente_detalleSerializer, \
    Tipo_de_expediente_detalleNewUpdateSerializer
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie


class Tipo_de_expedienteListView(ListCreateAPIView):
    """
    Vista para lista de tipos de expedientes, se permite crear un nuevo tipo expediente en la misma vista.
    Esta vista estara cacheada.
    """
    queryset = Tipo_de_expediente.objects.all()
    serializer_class = Tipo_de_expedienteSerializer

    # TODO sigue sin paginar
    # Cache requested url for each user for 2 hours
    @method_decorator(cache_page(60))
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(queryset, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class Tipo_de_expedienteDetailView(RetrieveUpdateDestroyAPIView):
    """
    Vista para un tipo de expediente dado un ID, se permite actualizar y eliminar en la misma vista.
    """
    queryset = Tipo_de_expediente.objects.all()
    serializer_class = Tipo_de_expedienteSerializer


class Tipo_de_expediente_detalleFilter(filters.FilterSet):
    """
    Filtros para detalle tipo de expedientes.
    """
    class Meta:
        model = Tipo_de_expediente_detalle
        fields = ('tipo_de_expediente_id', 'dependencia_id', 'orden')


class Tipo_de_expediente_detalleListView(ListCreateAPIView):
    """
    Vista para lista de detalle tipo expediente, se permite crear en la misma vista.
    """
    queryset = Tipo_de_expediente_detalle.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = Tipo_de_expediente_detalleFilter

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return Tipo_de_expediente_detalleNewUpdateSerializer
        return Tipo_de_expediente_detalleSerializer


class Tipo_de_expediente_detalleDetailView(RetrieveUpdateDestroyAPIView):
    """
    Vista para un detalle tipo expediente dado un ID, se permite actualizar y eliminar.
    """
    queryset = Tipo_de_expediente_detalle.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return Tipo_de_expediente_detalleNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return Tipo_de_expediente_detalleNewUpdateSerializer
        return Tipo_de_expediente_detalleSerializer
