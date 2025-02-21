const transformToHierarchy = (flatData) => {
  // First, create a map of all employees by their ID
  const employeeMap = new Map();

  // Assume each employee has an 'id' property. If not, we'll need to add it
  flatData.forEach(employee => {
    employeeMap.set(employee.id, {
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
      const employeeNode = employeeMap.get(employee.id);
      if (employee.manager_id === null) {
          // This is a root level employee
          root.children.push(employeeNode);
      } else {
          // Find the manager and add this employee as their child
          const managerNode = employeeMap.get(employee.manager_id);
          if (managerNode) {
              if (!managerNode.children) managerNode.children = [];
              managerNode.children.push(employeeNode);
          }
      }
  });
  
    return root;
};

export default transformToHierarchy;
