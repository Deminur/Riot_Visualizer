import * as d3 from "d3";
import { useEffect } from "react";
export default function GraphPings(props){

    const margin_bot = 20
    useEffect(()=>{
       initChart()
       window.addEventListener("resize", initChart, false);
    },[])

    useEffect(()=>{
        updateChart()
    },[props.data])

    function getMaxData(){
        var max = 1
        for(let d in props.data){
            if(props.data[d]['y']>max){
                max=props.data[d]['y']
            }
        }
        return max
    }

    function updateChart(){
        const height = document.getElementById(props.id).getBoundingClientRect().height-margin_bot
        const maxData = getMaxData()
        var svg  = d3.select("#"+props.id)
        var y = d3.scaleLinear().range([height-margin_bot,0]).domain([0,maxData+(0.2*maxData)])
        svg.selectAll('.curvesLines').data(props.data).transition().duration(1000).attr('y1',d => { return y(d.y)})
        svg.selectAll('.curvesPoints').data(props.data).transition().duration(1000).attr("cy", function(d) { return y(d.y); })
        svg.selectAll('.curveLabels').data(props.data).transition().duration(1000).text(function(d) { return d.y; }).attr("y", function(d) { return y(d.y); })
    }

    function initChart(){
        d3.selectAll("."+props.id).remove()
        d3.select("#"+props.id).selectAll('line').remove()
        d3.select("#"+props.id).selectAll('circle').remove()
        d3.select("#"+props.id).selectAll('text').remove()

        const width = document.getElementById(props.id).getBoundingClientRect().width
        const height = document.getElementById(props.id).getBoundingClientRect().height-margin_bot
        var svg  = d3.select("#"+props.id).attr('width','100%').attr('height','inherit')

        var x = d3.scaleBand().range([ 0, width ]).domain(props.data.map(d => {return d.x}))
        svg.append("g").attr('class',props.id).attr('transform',"translate(0,"+(height-margin_bot)+")").call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")

        const maxData = getMaxData()
        var y = d3.scaleLinear().range([height-margin_bot,0]).domain([0,maxData+(0.2*maxData)])
        // svg.append("g").attr('class',props.id).call(d3.axisLeft(y))

        //lines
        svg.selectAll('myline').data(props.data).enter().append('line')
            .attr('class','curvesLines')
            .attr('x1',d => { return x(d.x)})
            .attr('x2',d => { return x(d.x)})
            .attr('y1',d => { return y(d.y)})
            .attr('y2',d => { return y(0)})
            .attr('stroke','white')
            .attr('transform',function (d) {return "translate("+width/12+",0)"})

        //circles
        svg.selectAll("mycircle")
            .data(props.data)
            .enter()
            .append("circle")
                .attr('class','curvesPoints')
                .attr("cx", function(d) { return x(d.x); })
                .attr("cy", function(d) { return y(d.y); })
                .attr("r", "4")
                .style("fill", "#69b3a2")
                .attr("stroke", "black")
                .attr('transform',function (d) {return "translate("+width/12+",0)"})

        svg.selectAll("mycircle")
            .data(props.data)
            .enter()
            .append('text')
                .attr('class','curveLabels')
                .attr("x", function(d) { return x(d.x); })
                .attr("y", function(d) { return y(d.y); })
                .style("font", "15px sans-serif")
                .style('fill','white')
                .text(function(d) { return d.y; })
                .attr('transform',function (d) {return "translate("+((width/12)-5)+",-10)"})
            
        
        svg.selectAll(".tick").selectAll("text").remove();
        svg.selectAll(".tick")
                .data(props.data)
                .append("svg:image")
                .attr("xlink:href", function (d) { 
                    return "images/"+d.x+".png"
                 })
                .attr("width", 30)
                .attr("height", 30)
                .attr('transform',"translate(-15,0)");

        
        
    }

    

    

    return (
    <div style={{height:'90%'}}>
        {props.name}
        <svg id={props.id}>
        </svg>
    </div>
    )
}