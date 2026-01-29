import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Vigencia, LineaEstrategica, LineaVigencia, Usuario

def seed():
    print("Iniciando carga de datos de prueba...")

    # 1. Vigencia
    v2026, created = Vigencia.objects.get_or_create(id_vigencia=2026, defaults={'anio': 2026, 'estado': 'ACTIVA'})
    if created: print("- Vigencia 2026 creada")
    
    v2025, created = Vigencia.objects.get_or_create(id_vigencia=2025, defaults={'anio': 2025, 'estado': 'ACTIVA'})
    if created: print("- Vigencia 2025 creada")

    # 2. Lineas Estrategicas
    l1, created = LineaEstrategica.objects.update_or_create(codigo='L1', defaults={'nombre': 'POAI', 'descripcion': 'Plan Operativo Anual de Inversiones'})
    if created: print("- Linea L1 creada")
    else: print("- Linea L1 actualizada")
    
    l2, created = LineaEstrategica.objects.update_or_create(codigo='L2', defaults={'nombre': 'ESTRATEGIAS DE PERMANENCIA', 'descripcion': 'Programas de retención escolar'})
    if created: print("- Linea L2 creada")
    else: print("- Linea L2 actualizada")
    
    l3, created = LineaEstrategica.objects.update_or_create(codigo='L3', defaults={'nombre': 'REGALIAS', 'descripcion': 'Sistema General de Regalías (SGR)'})
    if created: print("- Linea L3 creada")
    else: print("- Linea L3 actualizada")

    # 3. LineaVigencia
    lv1, _ = LineaVigencia.objects.get_or_create(linea=l1, vigencia=v2026)
    lv2, _ = LineaVigencia.objects.get_or_create(linea=l2, vigencia=v2026)
    lv3, _ = LineaVigencia.objects.get_or_create(linea=l3, vigencia=v2026)
    print("- Relaciones Linea-Vigencia creadas")

    # 4. Usuarios
    u1, created = Usuario.objects.get_or_create(
        correo='admin@valle.gov.co',
        defaults={
            'nombre': 'Administrador General',
            'rol': 'ADMIN',
            'activo': True
        }
    )
    if created:
        u1.set_password('admin123')
        u1.save()
        print("- Usuario Admin creado")
        
    u2, created = Usuario.objects.get_or_create(
        correo='responsable@valle.gov.co',
        defaults={
            'nombre': 'Juan Perez',
            'rol': 'RESPONSABLE_PROYECTO',
            'activo': True
        }
    )
    if created:
        u2.set_password('pass123')
        u2.save()
        print("- Usuario Responsable creado")

    print("Carga finalizada con éxito.")

if __name__ == "__main__":
    seed()
