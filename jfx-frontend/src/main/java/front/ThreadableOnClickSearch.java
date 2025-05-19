package front;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

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
            this.parent.setPseudo((String) data.get("gameName"));
            if(this.puuid!="??"){
                //Get ID
                url = new URL("http://localhost:"+PORT+"/getID/?puuid="+this.puuid);
                inline = "";
                scan = new Scanner(url.openStream());
                while (scan.hasNext()) {
                    inline += scan.nextLine();
                }
                scan.close();
                data = (JSONObject) parser.parse(inline);
                this.parent.setLVL("LVL "+(Long) data.get("summonerLevel"));
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
                this.parent.setSoloqueueStats((String) soloqueue.get("tier"), (String) soloqueue.get("rank"), (Long) soloqueue.get("leaguePoints"), (Long) soloqueue.get("wins"), (Long) soloqueue.get("losses"));;
                //Flex
                JSONObject flex = (JSONObject) data.get("flex");
                this.parent.setFlexStats((String) flex.get("tier"), (String) flex.get("rank"), (Long) flex.get("leaguePoints"), (Long) flex.get("wins"), (Long) flex.get("losses"));
            }
        } catch (Exception e) {
            // TODO: handle exception
            System.out.println(e);
        }
    }
    
}
