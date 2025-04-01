import { useState, useEffect } from "react";

const useTableHeight = () => {
  const [tableHeight, setTableHeight] = useState("auto");

  useEffect(() => {
    const updateHeight = () => {
      const getElement = (id) => document.querySelector(`#${id}`);
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
        (isNaN(parseInt(style.marginBottom))
          ? 0
          : parseInt(style.marginBottom));

      const getPadding = (style) =>
        (isNaN(parseInt(style.paddingTop)) ? 0 : parseInt(style.paddingTop)) +
        (isNaN(parseInt(style.paddingBottom))
          ? 0
          : parseInt(style.paddingBottom));

      // Get elements using class names
      const content = getElement("content");
      const container = getElement("container");
      const header = getElement("header");
      const filterContainer = getElement("filterContainer");
      const searchBox = getElement("searchBox");

      // Compute heights and margins
      const headerHeight = getHeight(header);
      const filterHeight = getHeight(filterContainer);
      const searchBoxHeight = getHeight(searchBox);


      const totalMargins =
        getMargin(getStyles(content)) +
        getMargin(getStyles(container)) +
        getMargin(getStyles(header)) +
        getMargin(getStyles(filterContainer))+
        getMargin(getStyles(searchBox));

      const totalPadding =
        getPadding(getStyles(content)) +
        getPadding(getStyles(container)) ;

      // Calculate available height
      const availableHeight =
        window.innerHeight -
        (headerHeight + filterHeight + searchBoxHeight + totalMargins + totalPadding);
      setTableHeight(`${availableHeight}px`);

      // Debugging logs
      // console.log("innerHeight:", window.innerHeight);
      // console.log(
      //   "Header height:",
      //   headerHeight,
      //   "| margin:",
      //   getMargin(getStyles(header))
      // );
      // console.log(
      //   "Filter height:",
      //   filterHeight,
      //   "| margin:",
      //   getMargin(getStyles(filterContainer))
      // );
      // console.log(
      //   "Search height:",
      //   searchBoxHeight,
      //   "| margin:",
      //   getMargin(getStyles(searchBox))
      // );
      // console.log(
      //   "Content margin:",
      //   getMargin(getStyles(content)),
      //   "| padding:",
      //   getPadding(getStyles(content))
      // );
      // console.log(
      //   "Container margin:",
      //   getMargin(getStyles(container)),
      //   "| padding:",
      //   getPadding(getStyles(container))
      // );
      // console.log("Total margins: ",totalMargins,"| padding: ",totalPadding);
      
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    //  Use MutationObserver to detect DOM changes dynamically
    const observer = new MutationObserver(updateHeight);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", updateHeight);
      observer.disconnect();
    };
  }, []);

  return { tableHeight };
};

export default useTableHeight;
