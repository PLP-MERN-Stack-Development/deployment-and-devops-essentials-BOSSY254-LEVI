# 🚀 AI-Powered Personal Finance Tracker

A comprehensive MERN stack application for tracking personal finances with AI-powered insights, budgeting, and expense management. This project demonstrates full-stack development, deployment, CI/CD, and monitoring best practices.

## 🌟 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication
- **Transaction Management**: Add, view, filter, and categorize transactions
- **Budget Tracking**: Create and monitor budgets with alerts
- **Dashboard Analytics**: Visual charts and financial summaries
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Mobile-friendly interface

### Advanced Features
- **AI-Powered Insights**: Smart categorization and spending predictions
- **Multi-currency Support**: Handle different currencies
- **Recurring Transactions**: Automated recurring expense tracking
- **Budget Alerts**: Notifications when approaching budget limits
- **Data Export**: Export financial data in various formats
- **Dark Mode**: Toggle between light and dark themes

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, React Router, Chart.js, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB Atlas
- **Deployment**: Render (Backend), Vercel/Netlify (Frontend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Health checks, error tracking

### Project Structure
```
ai-finance-tracker/
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   └── App.js          # Main app component
│   └── package.json
├── .github/workflows/      # CI/CD pipelines
├── docs/                   # Documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- GitHub account
- Render/Vercel/Netlify account

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-finance-tracker.git
   cd ai-finance-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env with your API URL
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📋 Tasks Completed (Week 7 Assignment)

### Task 1: Preparing the Application for Deployment ✅

#### Optimize React Application for Production
- ✅ Run build process to generate static assets
- ✅ Implement code splitting for better performance
- ✅ Configure environment variables for different environments

#### Prepare Express.js Backend for Production
- ✅ Implement proper error handling with try-catch blocks
- ✅ Set up secure HTTP headers using Helmet
- ✅ Configure environment variables with dotenv
- ✅ Implement logging for production using Morgan

#### Create Production-Ready MongoDB Setup
- ✅ Set up MongoDB Atlas cluster configuration
- ✅ Configure proper database user permissions
- ✅ Implement database connection pooling with maxPoolSize

### Task 2: Deploying the Backend ✅

#### Deploy Express.js Backend to Cloud Platform
- ✅ Set up Render application configuration
- ✅ Configure environment variables in Render dashboard
- ✅ Set up continuous deployment from GitHub
- ✅ Configure custom domain (optional)
- ✅ Implement HTTPS with SSL/TLS certificate (automatic on Render)
- ✅ Set up server monitoring and logging via Render dashboard

### Task 3: Deploying the Frontend ✅

#### Deploy React Frontend to Static Hosting Service
- ✅ Configure build settings in Vercel/Netlify
- ✅ Set up environment variables in hosting platform
- ✅ Configure continuous deployment from GitHub
- ✅ Set up custom domain (optional)
- ✅ Configure HTTPS (automatic on Vercel/Netlify)
- ✅ Implement caching strategies for static assets

### Task 4: CI/CD Pipeline Setup ✅

#### Set up GitHub Actions for Continuous Integration
- ✅ Create workflows for running tests
- ✅ Configure linting and code quality checks
- ✅ Implement automated building of the application

#### Implement Continuous Deployment
- ✅ Configure automatic deployment on successful builds
- ✅ Set up staging and production environments
- ✅ Implement rollback strategies via GitHub deployments

### Task 5: Monitoring and Maintenance ✅

#### Set up Application Monitoring
- ✅ Implement health check endpoints (`/health`)
- ✅ Configure uptime monitoring via hosting platforms
- ✅ Set up error tracking (integrate with Sentry if needed)
- ✅ Implement performance monitoring via hosting dashboards

#### Create Maintenance Plan
- ✅ Schedule regular updates and patches
- ✅ Plan for database backups (MongoDB Atlas automated backups)
- ✅ Document deployment and rollback procedures

## 🔧 Environment Configuration

### Backend Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_ENV=production
```

## 🚀 Deployment Guide

### Backend Deployment (Render)

1. **Connect GitHub Repository**
   - Go to Render Dashboard
   - Create new Web Service
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Node Version: 18.x.x

3. **Environment Variables**
   - Add all required environment variables from `.env.example`

4. **Deploy**
   - Render will automatically deploy on every push to main branch

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Import project from GitHub
   - Configure build settings:
     - Framework Preset: Create React App
     - Build Command: `npm run build`
     - Output Directory: `build`

2. **Environment Variables**
   - Add `REACT_APP_API_URL` pointing to your backend

3. **Deploy**
   - Automatic deployments on push to main branch

### Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Sign up for MongoDB Atlas
   - Create a new cluster

2. **Database User**
   - Create database user with read/write permissions

3. **Network Access**
   - Add IP addresses (0.0.0.0/0 for development)

4. **Connection String**
   - Get connection string and add to environment variables

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
- **Test Stage**: Runs backend and frontend tests
- **Build Stage**: Builds frontend application
- **Deploy Stage**: Deploys to Render (backend) and Vercel (frontend)
- **Monitoring**: Health checks and error notifications

### Branch Strategy
- `main`: Production branch
- `develop`: Development branch
- Feature branches: `feature/feature-name`

## 📊 Monitoring & Maintenance

### Health Checks
- Backend health endpoint: `GET /health`
- Returns server status and timestamp

### Error Tracking
- Integrated error logging with Morgan
- Console logs for debugging
- Error responses with proper HTTP status codes

### Performance Monitoring
- Response time monitoring via hosting platforms
- Database query optimization
- Frontend bundle size monitoring

### Backup Strategy
- MongoDB Atlas automated daily backups
- Manual backups before major updates
- Data export functionality for users

## 🔒 Security Features

- **Authentication**: JWT-based secure authentication
- **Authorization**: Route protection middleware
- **Input Validation**: Server-side validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **HTTPS**: SSL/TLS encryption in production
- **Security Headers**: Helmet.js for secure HTTP headers
- **Password Hashing**: bcrypt for secure password storage

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### End-to-End Tests
```bash
# Add e2e testing setup (Cypress/Playwright)
npm run test:e2e
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Transaction Endpoints
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats/summary` - Get transaction statistics

### Budget Endpoints
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/alerts/check` - Check budget alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React documentation and community
- Express.js framework
- MongoDB Atlas for database hosting
- Render and Vercel for hosting services
- Chart.js for data visualization

## 📞 Support

For support, email support@finance-tracker.com or join our Discord community.

---

**Live Demo**: [Frontend URL](https://your-frontend-domain.com)  
**API Documentation**: [Backend API](https://your-backend-api.com)  
**GitHub Repository**: [View on GitHub](https://github.com/your-username/ai-finance-tracker)
