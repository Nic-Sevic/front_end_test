import React, { useCallback, useState, useEffect } from 'react';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCompany } from '../context/context';
import transformToHierarchy from '../utils/utils';

const ItemType = 'NODE';

const MyNodeComponent = ({ node, moveNode }) => {
  const { companyData } = useCompany();

    const [{ isDragging }, dragRef] = useDrag({
        type: ItemType,
        item: { node },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [{ isOver }, dropRef] = useDrop({
        accept: ItemType,
        drop: (item) => moveNode(item.node, node),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    // Combine the refs
    const ref = (el) => {
        dragRef(el);
        dropRef(el);
    };

    return (
        <div 
            ref={ref} 
            className={`chartNode ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div>
                <div className="name">{node.name === undefined ? companyData.company_name : node.name}</div>
                <div className="title">{node.title}</div>
            </div>
        </div>
    );
};

const MyOrgChart = () => {
    const { companyData, updateEmployee, fetchEmployees, addEmployee } = useCompany();
    const [data, setData] = useState(() => transformToHierarchy(companyData.employeeData));
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setData(transformToHierarchy(companyData.employeeData));
    }, [companyData]);

    const findAndRemoveNode = useCallback((node, targetNode) => {
        if (!node.children) return false;
        const index = node.children.findIndex(child => child.name === targetNode.name);
        if (index !== -1) {
            node.children.splice(index, 1);
            return true;
        }
        return node.children.some(child => findAndRemoveNode(child, targetNode));
    }, []);

    const moveNode = useCallback(async (draggedNode, targetNode) => {
      // Early validation to prevent self-management
      if (draggedNode.name === targetNode.name) {
          console.error('Invalid operation: Cannot make an employee their own manager');
          return;
      }
  
      try {
          const newData = { ...data };
  
          // Prevent moving the root node
          if (newData.name === draggedNode.name) {
              console.error('Invalid operation: Cannot move the root node');
              return;
          }
  
          // Remove node from old position
          findAndRemoveNode(newData, draggedNode);
  
          // Add node to new position using our modified addNode function
          const addNode = (node) => {
              if (node.name === targetNode.name) {
                  if (!node.children) node.children = [];
                  node.children.push(draggedNode);
                  return true;
              }
              return node.children && node.children.some(child => addNode(child));
          };
  
          const nodeAdded = addNode(newData);
          
          if (!nodeAdded) {
              console.error('Failed to add node to new position');
              return;
          }
  
          // Update the visual state
          setData(newData);
  
          // Update the database
          await updateEmployee(draggedNode.id, {
              name: draggedNode.name,
              title: draggedNode.title,
              email: draggedNode.email,
              manager_id: targetNode.id,
              company_id: draggedNode.company_id
          });
  
      } catch (error) {
          console.error('Failed to update employee:', error);
          // Optionally revert the visual change if the database update fails
      }
  }, [data, findAndRemoveNode, updateEmployee]);

    const handleAddEmployee = async () => {
        try {
            const newEmployee = {
                name: formData.name,
                email: formData.email,
                title: formData.title,
                manager_id: formData.manager_id,
                company_id: companyData.company_id
            };
            await addEmployee(newEmployee);
            await fetchEmployees(companyData.company_id);
            setFormData({});
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Error adding employee. Please try again and make sure employee does not already exist.');
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <OrgChart 
                tree={data} 
                NodeComponent={(props) => <MyNodeComponent {...props} moveNode={moveNode} />} 
            />
            <div>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <select
                    name="manager_id"
                    value={formData.manager_id || ''}
                    onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                >
                    <option value="">Select Manager</option>
                    {companyData.employeeData.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.id} - {emp.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddEmployee}>Add Employee</button>
            </div>
        </DndProvider>
    );
};

export default MyOrgChart;


