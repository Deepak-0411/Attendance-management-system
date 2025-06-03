import ContentBox from "../../layout/ContentBox";
import { useData } from "../../context/DataContext";

const Attendance = () => {
  const {attendanceData, setAttendanceData} = useData();

  const config = {
    title: "Attendance",
    apiGet: "/admin/viewEntries",
    apiFilter: "/admin/formFilterData",
    filterBox: true,
    filterInputs: [],
    searchBoxPlaceholder:"Search by name or ID",
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
