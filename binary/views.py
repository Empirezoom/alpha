from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages




# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from userprofile.models import  UserRegistration






from userprofile.models import Trade, UserRegistration
from userprofile.forms import TradeForm



from datetime import datetime




from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required # Assuming you have user authentication
from userprofile.models import UserRegistration
# from veteran.models import DepositRequest, WithdrawalRequest, ChatMessage















# Create your views here.

def homepage(request):


    context = {
        # 'featured': featured,

    }

    return render(request, 'index.html', context)









def education(request):


    context = {
        # 'featured': featured,

    }

    return render(request, 'education.html', context)
    
def support(request):


    context = {
        # 'featured': featured,

    }

    return render(request, 'support.html', context)









from django.views.decorators.cache import never_cache

@never_cache
def register_view(request):
    return render(request, 'register.html')


from django.contrib.auth.hashers import make_password
import re

@require_http_methods(["POST"])
def register_user(request):
    errors = {}
    try:
        first_name = request.POST.get('firstName', '').strip()
        last_name = request.POST.get('lastName', '').strip()
        email = request.POST.get('email', '').strip()
        phone = request.POST.get('phone', '').strip()
        password = request.POST.get('password', '')
        confirm_password = request.POST.get('confirmPassword', '')
        terms = request.POST.get('terms') == 'on'
        marketing = request.POST.get('marketing') == 'on'

        # Field validations
        if not first_name:
            errors['firstName'] = "First name is required."
        if not last_name:
            errors['lastName'] = "Last name is required."
        if not email:
            errors['email'] = "Email is required."
        elif UserRegistration.objects.filter(email=email).exists():
            errors['email'] = "Email already registered."
        if not phone:
            errors['phone'] = "Phone number is required."
        elif not re.match(r'^\+?\d{9,15}$', phone):
            errors['phone'] = "Enter a valid phone number."
        if not password:
            errors['password'] = "Password is required."
        elif len(password) < 8:
            errors['password'] = "Password must be at least 8 characters."
        if password != confirm_password:
            errors['confirmPassword'] = "Passwords do not match."
        if not terms:
            errors['terms'] = "You must accept the terms and conditions."

        if errors:
            return JsonResponse({'success': False, 'errors': errors})

        # Hash password before saving
        hashed_password = make_password(password)

        user_reg = UserRegistration.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            password=hashed_password,
            terms_accepted=terms,
            marketing_emails=marketing
        )

        return JsonResponse({
            'success': True,
            'message': 'Account created successfully!',
            'user_id': str(user_reg.user_id),
            'main_id': user_reg.main_id,
            'redirect_url': '/login/'  # or use reverse('login')
        })

    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'success': False, 'errors': {'general': 'An error occurred. Please try again.'}})
    # except Exception as e:
    #     print(f"Error: {e}")
    #     return JsonResponse({'success': False, 'errors': {'general': str(e)}})













# If you want to use Django's built-in session login, you'd use these, 
# but for custom model with non-hashed password, we'll do it manually.
# from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout


# def login_view(request):
#     if request.method == 'POST':
#         email = request.POST.get('email')
#         password = request.POST.get('password')

#         user = None
#         try:
#             # IMPORTANT: This is for non-hashed passwords as requested.
#             # In a real application, you *must* use password hashing (e.g., Django's built-in User model
#             # and authenticate/login functions, or a strong hashing library if customizing).
#             user = UserRegistration.objects.get(email=email, password=password)
#         except UserRegistration.DoesNotExist:
#             pass # User not found or password incorrect

#         if user is not None:
#             # User found and password matches
#             # Manually set a session variable to indicate the user is logged in
#             request.session['user_email'] = user.email
#             request.session['is_logged_in'] = True
#             messages.success(request, f'Welcome, {user.first_name}!')
#             return redirect('dashboard') # Redirect to a dashboard or home page after successful login
#         else:
#             # Invalid credentials
#             messages.error(request, 'Invalid email or password.')
            
#     # For GET requests or failed POST requests, render the login page
#     return render(request, 'login.html')



from django.contrib.auth.hashers import check_password

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = None
        try:
            user = UserRegistration.objects.get(email=email)
            # Use check_password to compare the plain password to the hashed one
            if not check_password(password, user.password):
                user = None  # Password does not match
        except UserRegistration.DoesNotExist:
            user = None

        if user is not None:
            # User found and password matches
            request.session['user_email'] = user.email
            request.session['is_logged_in'] = True
            messages.success(request, f'Welcome, {user.first_name}!')
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid email or password.')

    return render(request, 'login.html')




def logout_view(request):
    # Clear the custom session variables
    if 'user_email' in request.session:
        del request.session['user_email']
    if 'is_logged_in' in request.session:
        del request.session['is_logged_in']
    
    messages.info(request, 'You have been logged out.')
    return redirect('login') # Redirect to login page after logout














