from django.db import models


class BeneficioActividadIE(models.Model):
    id_beneficio = models.BigAutoField(primary_key=True)
    id_actividad = models.BigIntegerField()
    id_ie = models.BigIntegerField()
    fecha_evento = models.DateField()

    directivos_benef = models.IntegerField(null=True, blank=True)
    administrativos_benef = models.IntegerField(null=True, blank=True)
    docentes_benef = models.IntegerField(null=True, blank=True)
    estudiantes_benef = models.IntegerField(null=True, blank=True)
    padres_benef = models.IntegerField(null=True, blank=True)

    recibio_asistencia_tecnica = models.BooleanField(null=True, blank=True)
    modalidad_asistencia_tecnica = models.CharField(max_length=80, null=True, blank=True)

    recibio_dotacion = models.BooleanField(null=True, blank=True)
    dotacion_recibida = models.TextField(null=True, blank=True)

    observacion = models.CharField(max_length=600, null=True, blank=True)
    creado_en = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "beneficio_actividad_ie"


class BeneficioEvidencia(models.Model):
    id_evidencia = models.BigAutoField(primary_key=True)
    id_beneficio = models.BigIntegerField()

    tipo = models.CharField(max_length=10)  # ARCHIVO | ENLACE
    nombre = models.CharField(max_length=250)
    descripcion = models.CharField(max_length=500, null=True, blank=True)

    url = models.CharField(max_length=800, null=True, blank=True)
    nombre_archivo = models.CharField(max_length=250, null=True, blank=True)
    ruta_archivo = models.CharField(max_length=800, null=True, blank=True)
    tipo_mime = models.CharField(max_length=100, null=True, blank=True)
    tamanio_bytes = models.BigIntegerField(null=True, blank=True)

    cargado_por = models.BigIntegerField()
    fecha_carga = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "beneficio_evidencia"