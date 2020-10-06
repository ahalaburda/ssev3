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
    """
    Serializer para comentario, agregando el campo extra de nombre de usuario (nickname).
    """
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
