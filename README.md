# ASCII Generator - Full Stack Application

A modern, full-stack ASCII art generator with user authentication, project management, and advanced conversion features.

## 🚀 Features

### Core Functionality
- **Image to ASCII Conversion**: Transform images into beautiful ASCII art
- **Text to ASCII**: Convert text with various font styles
- **Batch Processing**: Process multiple images at once
- **Real-time Preview**: Live preview with zoom and pan controls
- **Multiple Export Formats**: Download as TXT, HTML, or copy to clipboard

### Full-Stack Features
- **User Authentication**: Sign up, sign in with email/password or OAuth
- **Project Management**: Save, organize, and manage your ASCII art projects
- **Preset System**: Save and share conversion settings
- **User Dashboard**: Comprehensive dashboard with statistics and project overview
- **Database Integration**: SQLite database with Prisma ORM
- **API Endpoints**: RESTful API for all operations

### User Experience
- **Auto-refresh**: Forms clear automatically after downloads
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes
- **Modern UI**: Built with Radix UI and Tailwind CSS
- **Animations**: Smooth animations with Framer Motion

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **NextAuth.js** - Authentication solution

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit
- **SQLite** - Lightweight database
- **bcryptjs** - Password hashing
- **JWT** - JSON Web Tokens

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Turbopack** - Fast bundler

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd appzoer-ascii
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and update the following:
   ```env
   # Generate a secure secret for production
   NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
   JWT_SECRET="your-jwt-secret-key-change-this-in-production"
   
   # Optional: Add OAuth provider credentials
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Create and push database schema
   DATABASE_URL="file:./dev.db" npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses a SQLite database with the following models:

### User
- Authentication and profile information
- Relations to projects, presets, and settings

### Project
- ASCII art projects with metadata
- Stores conversion settings and results
- Tracks processing time and file information

### Preset
- Saved conversion settings
- Can be public or private
- Reusable across projects

### UserSettings
- User preferences and defaults
- Theme, default conversion settings
- Auto-save preferences

### Analytics
- Usage tracking and metrics
- Optional user association

## 🔐 Authentication

The app supports multiple authentication methods:

### Email/Password
- Secure password hashing with bcrypt
- JWT-based sessions
- Registration and login endpoints

### OAuth Providers
- Google OAuth
- GitHub OAuth
- Easy to add more providers

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get specific project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Presets
- `GET /api/presets` - List presets (user + public)
- `POST /api/presets` - Create new preset

### User Settings
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update user settings

## 🎨 Usage

### For Users
1. **Sign up/Login**: Create an account or sign in
2. **Upload Image**: Drag & drop or select an image
3. **Adjust Settings**: Customize conversion parameters
4. **Convert**: Generate ASCII art
5. **Download**: Save in your preferred format
6. **Manage**: View projects in your dashboard

### For Developers
1. **API Integration**: Use REST endpoints for custom integrations
2. **Database Access**: Use Prisma client for data operations
3. **Authentication**: Implement custom auth flows
4. **Styling**: Customize with Tailwind CSS classes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- **Railway**: Supports SQLite and Node.js
- **Netlify**: Static hosting with serverless functions
- **Docker**: Containerized deployment

### Production Checklist
- [ ] Update environment variables
- [ ] Set up production database (PostgreSQL recommended)
- [ ] Configure OAuth providers
- [ ] Set up file storage (AWS S3, Cloudinary)
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push database schema
npm run db:studio    # Open Prisma Studio
```

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── converter/         # ASCII converter
│   └── landing/           # Landing page
├── components/            # React components
│   ├── ascii-converter/   # Converter components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # UI components
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── ascii-converter.ts # ASCII conversion logic
└── types/                 # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## 🎯 Roadmap

- [ ] Cloud file storage integration
- [ ] Advanced ASCII art styles
- [ ] Collaborative features
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Advanced analytics
- [ ] Export to more formats
- [ ] Real-time collaboration

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
