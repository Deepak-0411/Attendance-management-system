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
  // const [selectedShift, setSelectedShift] = useState("1");
  // const [selectedBuilding, setSelectedBuilding] = useState("IL");
  // const [selectedRoomNo, setSelectedRoomNo] = useState("101");
  const [studentlist, setStudentList] = useState([
    {rollNo : "235UCS050", name:"Deepak",status:"Present"},
    {rollNo : "235UCS060", name:"Jai",status:""},
    {rollNo : "235UCS058", name:"Harsh",status:"Absent"},
    {rollNo : "235UCS024", name:"Ankit",status:"absent"},
    {rollNo : "235UCS026", name:"Ansh",status:"present"},
    {rollNo : "235UCS015", name:"Aman",status:"UFM"},
    {rollNo : "235UCS016", name:"Solanki",status:"ufm"},
  ]);
  const [currentIdx, setCurrentIdx] = useState(1);

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
      // facultyname [0] id[1]
      setFacultyName(response.data.faculty || []);
      setFacultyDuty(response.data.viewDuty || []);
    } else {
      console.error("Error:", response.message);
      toast.error(`Failed to load faculty info.`);
    }
  };

    const fetchStudents = async (selectedShift,token,setLoading,setError) => {
    const response = await apiRequest({
      url: `/faculty/studentList?shift=${selectedShift}`,
      method: "GET",
      token,
      setLoading,
      setError,
    });

    if (
      response?.status === "success" &&
      Array.isArray(response.data?.students)
    ) {
      setStudentList(response.data.students);
    } else {
      setError("Failed to load students data.");
      toast.error("Failed to load students data.");
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
        // selectedShift,
        // selectedBuilding,
        // selectedRoomNo,
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
        // setSelectedShift,
        // setSelectedBuilding,
        // setSelectedRoomNo,
        setStudentList,
        setCurrentIdx,

        setFromDate,
        setToDate,

        // Utilities
        dataReset,
        getFacultyInfo,
        fetchStudents,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
