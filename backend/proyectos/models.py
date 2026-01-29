# proyectos/models.py
from django.db import models


class Proyecto(models.Model):
    ESTADOS_PROYECTO = [
        ("PLANEADO", "PLANEADO"),
        ("EN_EJECUCION", "EN_EJECUCION"),
        ("FINALIZADO", "FINALIZADO"),
        ("SUSPENDIDO", "SUSPENDIDO"),
    ]

    id_proyecto = models.BigAutoField(primary_key=True)
    codigo = models.CharField(max_length=40, unique=True)
    nombre = models.CharField(max_length=250)

    linea_vigencia = models.ForeignKey(
        "core.LineaVigencia",
        on_delete=models.DO_NOTHING,
        db_column="id_linea_vigencia",
        related_name="proyectos",
    )
    responsable = models.ForeignKey(
        "core.Usuario",
        on_delete=models.DO_NOTHING,
        db_column="responsable_id",
        related_name="proyectos_responsable",
    )
    apoyo_tecnico = models.ForeignKey(
        "core.Usuario",
        on_delete=models.DO_NOTHING,
        db_column="apoyo_tecnico_id",
        related_name="proyectos_apoyo_tecnico",
    )

    codigo_bpin = models.CharField(max_length=30, null=True, blank=True)
    codigo_pi = models.CharField(max_length=30, null=True, blank=True)
    apropiacion_definitiva = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    adicion = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    recursos = models.CharField(max_length=80, null=True, blank=True)
    avance_cargue_pct = models.IntegerField(null=True, blank=True)

    estado = models.CharField(max_length=20, choices=ESTADOS_PROYECTO, default='PLANEADO')
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)
    entidad_aliada = models.ForeignKey(
        "core.EntidadAliada",
        on_delete=models.DO_NOTHING,
        db_column="id_entidad_aliada",
        related_name="proyectos",
        null=True,
        blank=True
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "proyecto"

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class Actividad(models.Model):
    ESTADOS_ACTIVIDAD = [
        ("PLANEADO", "PLANEADO"),
        ("EN_EJECUCION", "EN_EJECUCION"),
        ("FINALIZADO", "FINALIZADO"),
        ("SUSPENDIDO", "SUSPENDIDO"),
    ]

    id_actividad = models.BigAutoField(primary_key=True)

    proyecto = models.ForeignKey(
        Proyecto,
        on_delete=models.CASCADE,
        db_column="id_proyecto",
        related_name="actividades",
    )

    nombre = models.CharField(max_length=250)
    descripcion = models.TextField(null=True, blank=True)

    estado = models.CharField(max_length=20, choices=ESTADOS_ACTIVIDAD, default='PLANEADO')
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)

    total_ejecutado = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    componente_pam = models.CharField(max_length=150, null=True, blank=True)
    actor_dirigido = models.CharField(max_length=200, null=True, blank=True)
    numero_beneficiarios = models.IntegerField(null=True, blank=True)

    entrega_dotacion = models.BooleanField(null=True, blank=True)
    descripcion_dotacion = models.TextField(null=True, blank=True)

    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "actividad"

    def __str__(self):
        return self.nombre


class AvanceActividad(models.Model):
    id_avance = models.BigAutoField(primary_key=True)

    actividad = models.ForeignKey(
        Actividad,
        on_delete=models.CASCADE,
        db_column="id_actividad",
        related_name="avances",
    )

    fecha_corte = models.DateField()
    porcentaje = models.IntegerField()
    descripcion = models.TextField(null=True, blank=True)

    registrado_por = models.ForeignKey(
        "core.Usuario",
        on_delete=models.DO_NOTHING,
        db_column="registrado_por",
        related_name="avances_registrados",
    )

    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "avance_actividad"


class ProyectoMeta(models.Model):
    """
    Tabla puente proyecto_meta.
    Implementada con id = None y primary_key compuesta simulada via unique_together según requerimiento.
    """
    id = None  # Relevante para Django internals si se quiere evitar campo 'id'
    proyecto = models.ForeignKey(
        Proyecto,
        on_delete=models.CASCADE,
        db_column="id_proyecto",
        related_name="metas_rel",
        primary_key=True,  # Hack parcial: primary_key debe estar en uno si id es None
    )

    meta = models.ForeignKey(
        "indicadores.Meta",
        on_delete=models.DO_NOTHING,
        db_column="id_meta",
        related_name="proyectos_rel",
    )

    valor_planeado = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    valor_logrado = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    observacion = models.CharField(max_length=600, null=True, blank=True)

    class Meta:
        managed = False
        db_table = "proyecto_meta"
        unique_together = (("proyecto", "meta"),)
