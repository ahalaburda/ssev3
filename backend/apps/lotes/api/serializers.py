from rest_framework import serializers
from apps.lotes.models import Lote


class LoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lote
        fields = ('descripcion', 'fecha_creacion', 'dependencia_destino_id', 'activo')
        depth = 1