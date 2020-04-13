from rest_framework import serializers
from apps.expedientes.models import Expediente, Instancia, Estado, Comentario, Objeto_de_Gasto


class ExpedienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expediente
        # fields = ('descripcion', 'activo')
        fields = '__all__'


class InstanciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instancia
        fields = '__all__'


class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'


class Objeto_de_GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objeto_de_Gasto
        fields = '__all__'


class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'
