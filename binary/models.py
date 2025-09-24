from django.db import models

# Create your models here.


class CompanyProfile(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    address = models.CharField( max_length=50)
    logo = models.TextField()
    favicon = models.TextField()
    copyright = models.CharField(max_length=90)


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