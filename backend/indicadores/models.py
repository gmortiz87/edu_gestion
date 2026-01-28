# indicadores/models.py
from django.db import models


class Meta(models.Model):
    id_meta = models.BigAutoField(primary_key=True)
    codigo = models.CharField(max_length=30, unique=True)
    nombre = models.CharField(max_length=250)
    descripcion = models.TextField(null=True, blank=True)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "meta"

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class IndicadorGestion(models.Model):
    PERIODICIDAD_CHOICES = [
        ("MENSUAL", "MENSUAL"),
        ("TRIMESTRAL", "TRIMESTRAL"),
        ("SEMESTRAL", "SEMESTRAL"),
        ("ANUAL", "ANUAL"),
    ]

    id_indicador = models.BigAutoField(primary_key=True)

    meta = models.ForeignKey(
        Meta,
        on_delete=models.DO_NOTHING,
        db_column="id_meta",
        related_name="indicadores",
    )

    codigo = models.CharField(max_length=40, unique=True)
    nombre = models.CharField(max_length=250)
    definicion = models.TextField(null=True, blank=True)
    formula = models.TextField(null=True, blank=True)
    unidad = models.CharField(max_length=50, null=True, blank=True)

    periodicidad = models.CharField(max_length=12, choices=PERIODICIDAD_CHOICES)

    fuente = models.CharField(max_length=200, null=True, blank=True)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "indicador_gestion"

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class IndicadorGestionValor(models.Model):
    id_valor = models.BigAutoField(primary_key=True)

    indicador = models.ForeignKey(
        IndicadorGestion,
        on_delete=models.CASCADE,
        db_column="id_indicador",
        related_name="valores",
    )

    fecha_corte = models.DateField()
    valor = models.DecimalField(max_digits=18, decimal_places=4)
    observacion = models.CharField(max_length=600, null=True, blank=True)

    registrado_por = models.ForeignKey(
        "core.Usuario",
        on_delete=models.DO_NOTHING,
        db_column="registrado_por",
        related_name="valores_indicador_registrados",
    )

    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "indicador_gestion_valor"
        unique_together = (("indicador", "fecha_corte"),)
