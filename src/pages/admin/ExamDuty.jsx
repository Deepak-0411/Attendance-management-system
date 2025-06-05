import { useData } from "../../context/DataContext";
import { useFilter } from "../../context/FilterContext";
import ContentBox from "../../layout/ContentBox";

const ExamDuty = () => {
  const { examDutyData, setExamDutyData } = useData();
  const {
    examDutyFilter,
    setExamDutyFilter,
    getSchoolList,
    getBuildingName,
    getRoomNo,
  } = useFilter();

  const filterInputs = [
    {
      label: "School",
      name: "school",
      value: examDutyFilter.school,
      options: getSchoolList(),
      required: true,
      onChange: (val) =>
        setExamDutyFilter((prev) => ({ ...prev, school: val })),
    },
    {
      label: "Building",
      name: "building",
      value: examDutyFilter.building,
      options: getBuildingName(examDutyFilter.school),
      required: true,
      onChange: (val) =>
        setExamDutyFilter((prev) => ({ ...prev, building: val })),
    },
    {
      label: "Room No.",
      name: "roomNo",
      value: examDutyFilter.roomNo,
      options: getRoomNo(examDutyFilter.school, examDutyFilter.building),
      required: true,
      onChange: (val) =>
        setExamDutyFilter((prev) => ({ ...prev, roomNo: val })),
    },
    {
      label: "Shift",
      name: "shift",
      value: examDutyFilter.shift,
      options: ["Morning", "Evening"],
      required: true,
      onChange: (val) => setExamDutyFilter((prev) => ({ ...prev, shift: val })),
    },
  ];

  const config = {
    title: "Exam Duty",
    apiGet: `/admin/duty`,
    apiFilter: "",
    filterBox: true,
    dateFilter : true,
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
