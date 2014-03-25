from django.db import models

# Create your models here.

class Type(models.Model):
    name    = models.CharField(max_length=100)
    
    def __unicode__(self):
        return self.name
    
class Item(models.Model):
    name    = models.CharField(max_length=100)
    type    = models.ForeignKey(Type)
    price   = models.DecimalField(max_digits=7, decimal_places=2)
    attr    = models.CharField(max_length=100)
    image   = models.ImageField(upload_to='media/')
    
    def __unicode__(self):
        return self.name