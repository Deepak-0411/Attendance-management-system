import { createContext, useContext, useState } from "react";
import { date } from "../utility/GetDate";
import { apiRequest } from "../utility/apiRequest";
import { toast } from "react-toastify";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  // Filters
  const [homeFilter, setHomeFilter] = useState({
    school: "",
    branch: "",
    shift: "",
    fromDate: date,
    toDate: date,
  });
  const [attendanceFilter, setAttendanceFilter] = useState({
    school: "",
    building: "",
    roomNo: "",
    shift: "",
    fromDate: date,
    toDate: date,
  });
  const [examDutyFilter, setExamDutyFilter] = useState({
    school: "",
    building: "",
    roomNo: "",
    shift: "",
    fromDate: date,
    toDate: date,
  });
  const [roomsFilter, setRoomsFilter] = useState({ school: "" });
  const [facultyFilter, setFacultyFilter] = useState({
    school: "",
    // branch: "",
  });
  const [studentDetailsFilter, setStudentDetailsFilter] = useState({
    school: "",
    branch: "",
    year: "",
    programme: "",
  });
  const [courseDetailsFilter, setCourseDetailsFilter] = useState({
    school: "",
    programme: "",
    branch: "",
  });

  // Metadata
  const [schoolFilterData, setSchoolFilterData] = useState({});

  const [roomFilterData, setRoomFilterData] = useState({});

  // Utilities (Fixed logic here)
  const getSchoolList = () => {
    // console.log("GetSchool is called");
    return Object.keys(schoolFilterData);
  };

  const getProgrammeList = (schoolName) => {
    return schoolFilterData[schoolName]
      ? Object.keys(schoolFilterData[schoolName])
      : [];
  };

  const getBranchList = (schoolName, programme) => {
    // console.log("GetBranch is called");
    return schoolFilterData[schoolName]?.[programme]
      ? schoolFilterData[schoolName]?.[programme]
      : [];
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
      url: "/api/data/school-filter",
    },
    {
      setDataList: setRoomFilterData,
      key: "Rooms data",
      url: "/api/data/room-filter",
    },
  ];

  const loadFilterOptions = async () => {
    for (const api of adminAPIs) {
      await apiRequest({
        url: api.url,
        method: "GET",
        onSuccess: (response) => {
          api.setDataList(response.data);
        },
        onFailure: (response) => {
          console.error("Error:", response.message);
          toast.error(`Error: Failed to get ${api.key}`);
        },
      });
    }
  };

  const isFiltersEmpty = () => {
    return (
      Object.keys(schoolFilterData).length === 0 ||
      Object.keys(roomFilterData).length === 0
    );
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
        getProgrammeList,
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
