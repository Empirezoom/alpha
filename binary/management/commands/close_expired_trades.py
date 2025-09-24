from django.core.management.base import BaseCommand
from django.utils import timezone
from userprofile.models import Trade
import random
from decimal import Decimal


# python manage.py close_expired_trades TO RUN THE COMMAND
# ALSO NO PIP WAS INSTALLED 

class Command(BaseCommand):
    help = 'Auto-close expired trades'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        active_trades = Trade.objects.filter(status='Active')
        for trade in active_trades:
            expiry_time = trade.opened_at + timezone.timedelta(minutes=trade.expiry)
            if now >= expiry_time:
                # Randomly decide win/loss
                result = random.choice(['Won', 'Lost'])
                trade.status = result
                trade.closed_at = now
                if result == 'Won':
                    profit = trade.amount * Decimal('0.85')
                    trade.profit_loss = profit
                    trade.user.balance += profit
                    trade.user.save()
                else:
                    trade.profit_loss = trade.amount
                trade.save()
                self.stdout.write(self.style.SUCCESS(f'Trade {trade.id} closed as {result}'))