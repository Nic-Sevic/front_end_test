Brief: Create a web application that allows companies to build and maintain their organizational structure through an interactive org chart interface, complete with employee performance metrics. This project tests full-stack development capabilities while embracing modern development practices, including the use of AI assistance tools. 
Please document time spent on different components 

## Technical Requirements Frontend (React)
1. Authentication
	- Simple login/signup flow for companies
	- Session management
	- Protected routes for authenticated users
2. Organization Chart
	- Interactive visualization of company structure
	- Support for 1-15 employees
	- Drag-and-drop functionality for restructuring
	- Responsive design that works well on different screen sizes
	- Employee cards should display:
		- Name
		- Title
		- Performance metrics
		- Reporting relationship
3. Employee Management
	- Add/edit/remove employees
	- Required employee fields:
		- Name
		- Title
		- Email
		- Direct manager
	Unset
	- Performance ratings (1-5 scale) for:
		- Technical Skills
		- Communication
		- Leadership
		- Initiative
4. User Experience
	- Intuitive interface
	- Clear feedback for user actions
	- Loading states
	- Error handling
	- Responsive design

## Technical Requirements Backend (Python)
1. Authentication API
	- User registration
	- Login/logout
	- Session management
2. Employee API
	- CRUD operations for employees
	- Bulk operations for organizational structure
	- Performance ratings management
	- Data validation
3. Organization API
	- Retrieve full org structure
	- Update reporting relationships
	- Company-specific data isolation

## Required Database Schema (minimum)
- companies
	- id
	- name
	- created_at
- users
	- id
	- company_id
	- email
	- password_hash
	- created_at
- employees
	- id
	- company_id
	- name
	- title
	- email
	- manager_id
	- created_at
	- updated_at
- performance_ratings
	- id
	- employee_id
	- category
	- rating
	- updated_at

## Technical Choices:
### Frontend
- React (required)
- Choice of:
	- Org chart library (react-org-chart, d3-org-chart, etc.)
	- UI component library
	- State management solution
	- API client
### Backend
- Python with FastAPI (required)
- Choice of:
	- Authentication library
	- Database ORM
	- API documentation tool

### Database
- Choice of:
	- SQLite (recommended for simplicity)
	- PostgreSQL
	- MySQL

## Technical Decision Guidelines
	1. Justify all technical decisions made during development
	2. Explain your project structure and architecture choices
	3. Discuss your approach to solving specific technical challenges
	4. Defend your choice of libraries and tools

## Deliverables
1. Source Code
	- [ ] Frontend repository
	- [ ] Backend repository
	- [ ] Database schema
	- [ ] Setup instructions
2. Documentation
	- [ ] README with setup instructions
	- [ ] API documentation
	- [ ] List of technical choices and rationale
	- [ ] AI usage documentation (optional)
	- [ ] Time log
3. Demo
	- [ ] Deployed version (optional)
	- [ ] Screen recording showing key features (required if not deployed)
	
## Evaluation Criteria
1. Technical Implementation
	- Code quality and organization
	- API design
	- Database design
	- Security considerations
2. Functionality
	- Feature completeness
	- Bug-free operation
	- Performance
	- Error handling
3. User Experience
	- Interface design
	- Responsiveness
	- Intuitive operation
	- Loading states and feedback
4. Documentation & Reasoning
	- Code comments
	- Setup instructions
	- API documentation
	- Technical decisions documentation

## Getting Started
	1. Create new repositories for frontend and backend
	2. Choose your technical stack within the given constraints
	3. Start with basic authentication flow
	4. Build the org chart visualization
	5. Implement employee management
	6. Add performance ratings
	7. Document as you go

## Submission
	1. Share repository links (github strongly preferred)
	2. Include all required documentation
	3. Provide any necessary credentials for testing
