import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";
import ContentBox from "../../layout/ContentBox";

const CourseDetails = () => {
  const { courceDetailsData, setCourceDetailsData } = useData();

  const {
    courseDetailsFilter,
    setCourseDetailsFilter,
    getSchoolList,
    getBranchList,
  } = useFilter();

  const filterInputs = [
    {
      label: "School",
      name: "school",
      value: courseDetailsFilter.school,
      options: getSchoolList(),
      required: true,
      onChange: (val) =>
        setCourseDetailsFilter((prev) => ({ ...prev, school: val })),
    },
    {
      label: "Branch",
      name: "branch",
      value: courseDetailsFilter.branch,
      options: getBranchList(courseDetailsFilter.school),
      required: true,
      onChange: (val) =>
        setCourseDetailsFilter((prev) => ({ ...prev, branch: val })),
    },
  ];

  const config = {
    title: "Courses",
    apiGet: "/admin/courses",
    apiFilter: "",
    filterBox: true,
    dateFilter : false,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "courseCode",
    nameKey: "courseName",
    addText: "+ Add Course",
    formFields: {
      courseName: { value: "", placeholder: "Course Name" },
      courseCode: { value: "", placeholder: "Course Code" },
    },
    tableHeading: ["Course Name", "Course Code"],
    tableColumn: ["courseName", "courseCode"],
    apiEndPointSingle: "courses",
    apiEndPointBulk: "importCourses",
    dataList: courceDetailsData,
    setDataList: setCourceDetailsData,
  };
  return <ContentBox {...config} />;
};
export default CourseDetails;
