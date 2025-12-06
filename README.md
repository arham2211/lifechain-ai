# Medical Dashboard Frontend

A comprehensive medical dashboard with role-based interfaces for healthcare management.

## Features

### 4 User Portals

1. **Patient Portal**

   - Personal health dashboard
   - Lab reports viewing
   - Visit history
   - Disease timeline visualization
   - Family history tree
   - Health predictions (AI-powered)
   - Personalized recommendations

2. **Doctor Portal**

   - Patient search and selection
   - Create and manage visits
   - Record vital signs
   - Document symptoms
   - Create diagnoses
   - Prescribe medications
   - View patient progression

3. **Lab Portal**

   - Dashboard with pending/completed reports
   - Create lab reports
   - Upload test results
   - Mark abnormal results
   - Quality control monitoring

4. **Admin Portal**
   - System-wide statistics
   - User management (patients, doctors, lab staff)
   - Lab facilities management
   - System health monitoring

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** Context API + React Hooks
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Build Tool:** Vite

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Clone the repository and navigate to the project:

   ```bash
   cd medical-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the API base URL in `src/services/api.ts`:

   ```typescript
   export const BASE_URL = "http://localhost:8001/api/v1";
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Common UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── patient/       # Patient portal pages
│   ├── doctor/        # Doctor portal pages
│   ├── lab/           # Lab portal pages
│   └── admin/         # Admin portal pages
├── services/          # API service functions
│   ├── api.ts
│   ├── authService.ts
│   ├── patientService.ts
│   ├── visitService.ts
│   ├── labService.ts
│   └── doctorService.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions and hooks
│   ├── formatters.ts
│   └── hooks.ts
├── App.tsx            # Main app with routing
└── main.tsx           # Entry point
```

## Authentication

The app uses JWT token-based authentication. On login, the token is stored in `localStorage` and included in all API requests via an Axios interceptor.

### Demo Credentials

- **Patient:** patient@test.com / password
- **Doctor:** doctor@test.com / password
- **Lab Staff:** lab@test.com / password
- **Admin:** admin@test.com / password

## Key Features

### Role-Based Access Control

- Each user role has a dedicated portal with specific sidebar navigation
- Protected routes prevent unauthorized access
- Automatic redirect to appropriate dashboard on login

### Patient Features

- View personal lab reports with abnormal value highlighting
- Track visit history
- See AI-powered health predictions and progression forecasts
- Get personalized health recommendations
- View family medical history

### Doctor Features

- Search and select patients
- Create comprehensive visit records
- Document vital signs, symptoms, diagnoses, and prescriptions
- Multi-step visit creation workflow
- Access patient medical history

### Lab Features

- Workflow: Create Lab → Create Report → Upload Test Results → Mark Complete
- Track pending and completed reports
- Flag abnormal test results for quality control
- Support for multiple report types

### Admin Features

- View system-wide statistics
- Manage all entities (patients, doctors, labs)
- Monitor system health

## API Integration

The frontend integrates with a FastAPI backend at `http://localhost:8001/api/v1`.

### Key Endpoints Used:

- `/auth/login` - Authentication
- `/patients/*` - Patient management
- `/doctors/*` - Doctor management
- `/visits/*` - Visit management
- `/labs/*` - Lab and report management
- `/reports/*` - Predictions and recommendations

## Styling

The app uses Tailwind CSS with a custom color palette:

- **Primary:** #1767B2 (Medical Blue)
- **Secondary:** #E9EAEB (Light Gray)
- **Background:** #FFFFFF (White)

## Error Handling

- User-friendly error messages for all API failures
- Loading states for async operations
- Form validation with helpful feedback
- 401 errors automatically redirect to login

## Data Visualization

- **Recharts** for progression timeline charts
- Interactive lab result displays with abnormal highlighting
- Statistical dashboards with metrics cards
- Risk level indicators with color coding

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Pages

1. Create page component in appropriate folder (`src/pages/{role}/`)
2. Add route in `src/App.tsx`
3. Add navigation item to the role's sidebar configuration
4. Implement using common components from `src/components/common/`

### Custom Hooks

- `useDebounce` - Debounce values (useful for search)
- `useLoading` - Manage loading states
- `useError` - Handle errors consistently
- `usePagination` - Pagination state management
- `useLocalStorage` - Persist data in local storage

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of a Final Year Project (FYP) for educational purposes.

## Support

For issues or questions, please contact the development team.
