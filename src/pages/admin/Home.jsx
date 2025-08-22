import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import styles from "../../styles/modules/admin/Home.module.css";
import FilterBar from "../../components/Filterbar/FilterBar";
import Spinner from "../../components/Spinner/Spinner";
import { useFilter } from "../../context/FilterContext";
import { useData } from "../../context/DataContext";
import { toast } from "react-toastify";
import { apiRequest } from "../../utility/apiRequest";
import { generateFilterInputs } from "../../utility/generateFilterInputs";

const colorMap = {
  Present: "#5ca904",
  Absent: "#F44336",
  UFM: "#edb348",
  "Not Marked": "#9E9E9E",
};
const responseKeyToLabel = {
  Present: "Present",
  Absent: "Absent",
  UFM: "UFM",
  Null: "Not Marked", // 'Null' from response is shown as 'Not Marked'
};

const Home = () => {
  const { homeData, setHomeData } = useData();
  const { homeFilter, setHomeFilter, getSchoolList, getBranchList } =
    useFilter();

  const dateFilterContext = {
    fromDate: homeFilter.fromDate,
    toDate: homeFilter.toDate,
    setFromDate: (val) =>
      setHomeFilter((prev) => ({
        ...prev,
        fromDate: val,
      })),
    setToDate: (val) =>
      setHomeFilter((prev) => ({
        ...prev,
        toDate: val,
      })),
  };

  const [loading, setLoading] = useState(false);

  const hasData = homeData.length > 0;
  const total = hasData
    ? homeData.reduce((sum, entry) => sum + entry.value, 0)
    : 0;

  const fetchData = async () => {
    const response = await apiRequest({
      url: `/admin/homestatus?fromdate=${homeFilter.fromDate}&todate=${homeFilter.toDate}`,
      method: "GET",
      setLoading,
    });

    if (response.status === "success") {
      const rawData = response.data.data || {};

      const formattedData = Object.entries(responseKeyToLabel).map(
        ([responseKey, displayLabel]) => ({
          name: displayLabel,
          value: rawData[responseKey] || 0,
        })
      );
      setHomeData(formattedData);
    } else {
      console.error("Error:", response.message);
      toast.error(`Error: Failed to fetch data.`);
    }
  };

  useEffect(() => {
    if (!Array.isArray(homeData) || homeData.length === 0) {
      fetchData();
    }
  }, []);

  const filterInputs = generateFilterInputs({
    fields: ["school", "branch", "shift"],
    filterState: homeFilter,
    setFilterState: setHomeFilter,
    getSchoolList,
    getBranchList,
  });

  return (
    <div className={styles.container}>
      <FilterBar
        filters={filterInputs}
        searchBtnAction={fetchData}
        dateFilterContext={dateFilterContext}
      />

      {loading ? (
        <Spinner />
      ) : total === 0 ? (
        <div className={styles.noData}>
          <h2>No data available</h2>
        </div>
      ) : (
        <div className={styles.content}>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie
                data={homeData}
                dataKey="value"
                nameKey="name"
                outerRadius={180}
                innerRadius={90}
                label={({ name, percent }) =>
                  `${name} : ${(percent * 100).toFixed(1)}%`
                }
                isAnimationActive={false}
              >
                {homeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorMap[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className={styles.bottomContent}>
            <h3 className={styles.detailsTitle}>Summary</h3>
            <ul>
              {homeData.map((item, index) => (
                <li key={index} className={styles.detailItem}>
                  <span>
                    <span
                      className={styles.colorDot}
                      style={{ backgroundColor: colorMap[item.name] }}
                    ></span>
                    {item.name}
                  </span>
                  <span>
                    {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
