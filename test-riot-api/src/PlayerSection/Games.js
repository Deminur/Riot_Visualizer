/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import SingleGame from "./SingleGame"
import './Games.css';


export default function Games(props){

    const [listOfGames,setListOfGames] = useState([])
    const [selected, setSelected] = useState("")

    useEffect(()=>{
        setListOfGames([])
    },[props.puuid])

    useEffect(()=>{
        let list = []
        let nbWin = 0
        for (let i = 0; i < props.games.length; i++) {
            let duration = props.games[i]['info']['gameDuration']
            let participants = props.games[i]['info']['participants']
            let userStats = {}
            for (let index = 0; index < participants.length; index++) {
                if(participants[index]['puuid']===props.puuid){
                    userStats=participants[index]
                    if(participants[index]['win']){
                        nbWin=nbWin + 1
                    }
                }
            }
            list.push({'duration':duration,'type':props.games[i]['info']['gameMode'] , 'stats':userStats, 'participantsStats':participants, date:new Date(props.games[i]['info']['gameEndTimestamp'])})
            setListOfGames(list)
        }
        props.setNbWin(nbWin)
    },[props.games])

    return(<div className="wrapper">
        {listOfGames.map(i =><SingleGame selected={selected} setSelected={setSelected} setGraphData={props.setGraphData} type={i['type']} date={i['date']} gameStats={i['participantsStats']} duration={i['duration']} stats={i['stats']}/>)}
    </div >)
}