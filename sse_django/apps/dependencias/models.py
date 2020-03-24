from django.db import models

class Dependencia(models.Model):
	descripcion = models.CharField(max_length=100)
	activo  = models.BooleanField(default=True)
	def __str__(self):
		return str(self.id)+" - "+str(self.descripcion)

class Dependencia_por_usuario(models.Model):
	dependencia_id = models.ForeignKey(Dependencia, null=True, blank=True, on_delete=models.CASCADE)
	# usuario_id = models.ForeignKey(User, null=False, blank=False, on_delete=models.CASCADE)

	def __str__(self):
		return str(self.id)+" - "+str(self.dependencia_id)

