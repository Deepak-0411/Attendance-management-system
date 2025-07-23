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
    getBranchList,
  } = useFilter();

  const [exportFilter, setExportFilters] = useState({
    school: "",
    branch: "",
  });

  const { school, branch } = courseDetailsFilter;

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: school || "",
      branch: branch || "",
    }));
  }, [courseDetailsFilter]);

  const filterInputs = generateFilterInputs({
    fields: ["school", "branch"],
    filterState: courseDetailsFilter,
    setFilterState: setCourseDetailsFilter,
    requiredFields: ["school", "branch"],
    getSchoolList,
    getBranchList,
  });

  const exportInputs = generateFilterInputs({
    fields: ["school", "branch"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
    getSchoolList,
    getBranchList,
  });

  const config = {
    title: "Courses",
    apiGet: `/admin/courses?school=${school}&branch=${branch}`,
    apiEndPointSingle: "/admin/courses",
    apiEndPointBulk: "/admin/importCourses",
    apiExport: `/admin/exportcourses?school=${exportFilter.school}&branch=${exportFilter.branch}`,
    filterBox: true,
    dateFilter: false,
    exportInputs: exportInputs,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "courseCode",
    nameKey: "courseName",
    addText: "+ Add Course",
    formFields: {
      school: { value: "", placeholder: "School Name", role: "text" },
      branch: { value: "", placeholder: "Branch", role: "text" },
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