from django.shortcuts import render, redirect
from django.contrib import messages
from dashboard.models import  Transaction
from dashboard.forms import DepositForm, WithdrawalForm






ASSET_DATA = {
    'forex': ['EUR/USD', 'GBP/JPY', 'USD/CAD', 'AUD/NZD'],
    'crypto': ['BTC/USD', 'ETH/USD', 'XRP/USD', 'LTC/USD'],
    'stocks': ['AAPL', 'GOOGL', 'MSFT', 'AMZN'],
    'commodities': ['Gold', 'Silver', 'Oil', 'Natural Gas'],
}

def dashboard_view(request):
    
    # Check if the user is logged in using our custom session variable
    if not request.session.get('is_logged_in'):
        messages.warning(request, ' Login to access the user dashboard.')
        return redirect('login') # Redirect to login if not authenticated

    user_email = request.session.get('user_email')
    user = None 
    if user_email:
        try:
            user = UserRegistration.objects.get(email=user_email)
        except UserRegistration.DoesNotExist:
            # This should ideally not happen if session is set correctly, but good for robustness
            messages.error(request, 'User data not found. Please log in again.')
            return redirect('login')
            
    asset_type = request.POST.get('asset_type','forex')
    assets = ASSET_DATA.get(asset_type, ASSET_DATA['forex'])
    # notification = request.session.pop('notification', None) # session 
    


# 1)
    # if request.method == 'POST':
    #     form = TradeForm(request.POST)
    #     if form.is_valid():
    #         trade = form.save(commit=False)
    #         trade.user = user
    #         trade.save()
    #         return redirect('dashboard')
    # else:
    #     form = TradeForm(initial={'asset_type': asset_type})


        # Check for deposit notification (admin changed balance)





    deposit_notified = request.session.pop('deposit_notified', False)
    if user.balance > 0 and not deposit_notified:
        request.session['deposit_notified'] = True
        messages.info(request, f"🛈 Current Balance is ${user.balance}.")
        # Add to notification modal
        if 'notifications' not in request.session:
            request.session['notifications'] = []
            return redirect('dashboard')
        request.session['notifications'].append({
            'type': 'success',
            'message': f"Total Deposit of ${user.balance} has been updated to your account balance.",
            'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # or any format you like
        })
        
# 2)
    # if request.method == 'POST':
    #     form = TradeForm(request.POST)
    #     if form.is_valid():
    #         amount = form.cleaned_data['amount']
    #         if user.balance < amount:
    #             messages.error(request, "🚨Insufficient Balance 🥺,Click on Request Deposit Button to Add Funds💵")
    #         else:
    #             trade = form.save(commit=False)
    #             trade.user = user
    #             trade.save()
    #             user.balance -= amount
    #             user.save()
    #             request.session['notification'] = "Trade placed successfully!"
    #             return redirect('dashboard')
    # else:
    #     form = TradeForm(initial={'asset_type': asset_type})



