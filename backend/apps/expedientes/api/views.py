from django_filters import rest_framework as filters
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.response import Response
from .serializers import *
from request_limiter import request_limiter, LimitedIntervalStrategy, LimitException
import datetime


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
    fecha_desde = filters.DateFilter(field_name='expediente_id__fecha_creacion__date', lookup_expr='gte')
    fecha_hasta = filters.DateFilter(field_name='expediente_id__fecha_creacion__date', lookup_expr='lte')
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


def get_last_instancias():
    """
    Obtener las ultimas instancias para cada expediente y ordenarlos de manera descendente con respecto al ID expediente
    """
    from django.db.models import Max
    return Instancia.objects.filter(
        id__in=Instancia.objects.values('expediente_id').annotate(id=Max('id')).values('id')
    ).order_by('-expediente_id')

class InstanciasForReportesListView(ListAPIView):
    """
    Vista para listar la ultima instancia de cada expediente sin paginar
    """
    queryset = get_last_instancias()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = InstanciaFilter
    serializer_class = InstanciaSerializer

    def list(self, request, *args, **kwargs):
        filtered_list = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(filtered_list, many=True)
        return Response(serializer.data)

class LastInstanciaListView(ListCreateAPIView):
    """
    Vista para lista de instancias, la lista utiliza la funcion de get_last_instancias para traer siempre las ultimas
     instancias. Se permite la creacion de una nueva instancia en la misma vista.
    """
    queryset = get_last_instancias()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = InstanciaFilter

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return InstanciaNewUpdateSerializer
        return InstanciaSerializer

    def list(self, request, *args, **kwargs):
        filtered_list = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(filtered_list)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(filtered_list, many=True)
        return Response(serializer.data)


class InstanciaExpedienteFilter(filters.FilterSet):
    estado = filters.CharFilter(field_name='estado_id__descripcion', lookup_expr='exact')
    anho = filters.NumberFilter(field_name='expediente_id__anho', lookup_expr='exact')

    class Meta:
        model: Instancia
        fields = 'estado'


class InstanciaExpedienteList(ListAPIView):
    """
    Vista para la lista de expedientes con respecto a la dependencia actual en la que se encuentra el usuario
    autenticado. Se excluyen los expedientes 'finalizados y anulados'.
    """
    queryset = get_last_instancias().exclude(expediente_id__estado_id__descripcion='Finalizado')\
        .exclude(expediente_id__estado_id__descripcion='Anulado')
    serializer_class = InstanciaSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = InstanciaExpedienteFilter

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset() \
            .filter(dependencia_actual_id__dependencia_por_usuario__usuario_id=kwargs.get('user_id'))
        filtered_list = self.filter_queryset(queryset)
        page = self.paginate_queryset(filtered_list)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(filtered_list, many=True)
        return Response(serializer.data)


class InstanciasMEList(ListAPIView):
    queryset = Instancia.objects.all().order_by('-expediente_id__numero_mesa_de_entrada')
    serializer_class = InstanciaSerializer

    #se limitan los request a la vista a 1 por segundo, para evitar que se asigne el mismo nro de mesa
    #esto puede llegar a ocurrir cuando 2 o mas usuarios hacen el request al mismo tiempo
    @request_limiter(strategy=LimitedIntervalStrategy(requests=1, interval=1))  # 1 request per second
    def list(self, request, *args, **kwargs):
        #se toma el año actual en el que corre el servidor para hacer la consulta a la BD
        day = datetime.datetime.now()
        formatedYear = day.strftime("%Y")
        queryset = self.get_queryset()\
            .filter(dependencia_actual_id__descripcion='Mesa Entrada', estado_id__descripcion='Recibido', expediente_id__anho=formatedYear)[:1]
        filtered_list = self.filter_queryset(queryset)
        serializer = self.get_serializer(filtered_list, many=True)
        return Response(serializer.data)


class ExpedienteInstaciasFilter(filters.FilterSet):
    orden = filters.NumberFilter(field_name='orden_actual', lookup_expr='exact')
    exp_id = filters.NumberFilter(field_name='expediente_id', lookup_expr='exact')

    class Meta:
        model: Instancia
        fields = ('orden', 'exp_id')


class ExpedienteInstanciasList(ListAPIView):
    """
    Vista para la lista de todas las instancias de cada expediente con respecto a su ID
    """
    queryset = Instancia.objects.all().order_by('-fecha_creacion')
    serializer_class = InstanciaSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ExpedienteInstaciasFilter

    def list(self, request, *args, **kwargs):
        filtered_list = self.filter_queryset(self.get_queryset())

        serializer = self.get_serializer(filtered_list, many=True)
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


class ComentarioFilter(filters.FilterSet):
    """
    Filtros para la lista de comentarios
    """
    comentario_por_expediente_id = filters.NumberFilter(field_name='instancia_id__expediente_id', lookup_expr='exact')
    class Meta:
        model = Comentario
        fields = 'comentario_por_expediente_id',


class ComentarioListView(ListCreateAPIView):
    """
    Vista para todos los comentarios, se permite agregar comentarios en la misma vista.
    """
    queryset = Comentario.objects.all().order_by('-fecha_creacion')
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ComentarioFilter

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return ComentarioNewUpdateSerializer
        return ComentarioSerializer

    def list(self, request, *args, **kwargs):
        filtered_list = self.filter_queryset(self.get_queryset())

        serializer = self.get_serializer(filtered_list, many=True)
        return Response(serializer.data)


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

#Vistas para objetos de gastos sin paginar
class Objeto_de_Gasto_NoPag_ListView(ListAPIView):
    queryset = Objeto_de_Gasto.objects.all()
    serializer_class = Objeto_de_GastoSerializer

    def list(self, request, *args, **kwargs):
        filtered_list = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(filtered_list, many=True)
        return Response(serializer.data)