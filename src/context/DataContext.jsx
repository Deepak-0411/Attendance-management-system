import { createContext, useContext, useState } from "react";
import { date } from "../utility/GetDate";
import apiRequest from "../utility/apiRequest";
import { toast } from "react-toastify";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // for Admim
  const [homeData, setHomeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [courceDetailsData, setCourceDetailsData] = useState([]);
  const [examDutyData, setExamDutyData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [studentDetailsData, setStudentDetailsData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);

  //   for Faculty
  const [facultyName, setFacultyName] = useState([]);
  const [facultyDuty, setFacultyDuty] = useState([]);
  const [studentlist, setStudentList] = useState([]);

  //   Date
  const [fromDate, setFromDate] = useState(date);
  const [toDate, setToDate] = useState(date);

  // utility functions
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
    } else {
      naam([]);
    }
  };
  const getFacultyInfo = async (authtoken, setLoading = () => {}) => {
    const response = await apiRequest({
      url: "/faculty/preview",
      method: "GET",
      token: authtoken,
      setLoading,
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
        homeData,
        attendanceData,
        courceDetailsData,
        examDutyData,
        facultyData,
        studentDetailsData,
        roomsData,
        studentlist,
        fromDate,
        toDate,
        facultyName,
        facultyDuty,
        setFacultyDuty,
        setFacultyName,
        setHomeData,
        setAttendanceData,
        setCourceDetailsData,
        setExamDutyData,
        setFacultyData,
        setStudentDetailsData,
        setRoomsData,
        setStudentList,
        setFromDate,
        setToDate,
        dataReset,
        getFacultyInfo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
