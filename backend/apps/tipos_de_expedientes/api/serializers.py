from rest_framework import serializers
from apps.tipos_de_expedientes.models import Tipo_de_expediente, Tipo_de_expediente_detalle


class Tipo_de_expedienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo_de_expediente
        fields = '__all__'


class Tipo_de_expediente_detalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo_de_expediente_detalle
        fields = '__all__'
        depth = 1


class Tipo_de_expediente_detalleNewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo_de_expediente_detalle
        fields = '__all__'
