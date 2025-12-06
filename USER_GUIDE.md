# Medical Dashboard - User Guide

## Overview

The Medical Dashboard is a comprehensive healthcare management system with four distinct role-based portals:

1. **Patient Portal** - Personal health management
2. **Doctor Portal** - Patient care and visit management
3. **Lab Portal** - Laboratory report creation and management
4. **Admin Portal** - System-wide administration

## Getting Started

### Login

Navigate to `http://localhost:5173/login` and use your credentials based on your role.

**Demo Credentials:**

- Patient: `patient@test.com` / `password`
- Doctor: `doctor@test.com` / `password`
- Lab Staff: `lab@test.com` / `password`
- Admin: `admin@test.com` / `password`

## Patient Portal Guide

### Dashboard

Your home page shows:

- **Statistics**: Total visits, lab reports, pending reports
- **AI Recommendations**: Latest health guidance
- **Quick Actions**: Links to important features

### Lab Reports

View all your laboratory test results:

- **Abnormal Values**: Highlighted in red for easy identification
- **Detailed View**: Click any report to see all test results
- **Status**: See pending or completed reports
- **History**: Access all past reports

### Visit History

Track all your medical appointments:

- View visit dates and doctors
- See chief complaints
- Review visit types

### Disease Timeline

Visualize your health progression:

1. **Disease Selector**: Choose which condition to track
2. **Timeline Chart**: See severity progression over time
3. **Diagnosis History**: Detailed list of all diagnoses
4. **AI Confidence**: View ML model confidence scores

### Family History

Understand genetic health risks:

- **Genetic Risk Assessment**: See inherited disease risks
- **Family Members**: View relatives' medical conditions
- **Blood Relatives**: Identified for accurate risk calculation
- **Disease Tracking**: See which conditions run in your family

### Health Predictions

AI-powered health forecasts:

1. **Select Timeframe**: 3, 6, 12, or 24 months ahead
2. **Disease-Specific**: See predictions for each condition
3. **Risk Levels**: Understand your risk (low/medium/high)
4. **Confidence Scores**: ML model reliability indicators

### AI Recommendations

Personalized health guidance:

- **Priority Levels**: High/Medium/Low importance
- **Categories**: Lifestyle, medication, monitoring, etc.
- **Disease-Specific**: Tailored to your conditions
- **Confidence Scores**: Based on your medical data

## Doctor Portal Guide

### Dashboard

Main workspace with patient search:

#### Patient Search

1. Type patient name or CNIC in search bar
2. Results appear below
3. Click a patient to select them
4. Selected patient info displays prominently

#### Quick Actions

- **View Patient Details**: Access full medical history
- **Create New Visit**: Start documenting a visit

### Create Visit

Multi-step workflow for comprehensive visit documentation:

#### Step 1: Basic Information

- **Visit Date**: Date of appointment
- **Visit Type**: Follow-up, Initial, Emergency, etc.
- **Chief Complaint**: Main reason for visit
- **Notes**: Additional context

#### Step 2: Vital Signs

Record patient vitals (all optional):

- Blood Pressure (Systolic/Diastolic)
- Heart Rate (bpm)
- Temperature (°C)
- Respiratory Rate
- Weight & Height

#### Step 3: Symptoms

Document patient symptoms:

- **Symptom Name**: What the patient reports
- **Severity**: Mild, Moderate, Severe
- **Duration**: How long they've had it
- **Notes**: Additional details
- Add multiple symptoms as needed

#### Step 4: Diagnoses

Record medical diagnoses:

- **Disease Name**: Condition identified
- **Status**: Active, Chronic, or Resolved
- **Severity**: Level of condition
- **Notes**: Clinical observations
- Add multiple diagnoses

#### Step 5: Prescriptions

Prescribe medications:

- **Medication Name**: Drug prescribed
- **Dosage**: Amount per dose
- **Frequency**: How often (e.g., "Twice daily")
- **Duration**: How long (e.g., "7 days")
- **Notes**: Special instructions

## Lab Portal Guide

### Dashboard

Overview of laboratory operations:

- **Pending Reports**: Reports awaiting completion
- **Completed Reports**: Finalized reports
- **Abnormal Results**: Quality control alerts
- **Recent Reports**: Latest 5 reports

### Create Lab Report

Systematic workflow for report creation:

#### Step 1: Select Patient

1. Search by name or CNIC
2. Click patient to select
3. Proceed to next step

#### Step 2: Report Information

- **Lab Facility**: Select from registered labs
- **Report Date**: Date of specimen collection
- **Report Type**: Choose from:
  - Biochemistry
  - Hematology
  - Radiology
  - Pathology
  - Microbiology

#### Step 3: Add Test Results

