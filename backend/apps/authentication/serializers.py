# sobreescritura del serializer para que envie los datos del ususario (username y si es admin)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        data.update({'username': self.user.username})
        data.update({'admin': self.user.is_superuser})
        return data
