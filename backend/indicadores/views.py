# indicadores/views.py
from rest_framework import viewsets
from .models import Meta, IndicadorGestion, IndicadorGestionValor
from .serializers import MetaSerializer, IndicadorGestionSerializer, IndicadorGestionValorSerializer
from django_filters.rest_framework import DjangoFilterBackend


class MetaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Meta.objects.all().order_by("-id_meta")
    serializer_class = MetaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["activo"]


class IndicadorGestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = IndicadorGestion.objects.select_related("meta").order_by("-id_indicador")
    serializer_class = IndicadorGestionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["meta", "activo"]


class IndicadorGestionValorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = IndicadorGestionValor.objects.select_related("indicador", "registrado_por").order_by("-id_valor")
    serializer_class = IndicadorGestionValorSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        "indicador": ["exact"],
        "fecha_corte": ["exact", "gte", "lte"]
    }