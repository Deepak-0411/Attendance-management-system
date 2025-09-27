import { createContext, useContext, useState } from "react";
import { date } from "../utility/GetDate";
import { apiRequest } from "../utility/apiRequest";
import { toast } from "react-toastify";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Admin states
  const [homeData, setHomeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [courceDetailsData, setCourceDetailsData] = useState([]);
  const [examDutyData, setExamDutyData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [studentDetailsData, setStudentDetailsData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);

  // Faculty states
  const [facultyName, setFacultyName] = useState([]);
  const [facultyDuty, setFacultyDuty] = useState([]);
  const [studentlist, setStudentList] = useState([]);

  // Date states
  const [fromDate, setFromDate] = useState(date);
  const [toDate, setToDate] = useState(date);

  // Overlay skipped data
  const [skippedData, setSkippedData] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overylayParent, setOverlayParent] = useState(null);

  const showSkippedData = (data, parent) => {
    setSkippedData(data);
    setShowOverlay(true);
    setOverlayParent(parent);
  };

  const hideSkippedData = () => {
    setShowOverlay(false);
    setSkippedData(null);
    setOverlayParent(null);
  };

  // Utility functions
  const dataReset = (naam = "all") => {
    if (naam === "all") {
      setHomeData([]);
      setAttendanceData([]);
      setCourceDetailsData([]);
      setExamDutyData([]);
      setFacultyData([]);
      setStudentDetailsData([]);
      setRoomsData([]);
      setStudentList([]);
      setFacultyDuty([]);
      setFacultyName([]);
    } else {
      naam([]);
    }
  };

  const getFacultyInfo = async (setLoading = () => {}, setError = () => {}) => {
    await apiRequest({
      url: "/api/invigilator/preview",
      method: "GET",
      setLoading,
      setError,
      onSuccess: (response) => {
        setFacultyName(response.data.faculty || []);
        setFacultyDuty(response.data.entries || []);
      },
      onFailure: (response) => {
        console.error("Error:", response.message);
        toast.error(`Failed to load faculty info.`);
      },
    });
  };

  const fetchStudents = async (selectedShift, setLoading, setError) => {
    if (!selectedShift) return;
    await apiRequest({
      url: `/api/invigilator/studentList?shift=${selectedShift}`,
      method: "GET",
      setLoading,
      setError,
      onSuccess: (response) => {
        if (Array.isArray(response.data?.students)) {
          setStudentList(response.data.students);
        }
      },
      onFailure: (response) => {
        setError("Failed to load students data.");
        toast.error("Failed to load students data.");
      },
    });
  };

  return (
    <DataContext.Provider
      value={{
        // Admin data
        homeData,
        attendanceData,
        courceDetailsData,
        examDutyData,
        facultyData,
        studentDetailsData,
        roomsData,

        // Faculty data
        facultyName,
        facultyDuty,
        studentlist,

        // Dates
        fromDate,
        toDate,

        // Setters
        // admin
        setHomeData,
        setAttendanceData,
        setCourceDetailsData,
        setExamDutyData,
        setFacultyData,
        setStudentDetailsData,
        setRoomsData,
        // faculty
        setFacultyName,
        setFacultyDuty,
        setStudentList,

        setFromDate,
        setToDate,

        // Utilities
        dataReset,
        getFacultyInfo,
        fetchStudents,

        // skipped data overlay
        skippedData,
        showOverlay,
        overylayParent,
        showSkippedData,
        hideSkippedData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
