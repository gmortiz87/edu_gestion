from django.db import models


class Vigencia(models.Model):
    id_vigencia = models.IntegerField(primary_key=True)
    anio = models.IntegerField(unique=True)
    estado = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = "vigencia"


class LineaEstrategica(models.Model):
    id_linea = models.BigAutoField(primary_key=True)
    codigo = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "linea_estrategica"


class LineaVigencia(models.Model):
    id_linea_vigencia = models.BigAutoField(primary_key=True)
    id_linea = models.BigIntegerField()
    id_vigencia = models.IntegerField()
    estado = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = "linea_vigencia"


class Usuario(models.Model):
    id_usuario = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    correo = models.CharField(max_length=200, unique=True)
    rol = models.CharField(max_length=30)
    activo = models.BooleanField()
    creado_en = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "usuario"


class Municipio(models.Model):
    id_municipio = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=120)

    class Meta:
        managed = False
        db_table = "municipio"


class InstitucionEducativa(models.Model):
    id_ie = models.BigAutoField(primary_key=True)
    codigo_dane = models.CharField(max_length=30, unique=True)
    nombre = models.CharField(max_length=250)
    id_municipio = models.IntegerField()

    class Meta:
        managed = False
        db_table = "institucion_educativa"


class Meta(models.Model):
    id_meta = models.BigAutoField(primary_key=True)
    codigo = models.CharField(max_length=30, unique=True)
    nombre = models.CharField(max_length=250)
    descripcion = models.TextField(null=True, blank=True)
    activo = models.BooleanField()
    creado_en = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "meta"