package front;

public class PlayerRankedStats {
    
    private String lp;

    private int win;

    private int losses;

    public PlayerRankedStats(String lp, int win, int losses) {
        this.lp = lp;
        this.win = win;
        this.losses = losses;
    }

    public String getLp() {
        return lp+" LP";
    }

    public void setLosses(int losses) {
        this.losses = losses;
    }

    public String getRatio(){
        if(losses+win==0){
            return "??/?? : ??%";
        }
        return this.win+"/"+this.losses+" : "+Math.round((float) win/((float) losses+ (float) win)*100)+"%";
    }

}
