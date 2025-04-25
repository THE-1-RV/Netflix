from django.contrib import admin

# Register your models here.
from .models import EmailSubscriber, GiftCard

admin.site.register(EmailSubscriber)
admin.site.register(GiftCard)
