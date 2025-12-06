# Testing Checklist - Medical Dashboard

## Pre-Testing Setup

### 1. Verify Backend is Running

```bash
# Backend should be accessible at:
curl http://localhost:8001/api/v1/
```

### 2. Start Frontend

```bash
cd medical-dashboard
npm install
npm run dev
```

### 3. Access Application

Open `http://localhost:5173` in your browser

## Role-Based Access Control Testing

### Test 1: Patient Role Access

- [x] Login as patient (patient@test.com / password)
- [x] Redirects to `/patient/dashboard`
- [x] Can access all patient routes
- [x] Cannot access doctor/lab/admin routes
- [x] Logout and verify redirect to login

### Test 2: Doctor Role Access

- [x] Login as doctor (doctor@test.com / password)
- [x] Redirects to `/doctor/dashboard`
- [x] Can access all doctor routes
- [x] Cannot access patient/lab/admin routes
- [x] Logout and verify redirect to login

### Test 3: Lab Staff Role Access

- [x] Login as lab staff (lab@test.com / password)
- [x] Redirects to `/lab/dashboard`
- [x] Can access all lab routes
- [x] Cannot access patient/doctor/admin routes
- [x] Logout and verify redirect to login

### Test 4: Admin Role Access

- [x] Login as admin (admin@test.com / password)
- [x] Redirects to `/admin/dashboard`
- [x] Can access all admin routes
- [x] Cannot access patient/doctor/lab routes
- [x] Logout and verify redirect to login

### Test 5: Unauthorized Access

- [x] Try accessing protected route without login
- [x] Should redirect to `/login`
- [x] Try accessing wrong role route
- [x] Should redirect to `/unauthorized`

## Patient Portal Testing

### Dashboard

- [ ] Login as patient
- [ ] Verify stats cards display correctly
- [ ] Check AI recommendations show (if data available)
- [ ] Click "View Lab Reports" quick action
- [ ] Click "Health Predictions" quick action

### Lab Reports

- [ ] Navigate to Lab Reports
- [ ] Verify reports list displays
- [ ] Click a report to view details
- [ ] Verify abnormal values highlighted in red
- [ ] Check pagination works (if >10 reports)
- [ ] Close modal successfully

### Visit History

- [ ] Navigate to Visit History
- [ ] Verify visits list displays
- [ ] Check visit details (date, doctor, type)
- [ ] Verify pagination works

### Disease Timeline

- [ ] Navigate to Disease Timeline
- [ ] Select a disease from dropdown
- [ ] Verify chart renders correctly
- [ ] Check diagnosis history displays
- [ ] Verify ML confidence scores show
- [ ] Change disease selector and verify update

### Family History

- [ ] Navigate to Family History
- [ ] Verify genetic risk assessment displays
- [ ] Check family members list
- [ ] Verify blood relatives are marked
- [ ] Check disease annotations on members

### Health Predictions

- [ ] Navigate to Health Predictions
- [ ] Change forecast period (3/6/12/24 months)
- [ ] Verify prediction chart renders
- [ ] Check risk level indicators
- [ ] Verify multiple diseases show separately

### AI Recommendations

- [ ] Navigate to AI Recommendations
- [ ] Verify recommendations display by disease
- [ ] Check priority levels (high/medium/low)
- [ ] Verify confidence scores show
- [ ] Check color coding by priority

## Doctor Portal Testing

### Dashboard & Patient Search

- [ ] Login as doctor
- [ ] Type patient name in search bar
- [ ] Verify debounced search works (300ms delay)
- [ ] Click a patient to select
- [ ] Verify selected patient card displays
- [ ] Check "Create Visit" button enables

### Create Visit - Full Workflow

- [ ] Select a patient first
- [ ] Click "Create New Visit"
- [ ] **Step 1: Basic Info**
  - [ ] Fill visit date
  - [ ] Enter visit type
  - [ ] Add chief complaint
  - [ ] Add notes
  - [ ] Click "Next: Add Vital Signs"
- [ ] **Step 2: Vital Signs**
  - [ ] Enter blood pressure values
  - [ ] Enter heart rate
  - [ ] Enter temperature
  - [ ] Click "Next: Add Symptoms"
- [ ] **Step 3: Symptoms**
  - [ ] Click "Add Symptom"
  - [ ] Fill symptom details
  - [ ] Add multiple symptoms
  - [ ] Click "Next: Add Diagnosis"
- [ ] **Step 4: Diagnosis**
  - [ ] Click "Add Diagnosis"
  - [ ] Enter disease name
  - [ ] Select status
  - [ ] Enter severity
  - [ ] Click "Next: Add Prescriptions"
