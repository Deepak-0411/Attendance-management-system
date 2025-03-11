import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../Auth/AuthContext";
import styles from "../Components/DisplayData.module.css";
import SingleUpload from "../Components/SingleUplaod";

const StudentDetails = () => {
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [rollno , setRollno] = useState("");
  const [refresh, setRefresh] = useState(true);

  const [selectedClass, setSelectedClass] = useState(null);

  const [filterOptions, setFilterOptions] = useState([]);

  const { token } = useAuth();

  const config = {
    student: {
      title: "FORM 1",
      apiGet: "https://gbu-server.vercel.app/api/admin/students",
      apiFilter: "https://gbu-server.vercel.app/api/admin/fillterStudents",
      apiDelete: "https://gbu-server.vercel.app/api/admin/students",
      idKey: "rollNo",
      nameKey: "name",
      addText: "+ upload sitting plan",
      formFields: {
        rollNo: { value: "", placeholder: "Roll No" },
        name: { value: "", placeholder: "Student Name" },
        branch: { value: "", placeholder: "Branch" },
        year: { value: "", placeholder: "Year" },
        programmeName: { value: "", placeholder: "Programme" },
        semester: { value: "", placeholder: "Semester" },
      },
      apiEndPointSingle: "students",
      apiEndPointBulk: "importStudents",
    },
  };

  const {
    title,
    apiGet,
    apiDelete,
    apiFilter,
    idKey,
    nameKey,
    addText,
    formFields,
    apiEndPointSingle,
    apiEndPointBulk,
  } = config["student"];

//   used for get list of rooms
  useEffect(() => {
    const fetchOptions = async () => {
      
      try {
        const response = await fetch(apiFilter, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch filter options");

        const data = await response.json();
        
        setFilterOptions(data);
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to load filter options.");
      }
    };

    fetchOptions();
  }, [token,refresh]);

  // Fetch students based on filters
  useEffect(() => {
    const fetchData = async () => {
      if (!(selectedClass && loadData)) return;
      
      setLoading(true);
      setError(null);

      try {
        // const url = new URL(apiGet);
        // Object.keys(filters).forEach((key) =>
        //   url.searchParams.append(key, filters[key])
        // );

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch student data");
        

        setDataList(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedClass, loadData ,refresh]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value.toLowerCase().trim());
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
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

      if (!response.ok) throw new Error("Failed to delete student.");

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
    console.log(id);
    
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

      {/* Search div */}
      <div className={styles.filterContainer}>
          <select
            className={styles.filterInput}
            value={filterOptions}
            onChange={(e) =>
              setSelectedClass(e.target.value)
            }
          >
            <option value="">{`Select class`}</option>
            {Array.isArray(filterOptions)
              ? filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))
              : ""}
          </select>

        <button
          className={styles.searchButton}
          onClick={() => setLoadData(true)}
          disabled={!selectedClass}
        >
          Search
        </button>
      </div>

      {show && (
        <div className={styles.uploadData}>
          <SingleUpload
            dataToSend={formFields}
            close={() => {
              setShow(false);
              setRefresh((prev)=>!prev);
            }}
            apiEndPointSingle={apiEndPointSingle}
            apiEndPointBulk={apiEndPointBulk}
          />
        </div>
      )}

      {loadData &&
        (loading ? (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.tableBox} id={styles.tableBoxAddon}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th
                    className={`${styles.tableHeading} ${styles.tableLayout1}`}
                  >
                    SR No.
                  </th>
                  <th
                    className={`${styles.tableHeading} ${styles.tableLayout2}`}
                  >
                    Name
                  </th>
                  <th
                    colSpan={2}
                    className={`${styles.tableHeading} ${styles.tableLayout3}`}
                  >
                    Roll no.
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length ? (
                  filteredData.map((item, index) => (
                    <tr key={item[idKey]}>
                      <td className={styles.tableDataLayout1}>{index + 1}</td>
                      <td className={styles.tableDataLayout2}>
                        {item[nameKey]}
                      </td>
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
                    <td colSpan="4">No student found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
};

export default StudentDetails;
