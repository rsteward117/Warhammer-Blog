# **Warhammer Blog Website**

A full-stack blog platform themed around Warhammer 40k, allowing you to create, read, update, and delete blog posts. This repo contains both the frontend and backend code.

## **Table of Contents**

- Features
- Tech Stack
- Project Structure
- Getting Started
  - Prerequisites
  - Installation
  - Running the App Locally
- Deployment
- Contributing
- License
- Contact

## **Features**

- **User Registration & Authentication**: (If applicable) Users can sign up, log in, and manage their profile.
- **Create/Edit/Remove Blog Posts**: Publish Warhammer-related articles or hobby updates.
- **Comments or Reactions**: (If applicable) Readers can interact with posts.
- **Responsive UI**: Frontend built to work on mobile, tablet, or desktop.
- **Backend Integration**: Connects to a database for storing user accounts, blog posts, etc.

## **Tech Stack**

- **Frontend**:
  - [React](https://reactjs.org/) (created using [Vite](https://vitejs.dev/))
  - HTML/CSS, JavaScript
  - Axios for API requests
- **Backend**:
  - [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
  - [PostgreSQL](https://www.postgresql.org/)
  - Hosted on [Render](https://render.com/)
- **Version Control**:
  - [Git](https://git-scm.com/) and [GitHub](https://github.com) for repository management

## **Project Structure**

Warhammer-blog/

├── README.md

├── backend/

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── index.js

│ ├── package.json

│ └── . . .

├── frontend/

│ └── blog-frontend/

│ ├── public/

│ ├── src/

│ ├── package.json

│ └── vite.config.js

└── ...

- **backend/**: Contains the Express.js server, route handlers, controllers, and database models,
- **frontend/blog-frontend/**: Contains React components, styles, and frontend config.

## **Getting Started**

### **Prerequisites**

- **Node.js**
- **npm**
- **Git**
- **PostgreSQL** **Database**

### **Installation**

**Clone the repo**:  
bash  
git clone <https://github.com/rsteward117/Warhammer-blog.git>

1. **Navigate into the project folder**: cd Warhammer-blog
2. **Install backend dependencies**:cd backend npm install
3. **Install frontend dependencies**: cd ../frontend/blog-frontend npm install

### **Running the App Locally**

1. **Backend**: In the backend directory: npm start
    - This will start your Express server (by default it’s on <http://localhost:5000>).
2. **Frontend**: In the frontend/blog-frontend directory: npm run dev
    - This will launch the React application (by default it’s on <http://localhost:5173>).
3. **Open the application**:
    - Visit your frontend dev server address (e.g., <http://localhost:5173>) in your web browser.
    - The frontend should be configured to make requests to the backend endpoint.

## **Deployment**

- **Backend**: Deployed on [Render](https://render.com).
  - **Endpoints**:. <https://warhammer-blog-backend.onrender.com>

## **Contributing**

Contributions, bug reports, and feature requests are welcome!

1. Fork the project
2. Create a new branch (git checkout -b feature/YourFeature)
3. Commit your changes (git commit -m 'Add awesome feature')
4. Push to the branch (git push origin feature/YourFeature)
5. Open a Pull Request

## **License**

This project is open source under the MIT License. Feel free to adapt and use for your own purposes.

## **Contact**

- **Author**: [Randy Steward](https://github.com/rsteward117)
- **Project Repo**: <https://github.com/rsteward117/Warhammer-blog>

If you have questions or need any help, feel free to open an issue or reach out!
