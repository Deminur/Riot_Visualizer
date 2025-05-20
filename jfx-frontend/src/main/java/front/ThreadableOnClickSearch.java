package front;

import java.net.URL;
import java.util.Scanner;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import javafx.application.Platform;

public class ThreadableOnClickSearch implements Runnable {

    private String entry;
    private int PORT;
    private JFXFront parent;
    private String puuid;
    private JSONParser parser = new JSONParser();
    private String id;

    ThreadableOnClickSearch(String entry, JFXFront parent, int PORT){
        this.entry = entry;
        this.PORT = PORT;
        this.parent = parent;
    }

    @Override
    public void run() {
        try {
            //Get profile
            String[] splitted = entry.split("#");
            URL url = new URL("http://localhost:"+PORT+"/getPuuid/?pseudo="+splitted[0].replace(" ", "+")+"&tag="+splitted[1]);
            String inline = "";
            Scanner scan = new Scanner(url.openStream());
            while (scan.hasNext()) {
                inline += scan.nextLine();
            }
            scan.close();
            JSONObject data = (JSONObject) parser.parse(inline);
            this.puuid = ((String) data.get("puuid"));
            String pseudo = (String) data.get("gameName");
            if(!this.puuid.equals("??")){
                //Get ID
                url = new URL("http://localhost:"+PORT+"/getID/?puuid="+this.puuid);
                inline = "";
                scan = new Scanner(url.openStream());
                while (scan.hasNext()) {
                    inline += scan.nextLine();
                }
                scan.close();
                data = (JSONObject) parser.parse(inline);
                PlayerStats playerStats = new PlayerStats(pseudo, ((Long) data.get("summonerLevel")).toString());
                this.id = (String) data.get("id");

                //Get ranked stats
                url = new URL("http://localhost:"+PORT+"/getRankeds/?id="+this.id);
                inline = "";
                scan = new Scanner(url.openStream());
                while (scan.hasNext()) {
                    inline += scan.nextLine();
                }
                scan.close();
                data = (JSONObject) parser.parse(inline);
                //Soloqueue
                JSONObject soloqueue = (JSONObject) data.get("soloQueue");
                PlayerRankedStats soloqueueStats;
                if(soloqueue==null){
                    soloqueueStats = new PlayerRankedStats("??",0,0);
                }else{
                    soloqueueStats = new PlayerRankedStats((String) soloqueue.get("tier")+" "+ (String) soloqueue.get("rank")+" "+ (Long) soloqueue.get("leaguePoints"), ((Long) soloqueue.get("wins")).intValue(), ((Long) soloqueue.get("losses")).intValue());
                }
                  //Flex
                JSONObject flex = (JSONObject) data.get("flex");
                PlayerRankedStats flexStats;
                if(flex==null){
                    flexStats = new PlayerRankedStats("??",0,0);
                }else{
                    flexStats = new PlayerRankedStats((String) flex.get("tier")+" "+ (String) flex.get("rank")+" "+ (Long) flex.get("leaguePoints"), ((Long) flex.get("wins")).intValue(), ((Long) flex.get("losses")).intValue());
                }
                playerStats.setSoloqueueStats(soloqueueStats);
                playerStats.setFlexStats(flexStats);
                this.parent.setPlayerStats(playerStats);

            }else{//player not found
                PlayerStats playerStats = new PlayerStats("??", "??");
                PlayerRankedStats soloqueue = new PlayerRankedStats("??", 0, 0);
                playerStats.setSoloqueueStats(soloqueue);
                PlayerRankedStats flex = new PlayerRankedStats("??", 0, 0);
                playerStats.setFlexStats(flex);
                this.parent.setPlayerStats(playerStats);
            }
            //refresh the Frontend
            Platform.runLater(()->this.parent.refreshIHM());
        } catch (Exception e) {
            // TODO: handle exception
            System.out.println(e);
        }
        this.parent.stopProgressIndicator();
    }
    
}
