from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import EmailSubscriber, GiftCard
from django.http import JsonResponse
from urllib.parse import quote

# Create your views here.
def index(request):
    return render(request, 'index.html', {'user': request.user})

def logout_view(request):
    logout(request)
    messages.success(request, "You have been logged out successfully.")
    return redirect('index')

def some_view(request):
    messages.success(request, 'Account deleted successfully.')
    # or messages.error(request, 'Error deleting account.')
    return redirect('home')

@csrf_exempt
def save_email(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if email:
            EmailSubscriber.objects.get_or_create(email=email)
        return redirect('/')
    return redirect('/')


@csrf_exempt
def subscribe_email(request):
    if request.method == "POST":
        email = request.POST.get("email")
        if email:
            EmailSubscriber.objects.get_or_create(email=email)
        return redirect("/")  # Or render a thank you page
    return redirect("/")


def home(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        cnf_password = request.POST.get('cnf_password')

        if password != cnf_password:
            messages.error(request, "Passwords do not match.")
            return redirect('home')

        if User.objects.filter(username=email).exists():
            messages.error(request, "User already exists.")
            return redirect('home')

        user = User.objects.create_user(username=email, email=email, password=password, first_name=username)
        user.save()
        messages.success(request, "Account created successfully! Please log in.")
        return redirect('log')

    return render(request, 'home.html')


def log(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(username=email, password=password)
        if user:
            login(request, user)
            messages.success(request, f"Welcome back, {user.first_name}!")
            return redirect('index')
        else:
            messages.error(request, "Invalid credentials.")
            return redirect('log')

    return render(request, 'log.html')


def deluser(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = User.objects.get(username=email)
            if user.check_password(password):
                user.delete()
                messages.success(request, "Your account has been deleted.")
                return redirect('index')
            else:
                messages.error(request, "Wrong password.")
        except User.DoesNotExist:
            messages.error(request, "User not found.")

    return render(request, 'deluser.html')

@login_required
def settings(request):
    if request.method == 'POST':
        if 'update_profile' in request.POST:
            # Handle profile update
            user = request.user
            user.full_name = request.POST.get('full_name')
            user.email = request.POST.get('email')
            user.save()
            messages.success(request, 'Profile updated successfully!')
        elif 'change_password' in request.POST:
            # Handle password change
            current_password = request.POST.get('current_password')
            new_password = request.POST.get('new_password')
            confirm_password = request.POST.get('confirm_password')
            
            if new_password != confirm_password:
                messages.error(request, 'New passwords do not match!')
            else:
                user = request.user
                if user.check_password(current_password):
                    user.set_password(new_password)
                    user.save()
                    update_session_auth_hash(request, user)  # Keep the user logged in
                    messages.success(request, 'Password changed successfully!')
                else:
                    messages.error(request, 'Current password is incorrect!')
    
    return render(request, 'settings.html')

def gift_cards(request):
    discount_amount = 0
    discount_code = None
    base_prices = {
        'standard': 199,
        'premium': 499,
        'deluxe': 799
    }

    if request.method == 'POST':
        entered_code = request.POST.get('gift_code')
        if entered_code:
            try:
                # Find an active gift card with the entered code
                card = GiftCard.objects.get(code=entered_code, is_active=True)
                discount_amount = card.value
                discount_code = card.code # Store the code for context
                messages.success(request, f'Successfully redeemed code "{card.code}"! You get a discount of ₹{discount_amount}.')
                # Optional: Deactivate the code after use (if desired)
                # card.is_active = False
                # card.save()
            except GiftCard.DoesNotExist:
                messages.error(request, "Invalid or inactive gift card code.")
        else:
             messages.warning(request, "Please enter a gift card code.")

    # Calculate discounted prices (ensure they don't go below 0)
    discounted_prices = {
        key: max(0, price - discount_amount) 
        for key, price in base_prices.items()
    }

    context = {
        'base_prices': base_prices,
        'discounted_prices': discounted_prices,
        'discount_amount': discount_amount,
        'redeemed_code': discount_code
    }
    return render(request, 'gift_cards.html', context)

def get_started_data(request):
    # Sample trending shows (in a real app, fetch from DB)
    trending_shows = [
        {"title": "Money Heist", "image": "/static/assets/images/moneyheist.jpg"},
        {"title": "Squid Game", "image": "/static/assets/images/squid.jpeg"},
        {"title": "Stranger Things", "image": "/static/assets/images/strangerthings.jpg"},
        {"title": "Breaking Bad", "image": "/static/assets/images/breakingbad.jpg"},
    ]
    # Sample plans (in a real app, fetch from DB)
    plans = [
        {"name": "Mobile", "price": 149, "features": ["Watch on mobile/tablet", "SD quality"]},
        {"name": "Basic", "price": 199, "features": ["Watch on any device", "HD available"]},
        {"name": "Standard", "price": 499, "features": ["2 screens at a time", "Full HD"]},
        {"name": "Premium", "price": 649, "features": ["4 screens at a time", "Ultra HD"]},
    ]
    return JsonResponse({"trending_shows": trending_shows, "plans": plans})

def get_started(request):
    return render(request, 'get_started.html')

def browse_data(request):
    # Family-friendly, sanskari movies/shows with fetchable posters only
    poster_urls = {
        "Ramayana": "https://upload.wikimedia.org/wikipedia/en/2/2e/Ramayan_1987_TV_series.jpg",
        "Mahabharat": "https://upload.wikimedia.org/wikipedia/en/2/2b/Mahabharat_1988_TV_series.jpg",
        "Swades": "https://upload.wikimedia.org/wikipedia/en/7/7e/Swades_poster.jpg",
        "Taare Zameen Par": "https://upload.wikimedia.org/wikipedia/en/8/86/Taare_Zameen_Par.jpg",
        "Chak De India": "https://upload.wikimedia.org/wikipedia/en/2/2e/Chak_De%21_India.jpg",
        "Lagaan": "https://upload.wikimedia.org/wikipedia/en/b/b6/Lagaan.jpg",
        "Dangal": "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg",
        "3 Idiots": "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
        "Bajrangi Bhaijaan": "https://upload.wikimedia.org/wikipedia/en/6/6e/Bajrangi_Bhaijaan_Poster.jpg",
        "Queen": "https://upload.wikimedia.org/wikipedia/en/2/22/QueenMoviePoster7thMarch.jpg",
        "Chhota Bheem": "https://upload.wikimedia.org/wikipedia/en/2/2c/Chhota_Bheem_and_the_Throne_of_Bali.jpg",
        "Motu Patlu": "https://upload.wikimedia.org/wikipedia/en/2/2e/Motu_Patlu_King_of_Kings_poster.jpg",
        "Doraemon": "https://upload.wikimedia.org/wikipedia/en/7/7e/Doraemon_2005.png",
        "Bal Ganesh": "https://upload.wikimedia.org/wikipedia/en/2/2e/Bal_Ganesh_poster.jpg",
        "Little Singham": "https://upload.wikimedia.org/wikipedia/en/2/2e/Little_Singham_poster.jpg",
        "Krishna Aur Kans": "https://upload.wikimedia.org/wikipedia/en/2/2e/Krishna_Aur_Kans_poster.jpg",
        "Hanuman": "https://upload.wikimedia.org/wikipedia/en/2/2e/Hanuman_2005_poster.jpg",
        "Jungle Book": "https://upload.wikimedia.org/wikipedia/en/7/7e/The_Jungle_Book_%282016%29_poster.jpg",
        "Frozen": "https://upload.wikimedia.org/wikipedia/en/0/05/Frozen_%282013_film%29_poster.jpg",
        "Toy Story": "https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg",
        "Finding Nemo": "https://upload.wikimedia.org/wikipedia/en/2/29/Finding_Nemo.jpg",
        "Kung Fu Panda": "https://upload.wikimedia.org/wikipedia/en/7/76/Kungfupanda.jpg",
        "Zootopia": "https://upload.wikimedia.org/wikipedia/en/e/ea/Zootopia.jpg",
        "Coco": "https://upload.wikimedia.org/wikipedia/en/9/9f/Coco_%282017_film%29.png",
        "Up": "https://upload.wikimedia.org/wikipedia/en/0/05/Up_%282009_film%29.jpg",
        "Paddington": "https://upload.wikimedia.org/wikipedia/en/6/6e/Paddington_%28film%29.jpg",
        "The Lion King": "https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg",
        "Chillar Party": "https://upload.wikimedia.org/wikipedia/en/2/2e/Chillar_Party_poster.jpg",
        "Stanley Ka Dabba": "https://upload.wikimedia.org/wikipedia/en/2/2e/Stanley_Ka_Dabba_poster.jpg",
    }
    # Only use movies/shows with fetchable posters
    available_titles = list(poster_urls.keys())
    def get_image(title):
        return poster_urls.get(title)
    categories = [
        {
            "title": "Today's Top Picks for Kids",
            "items": [
                {"title": t, "image": get_image(t), "badges": b} for t, b in [
                    ("Ramayana", ["Classic"]),
                    ("Mahabharat", ["Classic"]),
                    ("Chhota Bheem", ["Animated"]),
                    ("Motu Patlu", ["Animated"]),
                    ("Doraemon", ["Animated"]),
                    ("Bal Ganesh", ["Mythology"]),
                    ("Little Singham", ["Action"]),
                    ("Krishna Aur Kans", ["Mythology"]),
                    ("Hanuman", ["Mythology"]),
                    ("Jungle Book", ["Adventure"]),
                ]
            ]
        },
        {
            "title": "Family Blockbusters",
            "items": [
                {"title": t, "image": get_image(t), "badges": b} for t, b in [
                    ("Swades", ["Inspiring"]),
                    ("Taare Zameen Par", ["Family"]),
                    ("Chak De India", ["Sports"]),
                    ("Lagaan", ["Epic"]),
                    ("Dangal", ["Blockbuster"]),
                    ("3 Idiots", ["Comedy"]),
                    ("Bajrangi Bhaijaan", ["Family"]),
                    ("Queen", ["Feel Good"]),
                    ("Chillar Party", ["Kids"]),
                    ("Stanley Ka Dabba", ["Kids"]),
                ]
            ]
        },
        {
            "title": "Animated & International",
            "items": [
                {"title": t, "image": get_image(t), "badges": b} for t, b in [
                    ("Frozen", ["Animated"]),
                    ("Toy Story", ["Animated"]),
                    ("Finding Nemo", ["Animated"]),
                    ("Kung Fu Panda", ["Animated"]),
                    ("Zootopia", ["Animated"]),
                    ("Coco", ["Animated"]),
                    ("Up", ["Animated"]),
                    ("Paddington", ["Family"]),
                    ("The Lion King", ["Classic"]),
                    ("Jungle Book", ["Adventure"]),
                ]
            ]
        },
        {
            "title": "Top 10 for Kids in India Today",
            "items": [
                {"title": t, "image": get_image(t), "badges": b} for t, b in [
                    ("Chhota Bheem", ["Top 10"]),
                    ("Motu Patlu", ["Top 10"]),
                    ("Doraemon", ["Top 10"]),
                    ("Bal Ganesh", ["Top 10"]),
                    ("Little Singham", ["Top 10"]),
                    ("Krishna Aur Kans", ["Top 10"]),
                    ("Hanuman", ["Top 10"]),
                    ("Frozen", ["Top 10"]),
                    ("Toy Story", ["Top 10"]),
                    ("Finding Nemo", ["Top 10"]),
                ]
            ]
        }
    ]
    return JsonResponse({"categories": categories})

def browse(request):
    return render(request, 'browse.html')

def netflix_main(request):
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

def tv_shows_data(request):
    # You can replace this with real DB/API data
    shows = [
        {
            "title": "Stranger Things",
            "image": "/static/assets/images/strangerthings.jpg",
            "year": "2016",
            "rating": "TV-14",
            "isTop10": True,
            "isNew": False
        },
        {
            "title": "The Crown",
            "image": "/static/assets/images/thecrown.jpg",
            "year": "2016",
            "rating": "TV-MA",
            "isTop10": False,
            "isNew": True
        },
        {
            "title": "Money Heist",
            "image": "/static/assets/images/moneyheist.jpg",
            "year": "2017",
            "rating": "TV-MA",
            "isTop10": True,
            "isNew": False
        },
        {
            "title": "Breaking Bad",
            "image": "/static/assets/images/breakingbad.jpg",
            "year": "2008",
            "rating": "TV-MA",
            "isTop10": False,
            "isNew": False
        }
    ]
    return JsonResponse({"shows": shows})