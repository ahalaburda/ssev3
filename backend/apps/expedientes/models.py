from djmoney.models.fields import MoneyField
from django.db import models
from django.conf import settings
from apps.dependencias.models import Dependencia
from apps.tipos_de_expedientes.models import Tipo_de_expediente
from apps.lotes.models import Lote


class Estado(models.Model):
    descripcion = models.CharField(max_length=50)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Estados"

    def __str__(self):
        return str(self.descripcion)


class Prioridad(models.Model):
    descripcion = models.CharField(max_length=50)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Prioridades"

    def __str__(self):
        return str(self.descripcion)


class Objeto_de_Gasto(models.Model):
    descripcion = models.CharField(max_length=50)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Objetos de Gastos"

    def __str__(self):
        return str(self.descripcion)


class Expediente(models.Model):
    numero_mesa_de_entrada = models.IntegerField(blank=True, null=False, default=0)
    anho = models.IntegerField(blank=True, null=True)
    descripcion = models.TextField(blank=False, null=False, max_length=300)
    tipo_de_expediente_id = models.ForeignKey(Tipo_de_expediente, db_column='tipo_de_expediente_id',  null=False,
                                              blank=False, on_delete=models.CASCADE)
    dependencia_origen_id = models.ForeignKey(Dependencia, db_column='dependencia_origen_id',
                                              related_name='dependencia_origen', null=False, blank=False,
                                              on_delete=models.CASCADE)
    dependencia_destino_id = models.ForeignKey(Dependencia, db_column='dependencia_destino_id',
                                               related_name='dependencia_destino', null=False, blank=False,
                                               on_delete=models.CASCADE)
    monto = MoneyField(max_digits=15, decimal_places=0, null=True, default_currency='PYG', default=0)
    objeto_de_gasto_id = models.ForeignKey(Objeto_de_Gasto, db_column='objeto_de_gasto_id',  null=True, blank=True,
                                           on_delete=models.CASCADE)
    estado_id = models.ForeignKey(Estado, db_column='estado_id',  related_name='estado_id', null=False, blank=False,
                                  on_delete=models.CASCADE, default=1)
    prioridad_id = models.ForeignKey(Prioridad, db_column='prioridad_id',  related_name='prioridad', null=False,
                                     blank=False, on_delete=models.CASCADE, default=1)
    lote_id = models.ForeignKey(Lote, db_column='lote_id', null=True, blank=True, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True, blank=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True, blank=True)
    fecha_mesa_entrada = models.DateTimeField(auto_now=False, blank=True, null=True)

    class Meta:
        verbose_name_plural = "Expedientes"

    def __str__(self):
        return str(self.id) + " - " + str(self.numero_mesa_de_entrada) + "/" + str(self.anho)

    def getViewUpdateDate(self):
        return str(self.fecha_actualizacion.strftime("%d-%m-%Y - %Hhs"))

    def getViewCreateDate(self):
        return str(self.fecha_creacion.strftime("%d-%m-%Y - %Hhs"))


class Instancia(models.Model):
    expediente_id = models.ForeignKey(Expediente, db_column='expediente_id', related_name='expediente', null=False,
                                      blank=False, on_delete=models.CASCADE)
    orden_actual = models.IntegerField(blank=True, null=True)
    dependencia_anterior_id = models.ForeignKey(Dependencia, db_column='dependencia_anterior_id',
                                                related_name='instancia_anterior', null=True, blank=True,
                                                on_delete=models.CASCADE, default=1)
    dependencia_actual_id = models.ForeignKey(Dependencia, db_column='dependencia_actual_id',
                                              related_name='instancia_actual', null=False, blank=False,
                                              on_delete=models.CASCADE)
    dependencia_siguiente_id = models.ForeignKey(Dependencia, db_column='dependencia_siguiente_id',
                                                 related_name='instancia_siguiente', null=True, blank=True,
                                                 on_delete=models.CASCADE)
    estado_id = models.ForeignKey(Estado, db_column='estado_id', related_name='estado', null=False, blank=False,
                                  on_delete=models.CASCADE, default=1)
    fecha_creacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    fecha_recepcion = models.DateTimeField(blank=True, null=True)
    fecha_final = models.DateTimeField(blank=True, null=True)
    usuario_id_entrada = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='usuario_id_entrada', null=True,
                                           related_name='usuario_entrada', on_delete=models.CASCADE)
    usuario_id_salida = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='usuario_id_salida', null=True,
                                          blank=True, related_name='usuario_salida', on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Instancias"

    def getViewFinalDate(self):
        return str(self.fecha_final.strftime("%d-%m-%Y - %Hhs"))

    def getViewReceptionDate(self):
        return str(self.fecha_recepcion.strftime("%d-%m-%Y - %Hhs"))

    def getViewCreateDate(self):
        return str(self.fecha_creacion.strftime("%d-%m-%Y - %Hhs"))

    # Descripcion del expediente - Dependencia actual
    def __str__(self):
        return str(self.expediente_id) + " - " + str(self.dependencia_actual_id.descripcion)


class Comentario(models.Model):
    descripcion = models.TextField(blank=False, null=False, max_length=200)
    instancia_id = models.ForeignKey(Instancia, db_column='instancia_id',  related_name='instancia', null=False,
                                     on_delete=models.CASCADE)
    usuario_id = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='usuario_id', null=False,
                                   on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        verbose_name_plural = "Comentarios"

    def __str__(self):
        return str(self.instancia_id) + " - " + str(self.descripcion) + " - " + str(self.usuario_id)

    def getViewCreateDate(self):
        return str(self.fecha_creacion.strftime("%d-%m-%Y - %Hhs"))
