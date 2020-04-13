from rest_framework import serializers
from apps.expedientes.models import Expediente, Instancia, Comentario, Objeto_de_Gasto

class Objeto_de_GastoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Objeto_de_Gasto
		fields = '__all__'

class ExpedienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expediente
        # fields = ('descripcion', 'activo')
        fields = '__all__'

class InstanciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instancia
        fields = '__all__'

class ComentarioSerializer(serializers.ModelSerializer):
	class Meta:
		model = Comentario
		fields = '__all__'
