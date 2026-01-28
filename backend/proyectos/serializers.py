# proyectos/serializers.py
from rest_framework import serializers
from .models import Proyecto, Actividad, AvanceActividad, ProyectoMeta
from indicadores.serializers import MetaSerializer


class ProyectoMetaSerializer(serializers.ModelSerializer):
    meta = MetaSerializer(read_only=True)

    class Meta:
        model = ProyectoMeta
        fields = ["proyecto", "meta", "valor_planeado", "valor_logrado", "observacion"]
        read_only_fields = fields


class AvanceActividadSerializer(serializers.ModelSerializer):
    registrado_por_nombre = serializers.CharField(source="registrado_por.nombre", read_only=True)

    class Meta:
        model = AvanceActividad
        fields = ["id_avance", "actividad", "fecha_corte", "porcentaje", "descripcion", "registrado_por_nombre", "creado_en"]
        read_only_fields = fields


class ActividadSerializer(serializers.ModelSerializer):
    proyecto_codigo = serializers.CharField(source="proyecto.codigo", read_only=True)

    class Meta:
        model = Actividad
        fields = [
            "id_actividad", "proyecto", "proyecto_codigo", "nombre", "descripcion", 
            "estado", "fecha_inicio", "fecha_fin", "total_ejecutado", 
            "componente_pam", "actor_dirigido", "numero_beneficiarios", 
            "entrega_dotacion", "descripcion_dotacion", "creado_en"
        ]
        read_only_fields = fields


class ProyectoSerializer(serializers.ModelSerializer):
    linea_nombre = serializers.CharField(source="linea_vigencia.linea.nombre", read_only=True)
    vigencia_anio = serializers.IntegerField(source="linea_vigencia.vigencia.anio", read_only=True)
    responsable_nombre = serializers.CharField(source="responsable.nombre", read_only=True)
    apoyo_tecnico_nombre = serializers.CharField(source="apoyo_tecnico.nombre", read_only=True)
    
    metas = ProyectoMetaSerializer(many=True, read_only=True, source="metas_rel")

    class Meta:
        model = Proyecto
        fields = [
            "id_proyecto", "codigo", "nombre", "linea_nombre", "vigencia_anio",
            "responsable_nombre", "apoyo_tecnico_nombre", "codigo_bpin", "codigo_pi",
            "apropiacion_definitiva", "adicion", "recursos", "avance_cargue_pct",
            "estado", "fecha_inicio", "fecha_fin", "creado_en", "metas"
        ]
        read_only_fields = fields
