from django_filters import rest_framework as filters
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.response import Response

from .serializers import *


class ExpedienteFilter(filters.FilterSet):
    prioridad = filters.CharFilter(field_name='prioridad_id__descripcion', lookup_expr='exact')
    estado = filters.CharFilter(field_name='estado_id__descripcion', lookup_expr='exact')
    descripcion = filters.CharFilter(field_name='descripcion', lookup_expr='icontains')
    tipo_expediente = filters.CharFilter(field_name='tipo_de_expediente_id__descripcion', lookup_expr='icontains')
    fecha_creacion = filters.DateFromToRangeFilter(field_name='fecha_creacion')
    origen = filters.CharFilter(field_name='dependencia_origen_id__descripcion', lookup_expr='icontains')
    destino = filters.CharFilter(field_name='dependencia_destino_id__descripcion', lookup_expr='icontains')

    class Meta:
        model = Expediente
        fields = ('prioridad', 'estado', 'descripcion', 'tipo_expediente', 'fecha_creacion', 'origen', 'destino')


class ExpedienteListView(ListCreateAPIView):
    queryset = Expediente.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ExpedienteFilter

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return ExpedienteNewUpdateSerializer
        return ExpedienteSerializer


class ExpedienteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Expediente.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return ExpedienteNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return ExpedienteNewUpdateSerializer
        return ExpedienteSerializer


class ExpedienteDetail(ListCreateAPIView):
    # queryset = Instancia.objects.filter(dependencia_actual_id__dependencia_por_usuario__usuario_id=1)
    queryset = Expediente.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ExpedienteFilter
    serializer_class = ExpedienteListSerializer

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return ExpedienteNewUpdateSerializer
        return ExpedienteSerializer


class InstanciaFilter(filters.FilterSet):
    expediente_descripcion = filters.CharFilter(field_name='expediente_id__descripcion', lookup_expr='icontains')
    estado = filters.CharFilter(field_name='estado_id__descripcion', lookup_expr='exact')
    fecha_creacion = filters.DateFromToRangeFilter(field_name='fecha_creacion')
    actual = filters.CharFilter(field_name='dependencia_actual_id__descripcion', lookup_expr='icontains')
    expediente_anho = filters.CharFilter(field_name='expediente_id__anho', lookup_expr='exact')
    expediente_nro_mesa = filters.CharFilter(field_name='expediente_id__numero_mesa_de_entrada', lookup_expr='exact')

    class Meta:
        model = Instancia
        fields = ('expediente_id', 'expediente_descripcion', 'expediente_anho', 'expediente_nro_mesa', 'estado',
                  'fecha_creacion', 'actual')


def get_last_instancias():
    """
    Obtener las ultimas instancias de cada expediente
    """
    return Instancia.objects.filter(id__in=[i.id for i in Instancia.objects.raw(
        'select max(id) as id from expedientes_instancia group by expediente_id '
    )])


class InstanciaListView(ListCreateAPIView):
    queryset = get_last_instancias()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = InstanciaFilter

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return InstanciaNewUpdateSerializer
        return InstanciaSerializer


class InstanciaExpedienteList(ListAPIView):
    queryset = get_last_instancias()
    serializer_class = InstanciaSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()\
            .filter(dependencia_actual_id__dependencia_por_usuario__usuario_id=kwargs.get('user_id'))
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class InstanciaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Instancia.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return InstanciaNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return InstanciaNewUpdateSerializer
        return InstanciaSerializer


class ComentarioListView(ListCreateAPIView):
    queryset = Comentario.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return ComentarioNewUpdateSerializer
        return ComentarioSerializer


class ComentarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Comentario.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return ComentarioNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return ComentarioNewUpdateSerializer
        return ComentarioSerializer


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


# Query de expediente detail
    # queryset = Expediente.objects.raw(
    #     'SELECT expedientes_expediente.id, tipo_de_expediente_id, MAX(expedientes_instancia.id) as instancia_id, '
    #     'expedientes_instancia.estado_id as estado_instancia, expedientes_expediente.descripcion,'
    #     'numero_mesa_de_entrada, anho, monto_currency, monto, expedientes_expediente.fecha_creacion, '
    #     'fecha_actualizacion, dependencia_destino_id, dependencia_origen_id, dependencia_actual_id, lote_id, '
    #     'objeto_de_gasto_id, prioridad_id '
    #     'FROM expedientes_expediente '
    #     'INNER JOIN expedientes_instancia on expedientes_expediente.id = expedientes_instancia.expediente_id '
    #     'INNER JOIN expedientes_estado on expedientes_estado.id = expedientes_instancia.estado_id '
    #     'INNER JOIN (SELECT dependencia_id FROM `dependencias_dependencia_por_usuario` as dpu INNER JOIN auth_user on'
    #     'dpu.usuario_id = auth_user.id WHERE auth_user.id = 1) as dpu on dpu.dependencia_id = '
    #     'expedientes_instancia.dependencia_actual_id '
    #     'WHERE expedientes_instancia.estado_id = 1 or expedientes_instancia.estado_id = 2 '
    #     'GROUP BY expedientes_expediente.id, expedientes_instancia.id')