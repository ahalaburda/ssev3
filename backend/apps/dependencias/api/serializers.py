from rest_framework import serializers

from apps.dependencias.models import Dependencia
from apps.dependencias.models import Dependencia_por_usuario


class DependenciaSerializer(serializers.ModelSerializer):
	class Meta:
		model = Dependencia
		# fields = ('descripcion', 'activo')
		fields = '__all__'

class Dependencia_por_usuarioSerializer(serializers.ModelSerializer):
	class Meta:
		model = Dependencia_por_usuario
		# fields = ('id','dependencia',  'usuario_id')
		fields = '__all__'
		depth = 1 # https://www.django-rest-framework.org/api-guide/serializers/#specifying-nested-serialization
		



# Dependencia_por_usuarioSerializer():
#     id = IntegerField(label='ID', read_only=True)
#     dependencia = DependenciaSerializer(many=True, read_only=True):
#         descripcion = CharField(max_length=100)
#         activo = BooleanField(required=False)
#     dependencia_id = PrimaryKeyRelatedField(allow_null=True, queryset=Dependencia.objects.all(), required=False)
#     usuario_id = PrimaryKeyRelatedField(allow_null=True, queryset=User.objects.all(), required=False)
