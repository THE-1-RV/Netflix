from django.db import models

# Create your models here.
class EmailSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class GiftCard(models.Model):
    code = models.CharField(max_length=50, unique=True)
    value = models.IntegerField(help_text="Discount value in Rupees")
    is_active = models.BooleanField(default=True) # Optional: To deactivate codes later

    def __str__(self):
        return f"{self.code} (₹{self.value})"
