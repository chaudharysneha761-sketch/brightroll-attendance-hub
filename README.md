# Brightroll Attendance Hub

Build the frontend for my Smart Attendance Management System using React and Tailwind CSS, starting with the dashboard and shared layout.

Use my attached Time & Attendance dashboard screenshot as the visual reference. Create a premium, minimal SaaS-style interface with a slim vertical icon sidebar, warm off-white background, white content surfaces, thin gray dividers, compact tables, muted gray text, golden-yellow active navigation and primary accents, green Present indicators, and muted-red Absent indicators.

Create five pages:
1. Dashboard — student, subject, session and attendance metrics, attendance breakdown bar, and recent attendance table.
2. Mark Attendance — select a subject and class session, display students, mark Present/Absent, show counts, and submit attendance.
3. Students — searchable student table.
4. Subjects & Sessions — subject and session tables, plus a create-session form.
5. Reports — subject filter, supported date filters, student-wise attendance totals and percentages, and a subtle warning for students below 75%.

Technical requirements:
- Create clean, separated files for the UI, API requests, mock data, and page logic.
- Create a single configurable backend base URL.
- Integrate with these existing Express endpoints:
  GET /api/students
  GET /api/subjects
  GET /api/sessions
  POST /api/sessions
  POST /api/attendance
  GET /api/reports/attendance?subjectId=1
- Do not invent additional backend endpoints.
- Keep mock data in a separate file and make demo mode explicitly configurable.
- Show a Demo Data indicator when using sample data.
- When real API mode is enabled, show errors if requests fail; never silently fall back to mock data.
- Include loading, empty, error, and success states.
- Prevent repeated submissions while saving.
- Refresh relevant data after successful submissions.
- Ensure all navigation, forms, buttons, search, and filters work.
- Make the application responsive on desktop, tablet, and mobile.
- Do not use permanent local-storage attendance records.
- Do not add facial recognition, GPS, notifications, or unnecessary features.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://brightroll-attendance-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7b6f03e7-49a0-4724-b0ee-4c5cd99f1c07).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