# 3)
    if request.method == 'POST':
        form = TradeForm(request.POST)
        if form.is_valid():
            amount = form.cleaned_data['amount']
            asset = form.cleaned_data['asset']
            expiry = form.cleaned_data['expiry']
            trade_type = form.cleaned_data['trade_type']
            if user.balance < amount:
                messages.error(request, "🚨Insufficient Balance 🥺,Click on Request Deposit Button to Add Funds💵")
            else:
                trade = form.save(commit=False)
                trade.user = user
                trade.save()
                user.balance -= amount
                user.save()
                request.session['notification'] = "Trade placed successfully!" # session 
                msg = f"Placing {trade_type.upper()} trade on {asset} for ${amount} with {expiry} min expiry."
                messages.warning(request, msg)
                # Add to notification modal
                if 'notifications' not in request.session:
                    request.session['notifications'] = []
                request.session['notifications'].append({
                    'type': 'info',
                    'message': msg,
                    'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                })
                return redirect('dashboard')
    else:
        form = TradeForm()

    # Get notifications for modal
    notifications = request.session.get('notifications', [])

    active_trades = Trade.objects.filter(user=user, status='Active').order_by('-opened_at')
    trading_history = Trade.objects.filter(user=user).exclude(status='Active').order_by('-closed_at')



    transactions = Transaction.objects.filter(user=user).order_by('-date')




    user = get_current_user(request)
    # Check for unread admin messages
    has_unread_admin_msg = ChatMessage.objects.filter(user=user, sender='admin', is_read=False).exists()
    

    context = {
        'user_email': user_email,
        'user': user, # Pass the user object if you need more details in the template
        'form': form,
        'assets': assets,
        'active_trades': active_trades,
        'trading_history': trading_history,
        'asset_type': asset_type,
        'user': user,
        # 'notification': notification, # session 
        'notifications': notifications,
        'transactions': transactions,
        'has_unread_admin_msg': has_unread_admin_msg



    }
 
    return render(request, 'dashboard01aii.html', context)
















def deposit(request):
    user_email = request.session.get('user_email')
    user = None
    if user_email:
        try:
            user = UserRegistration.objects.get(email=user_email)
        except UserRegistration.DoesNotExist:
            messages.error(request, 'User data not found. Please log in again.')
            return redirect('login')

        if request.method == 'POST':
            amount = request.POST.get('depositAmount')
            method = request.POST.get('depositMethod')
            email = request.POST.get('depositEmail')
            phone = request.POST.get('depositPhone')
            
            if amount and method and email and phone:
                # 1. Create the transaction as before
                Transaction.objects.create(
                    user=user,
                    transaction_type='Deposit',
                    amount=amount,
                    method=method,
                    status='Processing',
                    email=email,
                    phone=phone,
                )

                # 2. --- NEW: Automatically create a chat message ---
                auto_message = f"I have initiated a Deposit of ${amount} via {method}. Please confirm."
                ChatMessage.objects.create(
                    user=user,
                    sender='user',
                    message=auto_message
                )
                # --- END NEW ---

                messages.success(request, 'Deposit request submitted!')
                return redirect('user_chat') # Redirect to chat page
            else:
                messages.error(request, 'Please fill all deposit fields.')
            return redirect('dashboard')
    else:
        messages.error(request, 'Session expired. Please log in again.')
        return redirect('login')


def withdraw(request):
    user_email = request.session.get('user_email')
    user = None
    if user_email:
        try:
            user = UserRegistration.objects.get(email=user_email)
        except UserRegistration.DoesNotExist:
            messages.error(request, 'User data not found. Please log in again.')
            return redirect('login')

        if request.method == 'POST':
            amount = request.POST.get('withdrawAmount')
            method = request.POST.get('withdrawMethod')
            # ... other withdrawal fields
            recipient_name = request.POST.get('recipientName')
            account_no = request.POST.get('accountNo')
            phone = request.POST.get('withdrawPhone')
            email = request.POST.get('withdrawEmail')
            front_id_card = request.FILES.get('frontIdCard')
            back_id_card = request.FILES.get('backIdCard')
            
            if all([amount, method, recipient_name, account_no, phone, email, front_id_card, back_id_card]):
                # 1. Create the transaction as before
                Transaction.objects.create(
                    user=user,
                    transaction_type='Withdrawal',
                    amount=amount,
                    method=method,
                    status='Processing',
                    recipient_name=recipient_name,
                    account_no=account_no,
                    phone=phone,
                    email=email,
                    front_id_card=front_id_card,
                    back_id_card=back_id_card,
                )

                # 2. --- NEW: Automatically create a chat message ---
                auto_message = f"I have requested a Withdrawal of ${amount} using {method}. Kindly process it."
                ChatMessage.objects.create(
                    user=user,
                    sender='user',
                    message=auto_message
                )
                # --- END NEW ---

                messages.success(request, 'Withdrawal request submitted!')
                return redirect('user_chat') # Redirect to chat page
            else:
                messages.error(request, 'Please fill all withdrawal fields and upload both ID images.')
            return redirect('dashboard')
    else:
        messages.error(request, 'Session expired. Please log in again.')
        return redirect('login')








from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import user_passes_test
from dashboard.models import  ChatMessage

def get_current_user(request):
    user_email = request.session.get('user_email')
    if not user_email:
        return None
    return get_object_or_404(UserRegistration, email=user_email)



import os

def add_is_image(messages):
    for m in messages:
        if m.file:
            ext = os.path.splitext(m.file.name)[1].lower()
            m.is_image = ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
        else:
            m.is_image = False
    return messages





# c. Update your user_chat view to support AJAX
from django.template.loader import render_to_string



def user_chat(request):
    user = get_current_user(request)
    if not user:
        return redirect('login')
    if request.method == 'POST':
        msg = request.POST.get('message', '')
        file = request.FILES.get('file')
        if msg or file:
            ChatMessage.objects.create(user=user, sender='user', message=msg, file=file)
        # Only redirect if NOT an AJAX request  (to avoid resubmit form)
        if not request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return redirect('user_chat')
    messages = ChatMessage.objects.filter(user=user).order_by('timestamp')
    messages = add_is_image(messages)
    if request.GET.get('ajax'):
        return render(request, 'partials/user_chat_messages.html', {'messages': messages})
    # Mark all unread admin messages as read when user visits the chat page
    ChatMessage.objects.filter(user=user, sender='admin', is_read=False).update(is_read=True)



    has_unread_admin_msg = ChatMessage.objects.filter(user=user, sender='admin', is_read=False).exists()

    return render(request, 'livechat.html', {'messages': messages, 'user': user, 'has_unread_admin_msg': has_unread_admin_msg})



@user_passes_test(lambda u: u.is_superuser)
# Django View Must Support AJAX

def admin_chat_with_user(request, user_id):
    user = get_object_or_404(UserRegistration, pk=user_id)
    if request.method == 'POST':
        msg = request.POST.get('message', '')
        file = request.FILES.get('file')
        if msg or file:
            ChatMessage.objects.create(user=user, sender='admin', message=msg, file=file)
        # Only redirect if NOT an AJAX request (to avoid resubmit form)
        if not request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return redirect('admin_chat_with_user', user_id=user_id)
    messages = ChatMessage.objects.filter(user=user).order_by('timestamp')
    messages = add_is_image(messages)
    ChatMessage.objects.filter(user=user, sender='user', is_read=False).update(is_read=True)
    if request.GET.get('ajax'):
        return render(request, 'partials/admin_chat_messages.html', {'messages': messages})
    

    has_unread_user_msg = ChatMessage.objects.filter(user=user, sender='user', is_read=False).exists()  # for auto reload live chats
    
    return render(request, 'admin_chat_with_user.html', {'messages': messages, 'chat_user': user, 'has_unread_user_msg': has_unread_user_msg})










# Admin: View all users and chat with a selected user
from userprofile.models import UserRegistration
from dashboard.models import ChatMessage

@user_passes_test(lambda u: u.is_superuser)
def admin_page(request):
    users = UserRegistration.objects.all().order_by('-created_at')
    user_count = UserRegistration.objects.count()
    user_data = []
    for user in users:
        # Count unread messages from user to admin
        unread_count = ChatMessage.objects.filter(user=user, sender='user', is_read=False).count()
        # Count all messages from user to admin
        total_msg_count = ChatMessage.objects.filter(user=user, sender='user').count()
        user_data.append({
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'balance': user.balance,
            'joined': user.created_at,
            'has_new_message': unread_count > 0,
            'message_count': unread_count,
            'total_msg_count': total_msg_count,
            
        })
    

    # Get the initial count of requests to pass to the template
    initial_count = Transaction.objects.filter(status='Processing').count()


    return render(request, 'admin_page.html', {'users': user_data,'user_count': user_count,'initial_processing_count': initial_count,
})







from django.http import JsonResponse

def check_unread_admin_messages(request):
    user = get_current_user(request)
    if not user:
        return JsonResponse({'has_unread': False})
    has_unread = ChatMessage.objects.filter(user=user, sender='admin', is_read=False).exists()
    return JsonResponse({'has_unread': has_unread})









from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models import Q





# DECORATORS TO ENSURE ONLY ADMIN/STAFF CAN ACCESS
def is_staff(user):
    return user.is_staff

@login_required
@user_passes_test(is_staff)
def transaction_list(request):
    """
    Displays a list of all user transactions for the admin,
    with filtering and search capabilities.
    """
    transactions = Transaction.objects.select_related('user').order_by('-date')

    # Get search and filter parameters from the request URL
    search_query = request.GET.get('q', '')
    status_filter = request.GET.get('status', 'all')

    # Apply search filter if a query exists
    if search_query:
        transactions = transactions.filter(
            Q(user__first_name__icontains=search_query) |
            Q(user__last_name__icontains=search_query) |
            Q(user__email__icontains=search_query) |
            Q(method__icontains=search_query) |
            Q(account_no__icontains=search_query)
        )

    # Apply status filter
    if status_filter != 'all':
        transactions = transactions.filter(status=status_filter)

    context = {
        'transactions': transactions,
        'search_query': search_query,
        'status_filter': status_filter,
    }
    # Make sure the template name matches your file name
    return render(request, 'admin_transaction.html', context)




# DECORATORS TO ENSURE ONLY ADMIN/STAFF CAN ACCESS
def is_staff(user):
    return user.is_staff

@login_required
@user_passes_test(is_staff)
def check_new_requests_api(request):
    """
    An API endpoint that returns the current count of transactions
    with a 'Processing' status.
    """
    try:
        count = Transaction.objects.filter(status='Processing').count()
        return JsonResponse({'processing_count': count})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)













from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.urls import reverse

def custom_admin_login(request):
    error = None
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_superuser:
            login(request, user)
            return redirect(reverse('admin_chat_users'))
        else:
            error = "Invalid credentials or not an admin user."
    return render(request, 'admin_login.html', {'error': error})





# def logout_view(request):
#     """Logout user by clearing session"""
#     if request.method == 'POST':
#         request.session.flush()  # Clear all session data
#         return redirect('login')
#     return redirect('login')