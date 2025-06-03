import { useData } from "../../context/DataContext";
import ContentBox from "../../layout/ContentBox";

const ExamDuty = () => {
  const {examDutyData, setExamDutyData} = useData();

  const config = {
    title: "Exam Duty",
    apiGet: `/admin/duty`,
    apiFilter: "",
    filterBox: true,
    filterInputs: [],
    searchBoxPlaceholder:"Search by name or ID",
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
