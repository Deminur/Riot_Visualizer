import axios from "axios"
import React, {useState} from 'react'
import Container from 'react-bootstrap/Container';
import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from "./PlayerSection/Profile"
import Games from "./PlayerSection/Games";
import GraphZone from "./Graphs/GraphZone";

export default function MainPage(props){

    const nbGamesPrinted = 20
    const port = 8000
    
    var [puuid,setPuuid] = useState("??")
    var [pseudo,setPseudo] = useState("??")
    var [tag,setTag] = useState("??")
    var [level,setLevel] = useState("0")
    var [soloqueueStats,setSoloqueueStats] = useState({})
    var [flexStats,setFlexStats] = useState({})
    var [games, setGames] = useState([])
    var [reset, setReset] = useState(0)
    var [graphData, setGraphData] = useState(createGraphData())
    var [nbWin, setNbWin] = useState(0)

    function createGraphData(){
        let playerChamp =""
        let pingData=[
            {x:'Command',y:0},
            {x:'Missing', y:0},
            {x:'Retreat',y:0},
            {x:'Back',y:0},
            {x:'Vision',y:0},
            {x:'Help',y:0},
            {x:'OMW',y:0},
        ]
        
        var spells = [
            {x:'A',y:0},
            {x:'Z',y:0},
            {x:'E',y:0},
            {x:'R',y:0},
            {x:'D', y:0},
            {x:'F', y:0}
        ]

        var dmg = [
            {'values':[
                {x:'1',y:0},
                {x:'2',y:0},
                {x:'3',y:0},
                {x:'4',y:0},
                {x:'5',y:0},
                {x:'6',y:0},
                {x:'7',y:0},
                {x:'8',y:0},
                {x:'9',y:0},
                {x:'10',y:0},
            ], 'color':'#DC7800'},//AD
            {'values':[
                {x:'1',y:0},
                {x:'2',y:0},
                {x:'3',y:0},
                {x:'4',y:0},
                {x:'5',y:0},
                {x:'6',y:0},
                {x:'7',y:0},
                {x:'8',y:0},
                {x:'9',y:0},
                {x:'10',y:0},
            ], 'color':'#320078'},//AP
        ]

        var vision = [
           {'values':
                [{x:'1',y:0},
                {x:'2',y:0},
                {x:'3',y:0},
                {x:'4',y:0},
                {x:'5',y:0},
                {x:'6',y:0},
                {x:'7',y:0},
                {x:'8',y:0},
                {x:'9',y:0},
                {x:'10',y:0},
            ], 'color':'#FFFFFF'},
           
        ]

        var tanked = [
            {'values':[
                {x:'1',y:0},
                {x:'2',y:0},
                {x:'3',y:0},
                {x:'4',y:0},
                {x:'5',y:0},
                {x:'6',y:0},
                {x:'7',y:0},
                {x:'8',y:0},
                {x:'9',y:0},
                {x:'10',y:0},
            ], 'color':'#DC7800'},//AD
            {'values':[
                {x:'1',y:0},
                {x:'2',y:0},
                {x:'3',y:0},
                {x:'4',y:0},
                {x:'5',y:0},
                {x:'6',y:0},
                {x:'7',y:0},
                {x:'8',y:0},
                {x:'9',y:0},
                {x:'10',y:0},
            ], 'color':'#320078'},//AP
            {'values':[
                {x:'1',y:0},
                {x:'2',y:0},
                {x:'3',y:0},
                {x:'4',y:0},
                {x:'5',y:0},
                {x:'6',y:0},
                {x:'7',y:0},
                {x:'8',y:0},
                {x:'9',y:0},
                {x:'10',y:0},
            ], 'color':'#FFFFFF'},//Reduced
        ]
        return {'playerChamp':playerChamp, 'pings':pingData, 'vision':vision, 'spells':spells, 'dmg':dmg, 'tanked':tanked}
    }

    function search(){
        resetState()
        var input = document.getElementById("inputPseudo").value
        var pseudo = input.split("#")
        var uuid = getPuuid(pseudo[0],pseudo[1])
        uuid.then((res) => {
            console.log(res.data)
            setPuuid(res.data['puuid'])
            setPseudo(res.data['gameName'])
            setTag(res.data['tagLine'])
            //If puuid exists we get the user profile
            if(res.data['puuid']!=="??"){
                getUserProfile(res.data['puuid'])
            }
        }).catch((err) => {
            console.log("unknown")
        });
        
    }

    async function getPuuid(pseudo,tag){
        return axios.get("http://localhost:"+port+"/getPuuid/",{params:{pseudo:pseudo, tag:tag}})        
    }

    function getUserProfile(puuid){
        axios.get("http://localhost:"+port+"/getID/",{params:{puuid:puuid}}).then(res=>{
            setLevel(res.data['summonerLevel'])
            //get the ranked stats
            axios.get("http://localhost:"+port+"/getRankeds/",{params:{id:res.data['id']}}).then(res=>{
                console.log(typeof res.data,"=>",res.data)
                setSoloqueueStats(res.data['soloQueue'])
                setFlexStats(res.data['flex'])
            })
            //get the games stats
            axios.get("http://localhost:"+port+"/getGamesList/",{params:{puuid:puuid, count:nbGamesPrinted}}).then(res=>{
                console.log(res.data['listOfGames'].toString())
                axios.get("http://localhost:"+port+"/getGames/",{params:{gameList:res.data['listOfGames'].toString()}}).then(res=>{
                    setGames(res.data['listOfGames'])
                })
                
            })
        }).catch((err)=>{
            console.log("unknown")
        })     
    }

    function resetState(){
        setPuuid("??")
        setPseudo("??")
        setTag("??")
        setLevel("??")
        setGames([])
        setFlexStats([])
        setSoloqueueStats([])
        setReset(reset+1)
        setGraphData(createGraphData())
        setNbWin(0)
    }

    return(<>
        <div  style={{height:'7vh'}}>
            <p>
                <label>
                    Pseudo :<input id="inputPseudo" type="text" name="name" />
                </label>
                <button onClick={search}>Recherche</button>
            </p> 
        </div>
        <Container fluid style={{height:'43vh'}}>
            <Row style={{height:'inherit'}}>
                <Col xs={4} style={{height:'inherit'}} >
                    <Profile pseudo={pseudo} tag={tag} level={level} soloqueueStats={soloqueueStats} flexStats={flexStats}/>
                </Col>
                <Col xs={8} style={{height:'inherit'}}>
                    <Games setNbWin={setNbWin} setGraphData={setGraphData} games={games} puuid={puuid}/>
                </Col>
            </Row>
        </Container>
        <div style={{height:'45vh', width:'100%'}}>
            <GraphZone data={graphData}/>
        </div>
        <div style={{height:'5vh', width:'100%'}}>
            {Math.round((nbWin/nbGamesPrinted)*100)}%
        </div>
        </>)
}