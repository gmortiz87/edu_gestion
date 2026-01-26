from rest_framework import serializers
from .models import BeneficioActividadIE
from proyectos.models import Actividad
from core.models import InstitucionEducativa, Municipio  # ajusta si cambia tu app

class BeneficioActividadIESerializer(serializers.ModelSerializer):
    # Derivados “de presentación”
    actividad_nombre = serializers.SerializerMethodField()

    ie_codigo_dane = serializers.SerializerMethodField()
    ie_nombre = serializers.SerializerMethodField()
    municipio_id = serializers.SerializerMethodField()
    municipio_nombre = serializers.SerializerMethodField()

    total_personas_benef = serializers.SerializerMethodField()
    total_beneficiarios = serializers.SerializerMethodField()  # ✅ <-- FALTABA ESTO

    class Meta:
        model = BeneficioActividadIE
        fields = [
            "id_beneficio",
            "id_actividad",
            "id_ie",
            "fecha_evento",

            "directivos_benef",
            "administrativos_benef",
            "docentes_benef",
            "estudiantes_benef",
            "padres_benef",

            "recibio_asistencia_tecnica",
            "modalidad_asistencia_tecnica",
            "recibio_dotacion",
            "dotacion_recibida",

            "observacion",
            "creado_en",

            # derivados
            "actividad_nombre",
            "ie_codigo_dane",
            "ie_nombre",
            "municipio_id",
            "municipio_nombre",
            "total_personas_benef",
            "total_beneficiarios",
        ]
        read_only_fields = fields

    def get_actividad_nombre(self, obj):
        a = Actividad.objects.filter(id_actividad=obj.id_actividad).only("nombre").first()
        return a.nombre if a else None

    def get_ie_codigo_dane(self, obj):
        ie = InstitucionEducativa.objects.filter(id_ie=obj.id_ie).only("codigo_dane").first()
        return ie.codigo_dane if ie else None

    def get_ie_nombre(self, obj):
        ie = InstitucionEducativa.objects.filter(id_ie=obj.id_ie).only("nombre").first()
        return ie.nombre if ie else None

    def get_municipio_id(self, obj):
        ie = InstitucionEducativa.objects.filter(id_ie=obj.id_ie).only("id_municipio").first()
        return ie.id_municipio if ie else None

    def get_municipio_nombre(self, obj):
        ie = InstitucionEducativa.objects.filter(id_ie=obj.id_ie).only("id_municipio").first()
        if not ie:
            return None
        mu = Municipio.objects.filter(id_municipio=ie.id_municipio).only("nombre").first()
        return mu.nombre if mu else None

    def get_total_personas_benef(self, obj):
        vals = [
            obj.directivos_benef,
            obj.administrativos_benef,
            obj.docentes_benef,
            obj.estudiantes_benef,
            obj.padres_benef,
        ]
        total = sum(int(v) for v in vals if v is not None)
        return total if total > 0 else None

    def get_total_beneficiarios(self, obj):
        valores = [
            obj.directivos_benef,
            obj.administrativos_benef,
            obj.docentes_benef,
            obj.estudiantes_benef,
            obj.padres_benef,
        ]
        total = sum(v or 0 for v in valores)
        return total if total > 0 else None