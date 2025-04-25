from django.urls import path
from . import views
from .views import subscribe_email


urlpatterns = [
    path('', views.index, name = 'index'),
    path('subscribe/', views.save_email, name='save_email'),
    path('log/', views.log, name='log'),
    path('home/', views.home, name='home'),
    path('deluser/', views.deluser, name='deluser'),
    path('logout/', views.logout_view, name='logout'),
]