
import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from proyectos.models import Proyecto
from core.models import LineaVigencia, Usuario

try:
    lv = LineaVigencia.objects.first()
    u = Usuario.objects.first()
    if not lv or not u:
        print("Missing related data (LineaVigencia or Usuario)")
    else:
        p = Proyecto(
            codigo="DEBUG-PRJ-01",
            nombre="Diagnostic Project",
            linea_vigencia=lv,
            responsable=u,
            apoyo_tecnico=u,
            estado="PLANEADO"
        )
        p.save()
        print("Project Save successful")
except Exception as e:
    import traceback
    print("Error detected:")
    traceback.print_exc()
