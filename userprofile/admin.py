
# admin.py
from django.contrib import admin
from .models import UserRegistration
from .models import *




from .models import Trade

from django.utils.html import format_html




class UserRegistrationAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'first_name', 'last_name', 'email', 'phone', 'created_at','balance')
    list_filter = ('created_at', 'terms_accepted', 'marketing_emails','balance')
    search_fields = ('first_name', 'last_name', 'email', 'phone')
    readonly_fields = ('user_id', 'created_at')
    
    fieldsets = (
        ('User Information', {
            'fields': ('user_id', 'first_name', 'last_name', 'email', 'phone')
        }),
        ('Account Settings', {
            'fields': ('password', 'terms_accepted', 'marketing_emails','balance')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )





# @admin.register(Trade)
# class TradeAdmin(admin.ModelAdmin):
#     list_display = ('user','asset', 'trade_type', 'amount', 'status', 'opened_at', 'closed_at')
#     list_filter = ('status', 'asset_type', 'trade_type')



@admin.action(description='Mark selected trades as Won')
def mark_as_won(modeladmin, request, queryset):
    for trade in queryset.filter(status='Active'):
        trade.status = 'Won'
        trade.closed_at = timezone.now()
        # Example: 85% payout
        profit = trade.amount * 0.85
        trade.profit_loss = profit
        trade.save()
        # Add profit to user balance
        user = trade.user
        user.balance += profit
        user.save()

@admin.action(description='Mark selected trades as Lost')
def mark_as_lost(modeladmin, request, queryset):
    for trade in queryset.filter(status='Active'):
        trade.status = 'Lost'
        trade.closed_at = timezone.now()
        trade.profit_loss = trade.amount
        trade.save()
        # No balance update for loss

# @admin.register(Trade)
# class TradeAdmin(admin.ModelAdmin):
#     list_display = ('user', 'asset', 'trade_type', 'amount', 'status', 'opened_at', 'closed_at', 'profit_loss')
#     actions = [mark_as_won, mark_as_lost]

@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ('user', 'asset', 'trade_type', 'amount', 'status', 'opened_at', 'closed_at', 'profit_loss', 'countdown')
    actions = [mark_as_won, mark_as_lost]
    readonly_fields = ['balance_updated'] 
    def countdown(self, obj):
        if obj.status == 'Active':
            from django.utils import timezone
            expiry_time = obj.opened_at + timezone.timedelta(minutes=obj.expiry)
            remaining = expiry_time - timezone.now()
            if remaining.total_seconds() > 0:
                minutes, seconds = divmod(int(remaining.total_seconds()), 60)
                return f"{minutes:02d}:{seconds:02d}"
            else:
                return "00:00"
        return "-"
    countdown.short_description = "Time Left"

    def save_model(self, request, obj, form, change):
        """
        Override save_model to provide feedback in admin
        """
        old_balance = None
        if change and obj.user:
            old_balance = obj.user.balance
            
        super().save_model(request, obj, form, change)
        
        # Provide feedback about balance changes
        if change and obj.user and old_balance is not None:
            new_balance = UserRegistration.objects.get(pk=obj.user.pk).balance
            if new_balance != old_balance:
                self.message_user(
                    request, 
                    f"User balance updated from {old_balance} to {new_balance}"
                )





admin.site.register(UserRegistration, UserRegistrationAdmin)





























