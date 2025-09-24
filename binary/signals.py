# signals.py (create this file in your app directory)
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from decimal import Decimal
from .models import Trade, UserRegistration

@receiver(pre_save, sender=Trade)
def handle_trade_status_change(sender, instance, **kwargs):
    """
    Handle trade status changes and update user balance accordingly
    """
    if instance.pk:  # Only for existing trades (updates)
        try:
            # Get the previous state of the trade
            old_trade = Trade.objects.get(pk=instance.pk)
            
            # Check if status changed from Active to Won or Lost
            if old_trade.status == 'Active' and instance.status in ['Won', 'Lost']:
                
                # Get the user associated with this trade
                user = instance.user
                
                if instance.status == 'Won':
                    # Add profit_loss to user balance
                    if instance.profit_loss:
                        user.balance += instance.profit_loss
                        user.save()
                        
                elif instance.status == 'Lost':
                    # Set profit_loss to negative trading amount
                    instance.profit_loss = -instance.amount
                    # Don't add anything to user balance (loss scenario)
                    
        except Trade.DoesNotExist:
            # This is a new trade, not an update
            pass
        except Exception as e:
            # Log the error or handle it appropriately
            print(f"Error updating trade status: {e}")


# Alternative approach using post_save if you prefer
@receiver(post_save, sender=Trade)
def update_user_balance_on_trade_completion(sender, instance, created, **kwargs):
    """
    Alternative implementation using post_save signal
    This approach tracks the previous state differently
    """
    # Only process if this is an update (not creation) and trade is completed
    if not created and instance.status in ['Won', 'Lost']:
        
        # You might want to add a flag to track if balance was already updated
        # to avoid double processing
        
        user = instance.user
        
        if instance.status == 'Won' and instance.profit_loss:
            # Check if balance was already updated (you might need to add a field for this)
            # For now, we'll assume this runs only once per status change
            user.balance += instance.profit_loss
            user.save()
            
        elif instance.status == 'Lost':
            # Set profit_loss to negative amount if not already set
            if not instance.profit_loss:
                instance.profit_loss = instance.amount
                # instance.profit_loss = -instance.amount
                # Save without triggering signals again
                Trade.objects.filter(pk=instance.pk).update(profit_loss=instance.profit_loss)