Add individual test results:

- **Test Name**: e.g., "Glucose", "HbA1c", "Hemoglobin"
- **Value**: Numeric result
- **Unit**: e.g., "mg/dL", "g/dL", "%"
- **Reference Range**: Normal range
- **Abnormal Flag**: Check if outside normal range
- Add multiple tests

#### Step 4: Complete

- Review all added tests
- Option to add more tests
- Mark report as complete
- Returns to dashboard

### Quality Control

Monitor abnormal results:

- View all flagged abnormal test results
- Review for accuracy
- Identify trends

## Admin Portal Guide

### Dashboard

System-wide overview:

- **Total Patients**: All registered patients
- **Total Doctors**: All registered doctors
- **Lab Facilities**: All registered labs
- **Lab Reports**: Total reports in system
- **System Health**: API, Database, ML Model status

### Management Features

Access to all system entities:

- **Patient Management**: View, create, edit, delete patients
- **Doctor Management**: Manage doctor accounts
- **Lab Management**: Manage lab facilities
- **User Administration**: (Future feature)

## Common Features

### Sidebar Navigation

All portals have a collapsible sidebar:

- Click hamburger menu to toggle
- Active page highlighted in blue
- Logout button at bottom

### Search Functionality

All search bars use debounced search:

- Start typing to search
- 300ms delay before search executes
- Results appear automatically

### Pagination

Tables with many records include pagination:

- View current page number
- Navigate with Previous/Next buttons
- Automatically loads more data

### Modal Windows

Detailed views open in modal windows:

- Click outside or X button to close
- Scrollable for long content
- Responsive on all devices

## Best Practices

### For Patients

1. **Regular Check-ins**: View dashboard weekly
2. **Monitor Recommendations**: Act on high-priority items
3. **Track Timeline**: Review progression monthly
4. **Share with Family**: Discuss genetic risks

### For Doctors

1. **Select Patient First**: Always search and select before creating visits
2. **Complete Documentation**: Fill all relevant fields
3. **Review ML Scores**: Consider AI confidence in decisions
4. **Track Patient Progress**: Use timeline features

### For Lab Staff

1. **Verify Patient**: Confirm correct patient before creating report
2. **Double-Check Values**: Ensure accuracy of test results
3. **Flag Abnormals**: Mark unusual results for quality review
4. **Complete Promptly**: Finish reports same day when possible

### For Admins

1. **Monitor Daily**: Check system health regularly
2. **Review Statistics**: Track usage trends
3. **Maintain Data Quality**: Audit records periodically
4. **Backup Regularly**: Ensure data safety

## Keyboard Shortcuts

- **Enter**: Submit forms
- **Escape**: Close modals
- **Tab**: Navigate form fields

## Mobile Usage

The application is responsive:

- Sidebar becomes full-screen overlay on mobile
- Tables scroll horizontally
- Touch-friendly buttons
- Optimized for tablets and phones

## Troubleshooting

### Can't Log In

- Verify credentials are correct
- Check backend API is running
- Clear browser cache
- Try different browser

### Data Not Loading

- Check internet connection
- Verify backend API is accessible
- Refresh the page
- Check browser console for errors

### Search Not Working

- Wait for debounce (300ms)
- Check spelling
- Try partial name/CNIC
- Ensure data exists in system

### Reports Not Showing

- Verify correct patient is selected
- Check date filters if any
- Refresh the page
- Contact admin if persistent

## Security

### Passwords

- Change default passwords immediately
- Use strong, unique passwords
- Don't share credentials
- Log out when finished

### Data Privacy

- Only access authorized patient data
- Don't share patient information
- Log out on shared computers
- Report suspicious activity

## Support

### Getting Help

1. Check this user guide
2. Review setup documentation (SETUP.md)
3. Check API documentation (Frontend.pdf)
4. Contact system administrator
5. Submit bug reports to development team

### Reporting Issues

Include in your report:

- What you were trying to do
- What happened instead
- Error messages (if any)
- Your role and browser
- Steps to reproduce

## Updates

The system is regularly updated:

- New features added periodically
- Bug fixes deployed promptly
- Check announcements for changes
- Report feature requests to admin

## Glossary

- **CNIC**: Computerized National Identity Card (Pakistani ID)
- **ML**: Machine Learning
- **AI**: Artificial Intelligence
- **HbA1c**: Hemoglobin A1c (diabetes marker)
- **Vital Signs**: Basic health measurements
- **Chief Complaint**: Main reason for visit
- **Diagnosis**: Identified medical condition
- **Prescription**: Medication order
- **Lab Report**: Laboratory test results
- **Abnormal Result**: Test value outside normal range

---

_Last Updated: November 2024_
_Version: 1.0.0_
