from rest_framework import serializers
from apps.lotes.models import Lote


class LoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lote
        fields = '__all__'
        depth = 1
