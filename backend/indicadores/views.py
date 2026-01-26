# indicadores/views.py
from rest_framework import viewsets
from .models import IndicadorGestion
from .serializers import IndicadorGestionSerializer

class IndicadorGestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = IndicadorGestion.objects.all().order_by("-id_indicador")
    serializer_class = IndicadorGestionSerializer
