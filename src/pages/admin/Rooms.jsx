import { useData } from "../../context/DataContext";
import ContentBox from "../../layout/ContentBox";
import { useFilter } from "../../context/FilterContext";
import { useEffect, useState } from "react";
import { generateFilterInputs } from "../../utility/generateFilterInputs";

const Rooms = () => {
  const {
    roomsFilter,
    setRoomsFilter,
    getSchoolList,
    // getBuildingName,
    // getRoomNo,
  } = useFilter();
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
    requiredFields: ["school"],
    getSchoolList,
  });
  const exportInputs = generateFilterInputs({
    fields: ["school"],
    filterState: exportFilter,
    setFilterState: setExportFilters,
    requiredFields: ["school"],
    getSchoolList,
  });

  const config = {
    title: "Rooms Available",
    apiGet: `/api/room?schoolName=${roomsFilter.school}`,
    apiEndPointSingle: "/api/room",
    apiEndPointBulk: "/api/room/import",
    apiExport: `/api/room/export?schoolName=${exportFilter.school}`,
    filterBox: true,
    dateFilter: false,
    exportInputs: exportInputs,
    exportFileName : "Rooms List",
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or roomNo",
    idKey: "roomNo",
    nameKey: "buildingName",
    addText: "+ Add Room",
    formFields: {
      schoolName: {
        value: "",
        placeholder: "School Name",
        role: "select",
        options: () => getSchoolList(),
      },
      buildingName: {
        value: "",
        placeholder: "Building Name",
        role: "text",
      },
      roomNo: {
        value: "",
        placeholder: "Room No.",
        role: "text",
      },
      capacity: { value: "", placeholder: "Capacity", role: "number" },
    },
    tableHeading: ["Building Name", "Room No", "Capacity"],
    tableColumn: ["buildingName", "roomNo", "capacity"],
    dataList: roomsData,
    setDataList: setRoomsData,
  };
  return <ContentBox {...config} />;
};
export default Rooms;
