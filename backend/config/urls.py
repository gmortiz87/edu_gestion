# config/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from proyectos.views import ProyectoViewSet, ActividadViewSet
from beneficiarios.views import BeneficioActividadIEViewSet
from indicadores.views import IndicadorGestionViewSet

router = DefaultRouter()
router.register(r"proyectos", ProyectoViewSet, basename="proyecto")
router.register(r"actividades", ActividadViewSet, basename="actividad")
router.register(r"beneficios", BeneficioActividadIEViewSet, basename="beneficio-actividad-ie")
router.register(r"indicadores", IndicadorGestionViewSet, basename="indicador-gestion")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