- [ ] **Step 5: Prescriptions**
  - [ ] Click "Add Prescription"
  - [ ] Enter medication details
  - [ ] Add multiple prescriptions
  - [ ] Click "Complete Visit"
- [ ] Verify redirect to dashboard
- [ ] Verify visit appears in system

### Navigation

- [ ] Test all sidebar links
- [ ] Verify active page highlighted
- [ ] Toggle sidebar (collapse/expand)
- [ ] Check responsive behavior on mobile

## Lab Portal Testing

### Dashboard

- [ ] Login as lab staff
- [ ] Verify pending reports count
- [ ] Verify completed reports count
- [ ] Verify abnormal results count
- [ ] Check recent reports list

### Create Lab Report - Full Workflow

- [ ] Click "Create Lab Report"
- [ ] **Step 1: Select Patient**
  - [ ] Search for patient
  - [ ] Click patient to select
  - [ ] Click Next
- [ ] **Step 2: Report Info**
  - [ ] Select lab facility
  - [ ] Set report date
  - [ ] Choose report type (biochemistry/etc)
  - [ ] Click "Next: Add Test Results"
- [ ] **Step 3: Add Tests**
  - [ ] Click "Add Test"
  - [ ] Enter test name (e.g., "Glucose")
  - [ ] Enter test value
  - [ ] Enter unit
  - [ ] Enter reference range
  - [ ] Check "Mark as abnormal" if needed
  - [ ] Add multiple tests
  - [ ] Click "Save Tests"
- [ ] **Step 4: Complete**
  - [ ] Verify success message
  - [ ] Option to add more tests or complete
  - [ ] Click "Complete Report"
- [ ] Verify redirect to dashboard
- [ ] Verify report shows in completed list

### Reports List

- [ ] Navigate to All Reports
- [ ] Verify filtering works
- [ ] Check pagination
- [ ] Click report to view details

### Abnormal Results

- [ ] Navigate to Abnormal Results
- [ ] Verify flagged results display
- [ ] Check quality control info

## Admin Portal Testing

### Dashboard

- [ ] Login as admin
- [ ] Verify all stat cards display
- [ ] Check total patients count
- [ ] Check total doctors count
- [ ] Check lab facilities count
- [ ] Check total reports count
- [ ] Verify system health indicators

### Management Features

- [ ] Click "Manage Patients"
- [ ] Click "Manage Doctors"
- [ ] Click "Manage Labs"
- [ ] Verify each loads correctly

## Common Features Testing

### Authentication

- [ ] Invalid credentials show error message
- [ ] Successful login redirects correctly
- [ ] Logout clears session
- [ ] Refresh page maintains session
- [ ] Token expiry redirects to login

### Loading States

- [ ] Verify loading spinners show during API calls
- [ ] Check skeleton loaders where applicable
- [ ] Ensure no blank screens during loads

### Error Handling

- [ ] Disconnect internet and try action
- [ ] Verify user-friendly error messages
- [ ] Check error dismiss functionality
- [ ] Verify retry mechanisms work

### Search & Debounce

- [ ] Type quickly in search bar
- [ ] Verify only last query executes
- [ ] Check 300ms debounce timing
- [ ] Test with partial matches

### Pagination

- [ ] Navigate to page with many records
- [ ] Click "Next Page"
- [ ] Click "Previous Page"
- [ ] Verify page numbers update
- [ ] Check data loads correctly

### Modals

- [ ] Open modal by clicking record
- [ ] Click outside to close
- [ ] Click X button to close
- [ ] Verify scrolling works in long modals
- [ ] Check responsiveness

### Data Tables

- [ ] Verify column headers display
- [ ] Check data rows populate
- [ ] Test row click functionality
- [ ] Verify empty state message
- [ ] Check loading state

## Responsive Design Testing

### Desktop (1920x1080)

- [ ] All elements visible
- [ ] Proper spacing
- [ ] Charts render correctly
- [ ] Sidebar always visible

### Tablet (768x1024)

- [ ] Layout adjusts properly
- [ ] Sidebar collapses
- [ ] Touch targets adequate
- [ ] Charts readable

### Mobile (375x667)

- [ ] Sidebar becomes overlay
- [ ] Tables scroll horizontally
- [ ] Forms stack vertically
- [ ] Buttons touch-friendly
- [ ] Text readable

## Browser Compatibility

### Chrome

- [ ] All features work
- [ ] Charts render
- [ ] No console errors

### Firefox

