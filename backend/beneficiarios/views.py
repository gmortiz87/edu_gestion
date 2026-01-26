# beneficiarios/views.py
from rest_framework import viewsets
from .models import BeneficioActividadIE
from .serializers import BeneficioActividadIESerializer

class BeneficioActividadIEViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BeneficioActividadIE.objects.all().order_by("-id_beneficio")
    serializer_class = BeneficioActividadIESerializer