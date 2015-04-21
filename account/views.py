from django.shortcuts import render
from django.http import Http404, HttpResponse, JsonResponse
from account.models import Account, Item
import json
#from django.utils import simplejson

# Create your views here.
def accounts(request):
    res = []
    
    if request.method == 'GET':
        accounts = Account.objects.all()
        accounts_arr = []
        for account in accounts:
            account_dic = {
                'id' : account.id,
                'name' : account.name,
                'balance' : account.balance
            }
            accounts_arr.append(account_dic)
        return JsonResponse( accounts_arr, safe=False)
            
    elif request.method == 'POST':
        data = json.loads(request.body)
        account = Account.objects.create(name=data['name'], balance=data['balance'])
        return JsonResponse({'message':'account has been created!'})

    return HttpResponse(json.dumps(res))

def account(request, account_id):
    if request.method == 'PUT':
        account = Account.objects.get(id=account_id)
        data = json.loads(request.body)
        account.balance = data['balance']
        account.save()
        
        return JsonResponse({'message':'new balance has been saved!'})

    return Http404


def hello(request):
    if request.method == 'POST':
        data = []
        data.append({'data':request.body})
        #print(data)
        return HttpResponse(json.dumps(data))
    else:
        data = []
        data.append({'data':'fail'})
        return HttpResponse(json.dumps(data))
    
    
    