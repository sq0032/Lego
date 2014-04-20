from django.shortcuts import render
from django.http import Http404, HttpResponse
from account.models import Account, Item
import json
#from django.utils import simplejson

# Create your views here.
def account(request):
    res = []
    
    if request.method == 'GET':
        accounts = Account.objects.all()
        for account in accounts:
            id = account.id
            print id
            name = str(account.name)
            balance = str(account.balance)
            print balance
            res.append({'id':id,'name':name,'balance':balance})
            print res
    elif request.method == 'POST':
        data = json.loads(request.body)
        account = Account(name=data['name'],balance=data['balance'])
        account.save()
#        print data['name']
#    elif request.method == 'UPDATA':
#        #do nothing
#    elif request.method == 'DELETE':
#        #do nothing
#        a = 0

    return HttpResponse(json.dumps(res))


def hello(request):
        
    
    return HttpResponse('Hello World')