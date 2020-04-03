from django.contrib import admin

# Register your models here.
from .models import Dependencia
from .models import Dependencia_por_usuario

admin.site.register(Dependencia)
admin.site.register(Dependencia_por_usuario)