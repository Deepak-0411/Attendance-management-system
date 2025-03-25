import { useState, useEffect } from "react";

const useTableHeight = () => {
  const [tableHeight, setTableHeight] = useState("auto");

  useEffect(() => {
    const updateHeight = () => {
      setTimeout(() => {
        const getElement = (className) => document.querySelector(`.${className}`);
        const getStyles = (element) =>
          element
            ? window.getComputedStyle(element)
            : {
                marginTop: "0px",
                marginBottom: "0px",
                paddingTop: "0px",
                paddingBottom: "0px",
              };

        const getHeight = (element) => (element ? element.offsetHeight : 0);
        const getMargin = (style) =>
          (isNaN(parseInt(style.marginTop)) ? 0 : parseInt(style.marginTop)) +
          (isNaN(parseInt(style.marginBottom)) ? 0 : parseInt(style.marginBottom));

        const getPadding = (style) =>
          (isNaN(parseInt(style.paddingTop)) ? 0 : parseInt(style.paddingTop)) +
          (isNaN(parseInt(style.paddingBottom)) ? 0 : parseInt(style.paddingBottom));

        // Get elements using class names
        const content = getElement("content");
        const container = getElement("container");
        const header = getElement("header");
        const filterContainer = getElement("filterContainer");

        // Compute heights and margins
        const headerHeight = getHeight(header);
        const filterHeight = getHeight(filterContainer);

        const totalMargins =
          getMargin(getStyles(content)) +
          getMargin(getStyles(container)) +
          getMargin(getStyles(header)) +
          getMargin(getStyles(filterContainer));

        const totalPadding =
          getPadding(getStyles(content)) +
          getPadding(getStyles(container)) +
          getPadding(getStyles(header)) +
          getPadding(getStyles(filterContainer));

        // Calculate available height
        const availableHeight = window.innerHeight - (headerHeight + filterHeight + totalMargins + totalPadding);
        setTableHeight(`${availableHeight}px`);

        // Debugging logs
        console.log("innerHeight:", window.innerHeight);
        console.log("Header height:", headerHeight, "| margin:", getMargin(getStyles(header)), "| padding:", getPadding(getStyles(header)));
        console.log("Filter height:", filterHeight, "| margin:", getMargin(getStyles(filterContainer)), "| padding:", getPadding(getStyles(filterContainer)));
        console.log("Content margin:", getMargin(getStyles(content)), "| padding:", getPadding(getStyles(content)));
        console.log("Container margin:", getMargin(getStyles(container)), "| padding:", getPadding(getStyles(container)));
      }, 100); // Delay ensures elements are in the DOM
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return { tableHeight };
};

export default useTableHeight;
