from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import permissions
from .serializers import CustomTokenPairSerializer


class ObtainTokenPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CustomTokenPairSerializer
