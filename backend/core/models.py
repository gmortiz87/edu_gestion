# core/models.py
from django.db import models

class Vigencia(models.Model):
    id_vigencia = models.IntegerField(primary_key=True)
    anio = models.IntegerField(unique=True)
    estado = models.CharField(max_length=10)  # ACTIVA | CERRADA

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
    id_linea = models.BigIntegerField()
    id_vigencia = models.IntegerField()
    estado = models.CharField(max_length=10)  # ACTIVA | INACTIVA

    class Meta:
        managed = False
        db_table = "linea_vigencia"

    def __str__(self):
        return f"LV({self.id_linea}/{self.id_vigencia}) {self.estado}"


class Usuario(models.Model):
    id_usuario = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    correo = models.CharField(max_length=200)
    rol = models.CharField(max_length=30)  # ADMIN | RESPONSABLE_PROYECTO | APOYO_TECNICO | EDITOR | LECTOR
    activo = models.BooleanField()
    creado_en = models.DateTimeField()

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
    codigo_dane = models.CharField(max_length=30)
    nombre = models.CharField(max_length=250)
    id_municipio = models.IntegerField()

    class Meta:
        managed = False
        db_table = "institucion_educativa"

    def __str__(self):
        return f"{self.codigo_dane} - {self.nombre}"
