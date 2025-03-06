import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import styles from "./DisplayData.module.css";
import SingleUpload from "./SingleUplaod";

const DisplayData = ({ type }) => {
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { token } = useAuth();

  const config = {
    course: {
      title: "Courses",
      apiGet: "https://gbu-server.vercel.app/api/admin/courses",
      apiDelete: "https://gbu-server.vercel.app/api/admin/courses",
      idKey: "courseCode",
      nameKey: "courseName",
      addText: "+ Add Course",
      formFields: {
        courseName: { value: "", placeholder: "Course Name" },
        courseCode: { value: "", placeholder: "Course Code" },
      },
      apiEndPointSingle: "courses",
      apiEndPointBulk: "importCourses",
    },
    faculty: {
      title: "Faculty Available",
      apiGet: "https://gbu-server.vercel.app/api/admin/faculty",
      apiDelete: "https://gbu-server.vercel.app/api/admin/faculty",
      idKey: "teacherId",
      nameKey: "fName",
      addText: "+ Add Faculty",
      formFields: {
        fName: { value: "", placeholder: "Name" },
        teacherId: { value: "", placeholder: "Teacher ID" },
        username: { value: "", placeholder: "Username" },
        password: { value: "", placeholder: "Password" },
      },
      apiEndPointSingle: "faculty",
      apiEndPointBulk: "faculty/import",
    },
  };

  const {
    title,
    apiGet,
    apiDelete,
    idKey,
    nameKey,
    addText,
    formFields,
    apiEndPointSingle,
    apiEndPointBulk,
  } = config[type];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiGet, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok)
          throw new Error(
            `Error ${response.status}: Failed to fetch ${type} data`
          );

        setDataList(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiGet, token, refreshTrigger]);

  const handleSearch = (e) =>
    setSearchTerm(e.target.value.toLowerCase().trim());

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    setIsDeleting(true);
    try {
      const response = await fetch(apiDelete, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [idKey]: id }),
      });

      if (!response.ok) throw new Error(`Failed to delete ${type}.`);

      setDataList((prev) => prev.filter((item) => item[idKey] !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredData = dataList.filter((item) => {
    const name = item[nameKey]?.toLowerCase() || "";
    const id = item[idKey]?.toString().toLowerCase() || "";
    return name.includes(searchTerm) || id.includes(searchTerm);
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>{title}</p>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <button className={styles.addButton} onClick={() => setShow(true)}>
            {addText}
          </button>
        </div>
      </div>

      {show && (
        <div className={styles.uploadData}>
          <SingleUpload
            dataToSend={formFields}
            close={() => {
              setShow(false);
              setRefreshTrigger((prev) => !prev);
            }}
            apiEndPointSingle={apiEndPointSingle}
            apiEndPointBulk={apiEndPointBulk}
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
                <th className={`${styles.tableHeading} ${styles.tableLayout1}`}>
                  SR No.
                </th>
                <th className={`${styles.tableHeading} ${styles.tableLayout2}`}>
                  {type === "faculty" ? "Name" : "Course Name"}
                </th>
                <th
                  colSpan={2}
                  className={`${styles.tableHeading} ${styles.tableLayout3}`}
                >
                  {type === "faculty" ? "Faculty ID" : "Course Code"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item[idKey]}>
                    <td className={styles.tableDataLayout1}>{index + 1}</td>
                    <td className={styles.tableDataLayout2}>{item[nameKey]}</td>
                    <td className={styles.tableDataLayout3}>{item[idKey]}</td>
                    <td className={styles.tableDataLayout4}>
                      <button
                        disabled={isDeleting}
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(item[idKey])}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            width="24"
                            height="24"
                            rx="3"
                            fill={isDeleting ? "#919191" : "#F04343"}
                          />
                          <path
                            d="M7.71429 17.5556C7.71429 18.35 8.35714 19 9.14286 19H14.8571C15.6429 19 16.2857 18.35 16.2857 17.5556V8.88889H7.71429V17.5556ZM17 6.72222H14.5L13.7857 6H10.2143L9.5 6.72222H7V8.16667H17V6.72222Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    No {type} found.
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

export default DisplayData;
