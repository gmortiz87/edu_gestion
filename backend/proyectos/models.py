# proyectos/models.py
from django.db import models


class Proyecto(models.Model):
    id_proyecto = models.BigAutoField(primary_key=True)
    codigo = models.CharField(max_length=40)
    nombre = models.CharField(max_length=250)

    id_linea_vigencia = models.BigIntegerField()
    responsable_id = models.BigIntegerField()
    apoyo_tecnico_id = models.BigIntegerField()

    codigo_bpin = models.CharField(max_length=30, null=True, blank=True)
    codigo_pi = models.CharField(max_length=30, null=True, blank=True)

    apropiacion_definitiva = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    adicion = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)

    recursos = models.CharField(max_length=80, null=True, blank=True)
    avance_cargue_pct = models.IntegerField(null=True, blank=True)

    estado = models.CharField(max_length=20)
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)
    creado_en = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "proyecto"

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class Actividad(models.Model):
    id_actividad = models.BigAutoField(primary_key=True)
    id_proyecto = models.BigIntegerField()

    nombre = models.CharField(max_length=250)
    descripcion = models.TextField(null=True, blank=True)

    estado = models.CharField(max_length=20)  # PENDIENTE/EN_EJECUCION/FINALIZADA
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)

    total_ejecutado = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    componente_pam = models.CharField(max_length=150, null=True, blank=True)
    actor_dirigido = models.CharField(max_length=200, null=True, blank=True)
    numero_beneficiarios = models.IntegerField(null=True, blank=True)

    entrega_dotacion = models.BooleanField(null=True, blank=True)
    descripcion_dotacion = models.TextField(null=True, blank=True)

    creado_en = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "actividad"

    def __str__(self):
        return self.nombre


class AvanceActividad(models.Model):
    id_avance = models.BigAutoField(primary_key=True)
    id_actividad = models.BigIntegerField()

    fecha_corte = models.DateField()
    porcentaje = models.IntegerField()
    descripcion = models.TextField(null=True, blank=True)

    registrado_por = models.BigIntegerField()
    creado_en = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "avance_actividad"