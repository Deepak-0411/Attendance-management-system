import { useData } from "../../context/DataContext";
import ContentBox from "../../layout/ContentBox";

const StudentDetails = () => {

  const {studentDetailsData, setStudentDetailsData} = useData();

  const config = {
    title: "Students",
    apiGet: "/admin/students",
    apiFilter: "/admin/fillterStudents",
    filterBox: true,
    filterInputs: [],
    searchBoxPlaceholder:"Search by name or ID",
    idKey: "rollNo",
    nameKey: "name",
    addText: "+ Add Student",
    formFields: {
      rollNo: { value: "", placeholder: "Roll No" },
      name: { value: "", placeholder: "Student Name" },
      branch: { value: "", placeholder: "Branch" },
      year: { value: "", placeholder: "Year" },
      programmeName: { value: "", placeholder: "Programme" },
      semester: { value: "", placeholder: "Semester" },
    },
    tableHeading: ["Name", "Roll no."],
    tableColumn: ["name", "rollNo"],
    apiEndPointSingle: "students",
    apiEndPointBulk: "importStudents",
    dataList: studentDetailsData,
    setDataList: setStudentDetailsData,
  };
  return <ContentBox {...config} />;
};
export default StudentDetails;
