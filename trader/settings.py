# Email configuration for password reset
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.mail.yahoo.com'  # Replace with your provider (e.g., 'smtp.outlook.com' for Outlook)
EMAIL_PORT = 587 or 465 # Use 465 for SSL if needed
EMAIL_USE_TLS = True  # 
EMAIL_USE_SSL = True 
EMAIL_HOST_USER = 'blue.stick@yahoo.com'  # Your email address
EMAIL_HOST_PASSWORD = 'matthew123224'  # Your email password or app-specific password
DEFAULT_FROM_EMAIL = 'blue.stick@yahoo.com'  # Sender email





