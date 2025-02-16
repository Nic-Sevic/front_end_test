import React, { useCallback, useState, useEffect } from 'react';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCompany } from '../context/context';

const ItemType = 'NODE';

const MyNodeComponent = ({ node, moveNode }) => {
    console.log('Rendering node:', node); // Log node data

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
    const { companyData } = useCompany();

    const [data, setData] = useState(() => transformToHierarchy(companyData.employeeData));

    useEffect(() => {
    }, [data]);

    const findAndRemoveNode = useCallback((node, targetNode) => {
        if (!node.children) return false;
        const index = node.children.findIndex(child => child.name === targetNode.name);
        if (index !== -1) {
            node.children.splice(index, 1);
            return true;
        }
        return node.children.some(child => findAndRemoveNode(child, targetNode));
    }, []);

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
    }, [data, findAndRemoveNode]);

    return (
        <DndProvider backend={HTML5Backend}>
            <OrgChart tree={data} NodeComponent={(props) => <MyNodeComponent {...props} moveNode={moveNode} />} />
        </DndProvider>
    );
};

const transformToHierarchy = (flatData) => {
  // First, create a map of all employees by their ID
  const employeeMap = new Map();
  
  // Assume each employee has an 'id' property. If not, we'll need to add it
  flatData.forEach(employee => {
      employeeMap.set(employee.id || employee.email, {
          ...employee,
          children: []
      });
  });
  
  // Create the tree structure
  const root = {
      children: []
  };
  
  // Connect employees based on manager_id
  flatData.forEach(employee => {
      const employeeNode = employeeMap.get(employee.id || employee.email);
      
      if (employee.manager_id === null) {
          // This is a root level employee
          root.children.push(employeeNode);
      } else {
          // Find the manager and add this employee as their child
          const managerNode = Array.from(employeeMap.values())
              .find(e => e.id === employee.manager_id);
          if (managerNode) {
              if (!managerNode.children) managerNode.children = [];
              managerNode.children.push(employeeNode);
          }
      }
  });
  
  // If there's only one root level employee, return that as the root
  return root.children.length === 1 ? root.children[0] : root;
};

export default MyOrgChart;


