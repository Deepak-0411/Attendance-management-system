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
    getBuildingName,
    getRoomNo,
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
    apiGet: `/admin/viewRooms?school=${roomsFilter.school}`,
    apiEndPointSingle: "/admin/addRoom",
    apiEndPointBulk: "/admin/roomImport",
    apiExport: `/admin/rooms/export?school=${exportFilter.school}`,
    filterBox: true,
    dateFilter: false,
    exportInputs: exportInputs,
    filterInputs: filterInputs,
    searchBoxPlaceholder: "Search by name or ID",
    idKey: "roomNo",
    nameKey: "buildingName",
    addText: "+ Add Room",
    formFields: {
      school: {
        value: "",
        placeholder: "School Name",
        role: "select",
        options: () => getSchoolList(),
      },
      buildingName: {
        value: "",
        placeholder: "Building Name",
        role: "select",
        options: (formData) => getBuildingName(formData.school),
      },
      roomNo: {
        value: "",
        placeholder: "Room No.",
        role: "select",
        options: (formData) =>
          getRoomNo(formData.school, formData.buildingName),
      },
      capacity: { value: "", placeholder: "Capacity", role: "text" },
    },
    tableHeading: ["Building Name", "Room No", "Capacity"],
    tableColumn: ["buildingName", "roomNo", "capacity"],
    dataList: roomsData,
    setDataList: setRoomsData,
  };
  return <ContentBox {...config} />;
};
export default Rooms;
