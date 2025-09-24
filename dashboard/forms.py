# from django import forms
# from .models import DepositRequest, WithdrawalRequest, ChatMessage

# class DepositForm(forms.ModelForm):
#     class Meta:
#         model = DepositRequest
#         fields = ['amount', 'method']

# class WithdrawalForm(forms.ModelForm):
#     class Meta:
#         model = WithdrawalRequest
#         fields = ['amount', 'method', 'recipient_name', 'account_number', 'phone', 'email', 'id_front', 'id_back']

# class ChatForm(forms.ModelForm):
#     class Meta:
#         model = ChatMessage
#         fields = ['message']






from django import forms
from .models import Transaction

class DepositForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['amount', 'method', 'email', 'phone']
        widgets = {
            'amount': forms.NumberInput(attrs={'min': 100}),
        }

class WithdrawalForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = [
            'amount', 'method', 'recipient_name', 'account_no', 'phone', 'email',
            'front_id_card', 'back_id_card'
        ]
        widgets = {
            'amount': forms.NumberInput(attrs={'min': 5000}),
        }