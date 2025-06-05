import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";
import ContentBox from "../../layout/ContentBox";
import { generateFilterInputs } from "../../utility/generateFilterInputs";

const ExamDuty = () => {
  const { examDutyData, setExamDutyData } = useData();
  const { examDutyFilter, setExamDutyFilter } = useFilter();
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
    required: ["school", "building", "roomNo", "shift"],
  });
  const exportInputs = generateFilterInputs({
    fields: ["school", "building", "roomNo", "shift"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
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
      teacherId: { value: "", placeholder: "Faculty-ID" },
      buildingName: { value: "", placeholder: "Building Name" },
      roomNo: { value: "", placeholder: "Room no." },
      shift: { value: "", placeholder: "Shift" },
      date: { value: "", placeholder: "Date" },
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
