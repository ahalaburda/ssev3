from rest_framework import serializers
from apps.expedientes.models import Expediente, Instancia, Estado


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
