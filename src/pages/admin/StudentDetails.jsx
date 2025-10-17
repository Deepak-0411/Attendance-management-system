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
    getProgrammeList,
    getBranchList,
  } = useFilter();

  const [exportFilter, setExportFilters] = useState({
    school: "",
    branch: "",
    year: "",
    programme: "",
  });

  const { school, branch, year, programme } = studentDetailsFilter;

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: school || "",
      branch: branch || "",
      year: year || "",
      programme: programme || "",
    }));
  }, [studentDetailsFilter]);

  const filterInputs = generateFilterInputs({
    fields: ["school", "programme", "branch", "year"],
    filterState: studentDetailsFilter,
    setFilterState: setStudentDetailsFilter,
    requiredFields: ["school", "branch", "year"],
    getSchoolList,
    getBranchList,
    getProgrammeList,
  });

  const exportInputs = generateFilterInputs({
    fields: ["school", "programme", "branch", "year"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
    getSchoolList,
    getBranchList,
    getProgrammeList,
  });

  const sem = { 1: [1, 2], 2: [3, 4], 3: [5, 6], 4: [7, 8], 5: [9, 10] };

  const config = {
    title: "Students",
    apiGet: `/api/student?year=${year}&branch=${branch}&schoolName=${school}&programme=${programme}`,
    apiEndPointSingle: "/api/student",
    apiEndPointBulk: "/api/student/import",
    apiExport: `/api/student/export?year=${exportFilter.year}&branch=${exportFilter.branch}&schoolName=${exportFilter.school}&programme=${exportFilter.programme}`,
    filterBox: true,
    dateFilter: false,
    exportInputs: exportInputs,
    exportFileName: "Students List",
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "rollNo",
    nameKey: "name",
    addText: "+ Add Student",
    formFields: {
      rollNo: { placeholder: "Roll No", role: "text" },
      name: { placeholder: "Student Name", role: "text" },
      year: {
        placeholder: "Year",
        role: "select",
        options: () => Object.keys(sem),
      },
      schoolName: {
        placeholder: "School Name",
        role: "select",
        options: () => getSchoolList(),
      },
      programme: {
        placeholder: "Programme",
        role: "select",
        options: (formData) => getProgrammeList(formData.schoolName),
      },
      branch: {
        placeholder: "Branch",
        role: "select",
        options: (formData) =>
          getBranchList(formData.schoolName, formData.programme),
      },
      semester: {
        placeholder: "Semester",
        role: "select",
        options: (formData) => sem[formData.year],
      },
      studentImg: {
        role: "image",
      },
    },
    tableHeading: ["Name", "Roll no."],
    tableColumn: ["name", "rollNo"],
    dataList: studentDetailsData,
    setDataList: setStudentDetailsData,
  };
  return <ContentBox {...config} />;
};
export default StudentDetails;
