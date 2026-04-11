# Examination Attendance Management System

An advanced, role-based application designed to digitize and streamline the process of managing examination attendance. This system replaces traditional paper-based methods with a centralized, offline-first web platform, featuring distinct interfaces for administrators and faculty members.

The application is built as a Progressive Web App (PWA), ensuring it's installable on devices and functions reliably even with intermittent or no internet connectivity.

## Live Demo

You can explore a live version of the application here: **[https://gbu-ams.vercel.app](https://gbu-ams.vercel.app/)**

### Demo Credentials

To explore the different roles, use the following pre-configured credentials:

**Admin Account**

- **Username (Email):** `admin@college.edu`
- **Password:** `Admin@1234`
- **Direct Login:** [Admin Login](https://gbu-ams.vercel.app/admin/login)

**Faculty Account**

- **Username (Email):** `faculty@college.edu`
- **Password:** `Faculty@1234`
- **Direct Login:** [Faculty Login](https://gbu-ams.vercel.app/faculty/login)
- _Faculty can also log in using Google OAuth._

## Key Features

### Admin Panel

- **Dashboard:** An overview of attendance status (Present, Absent, UFM, Not Marked) with an interactive pie chart.
- **Data Management:** Full CRUD (Create, Read, Update, Delete) capabilities for:
  - Courses
  - Students
  - Faculty
  - Exam Rooms
- **Bulk Operations:** Upload data for students, faculty, rooms, and duties in bulk using Excel/CSV files.
- **Duty Assignment:** Assign invigilation duties to faculty for specific rooms, dates, and shifts.
- **Student Allocation:** Manage student seating arrangements within exam rooms.
- **Reporting:** View and filter detailed attendance records. Export data to Excel files for documentation.

### Faculty Panel

- **Duty Display:** View a personalized list of assigned invigilation duties for the day.
- **Student Lists:** Access the list of students for a specific exam session.
- **Attendance Marking:**
  - **QR Code Scanning:** Instantly mark attendance by scanning a QR code on the student's answer sheet.
  - **Manual Marking:** Manually set a student's status to "Present", "Absent", or "UFM" (Unfair Means).
- **Offline First:** The system is designed to work offline, syncing data automatically when a connection is restored.

### General Features

- **PWA:** Installable on any device (desktop or mobile) for a native-app-like experience and offline access.
- **Role-Based Access:** Secure and separate interfaces for Admin and Faculty roles.
- **Responsive Design:** Fully functional across a range of devices, from desktops to mobile phones.
- **In-App Documentation:** A comprehensive documentation overlay is accessible from anywhere in the app via a floating button, explaining the workflow and features.

## Technology Stack

- **Frontend:** React, Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS, CSS Modules
- **API Communication:** Axios with `axios-retry` for robust data fetching.
- **Charts:** Recharts
- **QR Code Scanning:** `html5-qrcode`
- **Notifications:** `react-toastify`
- **PWA & Offline Support:** `vite-plugin-pwa` with custom service worker strategies.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Deepak-0411/Attendance-management-system.git
    cd Attendance-management-system
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev -- --host
    ```
    This will start the application, typically on `http://localhost:5173`. The `--host` flag exposes it to your local network.

## Project Structure

The codebase is organized to maintain a clean and scalable architecture.

```
src/
├── auth/           # Login components for Admin and Faculty
├── components/     # Reusable UI components (Table, Input, Header, etc.)
├── context/        # React Context for global state management
├── layout/         # Main page layouts (AdminLayout, FacultyLayout)
├── pages/          # Top-level components for each route
│   ├── admin/      # Views for the Admin panel
│   └── user/       # Views for the Faculty panel
├── routes/         # Application routing and protected route logic
├── styles/         # Global styles and CSS modules
└── utility/        # Helper functions (API requests, date formatting)
```
