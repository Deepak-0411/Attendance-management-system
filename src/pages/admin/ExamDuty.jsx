import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";
import ContentBox from "../../layout/ContentBox";
import { generateFilterInputs } from "../../utility/generateFilterInputs";

const ExamDuty = () => {
  const {
    examDutyData,
    setExamDutyData,
    fromDate: dataFromDate,
    toDate: dataToDate,
  } = useData();
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

  const { school, building, roomNo, shift, fromDate, toDate } = examDutyFilter;

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: school || "",
      building: building || "",
      roomNo: roomNo || "",
      shift: shift || "",
    }));
  }, [examDutyFilter]);

  const filterInputs = generateFilterInputs({
    fields: ["school", "building", "roomNo", "shift"],
    filterState: examDutyFilter,
    setFilterState: setExamDutyFilter,
    requiredFields: ["school"],
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

  const dateFilterContext = {
    fromDate: fromDate,
    toDate: toDate,
    setFromDate: (val) =>
      setExamDutyFilter((prev) => ({
        ...prev,
        fromDate: val,
      })),
    setToDate: (val) =>
      setExamDutyFilter((prev) => ({
        ...prev,
        toDate: val,
      })),
  };

  const config = {
    title: "Exam Duty",
    apiGet: `/api/duty?fromDate=${fromDate}&toDate=${toDate}&schoolName=${school}&buildingName=${building}&roomNo=${roomNo}&shift=${shift}`,
    apiExport: `/api/duty/export?fromDate=${dataFromDate}&toDate=${dataToDate}&schoolName=${exportFilter.school}&buildingName=${exportFilter.building}&roomNo=${exportFilter.roomNo}&shift=${exportFilter.shift}`,
    apiEndPointSingle: "/api/duty",
    apiEndPointBulk: "/api/duty/import",
    filterBox: true,
    dateFilter: true,
    exportFileName: "Exam Duty List",
    dateFilterContext,
    exportInputs: exportInputs,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "username",
    nameKey: "name",
    addText: "+ Assign Duty",
    formFields: {
      username: { value: "", placeholder: "Faculty-ID", role: "text" },
      schoolName: {
        value: "",
        placeholder: "School Name",
        role: "select",
        options: () => getSchoolList(),
      },
      buildingName: {
        value: "",
        placeholder: "Building Name",
        role: "select",
        options: (formData) => getBuildingName(formData.schoolName),
      },
      roomNo: {
        value: "",
        placeholder: "Room No.",
        role: "select",
        options: (formData) =>
          getRoomNo(formData.schoolName, formData.buildingName),
      },
      shift: {
        value: "",
        placeholder: "Shift",
        role: "select",
        options: ()=>([1, 2]),
      },
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
      "facultyName",
      "username",
      "buildingName",
      "roomNo",
      "shift",
      "date",
    ],
    dataList: examDutyData,
    setDataList: setExamDutyData,
  };
  return <ContentBox {...config} />;
};
export default ExamDuty;
