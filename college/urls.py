from django.urls import path
from . views import (getColleges, postEvent, getEvents,
                     collegeLogin, collegeRegister, CAuthCheck, CAuthInsert, AdminLogin)

urlpatterns = [
    path('getColleges/', getColleges),
    path('postEvent/', postEvent),
    path('getEvents/', getEvents),
    path('college/login/', collegeLogin),
    path('college/register/', collegeRegister),
    path('auth/<slug:cid>/', CAuthCheck),
    path('auth/', CAuthInsert),
    path('adminLogin/', AdminLogin)
]
