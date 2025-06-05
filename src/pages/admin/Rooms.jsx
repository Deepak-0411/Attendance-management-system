import { useData } from "../../context/DataContext";
import ContentBox from "../../layout/ContentBox";
import { useFilter } from "../../context/FilterContext";
import { useEffect, useState } from "react";
import { generateFilterInputs } from "../../utility/generateFilterInputs";

const Rooms = () => {
  const { roomsFilter, setRoomsFilter } = useFilter();
  const { roomsData, setRoomsData } = useData();
  const [exportFilter, setExportFilters] = useState({
    school: "",
  });

  useEffect(() => {
    setExportFilters((prev) => ({
      ...prev,
      school: roomsFilter.school || "",
    }));
  }, [roomsFilter]);

  const filterInputs = generateFilterInputs({
    fields: ["school"],
    filterState: roomsFilter,
    setFilterState: setRoomsFilter,
    required: ["school"],
  });
  const exportInputs = generateFilterInputs({
    fields: ["school"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
    required: ["school"],
  });

  const config = {
    title: "Rooms Available",
    apiGet: "/admin/examRooms",
    apiExport: "",
    filterBox: true,
    dateFilter: false,
    exportInputs: exportInputs,
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
export default Rooms;
