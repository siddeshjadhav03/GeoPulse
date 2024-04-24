from django.urls import path
from . import views

urlpatterns = [
    path('',views.IndexPage.as_view(), name='index'),
    path('villages/<str:district>', views.GetVillageData.as_view(), name='village'),
    path('geolocation/<str:village_name>', views.GetGeoLocation.as_view(), name='geolocation')
]