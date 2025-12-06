# Setup Guide - Medical Dashboard Frontend

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** version 20.19+ or 22.12+ (check with `node --version`)
- **npm** version 8+ (check with `npm --version`)
- **Backend API** running on `http://localhost:8001`

## Quick Start

### 1. Install Dependencies

```bash
cd medical-dashboard
npm install
```

If you encounter peer dependency issues, use:

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` if your backend API is running on a different URL.

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 4. Login

Use the demo credentials based on your role:

- **Patient:** patient@test.com / password
- **Doctor:** doctor@test.com / password
- **Lab Staff:** lab@test.com / password
- **Admin:** admin@test.com / password

## Project Structure

```
medical-dashboard/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Generic components (DataTable, Modal, etc.)
│   │   ├── Layout.tsx    # Main layout with sidebar
│   │   └── ProtectedRoute.tsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/            # Page components by role
│   │   ├── patient/     # Patient portal pages
│   │   ├── doctor/      # Doctor portal pages
│   │   ├── lab/         # Lab portal pages
│   │   └── admin/       # Admin portal pages
│   ├── services/        # API integration layer
│   │   ├── api.ts       # Axios configuration
│   │   ├── authService.ts
│   │   ├── patientService.ts
│   │   ├── visitService.ts
│   │   ├── labService.ts
│   │   └── doctorService.ts
│   ├── types/           # TypeScript definitions
│   │   └── index.ts
│   ├── utils/           # Helper functions and hooks
│   │   ├── formatters.ts
│   │   └── hooks.ts
│   ├── App.tsx          # Main app with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Tailwind CSS imports
├── public/              # Static assets
├── .env.example         # Environment variables template
├── tailwind.config.js   # Tailwind configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Features by Role

### Patient Portal

✅ Personal health dashboard with risk assessment  
✅ View lab reports with abnormal value highlighting  
✅ Visit history  
✅ Disease progression timeline with charts  
✅ Family medical history and genetic risk assessment  
✅ AI-powered health predictions (6-24 months forecast)  
✅ Personalized health recommendations

### Doctor Portal

✅ Patient search and selection  
✅ Multi-step visit creation workflow  
✅ Record vital signs, symptoms, diagnoses, prescriptions  
✅ View patient medical history  
✅ Access to ML confidence scores for diagnoses

### Lab Portal

✅ Dashboard with pending/completed reports  
✅ Create lab reports workflow  
✅ Add individual test results  
✅ Mark abnormal results for quality control  
✅ Complete and finalize reports

### Admin Portal

✅ System-wide statistics  
✅ Patient, doctor, and lab management  
✅ System health monitoring

## Technology Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **State Management:** Context API + React Hooks
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Build Tool:** Vite

## Development Tips

### Adding a New Page

1. Create component in `src/pages/{role}/`
2. Add route in `src/App.tsx`
3. Add navigation item to role's sidebar in Layout
4. Use common components from `src/components/common/`

### Using API Services

```typescript
import { patientService } from "../services/patientService";

// Fetch patients with filters
const patients = await patientService.getPatients({
  name: "John",
  limit: 10,
  skip: 0,
});

// Get specific patient
const patient = await patientService.getPatientById(patientId);
```

### Custom Hooks

```typescript
import {
  useLoading,
  useError,
  useDebounce,
  usePagination,
} from "../utils/hooks";

// Loading state
const { isLoading, withLoading } = useLoading();
const data = await withLoading(() => apiCall());

// Error handling
const { error, setError, clearError, handleError } = useError();

// Search with debounce
const debouncedQuery = useDebounce(searchQuery, 300);

// Pagination
const pagination = usePagination(0, 10);
```

## Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will automatically try the next available port.

### API Connection Errors

1. Verify backend is running on `http://localhost:8001`
2. Check CORS is enabled on the backend
3. Verify `.env` file has correct API URL

### Build Errors

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Clear Vite cache:
   ```bash
   rm -rf .vite
   ```

### TypeScript Errors

1. Restart TypeScript server in your IDE
2. Check `tsconfig.json` settings

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Server

1. Build the project
2. Upload `dist/` contents to your web server
3. Configure server to serve `index.html` for all routes (SPA routing)
4. Set environment variables for production API URL

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Security Considerations

- JWT tokens are stored in `localStorage`
- All API requests include Authorization header
- 401 responses automatically redirect to login
- Role-based access control on routes
- Input validation on all forms

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make changes
3. Run `npm run lint` to check code quality
4. Test all affected features
5. Submit pull request

## Support

For issues or questions:

- Check this documentation
- Review the API documentation (Frontend.pdf)
- Contact the development team

## License

This project is for educational purposes as part of a Final Year Project (FYP).
