from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('tv-shows/', views.tv_shows, name='tv_shows'),
    path('movies/', views.movies, name='movies'),
    path('games/', views.games, name='games'),
    path('new-popular/', views.new_popular, name='new_popular'),
    path('my-list/', views.my_list, name='my_list'),
    path('browse-languages/', views.browse_languages, name='browse_languages'),
] 