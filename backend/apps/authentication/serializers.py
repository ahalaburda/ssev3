from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(CustomTokenPairSerializer, cls).get_token(user)

        token['username'] = user.username
        return token
