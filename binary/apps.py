from django.apps import AppConfig


class BinaryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'binary'




# apps.py - Make sure to connect the signals
from django.apps import AppConfig

class YourAppConfig(AppConfig):  # Replace with your actual app name
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'your_app_name'  # Replace with your actual app name
    
    def ready(self):
        import binary.signals  # Replace with your actual app name