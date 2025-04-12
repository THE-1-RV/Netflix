from django.contrib import admin

# Register your models here.
from .models import EmailSubscriber

admin.site.register(EmailSubscriber)
