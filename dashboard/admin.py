# admin.py
from django.contrib import admin


# @admin.register(DepositRequest)
# class DepositRequestAdmin(admin.ModelAdmin):
#     list_display = ('user', 'amount', 'method', 'status', 'created_at')
#     list_filter = ('status', 'user')
#     search_fields = ('user__email',)
#     list_editable = ('status',)

# @admin.register(WithdrawalRequest)
# class WithdrawalRequestAdmin(admin.ModelAdmin):
#     list_display = ('user', 'amount', 'method', 'status', 'created_at')
#     list_filter = ('status', 'user')
#     search_fields = ('user__email',)
#     list_editable = ('status',)

# @admin.register(TransactionHistory)
# class TransactionHistoryAdmin(admin.ModelAdmin):
#     list_display = ('user', 'type', 'amount', 'method', 'status', 'date')
#     list_filter = ('type', 'status', 'user')
#     search_fields = ('user__email',)

# @admin.register(ChatMessage)
# class ChatMessageAdmin(admin.ModelAdmin):
#     list_display = ('user', 'sender', 'message', 'timestamp', 'is_read')
#     list_filter = ('sender', 'user')
#     search_fields = ('user__email', 'message')






from django.contrib import admin
from .models import Transaction



@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'transaction_type', 'amount', 'method', 'status', 'date')
    list_filter = ('transaction_type', 'status', 'method')
    search_fields = ('user__email', 'recipient_name', 'account_no', 'email')
    list_editable = ('status',)



from .models import ChatMessage

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'sender', 'message', 'file', 'timestamp', 'is_read')
    list_filter = ('sender', 'is_read', 'user')
    search_fields = ('user__email', 'message')