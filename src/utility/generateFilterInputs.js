export const generateFilterInputs = ({
  fields = [],
  filterState,
  setFilterState,
  getSchoolList,
  getBuildingName,
  getProgrammeList,
  getBranchList,
  getRoomNo,
  requiredFields = [], // new addition
}) => {
  return fields.map((field) => {
    let options = [];
    switch (field) {
      case "school":
        options = getSchoolList();
        break;
      case "programme":
        options = getProgrammeList?.(filterState.school) || [];
        break;
      case "branch":
        options =
          getBranchList?.(filterState.school, filterState.programme) || [];
        break;

      case "building":
        options = getBuildingName?.(filterState.school) || [];
        break;
      case "roomNo":
        options = getRoomNo?.(filterState.school, filterState.building) || [];
        break;
      case "shift":
        options = [1, 2];
        break;
      case "year":
        options = ["1", "2", "3", "4", "5"];
        break;
      default:
        options = [];
    }

    return {
      label: field[0].toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1"),
      name: field,
      value: filterState[field] || "",
      options,
      required: requiredFields.includes(field),
      onChange: (val) => setFilterState((prev) => ({ ...prev, [field]: val })),
    };
  });
};
