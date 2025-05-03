from django.shortcuts import render

def home(request):
    return render(request, 'netflix_main.html')

def tv_shows(request):
    return render(request, 'tv_shows.html')

def movies(request):
    return render(request, 'movies.html')

def games(request):
    return render(request, 'games.html')

def new_popular(request):
    return render(request, 'new_popular.html')

def my_list(request):
    return render(request, 'my_list.html')

def browse_languages(request):
    return render(request, 'browse_languages.html') 