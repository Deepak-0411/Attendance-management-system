import { createContext, useContext, useState } from "react";
import apiRequest from "../utility/apiRequest";
import { toast } from "react-toastify";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  // Filters
  const [homeFilter, setHomeFilter] = useState({
    school: "",
    branch: "",
    shift: "",
  });
  const [attendanceFilter, setAttendanceFilter] = useState({
    school: "",
    building: "",
    roomNo: "",
    shift: "",
  });
  const [examDutyFilter, setExamDutyFilter] = useState({
    school: "",
    building: "",
    roomNo: "",
    shift: "",
  });
  const [roomsFilter, setRoomsFilter] = useState({ school: "" });
  const [facultyFilter, setFacultyFilter] = useState({
    school: "",
    branch: "",
  });
  const [studentDetailsFilter, setStudentDetailsFilter] = useState({
    school: "",
    branch: "",
    year: "",
  });
  const [courseDetailsFilter, setCourseDetailsFilter] = useState({
    school: "",
    branch: "",
  });

  // Metadata
  const [schoolFilterData, setSchoolFilterData] = useState({
    Engineering: ["Computer Science", "Electronics", "Mechanical"],
    Pharmacy: ["Bachelor of Pharmacy", "Diploma in Pharmacy"],
    Management: [
      "Masters of Business Administration",
      "Bachelor of Business Administration",
    ],
  });

  const [roomFilterData, setRoomFilterData] = useState({
    Engineering: {
      "Block A": ["101", "102", "103"],
      "Block B": ["201", "202"],
    },
    Pharmacy: {
      "Pharma Block": ["P1", "P2"],
    },
    Management: {
      "MG Block": ["M101", "M102"],
    },
  });

  // Utilities (Fixed logic here)
  const getSchoolList = () => {
    // console.log("GetSchool is called");
    return Object.keys(schoolFilterData);
  };

  const getBranchList = (schoolName) => {
    // console.log("GetBranch is called");
    return schoolFilterData[schoolName] ? schoolFilterData[schoolName] : [];
  };

  const getBuildingName = (schoolName) => {
    // console.log("GetBuilding is called");
    return roomFilterData[schoolName]
      ? Object.keys(roomFilterData[schoolName])
      : [];
  };

  const getRoomNo = (schoolName, buildingName) => {
    // console.log("GetRoom is called");
    return roomFilterData[schoolName]?.[buildingName] ?? [];
  };

  const adminAPIs = [
    {
      setDataList: setSchoolFilterData,
      key: "Schools data",
      url: "",
    },
    {
      setDataList: setRoomFilterData,
      key: "Rooms data",
      url: "",
    },
  ];

  const loadFilterOptions = async (authToken) => {
    for (const api of adminAPIs) {
      const response = await apiRequest({
        url: api.url,
        method: "GET",
        token: authToken,
      });

      if (response.status === "success") {
        setDataList(response.data);
      } else {
        console.error("Error:", response.message);
        toast.error(`Error: Failed to ${api.key}`);
      }
    }
  };

  const isFiltersEmpty = () => {
    return schoolFilterData.lenght === 0 || roomFilterData.lenght === 0;
  };

  return (
    <FilterContext.Provider
      value={{
        // Filters
        homeFilter,
        setHomeFilter,
        attendanceFilter,
        setAttendanceFilter,
        examDutyFilter,
        setExamDutyFilter,
        roomsFilter,
        setRoomsFilter,
        facultyFilter,
        setFacultyFilter,
        studentDetailsFilter,
        setStudentDetailsFilter,
        courseDetailsFilter,
        setCourseDetailsFilter,

        // Metadata
        schoolFilterData,
        setSchoolFilterData,
        roomFilterData,
        setRoomFilterData,

        // Utility functions
        getSchoolList,
        getBranchList,
        getBuildingName,
        getRoomNo,
        loadFilterOptions,
        isFiltersEmpty,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
