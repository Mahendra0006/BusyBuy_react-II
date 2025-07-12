# React + Vite

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Mahendra0006/BusyBuy_react-II)

## Overview

BusyBuy React is a modern, full-stack e-commerce platform built with React.js and Firebase. It provides a seamless shopping experience with features like product management, user authentication, cart functionality, and order tracking.

## Features

### User Management
- Secure authentication system with Firebase
- User registration and login
- Profile management
- Order history tracking

### Product Management
- Dynamic product catalog
- Product search and filtering
- Product details with images and descriptions
- Add/Edit products (admin functionality)

### Shopping Cart
- Add/remove items from cart
- Quantity management
- Price calculations
- Cart persistence

### Order Processing
- Order placement
- Order tracking
- Order history
- Detailed order information

### UI/UX Features
- Responsive design
- Modern Bootstrap-based UI
- Toast notifications
- Loading states
- Error handling

## Technologies Used

- **Frontend Framework**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Components**: React Bootstrap
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Backend**: Firebase (Authentication, Database)
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── redux/          # Redux store and slices
├── routes/         # Route configurations
├── styles/         # Global styles
├── utils/          # Utility functions
├── firebase.js     # Firebase configuration
└── App.jsx         # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Mahendra0006/BusyBuy_react-II.git
   cd busybuy-II
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure Firebase
   - Create a Firebase project
   - Update firebase.js with your project credentials

4. Start the development server
   ```bash
   npm run dev
   ```

5. Build for production
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run preview` - Previews the production build
- `npm run lint` - Runs ESLint for code quality checks

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository.
