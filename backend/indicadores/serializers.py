# indicadores/serializers.py
from rest_framework import serializers
from .models import IndicadorGestion, IndicadorGestionValor


class IndicadorGestionSerializer(serializers.ModelSerializer):
    # Derivados (útiles para dashboard)
    ultimo_valor = serializers.SerializerMethodField()
    ultima_fecha_corte = serializers.SerializerMethodField()

    class Meta:
        model = IndicadorGestion
        fields = [
            "id_indicador",
            "id_meta",
            "codigo",
            "nombre",
            "definicion",
            "formula",
            "unidad",
            "periodicidad",
            "fuente",
            "activo",
            "creado_en",

            # derivados
            "ultimo_valor",
            "ultima_fecha_corte",
        ]
        read_only_fields = fields

    def get_ultimo_valor(self, obj):
        row = (
            IndicadorGestionValor.objects
            .filter(id_indicador=obj.id_indicador)
            .order_by("-fecha_corte")
            .values("valor")
            .first()
        )
        return float(row["valor"]) if row else None

    def get_ultima_fecha_corte(self, obj):
        row = (
            IndicadorGestionValor.objects
            .filter(id_indicador=obj.id_indicador)
            .order_by("-fecha_corte")
            .values("fecha_corte")
            .first()
        )
        return row["fecha_corte"] if row else None