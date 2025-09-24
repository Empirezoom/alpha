
# models.py
from django.db import models
from userprofile.models import UserRegistration  # Import your custom user model



# class DepositRequest(models.Model):
#     STATUS_CHOICES = [
#         ('Pending', 'Pending'),
#         ('Accepted', 'Accepted'),
#         ('Rejected', 'Rejected'),
#     ]
#     user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE)
#     amount = models.DecimalField(max_digits=12, decimal_places=2)
#     method = models.CharField(max_length=50)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
#     created_at = models.DateTimeField(auto_now_add=True)


#     def __str__(self):
#         return f"Deposit Request - {self.user.email} - ${self.amount}"

# class WithdrawalRequest(models.Model):
#     STATUS_CHOICES = [
#         ('Pending', 'Pending'),
#         ('Accepted', 'Accepted'),
#         ('Rejected', 'Rejected'),
#     ]
#     user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE)
#     amount = models.DecimalField(max_digits=12, decimal_places=2)
#     method = models.CharField(max_length=50)
#     recipient_name = models.CharField(max_length=100)
#     account_number = models.CharField(max_length=100)
#     phone = models.CharField(max_length=20)
#     email = models.EmailField()
#     id_front = models.FileField(upload_to='ids/')
#     id_back = models.FileField(upload_to='ids/')
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
#     created_at = models.DateTimeField(auto_now_add=True)


#     def __str__(self):
#         return f"Withdrawal Request - {self.user.email} - ${self.amount}"

# class TransactionHistory(models.Model):
#     user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE)
#     date = models.DateTimeField(auto_now_add=True)
#     type = models.CharField(max_length=20)  # Deposit/Withdrawal
#     amount = models.DecimalField(max_digits=12, decimal_places=2)
#     method = models.CharField(max_length=50)
#     status = models.CharField(max_length=20)

# class ChatMessage(models.Model):
#     user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE)
#     sender = models.CharField(max_length=10)  # 'user' or 'admin'
#     message = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)
#     is_read = models.BooleanField(default=False)






class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('Deposit', 'Deposit'),
        ('Withdrawal', 'Withdrawal'),
    ]
    STATUS_CHOICES = [
        ('Processing', 'Processing'),
        ('Completed', 'Completed'),
        ('Declined', 'Declined (Admin)'),    #   This is the most common status and often happens during the authorization stage. The bank or card issuer has reviewed the transaction and has refused to approve it. This can happen for many reasons, such as insufficient funds, an expired card, a fraud alert, or a daily spending limit being exceeded.
        ('Voided', 'Voided (You)'),  # A transaction is "voided" when a merchant cancels it before the clearing process is complete. This usually happens on the same day as the original transaction. Since the funds were only on hold (authorized) and not yet transferred, the merchant can simply void the transaction, and the hold on the funds will be released.
    
    ]
    user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Processing')
    date = models.DateTimeField(auto_now_add=True)
    # Withdrawal-specific fields
    recipient_name = models.CharField(max_length=100, blank=True, null=True)
    account_no = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    front_id_card = models.FileField(upload_to='id_cards/front', blank=True, null=True)
    back_id_card = models.FileField(upload_to='id_cards/back', blank=True, null=True)

    def __str__(self):
        return f"{self.user.email} - {self.transaction_type} - {self.amount}"
    








# class ChatMessage(models.Model):
#     SENDER_CHOICES = [
#         ('user', 'User'),
#         ('admin', 'Admin'),
#     ]
#     user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE, related_name='chat_messages')
#     sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
#     message = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)
#     is_read = models.BooleanField(default=False)  # For admin to mark user messages as read

#     def __str__(self):
#         return f"{self.user.email} - {self.sender} - {self.timestamp}"




class ChatMessage(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE, related_name='chat_messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    message = models.TextField(blank=True)
    file = models.FileField(upload_to='chat_uploads/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)