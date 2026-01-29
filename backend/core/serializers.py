# core/serializers.py
from rest_framework import serializers
from .models import (
    Vigencia,
    LineaEstrategica,
    LineaVigencia,
    Municipio,
    InstitucionEducativa,
    Usuario,
    EntidadAliada,
)


class VigenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vigencia
        fields = ["id_vigencia", "anio", "estado"]
        read_only_fields = fields


class LineaEstrategicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineaEstrategica
        fields = ["id_linea", "codigo", "nombre", "descripcion"]
        read_only_fields = fields


class LineaVigenciaSerializer(serializers.ModelSerializer):
    linea_codigo = serializers.CharField(source="linea.codigo", read_only=True)
    linea_nombre = serializers.CharField(source="linea.nombre", read_only=True)
    vigencia_anio = serializers.IntegerField(source="vigencia.anio", read_only=True)

    class Meta:
        model = LineaVigencia
        fields = [
            "id_linea_vigencia",
            "linea",
            "vigencia",
            "estado",
            "linea_codigo",
            "linea_nombre",
            "vigencia_anio",
        ]
        read_only_fields = fields


class MunicipioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipio
        fields = ["id_municipio", "nombre"]
        read_only_fields = fields


class InstitucionEducativaSerializer(serializers.ModelSerializer):
    municipio_nombre = serializers.CharField(source="municipio.nombre", read_only=True)

    class Meta:
        model = InstitucionEducativa
        fields = ["id_ie", "codigo_dane", "nombre", "municipio", "municipio_nombre"]
        read_only_fields = fields


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id_usuario", "nombre", "correo", "rol", "activo", "creado_en"]
        read_only_fields = fields


class EntidadAliadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntidadAliada
        fields = ["id_entidad", "nombre", "creado_en"]
        read_only_fields = ["id_entidad", "creado_en"]
