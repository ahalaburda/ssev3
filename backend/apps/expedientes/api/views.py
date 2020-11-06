from django_filters import rest_framework as filters
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.response import Response
from .serializers import *
import pandas


class ExpedienteFilter(filters.FilterSet):
    """
    Filtros para la lista de expediente.
    """
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
    """
    Vista para lista de todos los expedientes. Se permite la creacion en la misma vista.
    """
    queryset = Expediente.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ExpedienteFilter

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return ExpedienteNewUpdateSerializer
        return ExpedienteSerializer


class ExpedienteDetailView(RetrieveUpdateDestroyAPIView):
    """
    Vista para un expediente dado su ID, se permite actualizar y eliminar el expediente en la misma vista.
    """
    queryset = Expediente.objects.all()

    # si el metodo es PUT o PATCH se utiliza el serializer para actualizar, si no el normal con el atributo depth
    # seteado.
    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return ExpedienteNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return ExpedienteNewUpdateSerializer
        return ExpedienteSerializer


class InstanciaFilter(filters.FilterSet):
    """
    Filtros para la lista de instancias
    """
    expediente_descripcion = filters.CharFilter(field_name='expediente_id__descripcion', lookup_expr='icontains')
    estado = filters.CharFilter(field_name='estado_id__descripcion', lookup_expr='exact')
    fecha_desde = filters.DateTimeFilter(field_name='expediente_id__fecha_creacion', lookup_expr='gte')
    fecha_hasta = filters.DateTimeFilter(field_name='expediente_id__fecha_creacion', lookup_expr='lte')
    actual = filters.CharFilter(field_name='dependencia_actual_id__descripcion', lookup_expr='icontains')
    expediente_anho = filters.CharFilter(field_name='expediente_id__anho', lookup_expr='exact')
    expediente_nro_mesa = filters.CharFilter(field_name='expediente_id__numero_mesa_de_entrada', lookup_expr='exact')
    objeto_de_gasto = filters.CharFilter(field_name='expediente_id__objeto_de_gasto_id__descripcion',
                                         lookup_expr='exact')
    origen = filters.CharFilter(field_name='expediente_id__dependencia_origen_id__descripcion', lookup_expr='exact')

    class Meta:
        model = Instancia
        fields = ('expediente_id', 'expediente_descripcion', 'expediente_anho', 'expediente_nro_mesa', 'estado',
                  'fecha_desde', 'fecha_hasta', 'actual', 'objeto_de_gasto', 'origen')


def list_to_queryset(model, data):
    """
        Pasa de lista a Queryset, verificando primero el Modelo y la lista a ser convertido
        https://stackoverflow.com/questions/18607698/how-to-convert-a-list-in-to-queryset-django/18610447
    """
    from django.db.models.base import ModelBase
    if not isinstance(model, ModelBase):
        raise ValueError(
            "%s must be Model" % model
        )
    if not isinstance(data, list):
        raise ValueError(
            "%s must be List Object" % data
        )
    pk_list = [obj.pk for obj in data]
    return model.objects.filter(pk__in=pk_list)


def get_last_instancia_by_expediente_id(id):
    """
    Obtiene la ultima instancia por el id del expediente.
    """
    return Instancia.objects.filter(expediente_id=id).last()


def get_last_instancias():
    """
    Obtener las ultimas instancias para cada expediente.
    """
    # https://mode.com/blog/group-by-sql-python/
    # inst_values = Instancia.objects.values('id', 'expediente_id')  # obtener los IDs de instancia y de expediente
    # df = pandas.DataFrame(inst_values)  # hacer un DataFrame de la lista de IDs
    # max_grouped = df.groupby('expediente_id').max()  # agrupar por expediente y tomar los maximos
    # list_grouped = max_grouped.to_numpy().flatten()  # convertir a una lista
    # return Instancia.objects.filter(id__in=list_grouped)  # filtrar las instancias

    # return Instancia.objects.filter(id__in=[i.id for i in Instancia.objects.raw(
    #     'select max(id) as id from expedientes_instancia group by expediente_id '
    # )])

    # expedientes = Expediente.objects.all()
    # instancias = []
    # for expediente in expedientes:
    #         instancias.append(get_last_instancia_by_expediente_id(expediente.id))
    # return instancias

    from django.db.models import Max
    return Instancia.objects.filter(
        id__in=Instancia.objects.values('expediente_id').annotate(id=Max('id')).values('id')
    )

class InstanciaListView(ListCreateAPIView):
    """
    Vista para lista de instancias, la lista utiliza la funcion de get_last_instancias para traer siempre las ultimas
     instancias. Se permite la creacion de una nueva instancia en la misma vista.
    """
    # queryset = get_last_instancias()
    queryset = list_to_queryset(Instancia, get_last_instancias())
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = InstanciaFilter

    # def list(self, request, *args, **kwargs):
    #     queryset = get_last_instancias()
    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = self.get_serializer(page, many=True)
    #         return self.get_paginated_response(serializer.data)
    #
    #     serializer = self.get_serializer(queryset, many=True)
    #     return Response(serializer.data)

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return InstanciaNewUpdateSerializer
        return InstanciaSerializer


# TODO ordenar la lista
class InstanciaExpedienteList(ListAPIView):
    """
    Vista para la lista de expedientes con respecto a la dependencia actual en la que se encuentra el usuario
    autenticado.
    """
    # queryset = get_last_instancias()
    queryset = list_to_queryset(Instancia, get_last_instancias())
    serializer_class = InstanciaSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset() \
            .filter(dependencia_actual_id__dependencia_por_usuario__usuario_id=kwargs.get('user_id'))
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class InstanciaDetailView(RetrieveUpdateDestroyAPIView):
    """
    Vista para una instancia dado un ID, se permite actualizar y eliminar en la misma vista.
    """
    queryset = Instancia.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return InstanciaNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return InstanciaNewUpdateSerializer
        return InstanciaSerializer


class ComentarioListView(ListCreateAPIView):
    """
    Vista para todos los comentarios, se permite agregar comentarios en la misma vista.
    """
    queryset = Comentario.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return ComentarioNewUpdateSerializer
        return ComentarioSerializer


class ComentarioDetailView(RetrieveUpdateDestroyAPIView):
    """
    Vista para un comentario dado un ID, se permite actualizar y eliminar en la misma vista.
    """
    queryset = Comentario.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT']:
            return ComentarioNewUpdateSerializer
        elif self.request.method in ['PATCH']:
            return ComentarioNewUpdateSerializer
        return ComentarioSerializer


# Vistas para lista y detalle de objeto de gasto, prioridad y estado
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
