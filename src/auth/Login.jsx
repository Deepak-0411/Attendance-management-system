import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.webp";
import Input from "../components/Input/Input";
import LoadingScrn from "../components/Spinner/Spinner";
import styles from "../styles/modules/auth/Login.module.css";
import { apiRequest, baseURL } from "../utility/apiRequest";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

const Login = ({ user = "faculty" }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [remember] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const { URL, reqForward, title, inputType } = (() => {
    switch (user) {
      case "admin":
        return {
          URL: "/api/root/login",
          reqForward: "/admin/home",
          title: "Admin Login",
          inputType: "text",
        };
      case "faculty":
        return {
          URL: "/api/faculty/login",
          reqForward: "/faculty/displayDuty",
          title: "Faculty Login",
          inputType: "email",
        };
      default:
        return {
          URL: "",
          reqForward: "",
          title: "",
          inputType: "",
        };
    }
  })();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    const token = params.get("token");

    if (token) {
      const tokenURL = `/auth/add-token?token=${token}`;
      handleLogin(null, true, tokenURL);
    }

    if (error) {
      if (error === "faculty-not-registered") {
        toast.error("You are not registered as a faculty member.");
      } else if (error === "google_failed") {
        toast.error("Google login failed. Please try again.");
      } else {
        toast.error(`Error: ${error}`);
      }
    }
  }, [location]);

  const handleLogin = async (e, forOauth, tokenURL) => {
    if (e?.preventDefault) e.preventDefault();

    if (!forOauth && !(userId && password)) return;

    const payload = {
      method: "POST",
      setLoading,
      onSuccess: (response) => {
        toast.success("LoggedIn Successfully!!!");
        navigate(reqForward);
      },
      onFailure: (response) => {
        console.error("Error:", response.message);
        if (response.statusCode == "404") {
          toast.error("We couldn’t complete your request. Please try again.");
        } else {
          toast.error(`Error: ${response.message}`);
        }
      },
    };

    if (forOauth) {
      payload.url = tokenURL;
    }

    if (!forOauth) {
      payload.body = {
        username: userId,
        password: password,
      };
      payload.url = URL;
    }

     await apiRequest(payload);
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <img className={styles.logo} src={LOGO} alt="logo" />
          <h2 className={styles.heading}>Examination Attendance Portal</h2>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <form className={styles.form} onSubmit={(e) => handleLogin(e)}>
          <Input
            type={2}
            role={inputType}
            placeholder={"userId"}
            value={userId}
            setValue={(value) => setUserId(value)}
            required={true}
          />
          <Input
            type={2}
            role={"password"}
            placeholder={"password"}
            value={password}
            setValue={(value) => setPassword(value)}
            required={true}
          />
          <div className={styles.btns}>
            <div className={styles.rememberMe}>
              <input
                type="checkbox"
                id="check"
                className={styles.checkBox}
                value={remember}
                checked={true}
                onChange={() => {}}
              />
              <label className={styles.checkLabel} htmlFor="check">
                Remember me
              </label>
            </div>
            {user === "faculty" && (
              <button
                type="button"
                className={styles.btn}
                // onClick={() => navigate("/faculty/forgetPassword")}
              >
                Forget Password
              </button>
            )}
          </div>
          <button
            type="submit"
            className={styles.loginBtn}
            disabled={loading || !(userId && password)}
          >
            {loading ? <LoadingScrn size={"small"} color={"white"} /> : "Login"}
          </button>
        </form>
        {user === "faculty" && (
          <div className={styles.oauthContainer}>
            <p className={styles.oauthContainerP}>or</p>
            <button
              className={styles.oauthContainerBtn}
              onClick={handleGoogleLogin}
            >
              <FcGoogle size={26} />
              Continue with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Login;
