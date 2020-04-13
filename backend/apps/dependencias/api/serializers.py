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
        #https://es.stackoverflow.com/questions/5419/django-rest-framework-serializando-modelos-que-tienen-campos-relaciones-foreignk?rq=1
