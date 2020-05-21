from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
# from college import views
urlpatterns = [
    path('admin/', admin.site.urls),
    # path('colleges/', views.CollegesList.as_view()),
    path("api/", include('college.urls')),
    re_path('.*', TemplateView.as_view(template_name="index.html"))
]
