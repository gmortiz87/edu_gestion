from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
from .models import Actividad, AvanceActividad, Proyecto

@receiver([post_save, post_delete], sender=AvanceActividad)
def update_activity_progress(sender, instance, **kwargs):
    """
    Actualiza el 'total_ejecutado' de la Actividad basado en el porcentaje
    del reporte más reciente.
    """
    actividad = instance.actividad
    ultimo_avance = AvanceActividad.objects.filter(actividad=actividad).order_by('-fecha_corte', '-creado_en').first()
    
    nuevo_total = ultimo_avance.porcentaje if ultimo_avance else 0
    
    # Usamos save() para que se dispare el signal de la Actividad
    if actividad.total_ejecutado != nuevo_total:
        actividad.total_ejecutado = nuevo_total
        actividad.save()

@receiver([post_save, post_delete], sender=Actividad)
def update_project_progress(sender, instance, **kwargs):
    """
    Actualiza el 'avance_cargue_pct' del Proyecto basado en el promedio
    del 'total_ejecutado' de todas sus actividades.
    """
    proyecto = instance.proyecto
    total_actividades = Actividad.objects.filter(proyecto=proyecto).count()
    
    if total_actividades == 0:
        nuevo_avance = 0
    else:
        # Calculamos el promedio de ejecución de las actividades
        avg_ejecucion = Actividad.objects.filter(proyecto=proyecto).aggregate(promedio=Avg('total_ejecutado'))['promedio']
        nuevo_avance = int(avg_ejecucion) if avg_ejecucion is not None else 0
    
    # Usamos update para evitar disparar señales recursivas o innecesarias en Proyecto
    Proyecto.objects.filter(id_proyecto=proyecto.id_proyecto).update(avance_cargue_pct=nuevo_avance)
