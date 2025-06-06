import { createContext, useContext, useState } from "react";
import { date } from "../utility/GetDate";
import apiRequest from "../utility/apiRequest";
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
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedRoomNo, setSelectedRoomNo] = useState("");
  const [studentlist, setStudentList] = useState([
    // { id: 1, name: "Alice Johnson", present: false },
    // { id: 2, name: "Bob Smith", present: false },
    // { id: 3, name: "Charlie Kim", present: false },
    // { id: 4, name: "Dana Lee", present: false },
    // { id: 5, name: "Eli Martinez", present: false },
  ]);
  const [currentIdx, setCurrentIdx] = useState();

  // Date states
  const [fromDate, setFromDate] = useState(date);
  const [toDate, setToDate] = useState(date);

  // Utility functions
  const dataReset = (naam) => {
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
      setSelectedShift("");
      setSelectedBuilding("");
      setSelectedRoomNo("");
      setCurrentIdx("");
    } else {
      naam([]);
    }
  };

  const getFacultyInfo = async (
    authtoken,
    setLoading = () => {},
    setError = () => {}
  ) => {
    const response = await apiRequest({
      url: "/faculty/preview",
      method: "GET",
      token: authtoken,
      setLoading,
      setError,
    });

    if (response.status === "success") {
      setFacultyName(response.data.faculty || []);
      setFacultyDuty(response.data.viewDuty || []);
    } else {
      console.error("Error:", response.message);
      toast.error(`Failed to load faculty info.`);
    }
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
        selectedShift,
        selectedBuilding,
        selectedRoomNo,
        studentlist,
        currentIdx,

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
        setSelectedShift,
        setSelectedBuilding,
        setSelectedRoomNo,
        setStudentList,
        setCurrentIdx,

        setFromDate,
        setToDate,

        // Utilities
        dataReset,
        getFacultyInfo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
