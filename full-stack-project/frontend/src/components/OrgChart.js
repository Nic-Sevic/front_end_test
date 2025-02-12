import React, { useState, useCallback } from 'react';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const orgChartData = {
    name: 'Alice',
    title: 'CEO',
    children: [
        {
            name: 'Bob',
            title: 'CTO',
            children: [
                { name: 'David', title: 'Engineer' },
                { name: 'Eve', title: 'Engineer' },
            ],
        },
        {
            name: 'Charlie',
            title: 'CFO',
            children: [
                { name: 'Frank', title: 'Accountant' },
            ],
        },
    ],
};

const ItemType = 'NODE';

const MyNodeComponent = ({ node, moveNode }) => {
    const [, ref] = useDrag({
        type: ItemType,
        item: { node },
    });

    const [, drop] = useDrop({
        accept: ItemType,
        drop: (item) => moveNode(item.node, node),
    });

    return (
        <div ref={(node) => ref(drop(node))} className="chartNode">
            <div>
                <div className="name">{node.name}</div>
                <div className="title">{node.title}</div>
            </div>
        </div>
    );
};

const MyOrgChart = () => {
    const [data, setData] = useState(orgChartData);

    const findAndRemoveNode = (node, targetNode) => {
        if (!node.children) return false;
        const index = node.children.findIndex(child => child.name === targetNode.name);
        if (index !== -1) {
            node.children.splice(index, 1);
            return true;
        }
        return node.children.some(child => findAndRemoveNode(child, targetNode));
    };

    const moveNode = useCallback((draggedNode, targetNode) => {
        const newData = { ...data };

        // Remove draggedNode from its current position
        if (newData.name === draggedNode.name) return; // Prevent moving the root node
        findAndRemoveNode(newData, draggedNode);

        // Add draggedNode as a child of targetNode
        const addNode = (node) => {
            if (node.name === targetNode.name) {
                if (!node.children) node.children = [];
                node.children.push(draggedNode);
                return true;
            }
            return node.children && node.children.some(child => addNode(child));
        };
        addNode(newData);

        setData(newData);
    }, [data]);

    return (
        <DndProvider backend={HTML5Backend}>
            <OrgChart tree={data} NodeComponent={(props) => <MyNodeComponent {...props} moveNode={moveNode} />} />
        </DndProvider>
    );
};

export default MyOrgChart;


