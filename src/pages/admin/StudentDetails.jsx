import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";
import ContentBox from "../../layout/ContentBox";
import { generateFilterInputs } from "../../utility/generateFilterInputs";

const StudentDetails = () => {
  const { studentDetailsData, setStudentDetailsData } = useData();

  const {
    studentDetailsFilter,
    setStudentDetailsFilter,
    getSchoolList,
    getBranchList,
  } = useFilter();

  const [exportFilter, setExportFilters] = useState({
    school: "",
    branch: "",
    year: "",
  });

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: studentDetailsFilter.school || "",
      branch: studentDetailsFilter.branch || "",
      year: studentDetailsFilter.year || "",
    }));
  }, [studentDetailsFilter]);

  const filterInputs = generateFilterInputs({
    fields: ["school", "branch", "year"],
    filterState: studentDetailsFilter,
    setFilterState: setStudentDetailsFilter,
    requiredFields: ["school", "branch", "year"],
    getSchoolList,
    getBranchList,
  });

  const exportInputs = generateFilterInputs({
    fields: ["school", "branch", "year"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
    getSchoolList,
    getBranchList,
  });

  const config = {
    title: "Students",
    apiGet: "/admin/students",
    apiExport: "",
    filterBox: true,
    dateFilter: false,
    exportInputs: exportInputs,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "rollNo",
    nameKey: "name",
    addText: "+ Add Student",
    formFields: {
      rollNo: { value: "", placeholder: "Roll No", role: "text" },
      name: { value: "", placeholder: "Student Name", role: "text" },
      branch: { value: "", placeholder: "Branch", role: "text" },
      year: { value: "", placeholder: "Year", role: "text" },
      programmeName: { value: "", placeholder: "Programme", role: "text" },
      semester: { value: "", placeholder: "Semester", role: "text" },
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
