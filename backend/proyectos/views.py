# proyectos/views.py
from rest_framework import viewsets
from .models import Proyecto, Actividad
from .serializers import ProyectoSerializer, ActividadSerializer

class ProyectoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Proyecto.objects.all().order_by("-id_proyecto")
    serializer_class = ProyectoSerializer

class ActividadViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActividadSerializer
    queryset = Actividad.objects.all().order_by("-id_actividad")

    def get_queryset(self):
        qs = super().get_queryset()
        id_proyecto = self.request.query_params.get("id_proyecto")
        if id_proyecto:
            qs = qs.filter(id_proyecto=id_proyecto)
        return qs