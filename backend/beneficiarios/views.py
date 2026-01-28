# beneficiarios/views.py
from rest_framework import viewsets
from .models import BeneficioActividadIE
from .serializers import BeneficioActividadIESerializer
from .filters import BeneficioActividadIEFilter


class BeneficioActividadIEViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consultar beneficios reales por actividad e institución educativa.
    
    Permite filtrar por:
    - id_actividad: ID de la actividad
    - id_ie: ID de la institución educativa
    - fecha_evento: Fecha exacta del evento
    - fecha_evento__gte: Fecha desde (mayor o igual)
    - fecha_evento__lte: Fecha hasta (menor o igual)
    """
    queryset = BeneficioActividadIE.objects.all().order_by("-id_beneficio")
    serializer_class = BeneficioActividadIESerializer
    filterset_class = BeneficioActividadIEFilter