import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import Gear from "./Gear";
const ENDPOINT = "ws://localhost:12345/Velocity";

interface Telemetry {
    Velocity: number
    Gear: number
    Rpm: number
}

export default function Speedometer() {
    const ref = useRef(null);
    const [telemetry, setTelemetry] = useState<Telemetry>({ Velocity: 0, Gear: 0, Rpm: 0 });
    const maxSpeed = 350;

    const width = 500,
        height = 580,
        margin = 40;

    useEffect(() => {
        const webSocket = new WebSocket(ENDPOINT);
        webSocket.onmessage = function (event) {
            setTelemetry(JSON.parse(event.data));
        }
        webSocket.onopen = function (event) {
            webSocket.send("init")
        }
    }, []);

    useEffect(() => {
        if (!telemetry) return;

        const color = ["#1C73FF", "#CED3DC"];
        const anglesRange = Math.PI / 1.7
        const data = [telemetry.Velocity, maxSpeed - telemetry.Velocity];
        const outerRadius = 210;
        const innerRadius = 180;

        d3.select(ref.current)
            .select("g")
            .attr("data-ver", "old");

        const svg = d3
            .select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .attr("data-ver", "new")
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);


        const pie = d3.pie()
            .sort(null)
            .startAngle(-1 * anglesRange)
            .endAngle(anglesRange);

        const arc = d3.arc()
            .padAngle(.02)
            .cornerRadius(4)
            .innerRadius(innerRadius)
            .outerRadius(outerRadius) as any;

        svg
            .selectAll()
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => i === 0 && parseInt(d.data as any) > 250 ? "#f80000" : color[i])
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        const arcWithoutPadAngle = arc.padAngle(0);

        svg
            .selectAll()
            .data(pie([50, 50, 50, 50, 50, 50, 50]))
            .enter()
            .append('path')
            .attr('d', arcWithoutPadAngle)
            .attr('fill', "transparent")
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        const arc3 = d3.arc()
            .innerRadius(innerRadius + 40)
            .outerRadius(outerRadius + 30) as any;


        const pie2 = d3.pie()
            .sort(null)
            .startAngle(-1 * anglesRange - 0.3)
            .endAngle(anglesRange + 0.3);

        svg
            .selectAll('mySlices')
            .data(pie2([50, 50, 50, 50, 50, 50, 50, 50]))
            .join('text')
            .text((_d, i) => (i * 50).toString())
            .attr("transform", (d) => `translate(${arc3.centroid(d)})`)
            .style("text-anchor", "middle")
            .style("font-size", height / 30)

        svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr("y", "30")
            .style("font-size", height / 20)
            .text(telemetry.Velocity + " kph");

        svg
            .append("text")
            .attr("y", "-90")
            .attr("text-anchor", "middle")
            .style("font-size", height / 20)
            .text(telemetry.Gear);

        svg
            .selectAll('circle')
            .data(new Array(10))
            .join('circle')
            .attr('cx', (d, i) => i * 25 - 115)
            .attr('cy', -60)
            .attr('r', 7)
            .style('fill', (d, i) => i < telemetry.Rpm ? (telemetry.Rpm > 7 ? "#f80000" : "#1d8a3a") : "gray");

        d3
            .select(ref.current).selectAll("g[data-ver='old']").remove();
    }, [telemetry]);

    return (
        <div>
            <svg ref={ref}>
            </svg>
        </div>
    )
}