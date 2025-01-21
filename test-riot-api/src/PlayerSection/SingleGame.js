import { useEffect } from "react"
import './Games.css';

export default function SingleGame(props){

    const summonerSpells = {21:'Ba',1:'Clen',14:'Ig', 3:'Ex', 4:'Fl',6:'G',7:'H', 13:'Clar',11:'Sm',32:"Sb",12:'TP'}
    
    let color = (props.stats['win'])?('green'):('red')
    let hoveredColor = (props.stats['win'])?('#006400'):('#8B0000')
    let selectedColor = (props.stats['win'])?('#55ff55'):('#ff5555')

    function transformDate(date){
        var dateDecompose = date.toUTCString().split(" ")
        var heureDecompose = dateDecompose[4].split(":")
        return dateDecompose[1]+" "+dateDecompose[2]+" "+dateDecompose[3]+" "+heureDecompose[0]+":"+heureDecompose[1]
    }

    useEffect(()=>{
        onLeave()
    },[props.selected])

    function onClick(){
        let playerChamp = props.stats['championName']
        let newGraphData=[
            {x:'Command',y:props.stats['commandPings']},
            {x:'Missing', y:props.stats['enemyMissingPings']},
            {x:'Retreat',y:props.stats['retreatPings']},
            {x:'Back',y:props.stats['getBackPings']},
            {x:'Vision',y:props.stats['enemyVisionPings']},
            {x:'Help',y:props.stats['assistMePings']},
            {x:'OMW',y:props.stats['onMyWayPings']},
        ]

        var spells = [
                {x:'A',y:props.stats['spell1Casts']},
                {x:'Z',y:props.stats['spell2Casts']},
                {x:'E',y:props.stats['spell3Casts']},
                {x:'R',y:props.stats['spell4Casts']},
                {x:summonerSpells[props.stats['summoner1Id']], y:props.stats['summoner1Casts']},
                {x:summonerSpells[props.stats['summoner2Id']], y:props.stats['summoner2Casts']}
            ]
        
        var adValues = []
        var apValues = []
        for (let i in props.gameStats){
            adValues.push({x:props.gameStats[i]['championName'], y:props.gameStats[i]['physicalDamageDealtToChampions']})
            apValues.push({x:props.gameStats[i]['championName'], y:props.gameStats[i]['magicDamageDealtToChampions']})
        }
        var dmg = [{'values':adValues,'color':'#DC7800'},{'values':apValues,'color':'#320078'}]

        var visionValues = []
        for (let i in props.gameStats){
            visionValues.push({x:props.gameStats[i]['championName'], y:props.gameStats[i]['visionScore']})
        }
        var vision = [{'values':visionValues, 'color':'FFFFFF'}]

        var adTankedValues = []
        var apTankedValues = []
        var reducedValues = []
        for (let i in props.gameStats){
            adTankedValues.push({x:props.gameStats[i]['championName'], y:props.gameStats[i]['physicalDamageTaken']})
            apTankedValues.push({x:props.gameStats[i]['championName'], y:props.gameStats[i]['magicDamageTaken']})
            reducedValues.push({x:props.gameStats[i]['championName'], y:props.gameStats[i]['damageSelfMitigated']})
        }
        var tanked = [{'values':reducedValues,'color':'FFFFFF'},{'values':adTankedValues,'color':'#DC7800'},{'values':apTankedValues,'color':'#320078'}]

        props.setGraphData({'vision':vision, 'playerChamp':playerChamp,'pings':newGraphData, 'spells':spells, 'dmg':dmg, 'tanked':tanked})
        props.setSelected(props.date)
        var self = document.getElementById(props.date)
        self.style.backgroundColor = selectedColor
    }

    function onEnter(){
        if(props.selected!==props.date){
            var self = document.getElementById(props.date)
            self.style.backgroundColor = hoveredColor
        }
    }

    function onLeave(){
        if(props.selected!==props.date){
            var self = document.getElementById(props.date)
            self.style.backgroundColor = color  
        }
    }

    return(
    <div className="game" id={props.date} style={{backgroundColor:color}} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        ({props.type}) - {transformDate(props.date)} - {props.stats['championName']} {props.stats['kills']}/{props.stats['deaths']}/{props.stats['assists']} - {Math.floor(props.duration/60)}min {props.duration%60}
    </div>

    )
    
}