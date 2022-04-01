import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
const ENDPOINT = "ws://localhost:12345/Velocity";

export default function Speedometer() {
    const ref = useRef(null);
    const [velocity, setVelocity] = useState(0);
    let total = 400;

    const width = 500,
        height = 580,
        margin = 40;

    useEffect(() => {
        const webSocket = new WebSocket(ENDPOINT);
        webSocket.onmessage = function (event) {
            setVelocity(event.data);
        }
        webSocket.onopen = function (event) {
            webSocket.send("init")
        }
    }, []);

    useEffect(() => {
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

        var radius = Math.min(width, height) / 2 - margin

        // Create dummy data
        const data = { a: velocity, b: total - velocity }

        // set the color scale
        const color = ["red", "#8a89a6"];
        var anglesRange = Math.PI / 1.7

        const pie = d3.pie()
            .value(d => (d as any)[1])
            .sort(null)
            .startAngle(-1 * anglesRange)
            .endAngle(anglesRange);

        const data_ready = pie(Object.entries(data) as any)

        svg
            .selectAll('whatever')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(180)         // This is the size of the donut hole
                .outerRadius(radius) as any
            )
            .attr('fill', (d, i) => color[i])
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        svg
            .append("text")
            .attr("text-anchor", "middle")
            .style("font-size", height / 20)
            .text(velocity + " kph");

        d3
            .select(ref.current).selectAll("g[data-ver='old']").remove();
    }, [velocity]);


    // useEffect(() => {
    //     const id = setInterval(() => {
    //         setVelocity((prev) => {

    //             let accelerate = Math.random() < 0.5;

    //             if ((accelerate && prev + 2 <= total) || prev - 10 < 0) return prev + 2;

    //             return prev - 2;
    //         })
    //     }, 10)
    //     return () => {
    //         clearInterval(id)
    //     }
    // }, [total])

    return (
        <>
            <svg ref={ref}></svg>
        </>
    )
}