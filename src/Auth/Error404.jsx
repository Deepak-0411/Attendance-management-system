import error404 from "../assets/error404.svg";
import {  useNavigate } from "react-router-dom";
import errorStyles from "../Faculty/CSS/Error.module.css";
const Error404 = () => {
  const container = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection : "column",
    background : "white",
  };
  const navigate = useNavigate();

  return (
    <div style={container}>
      <img style={{ width: "100%", maxHeight : "80%" ,  marginBottom : "1rem"}} src={error404} alt="Error 404" />
      <button className={errorStyles.retryBtn}
      onClick={()=>navigate("/")}> Go Home </button>
    </div>
  );
};

export default Error404;
