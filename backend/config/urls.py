# config/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from proyectos.views import ProyectoViewSet, ActividadViewSet, AvanceActividadViewSet, ProyectoMetaViewSet
from beneficiarios.views import BeneficioActividadIEViewSet
from indicadores.views import MetaViewSet, IndicadorGestionViewSet, IndicadorGestionValorViewSet

from core.views import (
    VigenciaViewSet,
    LineaEstrategicaViewSet,
    LineaVigenciaViewSet,
    MunicipioViewSet,
    InstitucionEducativaViewSet,
    UsuarioViewSet,
)

router = DefaultRouter()
router.register(r"proyectos", ProyectoViewSet, basename="proyecto")
router.register(r"actividades", ActividadViewSet, basename="actividad")
router.register(r"avances-actividad", AvanceActividadViewSet, basename="avance-actividad")
router.register(r"proyectos-metas", ProyectoMetaViewSet, basename="proyecto-meta")
router.register(r"metas", MetaViewSet, basename="meta")
router.register(r"indicadores", IndicadorGestionViewSet, basename="indicador-gestion")
router.register(r"indicadores-valores", IndicadorGestionValorViewSet, basename="indicador-gestion-valor")
router.register(r"beneficios", BeneficioActividadIEViewSet, basename="beneficio-actividad-ie")
router.register(r"vigencias", VigenciaViewSet, basename="vigencia")
router.register(r"lineas-estrategicas", LineaEstrategicaViewSet, basename="linea-estrategica")
router.register(r"lineas-vigencias", LineaVigenciaViewSet, basename="linea-vigencia")
router.register(r"municipios", MunicipioViewSet, basename="municipio")
router.register(r"instituciones-educativas", InstitucionEducativaViewSet, basename="institucion-educativa")
router.register(r"usuarios", UsuarioViewSet, basename="usuario")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    # Documentación API
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
