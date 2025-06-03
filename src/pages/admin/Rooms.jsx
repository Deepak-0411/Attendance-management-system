import { useData } from "../../context/DataContext";
import ContentBox from "../../layout/ContentBox";

const CourseDetails = () => {

    const {roomsData, setRoomsData} = useData();
  
  const config = {
    title: "Rooms Available",
    apiGet: "/admin/examRooms",
    apiFilter: "",
    filterBox: true,
    filterInputs: [],
    searchBoxPlaceholder:"Search by name or ID",
    idKey: "roomNo",
    nameKey: "buildingName",
    addText: "+ Add Room",
    formFields: {
      buildingName: { value: "", placeholder: "Building Name" },
      roomNo: { value: "", placeholder: "Room No." },
      capacity: { value: "", placeholder: "Capacity" },
    },
    tableHeading: ["Building Name", "Room No", "Capacity"],
    tableColumn: ["buildingName", "roomNo", "capacity"],
    apiEndPointSingle: "faculty",
    apiEndPointBulk: "roomImport",
    dataList: roomsData,
    setDataList: setRoomsData,
  };
  return <ContentBox {...config} />;
};
export default CourseDetails;
