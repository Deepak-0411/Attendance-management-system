import "./try1.css";
const Try1 = ({removeoverlay}) => {
  return (
    <div className="main">
      <div className="inside">
        <h1>Hello</h1>
        <button onClick={()=>removeoverlay(false)}> hide overlay</button>
      </div>
    </div>
  );
};
export default Try1;
