import Container from 'react-bootstrap/Container';
import { Col, Row } from "react-bootstrap";

export default function Profile(props){

    return(<div style={{overflowX:'hidden', maxHeight:'500px'}}>

        <div>{props.pseudo} #{props.tag}</div>
        <div>LVL {props.level}</div>
        <Container fluid>
            <Row>
                <Col xs={6}>
                    <div><u>Soloqueue</u></div><br/>
                    {(props.soloqueueStats)?(
                        <p>
                            {props.soloqueueStats['tier']} {props.soloqueueStats['rank']} {props.soloqueueStats['leaguePoints']}LP<br/>
                            {props.soloqueueStats['wins']}/{props.soloqueueStats['losses']+props.soloqueueStats['wins']} : {Math.round((props.soloqueueStats['wins']/(props.soloqueueStats['losses']+props.soloqueueStats['wins']).toFixed(2)) * 100)}%<br/>
                        </p>
                    ):(
                        <p>no data available</p>
                    )}
                    
                </Col>
                <Col xs={6}>
                <div><u>Flex 5v5</u></div><br/>
                    {(props.flexStats)?(
                        <p>
                            {props.flexStats['tier']} {props.flexStats['rank']} {props.flexStats['leaguePoints']}LP<br/>
                            {props.flexStats['wins']}/{props.flexStats['losses']+props.flexStats['wins']} : {Math.round((props.flexStats['wins']/(props.flexStats['losses']+props.flexStats['wins']).toFixed(2)) * 100)}%<br/>
                        </p>
                    ):(
                        <p>no data available</p>
                    )}
                </Col>
            </Row>
        </Container>

    </div>)
}