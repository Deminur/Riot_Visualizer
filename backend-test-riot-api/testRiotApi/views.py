import requests
import os
from django.http import JsonResponse

module_dir = os.path.dirname(__file__)  
file_path = os.path.join(module_dir, 'key.txt')   #full path to text.
data_file = open(file_path , 'r')  
API_KEY = data_file.read()

def getDemiDecimus(request):
    url = 'https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/ZZ%20Demi%20Decimus/EUW?api_key='+API_KEY
    response = requests.get(url)
    data = response.json()
    return JsonResponse(data)

def getPuuid(request):
    pseudo = request.GET.get("pseudo")
    tag= request.GET["tag"]
    url = 'https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/'+pseudo+'/'+tag+'?api_key='+API_KEY
    response = requests.get(url)
    data = response.json()
    if response.status_code !=200:
        return JsonResponse({'puuid': '??', 'gameName': '??', 'tagLine': '??'})
    else:
        return JsonResponse(data)

def getID(request):
    puuid = request.GET.get("puuid")
    url = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/'+puuid+'?api_key='+API_KEY
    response = requests.get(url)
    data = response.json()
    return JsonResponse(data)

def getRankeds(request):
    profileID = request.GET.get("id")
    url = 'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+profileID+'?api_key='+API_KEY
    response = requests.get(url)
    data = response.json()
    soloQueue = None
    flex = None
    if data:
        for d in range(len(data)):
            if("FLEX" in data[d]['queueType']):
                flex = data[d]
            else:
                soloQueue=data[d]
    return JsonResponse({'soloQueue':soloQueue,'flex':flex})

def getGamesList(request):
    puuid = request.GET.get("puuid")
    count = request.GET.get("count")
    url = 'https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/'+puuid+'/ids?start=0&count='+count+'&api_key='+API_KEY
    response = requests.get(url)
    data = response.json()
    return JsonResponse(data, safe=False)

def getGames(request):
    gameList = request.GET.get("gameList")
    gameList = gameList.split(",")
    result = []
    for i in range(len(gameList)):
        url = 'https://europe.api.riotgames.com/lol/match/v5/matches/'+gameList[i]+'?api_key='+API_KEY
        response = requests.get(url)
        data = response.json()
        result.append(data)
    return JsonResponse(result,safe=False)
