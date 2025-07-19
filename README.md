# 🚀 DevJourney - Master Coding, Ace Interviews

A comprehensive coding platform designed to help developers sharpen their skills, solve challenging problems, and prepare for technical interviews. Built with modern web technologies and a focus on user experience.

![DevJourney Platform](https://img.shields.io/badge/DevJourney-Coding%20Platform-blue?style=for-the-badge&logo=code)
![Next.js](https://img.shields.io/badge/Next.js-15.1.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.3.1-2D3748?style=for-the-badge&logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🎯 Core Functionality
- **Interactive Code Editor** - Write and test code in C++, Python, or Java with instant feedback
- **Problem Categories** - Solve problems across different difficulty levels (Easy, Medium, Hard)
- **Progress Tracking** - Monitor solved problems, success rate, and learning journey
- **Real-time Compilation** - Get immediate feedback on your code submissions
- **Test Case Management** - Comprehensive test case system for accurate problem validation

### 🏆 Advanced Features
- **User Dashboard** - Personalized statistics and progress visualization
- **Problem of the Day (POTD)** - Daily coding challenges to maintain consistency
- **Contest System** - Participate in coding competitions
- **Leaderboard & Rankings** - Compete with other developers
- **Streak Tracking** - Maintain daily coding habits
- **Email Verification** - Secure user authentication system
- **Profile Management** - Customize your profile with avatars and personal info

### 🎨 User Experience
- **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- **Dark/Light Mode** - Customizable theme preferences
- **Real-time Updates** - Live submission status and results
- **Mobile Responsive** - Optimized for all device sizes
- **Loading States** - Smooth user experience with skeleton loaders

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.1.1** - React framework with App Router
- **TypeScript 5.7.2** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Monaco Editor** - Professional code editor

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma 6.3.1** - Type-safe database ORM
- **MongoDB** - NoSQL database
- **NextAuth.js** - Authentication solution

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Yarn or npm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ngdec03/devjourney.git
   cd devjourney
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DB_URL="your_mongodb_connection_string"
   
   # NextAuth
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Email (for verification)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your_email@gmail.com"
   EMAIL_SERVER_PASSWORD="your_app_password"
   
   # Cloudinary (for avatar uploads)
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
DevJourney/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # User dashboard
│   │   ├── problems/          # Problem listing & solving
│   │   ├── contest/           # Contest system
│   │   ├── learn/             # Learning resources
│   │   └── profile/           # User profile management
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions
├── prisma/                    # Database schema
├── public/                    # Static assets
└── package.json              # Dependencies & scripts
```

## 🎯 Key Features Explained

### Code Editor Integration
- Monaco Editor provides a professional coding experience
- Support for multiple programming languages
- Real-time syntax highlighting and error detection
- Custom test case execution

### Problem Management
- Categorized by difficulty levels
- Comprehensive problem descriptions
- Multiple test cases per problem
- Success rate tracking

### User Progress Tracking
- Visual progress indicators
- Problem distribution charts
- Submission history
- Streak maintenance

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://prisma.io/) for the excellent ORM
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@devjourney.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/devjourney/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/devjourney/wiki)

---

**Made with ❤️ by the DevJourney Team**

*Empowering developers to master coding and ace interviews*
