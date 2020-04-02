from rest_framework import serializers

from apps.dependencias.models import Dependencia
from apps.dependencias.models import Dependencia_por_usuario

class DependenciaSerializer(serializers.ModelSerializer):
	class Meta:
		model = Dependencia
		fields = ('descripcion', 'activo')
		# fields = '__all__'

class Dependencia_por_usuarioSerializer(serializers.ModelSerializer):
	dependencia_id = DependenciaSerializer(many=True)
	class Meta:
		model = Dependencia_por_usuario
		# fields = ('dependencia_id', 'usuario_id')
		fields = '__all__'