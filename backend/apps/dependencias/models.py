from django.db import models
from django.conf import settings


class Dependencia(models.Model):
    descripcion = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Dependencias"

    def __str__(self):
        return str(self.descripcion)


class Dependencia_por_usuario(models.Model):
    dependencia_id = models.ForeignKey(Dependencia, db_column='dependencia_id',  null=False, blank=True, on_delete=models.CASCADE)
    usuario_id = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='usuario_id',  null=False, blank=True, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Dependencias por Usuarios"

    def __str__(self):
        return str(self.id)+" - "+str(self.dependencia_id)

