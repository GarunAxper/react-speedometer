import * as d3 from "d3";
import { MutableRefObject, useEffect, useRef } from "react";

interface GearProps {
    Gear: number,
    Rpm: number
}

export default function Gear(props: GearProps) {
    const ref = useRef(null);

    useEffect(() => {
        d3.select(ref.current)
            .select("g")
            .attr("data-ver", "old");

        const svg = d3
            .select(ref.current)
            .attr("width", 500)
            .attr("height", 500)
            .attr("data-ver", "new")
            .append("g")
            .attr("transform", `translate(250, 250)`);

        svg
            .append("text")
            .attr("y", "-80")
            .attr("text-anchor", "middle")
            .style("font-size", "15rem")
            .text(props.Gear);

        svg
            .selectAll('circle')
            .data(new Array(10))
            .join('circle')
            .attr('cx', (d, i) => i * 25 - 115)
            .attr('cy', -50)
            .attr('r', 7)
            .style('fill', (d, i) => i < props.Rpm ? (props.Rpm > 7 ? "#f80000" : "#1d8a3a") : "gray");

        d3
            .select(ref.current).selectAll("g[data-ver='old']").remove();

    }, [props])

    return (
        <svg ref={ref}></svg>
    );
}