- [ ] All features work
- [ ] Charts render
- [ ] No console errors

### Safari

- [ ] All features work
- [ ] Charts render
- [ ] No console errors

### Edge

- [ ] All features work
- [ ] Charts render
- [ ] No console errors

## Performance Testing

### Page Load Times

- [ ] Dashboard loads < 2 seconds
- [ ] Chart pages load < 3 seconds
- [ ] Tables load < 2 seconds
- [ ] Search results < 1 second

### Network Requests

- [ ] No unnecessary duplicate requests
- [ ] Proper caching utilized
- [ ] Minimal payload sizes
- [ ] Error retries work

## Data Visualization Testing

### Charts (Recharts)

- [ ] Line charts render correctly
- [ ] Axes display properly
- [ ] Tooltips show on hover
- [ ] Legend displays
- [ ] Responsive to window resize

### Timeline

- [ ] Disease timeline displays
- [ ] Data points connected
- [ ] Dates formatted correctly
- [ ] Multiple diseases separate

### Predictions

- [ ] Forecast charts render
- [ ] Future dates shown
- [ ] Confidence intervals display
- [ ] Risk levels color-coded

## Form Validation Testing

### Create Visit Form

- [ ] Required fields validated
- [ ] Date format validated
- [ ] Numeric fields validated
- [ ] Error messages clear

### Lab Report Form

- [ ] Patient selection required
- [ ] Date validation works
- [ ] Test value format checked
- [ ] Empty submissions blocked

### Search Forms

- [ ] Minimum character requirement
- [ ] Invalid input handled
- [ ] Clear button works

## Integration Testing

### Complete Patient Journey

1. [ ] Doctor searches patient
2. [ ] Doctor creates visit with diagnosis
3. [ ] Lab staff creates report for patient
4. [ ] Lab staff adds test results
5. [ ] Patient views new lab report
6. [ ] Patient sees updated timeline
7. [ ] Patient gets new recommendations

### Complete Lab Workflow

1. [ ] Lab staff searches patient
2. [ ] Creates lab report
3. [ ] Adds multiple test results
4. [ ] Marks some as abnormal
5. [ ] Completes report
6. [ ] Views in abnormal results list
7. [ ] Patient can see report

## Security Testing

### Authentication

- [ ] Can't access pages without login
- [ ] Token stored securely
- [ ] Token sent with requests
- [ ] Invalid token redirects to login

### Authorization

- [ ] Each role sees only their pages
- [ ] Direct URL access blocked for other roles
- [ ] API calls include auth headers
- [ ] Unauthorized requests handled

### Data Privacy

- [ ] Patient sees only their own data
- [ ] Doctor sees only selected patient data
- [ ] No data leaks in console
- [ ] No sensitive data in URLs

## Accessibility Testing

### Keyboard Navigation

- [ ] Tab through forms works
- [ ] Enter submits forms
- [ ] Escape closes modals
- [ ] Focus indicators visible

### Screen Reader Support

- [ ] Labels on form inputs
- [ ] Alt text on images
- [ ] ARIA labels where needed
- [ ] Semantic HTML used

### Color Contrast

- [ ] Text readable on backgrounds
- [ ] Error messages clear
- [ ] Status indicators distinguishable
- [ ] Charts color-blind friendly

## Edge Cases

### Empty States

- [ ] No patients - displays message
- [ ] No reports - displays message
- [ ] No visits - displays message
- [ ] No recommendations - displays message

### Large Datasets

- [ ] 100+ patients - pagination works
- [ ] 50+ reports - performance good
- [ ] Long text - truncates properly
- [ ] Many test results - scrollable

### Network Issues

- [ ] Slow connection - loading states show
- [ ] Disconnected - error messages display
- [ ] Timeout - retry options available
- [ ] Partial data - handled gracefully

## Bug Report Template

When you find an issue, record:

```
**Description**: What went wrong
**Steps to Reproduce**:
1. Go to...
2. Click on...
3. See error...
**Expected**: What should happen
**Actual**: What actually happened
**Browser**: Chrome 120
**Role**: Patient
**Screenshot**: [if applicable]
**Console Errors**: [if any]
```

## Sign-Off

- [ ] All critical features tested
- [ ] All role-based access verified
- [ ] Responsive design confirmed
- [ ] Browser compatibility checked
- [ ] No blocking bugs found
- [ ] Performance acceptable
- [ ] Ready for deployment

**Tested By**: **\*\***\_\_\_**\*\***
**Date**: **\*\***\_\_\_**\*\***
**Version**: 1.0.0
