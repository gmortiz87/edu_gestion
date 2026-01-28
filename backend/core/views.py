# core/views.py
from rest_framework import viewsets
from .models import (
    Vigencia,
    LineaEstrategica,
    LineaVigencia,
    Municipio,
    InstitucionEducativa,
    Usuario,
)
from .serializers import (
    VigenciaSerializer,
    LineaEstrategicaSerializer,
    LineaVigenciaSerializer,
    MunicipioSerializer,
    InstitucionEducativaSerializer,
    UsuarioSerializer,
)
from .filters import InstitucionEducativaFilter


class VigenciaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consultar vigencias (años fiscales).
    """
    queryset = Vigencia.objects.all().order_by("-anio")
    serializer_class = VigenciaSerializer


class LineaEstrategicaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consultar líneas estratégicas.
    """
    queryset = LineaEstrategica.objects.all().order_by("codigo")
    serializer_class = LineaEstrategicaSerializer


class LineaVigenciaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consultar relaciones línea-vigencia.
    """
    queryset = LineaVigencia.objects.all().select_related("linea", "vigencia").order_by("-vigencia_id", "linea_id")
    serializer_class = LineaVigenciaSerializer


class MunicipioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consultar municipios.
    """
    queryset = Municipio.objects.all().order_by("nombre")
    serializer_class = MunicipioSerializer


class InstitucionEducativaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consultar instituciones educativas.
    
    Permite filtrar por:
    - municipio: ID del municipio
    - codigo_dane: Código DANE de la institución
    """
    serializer_class = InstitucionEducativaSerializer
    queryset = InstitucionEducativa.objects.all().select_related("municipio").order_by("nombre")
    filterset_fields = ["municipio", "codigo_dane"]


class UsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consultar usuarios del sistema.
    """
    queryset = Usuario.objects.all().order_by("rol", "nombre")
    serializer_class = UsuarioSerializer
