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
    apiGet: `/api/task?schoolName=${facultyFilter.school}`,
    apiExport: `/api/task/export?schoolName=${exportFilter.school}`,
    apiEndPointSingle: `/api/faculty/signup`,
    apiEndPointBulk: "/api/task/import",
    filterBox: true,
    dateFilter: false,
    exportInputs: exportInputs,
    exportFileName: "Faculty List",
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "username",
    nameKey: "name",
    addText: "+ Add Faculty",
    formFields: {
      name: { placeholder: "Name", role: "text" },
      username: { placeholder: "Username (email)", role: "email" },
      password: { placeholder: "Password", role: "password" },
      schoolName: {
        placeholder: "School Name",
        role: "select",
        options: () => getSchoolList(),
      },
    },
    tableHeading: ["Faculty Name", "Faculty-ID"],
    tableColumn: ["name", "username"],
    dataList: facultyData,
    setDataList: setFacultyData,
  };
  return <ContentBox {...config} />;
};
export default Faculty;
