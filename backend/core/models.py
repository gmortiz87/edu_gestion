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


from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UsuarioManager(BaseUserManager):
    def create_user(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError("El correo es obligatorio")
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, password=None, **extra_fields):
        extra_fields.setdefault("rol", "ADMIN")
        return self.create_user(correo, password, **extra_fields)


class EntidadAliada(models.Model):
    id_entidad = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=250, unique=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "entidad_aliada"

    def __str__(self):
        return self.nombre


class Usuario(AbstractBaseUser):
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
    password = models.CharField(max_length=255)  # Campo para hash de Django
    last_login = models.DateTimeField(null=True, blank=True)
    rol = models.CharField(max_length=30, choices=ROLES)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    objects = UsuarioManager()

    USERNAME_FIELD = "correo"
    REQUIRED_FIELDS = ["nombre", "rol"]

    class Meta:
        managed = False
        db_table = "usuario"

    def __str__(self):
        return f"{self.nombre} ({self.rol})"

    @property
    def is_staff(self):
        return self.rol == 'ADMIN'

    @property
    def is_superuser(self):
        return self.rol == 'ADMIN'

    def has_perm(self, perm, obj=None):
        return self.rol == 'ADMIN'

    def has_module_perms(self, app_label):
        return self.rol == 'ADMIN'

    @property
    def is_active(self):
        return self.activo


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
