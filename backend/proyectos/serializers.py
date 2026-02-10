# proyectos/serializers.py
from rest_framework import serializers
from .models import Proyecto, Actividad, AvanceActividad, ProyectoMeta
from indicadores.serializers import MetaSerializer


class ProyectoMetaSerializer(serializers.ModelSerializer):
    meta = MetaSerializer(read_only=True)

    class Meta:
        model = ProyectoMeta
        fields = ["proyecto", "meta", "valor_planeado", "valor_logrado", "observacion"]


class AvanceActividadSerializer(serializers.ModelSerializer):
    registrado_por_nombre = serializers.CharField(source="registrado_por.nombre", read_only=True)

    class Meta:
        model = AvanceActividad
        fields = ["id_avance", "actividad", "fecha_corte", "porcentaje", "descripcion", "registrado_por", "registrado_por_nombre", "creado_en"]
        read_only_fields = ["id_avance", "creado_en", "registrado_por_nombre"]


class ActividadSerializer(serializers.ModelSerializer):
    proyecto_codigo = serializers.CharField(source="proyecto.codigo", read_only=True)
    avances = AvanceActividadSerializer(many=True, read_only=True)

    class Meta:
        model = Actividad
        fields = [
            "id_actividad", "proyecto", "proyecto_codigo", "nombre", "descripcion", 
            "estado", "fecha_inicio", "fecha_fin", "total_ejecutado", 
            "componente_pam", "actor_dirigido", "numero_beneficiarios", 
            "entrega_dotacion", "descripcion_dotacion", "creado_en", "avances"
        ]
        read_only_fields = ["id_actividad", "creado_en", "proyecto_codigo", "avances"]


class ProyectoSerializer(serializers.ModelSerializer):
    linea_nombre = serializers.CharField(source="linea_vigencia.linea.nombre", read_only=True)
    vigencia_anio = serializers.IntegerField(source="linea_vigencia.vigencia.anio", read_only=True)
    responsable_nombre = serializers.CharField(source="responsable.nombre", read_only=True)
    apoyo_tecnico_nombre = serializers.CharField(source="apoyo_tecnico.nombre", read_only=True)
    entidad_aliada_nombre = serializers.CharField(source="entidad_aliada.nombre", read_only=True)
    
    metas = ProyectoMetaSerializer(many=True, read_only=True, source="metas_rel")
    actividades = ActividadSerializer(many=True, read_only=True)

    class Meta:
        model = Proyecto
        fields = [
            "id_proyecto", "codigo", "nombre", "linea_vigencia", "linea_nombre", "vigencia_anio",
            "responsable", "responsable_nombre", "apoyo_tecnico", "apoyo_tecnico_nombre", 
            "codigo_bpin", "codigo_pi", "apropiacion_definitiva", "adicion", 
            "recursos", "avance_cargue_pct", "estado", "fecha_inicio", "fecha_fin", 
            "entidad_aliada", "entidad_aliada_nombre", "creado_en", "metas", "actividades"
        ]
        read_only_fields = [
            "id_proyecto", "creado_en", "metas", "linea_nombre", 
            "vigencia_anio", "responsable_nombre", "apoyo_tecnico_nombre",
            "entidad_aliada_nombre", "actividades"
        ]
