import { useState } from "react";
import styles from "./Docs.module.css";
import { Link } from "react-router-dom";

const credentials = {
  admin: {
    email: "admin@college.edu",
    password: "Admin@1234",
    loginPath: "/admin/login",
    dashboardPath: "/admin/home",
  },
  faculty: {
    email: "faculty@college.edu",
    password: "Faculty@1234",
    loginPath: "/faculty/login",
    dashboardPath: "/faculty/displayDuty",
  },
};

const flowSteps = [
  {
    step: "01",
    actor: "Admin",
    title: "Set Up the System",
    description:
      "Admin logs in and configures the system from scratch. This includes adding courses, exam rooms, students, and faculty members. Data can be entered manually or uploaded in bulk via CSV or Excel sheets.",
  },
  {
    step: "02",
    actor: "Admin",
    title: "Assign Duties & Seating",
    description:
      "Admin assigns faculty members as examiners to specific rooms and time slots, following the timetable. Students are allocated to rooms with seating plans, either manually or via sheet uploads.",
  },
  {
    step: "03",
    actor: "Faculty",
    title: "Log In and View Duties",
    description:
      "The faculty member (examiner) logs in and sees their assigned duties for the day — which room they are invigilating and when.",
  },
  {
    step: "04",
    actor: "Faculty",
    title: "Mark Attendance",
    description:
      "The examiner opens their assigned session. A list of students in the room appears. Each student's sheet has a QR code or barcode — scanning it instantly marks them as present. Alternatively, attendance can be toggled manually. Students can also be marked as UFM (Unfair Means).",
  },
  {
    step: "05",
    actor: "Admin",
    title: "Review Reports",
    description:
      "Admin reviews attendance across all sessions. Reports can be filtered by student, date, or session, and exported for official use.",
  },
];

const adminRoutes = [
  { label: "Dashboard", path: "/admin/home" },
  { label: "Attendance Records", path: "/admin/attendance" },
  { label: "Exam Duty", path: "/admin/examDuty" },
  { label: "Rooms", path: "/admin/rooms" },
  { label: "Faculty", path: "/admin/faculty" },
  { label: "Students", path: "/admin/students" },
  { label: "Course Details", path: "/admin/course-details" },
];

