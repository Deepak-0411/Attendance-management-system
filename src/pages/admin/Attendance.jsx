import ContentBox from "../../layout/ContentBox";
import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";

const Attendance = () => {
  const { attendanceData, setAttendanceData } = useData();
  const {
    attendanceFilter,
    setAttendanceFilter,
    getSchoolList,
    getBuildingName,
    getRoomNo,
  } = useFilter();

  const filterInputs = [
  {
    label: "School",
    name: "school",
    value: attendanceFilter.school,
    options: getSchoolList(),
    required: true,
    onChange: (val) =>
      setAttendanceFilter((prev) => ({ ...prev, school: val })),
  },
  {
    label: "Building",
    name: "building",
    value: attendanceFilter.building,
    options: getBuildingName(attendanceFilter.school),
    required: true,
    onChange: (val) =>
      setAttendanceFilter((prev) => ({ ...prev, building: val })),
  },
  {
    label: "Room No.",
    name: "roomNo",
    value: attendanceFilter.roomNo,
    options: getRoomNo(attendanceFilter.school, attendanceFilter.building),
    required: true,
    onChange: (val) =>
      setAttendanceFilter((prev) => ({ ...prev, roomNo: val })),
  },
  {
    label: "Shift",
    name: "shift",
    value: attendanceFilter.shift,
    options: ["Morning", "Evening"],
    required: true,
    onChange: (val) =>
      setAttendanceFilter((prev) => ({ ...prev, shift: val })),
  },
];


  const config = {
    title: "Attendance",
    apiGet: "/admin/viewEntries",
    apiFilter: "/admin/formFilterData",
    filterBox: true,
    dateFilter : true,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "rollNo",
    nameKey: "courseCode",
    addText: "+ Add Student",
    formFields: {
      buildingName: { value: "", placeholder: "Building Name" },
      roomNo: { value: "", placeholder: "Room No." },
      shift: { value: "", placeholder: "Shift" },
      rollNo: { value: "", placeholder: "Roll No." },
      courseCode: { value: "", placeholder: "Course Code" },
      date: { value: "", placeholder: "Date" },
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
