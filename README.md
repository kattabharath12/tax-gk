# TaxGrok - Intelligent Tax Filing Application

A comprehensive tax filing application built with Next.js that streamlines tax document processing, calculation, and filing.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Deploy to Railway

See the comprehensive [Railway Deployment Guide](../RAILWAY_DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Deploy:**
1. Push code to GitHub
2. Create Railway project from GitHub repo
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy!

## 📋 Features

- 🔐 **User Authentication** - Secure signup/login with NextAuth
- 📄 **Document Processing** - Upload and process W2, 1099 forms
- 🤖 **AI-Powered Extraction** - Azure Document Intelligence for data extraction
- 💰 **Tax Calculations** - Automatic federal and state tax calculations
- 📊 **Dashboard** - Comprehensive overview of tax status
- 📝 **Form 1040 Generation** - Generate completed tax forms
- 💾 **Persistent Storage** - Railway volume storage for secure document storage

## 🛠️ Technology Stack

- **Framework**: Next.js 14.2.28
- **Language**: TypeScript 5.2.2
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Storage**: Railway Volume Storage (local filesystem)
- **AI/ML**: Azure Document Intelligence
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Zustand + Jotai

## 📦 Project Structure

```
app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   └── file-return/       # Tax filing page
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   ├── tax-filing/       # Tax filing wizard
│   └── ui/               # UI components (shadcn)
├── lib/                   # Utility libraries
│   ├── auth-options.ts   # NextAuth configuration
│   ├── local-storage.ts  # Local file storage service
│   ├── azure-client.ts   # Azure AI configuration
│   ├── db.ts             # Prisma client
│   └── tax-calculations.ts # Tax calculation logic
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```bash
# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Local File Storage (Railway Volume)
UPLOAD_DIR=/data/uploads

# Azure Document Intelligence
AZURE_DOC_INTELLIGENCE_API_KEY=
AZURE_DOC_INTELLIGENCE_ENDPOINT=
```

### 📁 Railway Volume Setup

**Important**: You must create a Railway volume for persistent file storage.

1. In your Railway project, go to your service settings
2. Navigate to the **"Volumes"** section
3. Create a new volume with mount path: `/data`
4. Set the `UPLOAD_DIR` environment variable to `/data/uploads`

See [RAILWAY_VOLUME_SETUP.md](./RAILWAY_VOLUME_SETUP.md) for detailed instructions.

## 🗄️ Database

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Prisma Studio

```bash
# Open Prisma Studio
npx prisma studio
```

## 🧪 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Railway-specific scripts
npm run railway:build  # Build for Railway
npm run railway:start  # Start on Railway
```

## 📚 API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Documents
- `POST /api/upload` - Upload document
- `POST /api/process-document` - Process uploaded document
- `GET /api/documents` - Get user's documents

### Tax Processing
- `POST /api/tax-data-extraction` - Extract tax data
- `POST /api/tax-calculation` - Calculate taxes
- `GET /api/download-f1040` - Download Form 1040

## 🎯 Key Features Explained

### Document Upload & Processing
1. User uploads tax document (W2, 1099, etc.)
2. Document stored in Railway volume storage (`/data/uploads`)
3. Azure Document Intelligence extracts data
4. Extracted data stored in PostgreSQL
5. User can review and edit extracted data

### Tax Calculation
1. System gathers income data from all documents
2. Applies federal tax brackets and deductions
3. Calculates state taxes (if applicable)
4. Provides itemized breakdown
5. Generates Form 1040

### Security
- Password hashing with bcrypt
- JWT-based session management
- Secure file upload with validation
- Environment-based configuration

### File Storage
- **Storage Type**: Railway persistent volumes
- **Location**: `/data/uploads` (configurable via `UPLOAD_DIR`)
- **Persistence**: Files persist across deployments
- **File Size Limit**: 10MB per file (configurable in API routes)
- **Supported Formats**: PDF, PNG, JPG, JPEG, TIFF
- **Backup Recommendation**: Regular backups advised for production use

**Storage Considerations:**
- Railway volumes are attached to a single instance
- For multi-instance deployments, consider external storage (S3, Azure Blob)
- Monitor disk usage in Railway dashboard
- Implement file cleanup for old/expired documents

## 🚢 Deployment

### Railway (Recommended)

Railway deployment is automated with included configuration files:
- `railway.json` / `railway.toml` - Railway configuration
- `Procfile` - Process configuration
- `.railwayignore` - Files to exclude

See [RAILWAY_DEPLOYMENT_GUIDE.md](../RAILWAY_DEPLOYMENT_GUIDE.md) for complete instructions.

### Other Platforms

This application can also be deployed to:
- **Vercel**: Next.js native support
- **AWS**: Elastic Beanstalk or ECS
- **Digital Ocean**: App Platform
- **Heroku**: Using Procfile

## 🐛 Troubleshooting

### Common Issues

**Build Errors**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Database Connection**:
```bash
# Verify DATABASE_URL is correct
npx prisma db pull
```

**Prisma Client Errors**:
```bash
# Regenerate Prisma client
npx prisma generate
```

## 📈 Performance Optimization

- Image optimization with Next.js Image component
- API route caching
- Database query optimization with Prisma
- CDN for static assets (when using custom domain)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
- Check the [Railway Deployment Guide](../RAILWAY_DEPLOYMENT_GUIDE.md)
- Review [Troubleshooting](#troubleshooting) section
- Contact the development team

## 🔄 Version History

- **1.1.0** (2025-10-26)
  - **Breaking Change**: Migrated from Azure Blob Storage to Railway volume storage
  - Removed Azure Blob Storage dependencies
  - Added local file storage service
  - Updated documentation for Railway volume setup
  - Simplified deployment requirements

- **1.0.0** (2025-10-26)
  - Initial release
  - Core tax filing functionality
  - Document processing with Azure AI
  - Railway deployment support

---

**Built with ❤️ using Next.js and TypeScript**
