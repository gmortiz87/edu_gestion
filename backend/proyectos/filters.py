# proyectos/filters.py
import django_filters
from .models import Proyecto, Actividad


class ProyectoFilter(django_filters.FilterSet):
    linea_vigencia_id = django_filters.NumberFilter(field_name="linea_vigencia_id")
    id_linea_vigencia = django_filters.NumberFilter(field_name="linea_vigencia_id")  # alias legacy

    estado = django_filters.CharFilter(field_name="estado")
    responsable_id = django_filters.NumberFilter(field_name="responsable_id")
    apoyo_tecnico_id = django_filters.NumberFilter(field_name="apoyo_tecnico_id")

    class Meta:
        model = Proyecto
        fields = ["linea_vigencia_id", "id_linea_vigencia", "estado", "responsable_id", "apoyo_tecnico_id"]


class ActividadFilter(django_filters.FilterSet):
    proyecto_id = django_filters.NumberFilter(field_name="proyecto_id")
    id_proyecto = django_filters.NumberFilter(field_name="proyecto_id")  # alias legacy
    estado = django_filters.CharFilter(field_name="estado")

    class Meta:
        model = Actividad
        fields = ["proyecto_id", "id_proyecto", "estado"]
