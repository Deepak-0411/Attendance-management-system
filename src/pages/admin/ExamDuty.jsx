import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";
import ContentBox from "../../layout/ContentBox";
import { generateFilterInputs } from "../../utility/generateFilterInputs";

const ExamDuty = () => {
  const { examDutyData, setExamDutyData } = useData();
  const {
    examDutyFilter,
    setExamDutyFilter,
    getSchoolList,
    getBuildingName,
    getRoomNo,
  } = useFilter();
  const [exportFilter, setExportFilters] = useState({
    school: "",
    building: "",
    roomNo: "",
    shift: "",
  });

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: examDutyFilter.school || "",
      building: examDutyFilter.building || "",
      roomNo: examDutyFilter.rollNo || "",
      shift: examDutyFilter.shift || "",
    }));
  }, [examDutyFilter]);

  const filterInputs = generateFilterInputs({
    fields: ["school", "building", "roomNo", "shift"],
    filterState: examDutyFilter,
    setFilterState: setExamDutyFilter,
    requiredFields: ["school", "building", "roomNo", "shift"],
    getSchoolList,
    getBuildingName,
    getRoomNo,
  });
  const exportInputs = generateFilterInputs({
    fields: ["school", "building", "roomNo", "shift"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
    getSchoolList,
    getBuildingName,
    getRoomNo,
  });

  const config = {
    title: "Exam Duty",
    apiGet: `/admin/duty`,
    apiExport: "",
    filterBox: true,
    dateFilter: true,
    exportInputs: exportInputs,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "teacherId",
    nameKey: "fName",
    addText: "+ Assign Duty",
    formFields: {
      teacherId: { value: "", placeholder: "Faculty-ID", role: "text" },
      buildingName: { value: "", placeholder: "Building Name", role: "text" },
      roomNo: { value: "", placeholder: "Room no.", role: "text" },
      shift: { value: "", placeholder: "Shift", role: "text" },
      date: { value: "", placeholder: "Date", role: "date" },
    },
    tableHeading: [
      "Faculty Name",
      "Faculty-ID",
      "Building Name",
      "Room No.",
      "Shift",
      "Date",
    ],
    tableColumn: [
      "fName",
      "teacherId",
      "buildingName",
      "roomNo",
      "shift",
      "date",
    ],
    apiEndPointSingle: "duty",
    apiEndPointBulk: "duty/import",
    dataList: examDutyData,
    setDataList: setExamDutyData,
  };
  return <ContentBox {...config} />;
};
export default ExamDuty;
