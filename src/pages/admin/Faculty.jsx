import { useData } from "../../context/DataContext";
import ContentBox from "../../layout/ContentBox";
import { useFilter } from "../../context/FilterContext";
import { generateFilterInputs } from "../../utility/generateFilterInputs";
import { useEffect, useState } from "react";

const Faculty = () => {
  const { facultyData, setFacultyData } = useData();
  const { facultyFilter, setFacultyFilter } = useFilter();

  const [exportFilter, setExportFilters] = useState({
    school: "",
    branch: "",
  });

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: facultyFilter.school || "",
      branch: facultyFilter.branch || "",
    }));
  }, [facultyFilter]);

  const filterInputs = generateFilterInputs({
    fields: ["school", "branch"],
    filterState: facultyFilter,
    setFilterState: setFacultyFilter,
    required: ["school", "branch"],
  });

  const exportInputs = generateFilterInputs({
    fields: ["school", "branch"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
  });

  const config = {
    title: "Faculty Available",
    apiGet: "/admin/faculty",
    apiExport: "",
    filterBox: true,
    dateFilter: false,
    exportInputs: exportInputs,
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
