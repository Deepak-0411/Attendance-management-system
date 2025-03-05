import error404 from "../assets/error404.svg";

const Error404 = () => {
  const container = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background : "white"
  };

  return (
    <div style={container}>
      <img style={{ width: "100%",height:"100%" }} src={error404} alt="Error 404" />
    </div>
  );
};

export default Error404;
