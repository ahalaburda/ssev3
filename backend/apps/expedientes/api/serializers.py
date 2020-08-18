from rest_framework import serializers
from apps.expedientes.models import Expediente, Instancia, Estado, Comentario, Objeto_de_Gasto, Prioridad


class Objeto_de_GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objeto_de_Gasto
        fields = '__all__'


class InstanciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instancia
        fields = '__all__'
        depth = 3


class ExpedienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expediente
        fields = '__all__'
        depth = 2


class ExpedienteByIdSerializer(serializers.ModelSerializer):
    dependencia_actual = serializers.SerializerMethodField()
    estado_instancia = serializers.SerializerMethodField()

    class Meta:
        model = Expediente
        fields = ('dependencia_actual', 'estado_instancia')


# expedientes por dependencia y usuario
class ExpedienteListSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)
    instancia_id = serializers.IntegerField(required=True)
    estado_instancia = serializers.IntegerField(required=True)
    tipo_de_expediente_id = serializers.CharField(required=True)
    descripcion = serializers.CharField(required=True)
    numero_mesa_de_entrada = serializers.IntegerField(required=True)
    anho = serializers.IntegerField(required=True)
    monto_currency = serializers.CharField(required=True)
    monto = serializers.CharField(required=True)
    fecha_creacion = serializers.CharField(required=True)
    fecha_actualizacion = serializers.CharField(required=True)
    dependencia_destino_id = serializers.CharField(required=True)
    dependencia_origen_id = serializers.CharField(required=True)
    lote_id = serializers.IntegerField(required=True)
    objeto_de_gasto_id = serializers.CharField(required=True)
    prioridad_id = serializers.CharField(required=True)
    dependencia_actual_id = serializers.CharField(required=True)

    class Meta:
        fields = ('id', 'instancia_id', 'estado_instancia')
        # fields = (
        # 'id', 'numero_mesa_de_entrada', 'anho', 'descripcion', 'monto_currency', 'monto', 'fecha_creacion',
        # 'fecha_actualizacion', 'tipo_de_expediente_id', 'dependencia_origen_id', 'dependencia_destino_id',
        # 'objeto_de_gasto_id', 'estado_id', 'prioridad_id', 'instancias')


class ExpedienteNewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expediente
        fields = '__all__'


class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'


class InstanciaNewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instancia
        fields = '__all__'


class ComentarioSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario_id.username')

    class Meta:
        model = Comentario
        fields = ['id', 'usuario', 'descripcion', 'fecha_creacion', 'instancia_id']
        depth = 1


class ComentarioNewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'


class PrioridadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prioridad
        fields = '__all__'
