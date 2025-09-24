from django import forms
from .models import Trade




class TradeForm(forms.ModelForm):
    class Meta:
        model = Trade
        fields = ['asset_type', 'asset', 'trade_type', 'amount', 'expiry']
        widgets = {
            'asset_type': forms.Select(attrs={'onchange': 'this.form.submit();'}),
            'amount': forms.NumberInput(attrs={'min': 10}),
            'expiry': forms.NumberInput(attrs={'min': 1}),
        }




from django import forms
from .models import Trade

class TradeForm(forms.ModelForm):
    class Meta:
        model = Trade
        fields = ['asset_type', 'asset', 'trade_type', 'amount', 'expiry']
        widgets = {
            'amount': forms.NumberInput(attrs={'min': 10}),
            'expiry': forms.NumberInput(attrs={'min': 1}),
        }





