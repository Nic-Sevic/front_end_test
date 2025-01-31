import React, { useEffect, useRef } from 'react';
import { select, drag } from 'd3';

const OrgChart = ({ data }) => {
    const chartContainerRef = useRef(null);

    useEffect(() => {
        if (data) {
            const chartContainer = chartContainerRef.current;

            // Render the chart
            select(chartContainer)
                .selectAll('.node')
                .data(data)
                .enter()
                .append('div')
                .attr('class', 'node')
                .html(d => `
                    <div style="background-color: rgba(255, 255, 255, 0.8); border: 1px solid rgba(0, 0, 0, 0.1);">
                        <div style="font-weight: bold;">${d.data.name}</div>
                    </div>
                `);

            // Add drag-and-drop functionality
            const dragBehavior = drag()
                .on('start', (event, d) => {
                    // Handle drag start
                })
                .on('drag', (event, d) => {
                    // Handle dragging
                    // const target = event.sourceEvent.target;
                    // select(target)
                    //     .attr('x', d.x = event.x)
                    //     .attr('y', d.y = event.y);
                })
                .on('end', (event, d) => {
                    // Handle drag end
                });

            // Apply the drag behavior to the nodes
            select(chartContainer)
                .selectAll('.node')
                .call(dragBehavior);
        }
    }, [data]);

    return <div id="chart-container" ref={chartContainerRef} className="centered-chart" draggable="false"></div>;
};

export default OrgChart;
