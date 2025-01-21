/* eslint-disable no-loop-func */
import * as d3 from "d3";
import { useEffect } from "react";
export default function GraphDmgDealt(props){

    const margin_bot = 20

    //Init the charts and handle the resize of the screen
    useEffect(()=>{
       initChart()
       window.addEventListener("resize", initChart, false);
    },[])

    //Redraw charts when data are changed
    useEffect(()=>{
        updateChart()
    },[props.data])

    function getMaxData(){
        var max = 1
        for(let type in props.data){
            for(let d in props.data[type]['values']){
                if(props.data[type]['values'][d]['y']>max){
                    max=props.data[type]['values'][d]['y']
                }
            }
        }
        return max
    }

    function updateChart(){
        const height = document.getElementById(props.id).getBoundingClientRect().height-margin_bot
        const width = document.getElementById(props.id).getBoundingClientRect().width
        const maxData = getMaxData()
        
        var y = d3.scaleLinear().range([height-margin_bot,0]).domain([0,maxData+(0.2*maxData)])
        var x = d3.scaleBand().range([ 0, width ]).domain(props.data[0]['values'].map(d => {return d.x}))
        d3.select("#XAxis").transition().call(d3.scaleLinear(x))
        var svg  = d3.select("#"+props.id)
        svg.select("#XAxis").remove()
        svg.append("g").attr('class',props.id).attr('id','XAxis').attr('transform',"translate(0,"+(height-margin_bot)+")").call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style('fill',(d=>{return (props.playerChamp===d)?("green"):("")}));

        for (var type in props.data){
            svg.selectAll('.curvesLines'+type).data(props.data[type]['values']).transition().duration(1000).attr('y1',d => { return y(d.y)})
            svg.selectAll('.curvesPoints'+type).data(props.data[type]['values']).transition().duration(1000).attr("cy", function(d) { return y(d.y); })
        }

    }

    function initChart(){
        d3.selectAll("."+props.id).remove()
        d3.select("#"+props.id).selectAll('line').remove()
        d3.select("#"+props.id).selectAll('circle').remove()
        d3.select("#"+props.id).selectAll('text').remove()

        const width = document.getElementById(props.id).getBoundingClientRect().width
        const height = document.getElementById(props.id).getBoundingClientRect().height-margin_bot
        var svg  = d3.select("#"+props.id).attr('width','100%').attr('height','inherit')

        var x = d3.scaleBand().range([ 0, width ]).domain(props.data[0]['values'].map(d => {return d.x}))
        svg.append("g").attr('class',props.id).attr('id','XAxis').attr('transform',"translate(0,"+(height-margin_bot)+")").call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        const maxData = getMaxData()
        var y = d3.scaleLinear().range([height-margin_bot,0]).domain([0,maxData+(0.2*maxData)])

        //For type of damage, draw a line
        for(var type in props.data){
            svg.selectAll('myline').data(props.data[type]['values']).enter().append('line')
            .attr('class','curvesLines'+type)
            .attr('x1',d => { return (x(d.x));})
            .attr('x2',d => {return (x(d.x));})
            .attr('y1',d => { return y(d.y)})
            .attr('y2',d => { return y(0)})
            .attr('stroke',props.data[type]['color'])
            .attr('transform',function (d) {return "translate("+width/20+",0)"})

        svg.selectAll("mycircle")
            .data(props.data[type]['values'])
            .enter()
            .append("circle")
                .attr('class','curvesPoints'+type)
                .attr("cx", function(d) { return (x(d.x)); })
                .attr("cy", function(d) { return y(d.y); })
                .attr("r", "4")
                .style("fill", props.data[type]['color'])
                .attr("stroke", "black")
                .attr('transform',function (d) {return "translate("+width/20+",0)"})
        }
        
        
    }

    return (
    <div style={{height:'90%'}}>
        {props.name}
        <svg id={props.id}>
        </svg>
    </div>
    )
}