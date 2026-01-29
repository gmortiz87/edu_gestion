
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from proyectos.models import Proyecto, Actividad
from django.utils import timezone

try:
    p = Proyecto.objects.first()
    if not p:
        print("No project found")
    else:
        a = Actividad(
            proyecto=p,
            nombre="Diagnostic Activity",
            estado="PLANEADO",
            fecha_inicio="2026-01-01",
            fecha_fin="2026-12-31",
            componente_pam="TIC",
            actor_dirigido="Estudiantes",
            numero_beneficiarios=10,
            entrega_dotacion=False
        )
        a.save()
        print("Save successful")
except Exception as e:
    import traceback
    print("Error detected:")
    traceback.print_exc()
