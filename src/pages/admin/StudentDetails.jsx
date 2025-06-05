import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";
import ContentBox from "../../layout/ContentBox";

const StudentDetails = () => {
  const { studentDetailsData, setStudentDetailsData } = useData();

  const {
    studentDetailsFilter,
    setStudentDetailsFilter,
    getSchoolList,
    getBranchList,
  } = useFilter();

  const filterInputs = [
    {
      label: "School",
      name: "school",
      value: studentDetailsFilter.school,
      options: getSchoolList(),
      required: true,
      onChange: (val) =>
        setStudentDetailsFilter((prev) => ({ ...prev, school: val })),
    },
    {
      label: "Branch",
      name: "branch",
      value: studentDetailsFilter.branch,
      options: getBranchList(studentDetailsFilter.school),
      required: true,
      onChange: (val) =>
        setStudentDetailsFilter((prev) => ({ ...prev, branch: val })),
    },
    {
      label: "Year",
      name: "year",
      value: studentDetailsFilter.year,
      options: ["1st", "2nd", "3rd", "4th", "5th"],
      required: true,
      onChange: (val) =>
        setStudentDetailsFilter((prev) => ({ ...prev, year: val })),
    },
  ];

  const config = {
    title: "Students",
    apiGet: "/admin/students",
    apiFilter: "/admin/fillterStudents",
    filterBox: true,
    dateFilter: false,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
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
