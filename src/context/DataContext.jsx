import { createContext, useContext, useState } from "react";
import { date } from "../utility/GetDate";

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
  const [studentlist, setStudentList] = useState([]);

  //   Date
  const [fromDate, setFromDate] = useState(date);
  const [toDate, setToDate] = useState(date);

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
