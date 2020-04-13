from rest_framework import serializers
from ..models import Tipo_de_expediente, Tipo_de_expediente_detalle

class Tipo_de_expedienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo_de_expediente
        fields = ('descripcion', 'activo')

class Tipo_de_expediente_detalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo_de_expediente_detalle
        fields = '__all__'