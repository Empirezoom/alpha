# models.py
from django.db import models
import uuid
from django.core.validators import EmailValidator, RegexValidator

from django.utils import timezone

from django.db.models.signals import pre_save
from django.dispatch import receiver




from django.db import models
import random
import string

# Your existing model
class UserRegistration(models.Model):
    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    main_id = models.CharField(max_length=20, unique=True, editable=False,)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message='Enter a valid phone number')])
    password = models.CharField(max_length=255)
    terms_accepted = models.BooleanField(default=False)
    marketing_emails = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=5.00)

    def save(self, *args, **kwargs):
        if not self.main_id:  # Generate ID only on first save
            prefix = "TRD"
            suffix = "FX"
            
            # Keep generating until a unique ID is found
            while True:
                random_digits = ''.join(random.choices(string.digits, k=10)) # 10 random digits
                new_id = f"{prefix}{random_digits}{suffix}"
                
                # Check if the ID already exists in the database
                if not UserRegistration.objects.filter(main_id=new_id).exists():
                    self.main_id = new_id
                    break
        super(UserRegistration, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"
    
    class Meta:
        verbose_name = "User Registration"
        verbose_name_plural = "User Registrations"

















# from .models import UserRegistration  # Adjust import if UserRegistration is in another app

class Trade(models.Model):
    ASSET_TYPE_CHOICES = [
        ('forex', 'Forex'),
        ('crypto', 'Crypto'),
        ('stocks', 'Stocks'),
        ('commodities', 'Commodities'),
    ]
    TRADE_TYPE_CHOICES = [
        ('Call', 'Call'),
        ('Put', 'Put'),
    ]
    RESULT_CHOICES = [
        ('Active', 'Active'),
        ('Won', 'Won'),
        ('Lost', 'Lost'),
    ]

    user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE, related_name='trades')
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPE_CHOICES)
    asset = models.CharField(max_length=50)
    trade_type = models.CharField(max_length=10, choices=TRADE_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    expiry = models.IntegerField(help_text="Expiry in minutes")
    status = models.CharField(max_length=10, choices=RESULT_CHOICES, default='Active')
    opened_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    profit_loss = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    balance_updated = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        # Store the original status before saving
        if self.pk:
            original = Trade.objects.get(pk=self.pk)
            self._original_status = original.status
        else:
            self._original_status = None
        super().save(*args, **kwargs)





# Improved signal implementation with better tracking
@receiver(pre_save, sender=Trade)
def improved_trade_status_handler(sender, instance, **kwargs):
    """
    Improved implementation with better tracking
    """
    if instance.pk:  # Only for existing trades
        try:
            old_trade = Trade.objects.get(pk=instance.pk)
            
            # Check if status changed from Active to Won or Lost
            if (old_trade.status == 'Active' and 
                instance.status in ['Won', 'Lost'] and 
                not old_trade.balance_updated):
                
                user = instance.user
                
                if instance.status == 'Won':
                    # Add profit_loss to user balance
                    if instance.profit_loss:
                        user.balance += instance.profit_loss
                        user.save()
                        instance.balance_updated = True
                        
                elif instance.status == 'Lost':
                    # Set profit_loss to negative trading amount
                    instance.profit_loss = instance.amount
                    # instance.profit_loss = -instance.amount
                    instance.balance_updated = True
                    # Don't add anything to user balance
                    
        except Trade.DoesNotExist:
            pass
        except Exception as e:
            print(f"Error in trade status handler: {e}")

    def __str__(self):
        return f"{self.asset} {self.trade_type} ${self.amount} ({self.status})"





