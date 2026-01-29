# proyectos/views.py
from rest_framework import viewsets, permissions
from .models import Proyecto, Actividad, AvanceActividad, ProyectoMeta
from .serializers import ProyectoSerializer, ActividadSerializer, AvanceActividadSerializer, ProyectoMetaSerializer
from django_filters.rest_framework import DjangoFilterBackend


class ProyectoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Proyecto.objects.select_related(
        "linea_vigencia__linea",
        "linea_vigencia__vigencia",
        "responsable",
        "apoyo_tecnico"
    ).prefetch_related(
        "metas_rel",
        "metas_rel__meta"
    ).order_by("-id_proyecto")
    serializer_class = ProyectoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["linea_vigencia", "estado", "responsable", "apoyo_tecnico"]


class ActividadViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Actividad.objects.select_related("proyecto").order_by("-id_actividad")
    serializer_class = ActividadSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["proyecto", "estado"]


class AvanceActividadViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = AvanceActividad.objects.select_related("actividad", "registrado_por").order_by("-id_avance")
    serializer_class = AvanceActividadSerializer


class ProyectoMetaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = ProyectoMeta.objects.select_related("proyecto", "meta")
    serializer_class = ProyectoMetaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["proyecto", "meta"]
