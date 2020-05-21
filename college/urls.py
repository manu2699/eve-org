from django.urls import path
from . views import (getColleges, postEvent, getEvents,
                     collegeLogin, collegeRegister)

urlpatterns = [
    path('getColleges/', getColleges),
    path('postEvent/', postEvent),
    path('getEvents/', getEvents),
    path('college/login/', collegeLogin),
    path('college/register/', collegeRegister)
]
