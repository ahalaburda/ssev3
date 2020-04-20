from rest_framework import serializers
from apps.dependencias.models import Dependencia
from apps.dependencias.models import Dependencia_por_usuario


class DependenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dependencia
        # fields = ('descripcion', 'activo')
        fields = '__all__'


class Dependencia_por_usuarioSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario_id.username')

    class Meta:
        model = Dependencia_por_usuario
        fields = ('id', 'dependencia_id', 'usuario')
        # fields = '__all__'
        depth = 1
        # https://www.django-rest-framework.org/api-guide/serializers/#specifying-nested-serialization
        # https://es.stackoverflow.com/questions/5419/django-rest-framework-serializando-modelos-que-tienen-campos-relaciones-foreignk?rq=1


class Dependencia_por_usuarioNewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dependencia_por_usuario
        fields = '__all__'
