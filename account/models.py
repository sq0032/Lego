from django.db import models

# Create your models here.

    
class Item(models.Model):
    name    = models.CharField(max_length=100)
    type    = models.CharField(max_length=100)
    
    def __unicode__(self):
        return self.name
    

class Account(models.Model):
    name    = models.CharField(max_length=100)
    balance = models.DecimalField(max_digits=7, decimal_places=2)
    items   = models.ForeignKey(Item, blank=True, null=True)
    
    def __unicode__(self):
        return "%s: $%s"%(self.name,self.balance)




