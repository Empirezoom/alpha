from django.urls import path
from . import views






urlpatterns = [
    path('',views.homepage,name='homepage'),

    path('education/',views.education,name='education'),
    path('support/',views.support,name='support'),


    # path('register/',views.register_view,name='register'),
    # path('login/',views.login,name='login'),
    # path('register/',views.register_view,name='register'),
    # path('later',views.later,name='later'),




    

    path('register/', views.register_view, name='register'),
    path('register-user/', views.register_user, name='register_user'),  # <-- This is the AJAX endpoint








    path('login/', views.login_view, name='login'),
    # path('dashboard/', views.dashboard_view, name='dashboard'),
    path('logout/', views.logout_view, name='logout'),





















    # path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('chat/check-unread/', views.check_unread_admin_messages, name='check_unread_admin_messages'),
    


    path('deposit/', views.deposit, name='deposit'),
    path('withdraw/', views.withdraw, name='withdraw'),

    
    path('chat/', views.user_chat, name='user_chat'),
    path('admin/chats/', views.admin_page, name='admin_chat_users'),
    path('admin/chats/<int:user_id>/', views.admin_chat_with_user, name='admin_chat_with_user'),
    
    path('admin/transactions/', views.transaction_list, name='transaction_list'),
    path('api/check-new-requests/', views.check_new_requests_api, name='check_new_requests_api'),

    







]