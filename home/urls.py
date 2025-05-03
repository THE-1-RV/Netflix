from django.urls import path
from . import views
from .views import subscribe_email


urlpatterns = [
    path('', views.index, name='index'),
    path('subscribe/', views.save_email, name='save_email'),
    path('log/', views.log, name='log'),
    path('home/', views.home, name='home'),
    path('deluser/', views.deluser, name='deluser'),
    path('logout/', views.logout_view, name='logout'),
    path('settings/', views.settings, name='settings'),
    path('api/get_started_data/', views.get_started_data, name='get_started_data'),
    path('get_started/', views.get_started, name='get_started'),
    path('api/browse/', views.browse_data, name='browse_data'),
    path('netflix_main/', views.netflix_main, name='netflix_main'),

    # Netflix app pages
    path('tv-shows/', views.tv_shows, name='tv_shows'),
    path('movies/', views.movies, name='movies'),
    path('games/', views.games, name='games'),
    path('new-popular/', views.new_popular, name='new_popular'),
    path('my-list/', views.my_list, name='my_list'),
    path('browse-languages/', views.browse_languages, name='browse_languages'),
    path('api/tv-shows/', views.tv_shows_data, name='tv_shows_data'),
]