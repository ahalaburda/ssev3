from django.contrib import admin

# Register your models here.
from .models import Expediente
from .models import Instancia
from .models import Comentario
from .models import Estado
from .models import Prioridad
from .models import Objeto_de_Gasto

admin.site.register(Expediente)
admin.site.register(Instancia)
admin.site.register(Comentario)
admin.site.register(Estado)
admin.site.register(Prioridad)
admin.site.register(Objeto_de_Gasto)