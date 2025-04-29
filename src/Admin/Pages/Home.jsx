import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./CSS/Home.module.css";
import Date from "../../Utility/GetDate";
import FilterBar from "../Components/FilterBar";
import LoadingScrn from "../../Components/LoadingScrn";

const colorMap = {
  Present: "#5ca904",
  Absent: "#F44336",
  UFM: "#14bce1",
  "Not Marked": "#9E9E9E",
};
const responseKeyToLabel = {
  Present: "Present",
  Absent: "Absent",
  UFM: "UFM",
  Null: "Not Marked", // 'Null' from response is shown as 'Not Marked'
};

const Home = () => {
  const { token } = useAuth();
  const [data, setData] = useState([
    { name: "Present", value: 0 },
    { name: "Absent", value: 0 },
    { name: "UFM", value: 0 },
    { name: "Not Marked", value: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [fromDate, setFromDate] = useState(Date);
  const [toDate, setToDate] = useState(Date);
  const hasData = data.length > 0;
  const total = hasData ? data.reduce((sum, entry) => sum + entry.value, 0) : 0;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://gbu-server.vercel.app/api/admin/homestatus?fromdate=${fromDate}&todate=${toDate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch student data");
        const responsedata = await response.json();
        const rawData = responsedata.data || {};

        const formattedData = Object.entries(responseKeyToLabel).map(
          ([responseKey, displayLabel]) => ({
            name: displayLabel,
            value: rawData[responseKey] || 0,
          })
        );
        setData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const filterInputs = [
    {
      type: "date",
      label: "From",
      name: "from",
      value: fromDate,
      onChange: (val) => handleFromDateChange(val),
      required: true,
    },
    {
      type: "date",
      label: "To",
      name: "to",
      value: toDate,
      onChange: (val) => handleToDateChange(val),
      required: true,
    },
  ];

  const handleFromDateChange = (value) => {
    setFromDate(value);

    if (toDate < value) {
      setToDate(value);
    }
  };

  const handleToDateChange = (value) => {
    if (value >= fromDate) {
      setToDate(value);
    }
  };

  return (
    <div className={styles.container}>
      <FilterBar
        filters={filterInputs}
        searchBtnAction={() => setRefresh((prev) => !prev)}
      />

      {loading ? (
        <LoadingScrn />
      ) : error ? (
        <div className={styles.statusBox}>
          <p className={styles.errorText}>Error: {error}</p>
        </div>
      ) : total === 0 ? (
        <div className={styles.noData}>
          <h2>No data available</h2>
        </div>
      ) : (
        <div className={styles.content}>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={180}
                innerRadius={90}
                label={({ name, percent }) =>
                  `${name} : ${(percent * 100).toFixed(1)}%`
                }
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorMap[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className={styles.bottomContent}>
            <h3 className={styles.detailsTitle}>Summary</h3>
            <ul>
              {data.map((item, index) => (
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
