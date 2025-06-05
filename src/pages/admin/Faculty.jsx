import { useData } from "../../context/DataContext";
import ContentBox from "../../layout/ContentBox";
import { useFilter } from "../../context/FilterContext";

const Faculty = () => {
  const { facultyData, setFacultyData } = useData();
  const { facultyFilter, setFacultyFilter, getSchoolList } = useFilter();

  const filterInputs = [
    {
      label: "School",
      name: "school",
      value: facultyFilter.school,
      options: getSchoolList(),
      required: true,
      onChange: (val) => setFacultyFilter((prev) => ({ ...prev, school: val })),
    },
  ];

  const config = {
    title: "Faculty Available",
    apiGet: "/admin/faculty",
    apiFilter: "",
    filterBox: true,
    dateFilter : false,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "teacherId",
    nameKey: "fName",
    addText: "+ Add Faculty",
    formFields: {
      fName: { value: "", placeholder: "Name" },
      teacherId: { value: "", placeholder: "Teacher ID" },
      username: { value: "", placeholder: "Username" },
      password: { value: "", placeholder: "Password" },
      schoolName: { value: "", placeholder: "School Name" },
    },
    tableHeading: ["Faculty Name", "Faculty-ID", "School Name"],
    tableColumn: ["fName", "teacherId", "schoolName"],
    apiEndPointSingle: "faculty",
    apiEndPointBulk: "faculty/import",
    dataList: facultyData,
    setDataList: setFacultyData,
  };
  return <ContentBox {...config} />;
};
export default Faculty;
