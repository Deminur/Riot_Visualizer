package com.example;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
class Controller {

    String API_KEY="";

    public Controller(){
        File myObj = new File("backendJava/src/main/resources/key.txt");
        Scanner myReader;
        try {
            myReader = new Scanner(myObj);
            API_KEY = myReader.nextLine();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        System.out.println(API_KEY);
    }

    RestTemplate restTemplate = new RestTemplate();

    @CrossOrigin
    @GetMapping("getPuuid/")
    public String getPuuid(@RequestParam String pseudo, @RequestParam String tag){
        String url = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/"+pseudo+"/"+tag+"?api_key="+API_KEY;
        ResponseEntity<String> response = restTemplate.getForEntity(url,String.class); 
        return response.getBody();
    }

    @CrossOrigin
    @GetMapping("getID/")
    public String getID(@RequestParam String puuid){
        String url = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/"+puuid+"?api_key="+API_KEY;
        ResponseEntity<String> response = restTemplate.getForEntity(url,String.class); 
        return response.getBody();
    }

    @CrossOrigin
    @GetMapping(value="getRankeds/")
    public ResponseEntity getRankeds(@RequestParam String id){
        String url = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/"+id+"?api_key="+API_KEY;
        ResponseEntity<String> response = restTemplate.getForEntity(url,String.class); 
        String responseSTR = response.getBody().replace("},{", "}/{");
        responseSTR = responseSTR.replace("[", "");
        responseSTR = responseSTR.replace("]", "");
        String[] responseList = responseSTR.split("/");
        JSONObject soloQueue = null;
        JSONObject flex = null;
        if(responseList.length>1){
            if(responseList[0].contains("FLEX")){
                flex = new JSONObject(responseList[0]);
                soloQueue = new JSONObject( responseList[1]);
            }else{
                flex = new JSONObject( responseList[1]);
                soloQueue =new JSONObject( responseList[0]);
            }
        }
        String result = "{\"soloQueue\":"+soloQueue+",\"flex\":"+flex+"}";
        return new ResponseEntity<>(result,HttpStatus.OK);

    }

    @CrossOrigin
    @GetMapping("getGamesList/")
    public String getGamesList(@RequestParam String puuid, @RequestParam String count){
        String url = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/"+puuid+"/ids?start=0&count="+count+"&api_key="+API_KEY;
        ResponseEntity<String> response = restTemplate.getForEntity(url,String.class); 
        return response.getBody();
    }

    @CrossOrigin
    @GetMapping("getGames/")
    public ResponseEntity getGames(@RequestParam String gameList){
        String[] list = gameList.split(",");
        String result="[";
        for (int i = 0; i < list.length; i++) {
            if(i!=0){
                result+=",";
            }
            String url = "https://europe.api.riotgames.com/lol/match/v5/matches/"+list[i]+"?api_key="+API_KEY;
            ResponseEntity<String> response = restTemplate.getForEntity(url,String.class); 
            result+=response.getBody();
        }
        result+="]";
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

}
