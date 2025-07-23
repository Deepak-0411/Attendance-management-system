import ContentBox from "../../layout/ContentBox";
import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";
import { useEffect, useState } from "react";
import { generateFilterInputs } from "../../utility/generateFilterInputs";

const Attendance = () => {
  const {
    attendanceData,
    setAttendanceData,
    fromDate: dataFromDate,
    toDate: dataToDate,
  } = useData();
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
  const { school, building, roomNo, shift, fromDate, toDate } =
    attendanceFilter;

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: school || "",
      building: building || "",
      roomNo: roomNo || "",
      shift: shift || "",
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

  const dateFilterContext = {
    fromDate: fromDate,
    toDate: toDate,
    setFromDate: (val) =>
      setAttendanceFilter((prev) => ({
        ...prev,
        fromDate: val,
      })),
    setToDate: (val) =>
      setAttendanceFilter((prev) => ({
        ...prev,
        toDate: val,
      })),
  };

  const config = {
    title: "Attendance",
    apiGet: `/admin/formEntries?fromDate=${fromDate}&toDate=${toDate}&school=${school}&buildingName=${building}&roomNo=${roomNo}&shift=${shift}`,
    apiExport: `/admin/attendance/export?fromDate=${dataFromDate}&toDate=${dataToDate}&school=${exportFilter.school}&buildingName=${exportFilter.building}&roomNo=${exportFilter.roomNo}&shift=${exportFilter.shift}`,
    apiEndPointSingle: "/admin/addStudent",
    apiEndPointBulk: "/admin/uploadExcel",
    filterBox: true,
    dateFilter: true,
    dateFilterContext,
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
    dataList: attendanceData,
    setDataList: setAttendanceData,
  };

  return <ContentBox {...config} />;
};
export default Attendance;
