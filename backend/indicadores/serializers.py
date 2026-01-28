# indicadores/serializers.py
from rest_framework import serializers
from .models import IndicadorGestion, IndicadorGestionValor, Meta


class MetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meta
        fields = ["id_meta", "codigo", "nombre", "descripcion", "activo", "creado_en"]
        read_only_fields = fields


class IndicadorGestionSerializer(serializers.ModelSerializer):
    meta = MetaSerializer(read_only=True)

    class Meta:
        model = IndicadorGestion
        fields = [
            "id_indicador",
            "meta",
            "codigo",
            "nombre",
            "definicion",
            "formula",
            "unidad",
            "periodicidad",
            "fuente",
            "activo",
            "creado_en",
        ]
        read_only_fields = fields


class IndicadorGestionValorSerializer(serializers.ModelSerializer):
    indicador = IndicadorGestionSerializer(read_only=True)
    registrado_por_nombre = serializers.CharField(source="registrado_por.nombre", read_only=True)

    class Meta:
        model = IndicadorGestionValor
        fields = [
            "id_valor",
            "indicador",
            "fecha_corte",
            "valor",
            "observacion",
            "registrado_por_nombre",
            "creado_en",
        ]
        read_only_fields = fields
