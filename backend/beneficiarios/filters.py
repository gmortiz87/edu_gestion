# beneficiarios/filters.py
import django_filters
from .models import BeneficioActividadIE


class BeneficioActividadIEFilter(django_filters.FilterSet):
    """Filtros para el ViewSet de Beneficios por Actividad e IE"""
    id_actividad = django_filters.NumberFilter(field_name='id_actividad')
    id_ie = django_filters.NumberFilter(field_name='id_ie')
    fecha_evento = django_filters.DateFilter(field_name='fecha_evento')
    fecha_evento__gte = django_filters.DateFilter(field_name='fecha_evento', lookup_expr='gte')
    fecha_evento__lte = django_filters.DateFilter(field_name='fecha_evento', lookup_expr='lte')

    class Meta:
        model = BeneficioActividadIE
        fields = ['id_actividad', 'id_ie', 'fecha_evento']
