package front;

public class PlayerStats {
    
    private String pseudo;

    private String level;

    private PlayerRankedStats soloqueueStats = new PlayerRankedStats("??", 0, 0);

    private PlayerRankedStats flexStats = new PlayerRankedStats("??", 0, 0);

    public PlayerStats(String pseudo, String level) {
        this.pseudo = pseudo;
        this.level = level;
    }

    public String getPseudo() {
        return pseudo;
    }

    public String getLevel() {
        return "LVL "+ level;
    }

    public PlayerRankedStats getSoloqueueStats() {
        return soloqueueStats;
    }

    public void setSoloqueueStats(PlayerRankedStats soloqueueStats) {
        this.soloqueueStats = soloqueueStats;
    }

    public PlayerRankedStats getFlexStats() {
        return flexStats;
    }

    public void setFlexStats(PlayerRankedStats flexStats) {
        this.flexStats = flexStats;
    }

}
