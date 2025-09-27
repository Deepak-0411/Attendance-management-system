import error404 from "../assets/error404.svg";
import {  useNavigate } from "react-router-dom";
const PageNotFound = () => {
  const container = {
    height: "100dvh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection : "column",
    background : "white",
  };
  const retryBtn={
    border: "none",
    borderRadius: ".5rem",
    color: "white",
    background: "green",
    padding: ".5rem",
    fontSize: "1.2rem",
    cursor: "pointer",
  };
  const navigate = useNavigate();

  return (
    <div style={container}>
      <img style={{ width: "100%", maxHeight : "80%" ,  marginBottom : "1rem"}} src={error404} alt="Error 404" />
      <button style={retryBtn}
      onClick={()=>navigate("/")}> Go Home </button>
    </div>
  );
};

export default PageNotFound;
