import { useData } from "../../context/DataContext";
import ContentBox from "../../layout/ContentBox";
import { useFilter } from "../../context/FilterContext";
import { generateFilterInputs } from "../../utility/generateFilterInputs";
import { useEffect, useState } from "react";

const Faculty = () => {
  const { facultyData, setFacultyData } = useData();
  const { facultyFilter, setFacultyFilter, getSchoolList, getBranchList } =
    useFilter();

  const [exportFilter, setExportFilters] = useState({
    school: "",
  });

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: facultyFilter.school || "",
    }));
  }, [facultyFilter]);

  const filterInputs = generateFilterInputs({
    fields: ["school"],
    filterState: facultyFilter,
    setFilterState: setFacultyFilter,
    requiredFields: ["school"],
    getSchoolList,
    getBranchList,
  });

  const exportInputs = generateFilterInputs({
    fields: ["school"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
    requiredFields: ["school"],
    getSchoolList,
    getBranchList,
  });

  const config = {
    title: "Faculty Available",
    apiGet: `/admin/faculty?school=${facultyFilter.school}`,
    apiExport: `/admin/faculty/export?school=${exportFilter.school}`,
    apiEndPointSingle: "/admin/faculty",
    apiEndPointBulk: "/admin/faculty/import",
    filterBox: true,
    dateFilter: false,
    exportInputs: exportInputs,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "teacherId",
    nameKey: "fName",
    addText: "+ Add Faculty",
    formFields: {
      fName: { value: "", placeholder: "Name", role: "text" },
      teacherId: { value: "", placeholder: "Teacher ID", role: "text" },
      username: { value: "", placeholder: "Username", role: "text" },
      password: { value: "", placeholder: "Password", role: "password" },
      school: {
        value: "",
        placeholder: "School Name",
        role: "select",
        options: () => getSchoolList(),
      },
    },
    tableHeading: ["Faculty Name", "Faculty-ID", "School Name"],
    tableColumn: ["fName", "teacherId", "school"],
    dataList: facultyData,
    setDataList: setFacultyData,
  };
  return <ContentBox {...config} />;
};
export default Faculty;
