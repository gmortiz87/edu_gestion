from django.db import models


class IndicadorGestion(models.Model):
    id_indicador = models.BigAutoField(primary_key=True)
    id_meta = models.BigIntegerField()

    codigo = models.CharField(max_length=40, unique=True)
    nombre = models.CharField(max_length=250)
    definicion = models.TextField(null=True, blank=True)
    formula = models.TextField(null=True, blank=True)
    unidad = models.CharField(max_length=50, null=True, blank=True)
    periodicidad = models.CharField(max_length=12)
    fuente = models.CharField(max_length=200, null=True, blank=True)

    activo = models.BooleanField()
    creado_en = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "indicador_gestion"


class IndicadorGestionValor(models.Model):
    id_valor = models.BigAutoField(primary_key=True)
    id_indicador = models.BigIntegerField()
    fecha_corte = models.DateField()
    valor = models.DecimalField(max_digits=18, decimal_places=4)
    observacion = models.CharField(max_length=600, null=True, blank=True)
    registrado_por = models.BigIntegerField()
    creado_en = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "indicador_gestion_valor"