const facultyRoutes = [
  { label: "My Duties", path: "/faculty/displayDuty" },
  { label: "Students List", path: "/faculty/students" },
  { label: "Mark Attendance", path: "/faculty/markAttendance" },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className={styles.copyBtn}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CredentialCard({ role, data }) {
  return (
    <div className={styles.credCard}>
      <div className={styles.credHeader}>
        <span className={styles.credRole}>{role}</span>
        <Link to={data.loginPath} className={styles.credLoginLink}>
          Go to Login
        </Link>
      </div>
      <div className={styles.credRow}>
        <span className={styles.credLabel}>Email</span>
        <span className={styles.credValue}>{data.email}</span>
        <CopyButton text={data.email} />
      </div>
      <div className={styles.credRow}>
        <span className={styles.credLabel}>Password</span>
        <span className={styles.credValue}>{data.password}</span>
        <CopyButton text={data.password} />
      </div>
      <Link to={data.dashboardPath} className={styles.credDashLink}>
        Open Dashboard
      </Link>
    </div>
  );
}

export default function Docs() {
  return (
    <div className={styles.main}>
      <div className={styles.scrollContainer}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <p className={styles.tag}>Documentation</p>
            <h1 className={styles.title}>Attendance Management System</h1>
            <p className={styles.subtitle}>
              A centralized platform for managing exam attendance in educational
              institutions. This page walks you through what the system does,
              how it works, and how to explore it.
            </p>
          </div>

          <div className={styles.divider} />

          {/* Quick Access */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Access</h2>
            <p className={styles.sectionDesc}>
              Use the credentials below to log in and explore each role. Both
              accounts are pre-configured with sample data.
            </p>
            <div className={styles.credGrid}>
              <CredentialCard role="Admin" data={credentials.admin} />
              <CredentialCard role="Faculty" data={credentials.faculty} />
            </div>
          </section>

          <div className={styles.divider} />

          {/* About */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About the System</h2>
            <p className={styles.bodyText}>
              This system is built to digitize exam attendance in colleges. The
              traditional process of paper registers, manual tallying, and
              scattered spreadsheets is replaced with a structured, role-based
              platform.
            </p>
            <p className={styles.bodyText}>
              There are two types of users — an <strong>Admin</strong> who
              controls everything, and <strong>Faculty</strong> members who log
              in on exam day to mark attendance. Students are not users of the
              system; they are managed as data by the admin.
            </p>
            <div className={styles.roleGrid}>
              <div className={styles.roleCard}>
                <div className={styles.roleCardLabel}>Admin</div>
                <p className={styles.roleCardText}>
                  Full control over the system. Manages courses, rooms,
                  students, and faculty. Assigns seating and exam duties. Views
                  and exports reports.
                </p>
              </div>
              <div className={styles.roleCard}>
                <div className={styles.roleCardLabel}>Faculty</div>
                <p className={styles.roleCardText}>
                  Logs in on exam day to view assigned duties. Opens the room
                  session and marks student attendance by scanning QR codes or
                  toggling manually.
                </p>
              </div>
            </div>
          </section>

          <div className={styles.divider} />

          {/* How It Works */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionDesc}>
              The system follows a structured workflow from setup to reporting.
            </p>
            <div className={styles.flowList}>
              {flowSteps.map((step) => (
                <div key={step.step} className={styles.flowItem}>
                  <div className={styles.flowLeft}>
                    <span className={styles.flowStep}>{step.step}</span>
                    <span
                      style={{
                        background:
                          step.actor === "Admin" ? "#dbeafe" : "#dcfce7",
                        color: step.actor === "Admin" ? "#1d4ed8" : "#15803d",
                      }}
                      className={styles.flowActor}
                    >
                      {step.actor}
                    </span>
                  </div>
                  <div className={styles.flowRight}>
                    <div className={styles.flowTitle}>{step.title}</div>
                    <div className={styles.flowDesc}>{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.divider} />

          {/* Attendance Methods */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Attendance Methods</h2>
            <div className={styles.methodGrid}>
              <div className={styles.methodCard}>
                <div className={styles.methodName}>QR Code Scanning</div>
                <p className={styles.methodDesc}>
                  Every student's exam sheet has a QR code or barcode. The
                  faculty member uses the app's scanner to read it. The student
                  is immediately marked present in the system.
                </p>
              </div>
              <div className={styles.methodCard}>
                <div className={styles.methodName}>Manual Entry</div>
                <p className={styles.methodDesc}>
                  If a student's code cannot be scanned, the examiner can
                  manually toggle their status. Students can be marked as
                  Present, Absent, or UFM (Unfair Means).
                </p>
              </div>
            </div>
          </section>

          <div className={styles.divider} />

          {/* Routes Reference */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pages and Routes</h2>
            <p className={styles.sectionDesc}>
              Below is a reference of all accessible pages in the application.
            </p>
            <div className={styles.routesGrid}>
              <div>
                <div className={styles.routeGroupLabel}>Admin</div>
                <div className={styles.routeList}>
                  {adminRoutes.map((r) => (
                    <Link key={r.path} to={r.path} className={styles.routeItem}>
                      <span className={styles.routeLabel}>{r.label}</span>
                      <span className={styles.routePath}>{r.path}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <div className={styles.routeGroupLabel}>Faculty</div>
                <div className={styles.routeList}>
                  {facultyRoutes.map((r) => (
                    <Link key={r.path} to={r.path} className={styles.routeItem}>
                      <span className={styles.routeLabel}>{r.label}</span>
                      <span className={styles.routePath}>{r.path}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className={styles.divider} />

          {/* Footer note */}
          <div className={styles.footer}>
            <p className={styles.footerText}>
              Built by{" "}
              <a
                href="https://github.com/Deepak-0411"
                className={styles.footerLink}
                target="_blank"
                rel="noreferrer"
              >
                Deepak-0411
              </a>
              . Source on{" "}
              <a
                href="https://github.com/Deepak-0411/Attendance-management-system"
                className={styles.footerLink}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
