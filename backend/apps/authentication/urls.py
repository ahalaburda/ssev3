from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import LogoutAndBlackListRefreshToken
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', LogoutAndBlackListRefreshToken.as_view(), name='blacklist')
]
