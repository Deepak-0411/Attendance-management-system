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
    apiGet: `/api/form/view?fromDate=${fromDate}&toDate=${toDate}&schoolName=${school}&buildingName=${building}&roomNo=${roomNo}&shift=${shift}`,
    apiExport: `/api/form/export?fromDate=${dataFromDate}&toDate=${dataToDate}&schoolName=${exportFilter.school}&buildingName=${exportFilter.building}&roomNo=${exportFilter.roomNo}&shift=${exportFilter.shift}`,
    apiEndPointSingle: "/api/form/allocate",
    apiEndPointBulk: "/api/form/allocate",
    filterBox: true,
    dateFilter: true,
    exportFileName: "form-1",
    dateFilterContext,
    exportInputs: exportInputs,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "rollNo",
    nameKey: "courseCode",
    addText: "+ Add Student",
    formFields: {
      schoolName: {
        value: "",
        placeholder: "School Name",
        role: "select",
        options: () => getSchoolList(),
      },
      buildingName: {
        value: "",
        placeholder: "Building Name",
        role: "select",
        options: (formData) => getBuildingName(formData.schoolName),
      },
      roomNo: {
        value: "",
        placeholder: "Room No.",
        role: "select",
        options: (formData) =>
          getRoomNo(formData.schoolName, formData.buildingName),
      },
      shift: {
        value: "",
        placeholder: "Shift",
        role: "select",
        options: () => [1, 2],
      },
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
