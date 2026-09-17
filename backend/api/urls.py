from django.urls import path
from . import views

urlpatterns = [
    path('potata/', views.potata_info, name='potata_info'),
    path('cheer/', views.cheer_potata, name='cheer_potata'),
    path('health/', views.health_check, name='health_check'),
]
