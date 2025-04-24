import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./CSS/Home.module.css";
import Date from "../../Utility/GetDate";
import FilterBar from "../Components/FilterBar";

const colorMap = {
  Present: "#5ca904",
  Absent: "#F44336",
  UFM: "#14bce1",
  "Not Marked": "#9E9E9E",
};

const Home = () => {
  const [data, setData] = useState([
    { name: "Present", value: 50 },
    { name: "Absent", value: 20 },
    { name: "UFM", value: 5 },
    { name: "Not Marked", value: 10 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [fromDate, setFromDate] = useState(Date);
  const [toDate, setToDate] = useState(Date);
  const hasData = data.length > 0;
  const total = hasData ? data.reduce((sum, entry) => sum + entry.value, 0) : 0;

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
        searchBtnAction={() => setRefreshTrigger((prev) => !prev)}
      />
      {hasData ? (
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
      ) : (
        <div className={styles.noData}>
          <h2>No data available</h2>
        </div>
      )}
    </div>
  );
};

export default Home;
