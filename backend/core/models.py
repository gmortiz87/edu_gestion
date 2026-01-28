# core/models.py
from django.db import models

class Vigencia(models.Model):
    id_vigencia = models.IntegerField(primary_key=True)
    anio = models.IntegerField(unique=True)
    estado = models.CharField(max_length=10, default='ACTIVA')  # ACTIVA | CERRADA

    class Meta:
        managed = False
        db_table = "vigencia"

    def __str__(self):
        return f"{self.anio} ({self.estado})"


class LineaEstrategica(models.Model):
    id_linea = models.BigAutoField(primary_key=True)
    codigo = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "linea_estrategica"

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class LineaVigencia(models.Model):
    id_linea_vigencia = models.BigAutoField(primary_key=True)
    linea = models.ForeignKey(
        LineaEstrategica, 
        on_delete=models.DO_NOTHING, 
        db_column="id_linea",
        related_name="vigencias"
    )
    vigencia = models.ForeignKey(
        Vigencia, 
        on_delete=models.DO_NOTHING, 
        db_column="id_vigencia",
        related_name="lineas"
    )
    estado = models.CharField(max_length=10, default='ACTIVA')  # ACTIVA | INACTIVA

    class Meta:
        managed = False
        db_table = "linea_vigencia"
        unique_together = (("linea", "vigencia"),)

    def __str__(self):
        return f"LV({self.linea}/{self.vigencia}) {self.estado}"


class Usuario(models.Model):
    ROLES = [
        ('ADMIN', 'ADMIN'),
        ('RESPONSABLE_PROYECTO', 'RESPONSABLE_PROYECTO'),
        ('APOYO_TECNICO', 'APOYO_TECNICO'),
        ('EDITOR', 'EDITOR'),
        ('LECTOR', 'LECTOR'),
    ]
    id_usuario = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    correo = models.CharField(max_length=200, unique=True)
    rol = models.CharField(max_length=30, choices=ROLES)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "usuario"

    def __str__(self):
        return f"{self.nombre} ({self.rol})"


class Municipio(models.Model):
    id_municipio = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=120)

    class Meta:
        managed = False
        db_table = "municipio"

    def __str__(self):
        return f"{self.id_municipio} - {self.nombre}"


class InstitucionEducativa(models.Model):
    id_ie = models.BigAutoField(primary_key=True)
    codigo_dane = models.CharField(max_length=30, unique=True)
    nombre = models.CharField(max_length=250)
    municipio = models.ForeignKey(
        Municipio, 
        on_delete=models.DO_NOTHING, 
        db_column="id_municipio",
        related_name="instituciones"
    )

    class Meta:
        managed = False
        db_table = "institucion_educativa"

    def __str__(self):
        return f"{self.codigo_dane} - {self.nombre}"
