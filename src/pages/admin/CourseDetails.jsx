import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";
import ContentBox from "../../layout/ContentBox";
import { generateFilterInputs } from "../../utility/generateFilterInputs";

const CourseDetails = () => {
  const { courceDetailsData, setCourceDetailsData } = useData();

  const {
    courseDetailsFilter,
    setCourseDetailsFilter,
    getSchoolList,
    getProgrammeList,
    getBranchList,
  } = useFilter();

  const [exportFilter, setExportFilters] = useState({
    school: "",
    programme: "",
    branch: "",
  });

  const { school, branch, programme } = courseDetailsFilter;

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: school || "",
      branch: branch || "",
      programme: programme || "",
    }));
  }, [courseDetailsFilter]);

  const filterInputs = generateFilterInputs({
    fields: ["school", "programme", "branch"],
    filterState: courseDetailsFilter,
    setFilterState: setCourseDetailsFilter,
    requiredFields: ["school", "programme", "branch"],
    getSchoolList,
    getProgrammeList,
    getBranchList,
  });

  const exportInputs = generateFilterInputs({
    fields: ["school", "programme", "branch"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
    getSchoolList,
    getProgrammeList,
    getBranchList,
  });

  const config = {
    title: "Courses",
    apiGet: `/api/course?schoolName=${school}&programme=${programme}&branch=${branch}`,
    apiEndPointSingle: "/api/course",
    apiEndPointBulk: "/api/course/import",
    apiExport: `/api/course/export?schoolName=${exportFilter.school}&programme=${exportFilter.programme}&branch=${exportFilter.branch}`,
    filterBox: true,
    dateFilter: false,
    exportInputs: exportInputs,
    exportFileName: "Cources List",
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "courseCode",
    nameKey: "courseName",
    addText: "+ Add Course",
    formFields: {
      schoolName: {
        value: "",
        placeholder: "School Name",
        role: "select",
        options: () => getSchoolList(),
      },
      programme: {
        value: "",
        placeholder: "Programme",
        role: "select",
        options: (formData) => getProgrammeList(formData.schoolName),
      },
      branch: {
        value: "",
        placeholder: "Branch",
        role: "select",
        options: (formData) =>
          getBranchList(formData.schoolName, formData.programme),
      },
      courseName: { value: "", placeholder: "Course Name", role: "text" },
      courseCode: { value: "", placeholder: "Course Code", role: "text" },
    },
    tableHeading: ["Course Name", "Course Code"],
    tableColumn: ["courseName", "courseCode"],
    dataList: courceDetailsData,
    setDataList: setCourceDetailsData,
  };
  return <ContentBox {...config} />;
};
export default CourseDetails;
