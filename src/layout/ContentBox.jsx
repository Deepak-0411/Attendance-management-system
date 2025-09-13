import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Table from "../components/Table/Table";
import SingleUpload from "../components/SingleUpload/SingleUpload";
import FilterBar from "../components/Filterbar/FilterBar";
import DownloadFile from "../components/DownloadFile/DownloadFile";
import Spinner from "../components/Spinner/Spinner";
import { apiRequest } from "../utility/apiRequest";
import { toast } from "react-toastify";
import styles from "../styles/modules/layout/ContentBox.module.css";
import Overlay from "../components/Overlay/Overlay";
import { useFilter } from "../context/FilterContext";

const ContentBox = ({
  title,
  apiGet,
  apiExport,
  filterBox,
  dateFilter,
  dateFilterContext,
  filterInputs,
  exportInputs,
  exportFileName,
  searchBoxPlaceholder,
  idKey,
  nameKey,
  addText,
  formFields,
  tableHeading,
  tableColumn,
  apiEndPointSingle,
  apiEndPointBulk,
  dataList = [],
  setDataList,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const { isFiltersEmpty, loadFilterOptions } = useFilter();

  const fetchData = async () => {
    await apiRequest({
      url: apiGet,
      method: "GET",
      setLoading,
      onSuccess: (response) => {
        setDataList(response.data.entries);
      },
      onFailure: (response) => {
        console.error("Error:", response.message);
        toast.error(`Error:${response.message || "Failed to fetch data."}`);
      },
    });
  };

  useEffect(() => {
    // if (!Array.isArray(dataList) || dataList.length === 0) {
    //   // console.log("datalist",dataList);

    //   fetchData();
    // }
    if (isFiltersEmpty()) {
      loadFilterOptions();
    }
  }, []);

  const filteredData = Array.isArray(dataList)
    ? dataList.filter((item) => {
        const name = item[nameKey]?.toLowerCase() || "";
        const id = item[idKey]?.toString().toLowerCase() || "";
        return name.includes(searchTerm) || id.includes(searchTerm);
      })
    : [];

  return (
    <div className={`${styles.container}`} id="container">
      {/* This is header  */}

      <Header
        title={title}
        searchBoxPlaceholder={searchBoxPlaceholder}
        value={searchTerm}
        setValue={(val) => setSearchTerm(val)}
        showUploadOverlay={() => setShowUpload(true)}
        addBtnText={addText}
        showExportBtn={true}
        exportBtnAction={setShowExport}
      />

      {/* Filters */}
      {filterBox && (
        <FilterBar
          filters={filterInputs}
          dateFilter={dateFilter}
          searchBtnAction={fetchData}
          dateFilterContext={dateFilterContext}
        />
      )}

      {/* file upload */}
      {showUpload && (
        <Overlay onClose={() => setShowUpload(false)}>
          <SingleUpload
            dataToSend={formFields}
            apiEndPointSingle={apiEndPointSingle}
            apiEndPointBulk={apiEndPointBulk}
          />
        </Overlay>
      )}

      {showExport && (
        <Overlay onClose={() => setShowExport(false)}>
          <DownloadFile
            dateFilter={dateFilter}
            exportFilters={exportInputs}
            apiEndPoint={apiExport}
            exportFileName={exportFileName}
          />
        </Overlay>
      )}

      {/* loading spinner  and table*/}
      {loading ? (
        <Spinner />
      ) : (
        <Table
          tableHeadings={tableHeading}
          filteredData={filteredData}
          idKey={idKey}
          tableColumn={tableColumn}
        />
      )}
    </div>
  );
};

export default ContentBox;
