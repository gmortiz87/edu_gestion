
import os
import django
from rest_framework import serializers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from proyectos.models import Proyecto
from proyectos.serializers import ProyectoSerializer
from core.models import LineaVigencia, Usuario

try:
    lv = LineaVigencia.objects.first()
    u = Usuario.objects.first()
    
    data = {
        "codigo": "111222",
        "nombre": "Test Project Serializer",
        "linea_vigencia": lv.id_linea_vigencia,
        "responsable": u.id_usuario,
        "apoyo_tecnico": u.id_usuario,
        "estado": "PLANEADO",
        "fecha_inicio": "2026-01-01",
        "fecha_fin": "2026-12-31"
    }
    
    serializer = ProyectoSerializer(data=data)
    if serializer.is_valid():
        print("Serializer is valid. Attempting to save...")
        serializer.save()
        print("Project Serializer Save successful")
    else:
        print("Serializer Errors:", serializer.errors)
        
except Exception as e:
    import traceback
    print("\nERROR DETECTED during serialization/save:")
    traceback.print_exc()
