# Mock Mode Guide

## Overview

This application now supports **Mock Mode** which allows you to test and view all pages without connecting to the backend API. This is useful for frontend development, testing, and demonstrations.

## How Mock Mode Works

When Mock Mode is enabled:

- Login works with demo credentials (no backend required)
- All data fetching returns mock/sample data
- You can navigate through all pages and see how they look with data
- No actual API calls are made to the backend

## Using Mock Mode

### Login Credentials

Use these credentials to login in Mock Mode:

- **Patient**:

  - Email: `patient@test.com`
  - Password: `password`

- **Doctor**:

  - Email: `doctor@test.com`
  - Password: `password`

- **Lab Staff**:

  - Email: `lab@test.com`
  - Password: `password`

- **Admin**:
  - Email: `admin@test.com`
  - Password: `password`

### Enabling/Disabling Mock Mode

Mock Mode is controlled by the `MOCK_MODE` constant in two places:

#### 1. Authentication (Login)

File: `src/contexts/AuthContext.tsx`

```typescript
const MOCK_MODE = true; // Set to false when backend is ready
```

#### 2. Data Services

File: `src/services/mockData.ts`

```typescript
export const MOCK_MODE = true; // Set to false when backend is ready
```

**To disable Mock Mode and use real backend:**

1. Set `MOCK_MODE = false` in both files above
2. Ensure your backend API is running on `http://localhost:8001`
3. Restart the development server

## Mock Data Available

The following mock data is available:

- **Patients**: 2 sample patients
- **Doctors**: 1 sample doctor
- **Visits**: 2 sample visits
- **Lab Reports**: 4 sample lab reports (with file paths)
- **Test Results**: 6 abnormal test results
- **Family History**: Sample family members

## Limitations

When in Mock Mode:

- You cannot create, update, or delete data (changes won't persist)
- Some features may show empty data if not implemented in mock data
- Pagination and filtering work with limited data
- Real-time updates are not available

## Testing Different User Roles

To test different dashboards and features:

1. **Patient Dashboard**: Login as `patient@test.com`

   - View visits, lab reports, family history
   - See mock medical data

2. **Doctor Dashboard**: Login as `doctor@test.com`

   - View patient list
   - Access visit creation features

3. **Lab Staff Dashboard**: Login as `lab@test.com`

   - Create lab reports with test results
   - Upload lab reports (PDF, JPEG, PNG)
   - View all lab reports with filtering
   - View abnormal test results with severity levels

4. **Admin Dashboard**: Login as `admin@test.com`
   - Access user management
   - View system statistics

## Switching to Real Backend

When your backend is ready:

1. Open `src/contexts/AuthContext.tsx` and set:

   ```typescript
   const MOCK_MODE = false;
   ```

2. Open `src/services/mockData.ts` and set:

   ```typescript
   export const MOCK_MODE = false;
   ```

3. Verify backend is running at `http://localhost:8001`

4. Restart the development server:

   ```bash
   npm run dev
   ```

5. Login with real credentials

## Troubleshooting

### Login still fails after disabling Mock Mode

- Check if backend is running
- Verify backend URL in `src/services/api.ts`
- Check browser console for error messages

### Mock data not showing

- Verify `MOCK_MODE = true` in both files
- Clear browser localStorage
- Restart development server

### Pages show empty data

- Mock data may not be implemented for all features yet
- Check `src/services/mockData.ts` to add more mock data as needed

## Adding More Mock Data

To add more mock data, edit `src/services/mockData.ts` and add your data following the existing patterns. Make sure to match the TypeScript interfaces defined in `src/types/index.ts`.
