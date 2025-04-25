from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import EmailSubscriber, GiftCard

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