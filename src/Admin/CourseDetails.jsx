import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import styles from "./Faculty.module.css";
import SingleUplaod from "./SingleUplaod";

const CourseDetails = () => {
  const [courseList, setCourseList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(
          "https://gbu-server.vercel.app/api/admin/courses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: Failed to fetch course data`
          );
        }

        const data = await response.json();
        setCourseList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [token, refreshTrigger]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase().trim());
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    console.log("id : " + id);

    try {
      const response = await fetch(
        `https://gbu-server.vercel.app/api/admin/courses`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseCode: id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete course.");
      }

      setCourseList((prev) =>
        prev.filter((course) => course.courseCode !== id)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredCourse = courseList.filter((course) => {
    const name = course.courseName?.toLowerCase() || "";
    const code = String(course.courseCode || "");
    return name.includes(searchTerm) || code.includes(searchTerm);
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>Course Available</p>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <button className={styles.addButton} onClick={() => setShow(true)}>
            + Add Course
          </button>
        </div>
      </div>
      {show && (
        <div className={styles.uploadData}>
          <SingleUplaod
            dataToSend={{
              courseName: { value: "", placeholder: "Course Name" },
              courseCode: { value: "", placeholder: "Course Code" },
            }}
            close={() => {
              setShow(false);
              setRefreshTrigger((prev) => !prev);
            }}
            apiEndPointSingle="courses"
            apiEndPointBulk="importCourses"
          />
        </div>
      )}
      {loading ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.tableBox}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeading}>SR No.</th>
                <th className={styles.tableHeading}>Course Name</th>
                <th colSpan={2} className={styles.tableHeading}>
                  Course Code
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCourse.length > 0 ? (
                filteredCourse.map((course, index) => (
                  <tr key={course.courseCode}>
                    <td>{index + 1}</td>
                    <td>{course.courseName}</td>
                    <td>{course.courseCode}</td>
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(course.courseCode)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
