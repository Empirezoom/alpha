from django.db import models
import uuid
from datetime import timedelta
from django.utils import timezone

# Create your models here.


class CompanyProfile(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    address = models.CharField( max_length=50)
    logo = models.TextField()
    favicon = models.TextField()
    copyright = models.CharField(max_length=90)
    terms = models.FileField(upload_to='doc', blank=True, null=True)
    telegram = models.CharField(max_length=150, blank=True, null=True,)
    whatsapp = models.CharField(max_length=150, blank=True, null=True,)

    
     


    def __str__(self):
        return self.name
    class Meta:
        db_table = 'CompanyProfile'
        managed = True
        verbose_name = 'CompanyProfile'
        verbose_name_plural = 'CompanyProfile'



class Feature(models.Model):
    img = models.CharField(max_length=90)
    title = models.CharField(max_length=50)
    text = models.TextField()


    def __str__(self):
        return self.title
    class Meta:
        db_table = 'Featured'
        managed = True
        verbose_name = 'Featured'
        verbose_name_plural = 'Featured'


class Stat(models.Model):
    num = models.CharField(max_length=50)
    text = models.TextField()


    def __str__(self):
        return self.text
    class Meta:
        db_table = 'Stat'
        managed = True
        verbose_name = 'Stat'
        verbose_name_plural = 'Stats'



class Education(models.Model):
    img_title = models.CharField(max_length=90)
    text = models.TextField()
    title1 = models.CharField(max_length=50)
    title2 = models.CharField(max_length=50)
    title3 = models.CharField(max_length=50)
    title4 = models.CharField(max_length=50)
    title5 = models.CharField(max_length=50)
    link = models.CharField(max_length=50,blank=True,null=True)
    

    def __str__(self):
        return self.img_title
    class Meta:
        db_table = 'Education'
        managed = True
        verbose_name = 'Education'
        verbose_name_plural = 'Education'





class Brokers(models.Model):
    name = models.CharField(max_length=50)
    rank = models.CharField( max_length=50)
    # main 
    profile = models.ImageField(upload_to='BROKERS', height_field=None, width_field=None, max_length=None)
    facebook_link = models.CharField( max_length=150)
    instagram_link = models.CharField( max_length=150)
    telegram_link = models.CharField( max_length=150)
    about = models.TextField()
    availability = models.BooleanField(default=True)
    # not inclusive
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    whatsapp_link = models.CharField( max_length=150,blank=True,null=True)


    def __str__(self):
        return self.name
    class Meta:
        db_table = 'Broker'
        managed = True
        verbose_name = 'broker'
        verbose_name_plural = 'brokers'


from userprofile.models import UserRegistration

class PasswordResetToken(models.Model):
    user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=timezone.now() + timedelta(hours=1))  # Token valid for 1 hour

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Reset token for {self.user.email}"