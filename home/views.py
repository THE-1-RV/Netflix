from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .models import EmailSubscriber

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