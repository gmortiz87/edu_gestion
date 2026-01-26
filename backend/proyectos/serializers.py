# proyectos/serializers.py
from django.db.models import Sum
from rest_framework import serializers
from .models import Proyecto, Actividad, AvanceActividad

class ProyectoSerializer(serializers.ModelSerializer):
    presupuesto_total = serializers.SerializerMethodField()
    total_ejecutado_calculado = serializers.SerializerMethodField()
    porcentaje_ejecucion = serializers.SerializerMethodField()

    class Meta:
        model = Proyecto
        fields = [
            "id_proyecto","codigo","nombre","id_linea_vigencia",
            "responsable_id","apoyo_tecnico_id",
            "codigo_bpin","codigo_pi",
            "apropiacion_definitiva","adicion",
            "recursos","avance_cargue_pct","estado",
            "fecha_inicio","fecha_fin","creado_en",
            "presupuesto_total","total_ejecutado_calculado","porcentaje_ejecucion",
        ]
        read_only_fields = fields

    def get_presupuesto_total(self, obj):
        aprop = obj.apropiacion_definitiva or 0
        adicion = obj.adicion or 0
        return float(aprop + adicion)

    def get_total_ejecutado_calculado(self, obj):
        total = (
            Actividad.objects
            .filter(id_proyecto=obj.id_proyecto)
            .aggregate(s=Sum("total_ejecutado"))["s"]
        )
        return float(total or 0)

    def get_porcentaje_ejecucion(self, obj):
        presupuesto = (obj.apropiacion_definitiva or 0) + (obj.adicion or 0)
        if not presupuesto:
            return None
        ejecutado = self.get_total_ejecutado_calculado(obj)
        return round((ejecutado / float(presupuesto)) * 100, 2)


class ActividadSerializer(serializers.ModelSerializer):
    proyecto_codigo = serializers.SerializerMethodField()
    proyecto_nombre = serializers.SerializerMethodField()
    avance_actual = serializers.SerializerMethodField()

    class Meta:
        model = Actividad
        fields = [
            "id_actividad","id_proyecto","nombre","descripcion","estado",
            "fecha_inicio","fecha_fin","total_ejecutado","componente_pam",
            "actor_dirigido","numero_beneficiarios","entrega_dotacion",
            "descripcion_dotacion","creado_en",
            "proyecto_codigo","proyecto_nombre","avance_actual",
        ]
        read_only_fields = fields

    def get_proyecto_codigo(self, obj):
        p = Proyecto.objects.filter(id_proyecto=obj.id_proyecto).only("codigo").first()
        return p.codigo if p else None

    def get_proyecto_nombre(self, obj):
        p = Proyecto.objects.filter(id_proyecto=obj.id_proyecto).only("nombre").first()
        return p.nombre if p else None

    def get_avance_actual(self, obj):
        ultimo = (
            AvanceActividad.objects
            .filter(id_actividad=obj.id_actividad)
            .order_by("-fecha_corte", "-id_avance")
            .values("fecha_corte", "porcentaje")
            .first()
        )
        if not ultimo:
            return None
        return {"fecha_corte": ultimo["fecha_corte"], "porcentaje": ultimo["porcentaje"]}