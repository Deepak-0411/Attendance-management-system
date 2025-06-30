import ContentBox from "../../layout/ContentBox";
import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";
import { useEffect, useState } from "react";
import { generateFilterInputs } from "../../utility/generateFilterInputs";

const Attendance = () => {
  const { attendanceData, setAttendanceData } = useData();
  const {
    attendanceFilter,
    setAttendanceFilter,
    getSchoolList,
    getBuildingName,
    getRoomNo,
  } = useFilter();
  const [exportFilter, setExportFilters] = useState({
    school: "",
    building: "",
    roomNo: "",
    shift: "",
  });

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: attendanceFilter.school || "",
      building: attendanceFilter.building || "",
      roomNo: attendanceFilter.roomNo || "",
      shift: attendanceFilter.shift || "",
    }));
  }, [attendanceFilter]);

  const filterInputs = generateFilterInputs({
    fields: ["school", "building", "roomNo", "shift"],
    filterState: attendanceFilter,
    setFilterState: setAttendanceFilter,
    requiredFields: ["school", "building", "roomNo", "shift"],
    getSchoolList,
    getBuildingName,
    getRoomNo,
  });
  const exportInputs = generateFilterInputs({
    fields: ["school", "building", "roomNo", "shift"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
    getSchoolList,
    getBuildingName,
    getRoomNo,
  });

  const config = {
    title: "Attendance",
    apiGet: "/admin/viewEntries",
    apiExport: "",
    filterBox: true,
    dateFilter: true,
    exportInputs: exportInputs,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "rollNo",
    nameKey: "courseCode",
    addText: "+ Add Student",
    formFields: {
      school: { value: "", placeholder: "School Name", role: "text" },
      buildingName: { value: "", placeholder: "Building Name", role: "text" },
      roomNo: { value: "", placeholder: "Room No.", role: "text" },
      shift: { value: "", placeholder: "Shift", role: "text" },
      rollNo: { value: "", placeholder: "Roll No.", role: "text" },
      courseCode: { value: "", placeholder: "Course Code", role: "text" },
      date: { value: "", placeholder: "Date", role: "date" },
    },
    tableHeading: [
      "Date",
      "Shift",
      "Building Name",
      "Room No.",
      "Roll No.",
      "Course Code",
      "Booklet No.",
      "Status",
      "Marked By",
    ],
    tableColumn: [
      "date",
      "shift",
      "buildingName",
      "roomNo",
      "rollNo",
      "courseCode",
      "bookletNumber",
      "status",
      "signature",
    ],
    apiEndPointSingle: "addStudent",
    apiEndPointBulk: "importExcel",
    dataList: attendanceData,
    setDataList: setAttendanceData,
  };

  return <ContentBox {...config} />;
};
export default Attendance;
