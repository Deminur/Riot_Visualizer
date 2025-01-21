import Container from 'react-bootstrap/Container';
import { Col, Row } from "react-bootstrap";
import GraphPings from './GraphPings';
import GraphSpells from './GraphSpells';
import Graph from './Graph';

export default function GraphZone(props){
    return (
        <Container fluid style={{height:'inherit'}}>
            <Row style={{height:'inherit'}}>
                <Col xs={2} style={{height:'inherit'}}> <GraphPings name={"Pings"} id={"pingsGraph"} data={props.data['pings']}/> </Col>
                <Col xs={3} style={{height:'inherit'}}> <Graph playerChamp={props.data['playerChamp']} name={"Dmg Dealt"} id={"dmgDealtGraph"} data={props.data['dmg']}/> </Col>
                <Col xs={2} style={{height:'inherit'}}> <Graph playerChamp={props.data['playerChamp']} name={"Vision"} id={"visionGraph"} data={props.data['vision']}/> </Col>
                <Col xs={3} style={{height:'inherit'}}> <Graph playerChamp={props.data['playerChamp']} name={"Tank Stats"} id={"tankGraph"} data={props.data['tanked']}/> </Col>
                <Col xs={2} style={{height:'inherit'}}> <GraphSpells name={'Spells'} id={"spellsGraph"} data={props.data['spells']}/> </Col>
            </Row>
        </Container>
    )
}