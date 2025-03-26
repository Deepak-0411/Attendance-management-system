import { useEffect, useState, useCallback } from "react";
import Header from "../Components/Header";
import Table from "../Components/Table";
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
  const [refresh, setRefresh] = useState(true);


  // Filter states
  const [filters, setFilters] = useState({
    year: "",
    programme: "",
    branch: "",
  });
  const { year, programme, branch } = filters;

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    year: [],
    programme: [],
    branch: [],
  });

  const { token } = useAuth();

  const config = {
    student: {
      title: "Students",
      apiGet: "https://gbu-server.vercel.app/api/admin/students",
      apiFilter: "https://gbu-server.vercel.app/api/admin/fillterStudents",
      apiDelete: "https://gbu-server.vercel.app/api/admin/students",
      idKey: "rollNo",
      nameKey: "name",
      addText: "+ Add Student",
      formFields: {
        rollNo: { value: "", placeholder: "Roll No" },
        name: { value: "", placeholder: "Student Name" },
        branch: { value: "", placeholder: "Branch" },
        year: { value: "", placeholder: "Year" },
        programmeName: { value: "", placeholder: "Programme" },
        semester: { value: "", placeholder: "Semester" },
      },
      tableHeading: ["Name", "Roll no."],
      tableData: ["name", "rollNo"],
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
    tableHeading,
    tableData,
    apiEndPointSingle,
    apiEndPointBulk,
  } = config["student"];

  // Fetch filter options (Year, Programme, Branch)
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

        setFilterOptions({
          year: data.years || [],
          programme: data.programmeNames || [],
          branch: data.branches || [],
        });
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to load filter options.");
      }
    };

    fetchOptions();
  }, [token, refresh]);

  // Fetch students based on filters
  useEffect(() => {
    const fetchData = async () => {
      if (!(year && programme && branch && loadData)) return;

      setLoading(true);
      setError(null);

      try {
        const url = new URL(apiGet);
        Object.keys(filters).forEach((key) =>
          url.searchParams.append(key, filters[key])
        );

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
  }, [refresh]);

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

    return name.includes(searchTerm) || id.includes(searchTerm);
  });

  return (
    <div className={`${styles.container} container`}>
      <Header
        title={title}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        setShow={() => setShow(true)}
        addText={addText}
      />

      {/* Filters */}
      <div className={`${styles.filterContainer} filterContainer`}>
        <div className={styles.containerInside}>
        {["year", "programme", "branch"].map((filter) => (
          <select
            key={filter}
            className={styles.filterInput}
            value={filters[filter]}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [filter]: e.target.value }))
            }
          >
            <option value="">{`Select ${
              filter.charAt(0).toUpperCase() + filter.slice(1)
            }`}</option>
            {Array.isArray(filterOptions[filter])
              ? filterOptions[filter].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))
              : null}
          </select>
        ))}

        <button
          className={styles.searchButton}
          onClick={() => {setLoadData(true); setRefresh((prev) => !prev);}}
          disabled={!(year && programme && branch)}
        >
          Search
        </button>
        </div>
      </div>

      {show && (
        <div className={styles.uploadData}>
          <SingleUpload
            dataToSend={formFields}
            close={() => {
              setShow(false);
              setRefresh((prev) => !prev);
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
          <Table
          tableHeading={tableHeading}
          filteredData={filteredData}
          idKey={idKey}
          tableData={tableData}
          isDeleting={isDeleting}
          deleteData={() => handleDelete(item[idKey])}
        />
        ))}
    </div>
  );
};

export default StudentDetails;
