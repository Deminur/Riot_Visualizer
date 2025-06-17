package front;

import javafx.fxml.FXML;
import javafx.scene.chart.BarChart;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressIndicator;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TextField;

public class JFXFront {

    @FXML
    private TextField pseudoArea;
    @FXML
    private Button btnSearch;

    @FXML
    private Label labelPseudo; 
    @FXML
    private Label labelLVL;

    @FXML
    private Label labelSoloqueueRank;
    @FXML
    private Label labelSoloqueueRatio;
    @FXML
    private Label labelFlexRank;
    @FXML
    private Label labelFlexRatio;

    @FXML
    private ScrollPane scrollListGames;

    @FXML
    private ProgressIndicator progressIndicator;

    @FXML
    private BarChart<String,Integer> chartPings;
    @FXML
    private BarChart<String,Integer> chartDmg;
    @FXML
    private BarChart<String,Integer> chartVision;
    @FXML
    private BarChart<String,Integer> chartTank;
    @FXML
    private BarChart<String,Integer> chartSpells;

    private PlayerStats playerStats;

    private final int PORT = 8000;

    public void setPseudo(String pseudo){
        this.labelPseudo.setText(pseudo);
    }

    public void setLVL(String Lvl){
        this.labelLVL.setText(Lvl);
    }

    public void startProgressIndicator(){
        this.progressIndicator.setVisible(true);
    }

    public void stopProgressIndicator(){
        this.progressIndicator.setVisible(false);
    }

    public void setSoloqueueStats(String tier, String rank, Long Lp, Long win, Long loss){
        this.labelSoloqueueRank.setText(tier+" "+rank+" "+Lp+" LP");
        int ratio = Math.round((win.floatValue()/(loss.floatValue()+win.floatValue()))*100);
        this.labelSoloqueueRatio.setText(win+"/"+loss+" : "+ratio+"%");
    }

    public void setFlexStats(String tier, String rank, Long Lp, Long win, Long loss){
        this.labelFlexRank.setText(tier+" "+rank+" "+Lp+" LP");
        int ratio = Math.round((win.floatValue()/(loss.floatValue()+win.floatValue()))*100);
        this.labelFlexRatio.setText(win+"/"+loss+" : "+ratio+"%");
    }

    public void setPlayerStats(PlayerStats playerStats){
        this.playerStats = playerStats;
    }

    @FXML
    private void onClickSearch(){
        try {
            this.startProgressIndicator();
            ThreadableOnClickSearch t = new ThreadableOnClickSearch(this.pseudoArea.getText(), this, PORT);
            Thread thread = new Thread(t);
            thread.start();        
        } catch (Exception e) {
            this.setPseudo("??");
            System.err.println("error in pseudo");
        }
    }

    public void refreshIHM() {
        this.labelPseudo.setText(this.playerStats.getPseudo());
        this.labelLVL.setText(this.playerStats.getLevel());
        this.labelFlexRank.setText(this.playerStats.getFlexStats().getLp());
        this.labelFlexRatio.setText(this.playerStats.getFlexStats().getRatio());
        this.labelSoloqueueRank.setText(this.playerStats.getSoloqueueStats().getLp());
        this.labelSoloqueueRatio.setText(this.playerStats.getSoloqueueStats().getRatio());
    }
}
