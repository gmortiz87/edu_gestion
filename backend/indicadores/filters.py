# indicadores/filters.py
import django_filters
from .models import IndicadorGestion


class IndicadorGestionFilter(django_filters.FilterSet):
    # ✅ forma nativa Django para ForeignKey
    meta_id = django_filters.NumberFilter(field_name="meta_id")

    # ✅ alias para no romper consumidores que aún manden id_meta
    id_meta = django_filters.NumberFilter(field_name="meta_id")

    activo = django_filters.BooleanFilter(field_name="activo")

    class Meta:
        model = IndicadorGestion
        fields = ["meta_id", "id_meta", "activo"]
