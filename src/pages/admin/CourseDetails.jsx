import { useData } from "../../context/DataContext";
import ContentBox from "../../layout/ContentBox";

const CourseDetails = () => {
  const {courceDetailsData, setCourceDetailsData} = useData();

  const config = {
    title: "Courses",
    apiGet: "/admin/courses",
    apiFilter: "",
    filterBox: true,
    filterInputs: [],
    searchBoxPlaceholder:"Search by name or ID",
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
