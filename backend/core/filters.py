# core/filters.py
import django_filters
from .models import InstitucionEducativa


class InstitucionEducativaFilter(django_filters.FilterSet):
    """Filtros para el ViewSet de Instituciones Educativas"""
    id_municipio = django_filters.NumberFilter(field_name='id_municipio')
    codigo_dane = django_filters.CharFilter(field_name='codigo_dane')

    class Meta:
        model = InstitucionEducativa
        fields = ['id_municipio', 'codigo_dane']
