from django.contrib import admin

# Register your models here.

from .models import Tipo_de_expediente
from .models import Tipo_de_expediente_detalle

admin.site.register(Tipo_de_expediente)
admin.site.register(Tipo_de_expediente_detalle)