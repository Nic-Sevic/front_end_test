const transformToHierarchy = (flatData) => {
  const employeeMap = new Map();
  const root = { children: [] };

  // Create a map of employees
  flatData.forEach(employee => {
    employeeMap.set(employee.id, {
        ...employee,
        children: []
    });
  });

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
