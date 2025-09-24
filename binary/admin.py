from django.contrib import admin
from .models import *








# Register your models here.



class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ['id','name','email','phone','address']
    
class FeatureAdmin(admin.ModelAdmin):
    list_display = ['id','img','title','text']

class StatAdmin(admin.ModelAdmin):
    list_display = ['id','num','text']


class EducationAdmin(admin.ModelAdmin):
    list_display = ['id','img_title','text','link']























admin.site.register(CompanyProfile,CompanyProfileAdmin) 
admin.site.register(Feature,FeatureAdmin) 
admin.site.register(Stat,StatAdmin) 
admin.site.register(Education,EducationAdmin) 

