import { useData } from "../../context/DataContext";
import ContentBox from "../../layout/ContentBox";
import { useFilter } from "../../context/FilterContext";

const CourseDetails = () => {
  const { roomsFilter, setRoomsFilter, getSchoolList } = useFilter();
  const { roomsData, setRoomsData } = useData();

  const filterInputs = [
    {
      label: "School",
      name: "school",
      value: roomsFilter.school,
      options: getSchoolList(),
      required: true,
      onChange: (val) => setRoomsFilter((prev) => ({ ...prev, school: val })),
    },
  ];

  const config = {
    title: "Rooms Available",
    apiGet: "/admin/examRooms",
    apiFilter: "",
    filterBox: true,
    dateFilter : false,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
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
