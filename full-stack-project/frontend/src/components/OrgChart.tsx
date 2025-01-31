import React, { useEffect, useRef } from 'react';
import { select, drag, DragBehavior } from 'd3'; // Import necessary functions from D3
import { OrgChart } from 'd3-org-chart';
// import './OrgChart.css';

interface OrgChartNode {
    id: string;
    name: string;
    parentId: string | null;
}

interface OrgChartComponentProps {
    data: OrgChartNode[];
}

interface NodeData {
    name: string;
    x?: number;
    y?: number;
    // Add other properties as needed
}

const OrgChartComponent: React.FC<OrgChartComponentProps> = ({ data }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartContainerRef.current) {
            const chart = new OrgChart<NodeData>(); // Specify the type for OrgChart
            chart
                .container('#chart-container') // Pass the id as a string
                .data(data)
                .nodeWidth((d) => 160)
                .nodeHeight((d) => 100)
                .childrenMargin((d) => 20)
                .compactMarginBetween((d) => 15)
                .compactMarginPair((d) => 80)
                .nodeContent((d) => `
                    <div style="padding: 10px; border-radius: 5px; background-color: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                        <div style="font-weight: bold;">${d.data.name}</div>
                    </div>
                `)
                .render();

            // Add drag-and-drop functionality
            const dragBehavior = drag<Element, NodeData, NodeData>()
                .on('start', (event, d) => {
                    // Handle drag start
                })
                .on('drag', (event, d) => {
                    // Handle dragging
                    //const target = event.sourceEvent.target as Element;
                    // select(target)
                       // .attr('x', d.x = event.x)
                       // .attr('y', d.y = event.y);
                })
                .on('end', (event, d) => {
                    // Handle drag end
                });

            // Apply the drag behavior to the nodes
            select(chartContainerRef.current)
                .selectAll<Element, NodeData>('.node')
                .call(dragBehavior as any);
        }
    }, [data]);

    return <div id="chart-container" ref={chartContainerRef} className="centered-chart" draggable="false"></div>;
};

export default OrgChartComponent;
