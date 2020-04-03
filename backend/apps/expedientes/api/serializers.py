from rest_framework import serializers

from apps.expedientes.models import Expediente

class ExpedienteSerializer(serializers.ModelSerializer):
	class Meta:
		model = Expediente
		# fields = ('descripcion', 'activo')
		fields = '__all__'

