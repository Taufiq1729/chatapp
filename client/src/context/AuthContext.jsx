import { createContext, useState, useCallback, useEffect } from "react";

export const AuthContext = createContext();

const baseUrl = "http://localhost:5500/api";

// ✅ Define postRequest inside this file
const postRequest = async (url, body) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                error: true,
                message: data?.message || "Something went wrong",
            };
        }

        return data;
    } catch (err) {
        console.error("Network error in postRequest:", err);
        return {
            error: true,
            message: "Unable to reach server. Please check that the backend is running.",
        };
    }
};


export const AuthContextProvider = ({ children }) =>{
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    console.log("registerInfo", registerInfo);
    console.log("User", user);

    useEffect(() => {
        const storedUser = localStorage.getItem("User");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser({ ...parsed, _id: parsed._id || parsed.id });
            } catch {
                setUser(null);
            }
        }
    }, []);

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, []);

    const registerUser = useCallback(async(e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(`${baseUrl}/users/register`, registerInfo);

        setIsRegisterLoading(false);
    
        if (response.error) {
            setRegisterError(response.message);
            return;
        }

        const raw = response.user || response;
        const authUser = { ...raw, _id: raw._id || raw.id };

        setUser(authUser);
        localStorage.setItem("User", JSON.stringify(authUser));

        if (response.token) {
            localStorage.setItem("Token", response.token);
        }
    }, [registerInfo]);

    const loginUser = useCallback(async (e) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);

        const response = await postRequest(`${baseUrl}/users/login`, loginInfo);

        setIsLoginLoading(false);

        if (response.error) {
            setLoginError(response.message);
            return;
        }

        const raw = response.user || response;
        const authUser = { ...raw, _id: raw._id || raw.id };

        setUser(authUser);
        localStorage.setItem("User", JSON.stringify(authUser));

        if (response.token) {
            localStorage.setItem("Token", response.token);
        }
    }, [loginInfo]);

    const logoutUser = useCallback(()=>{
        localStorage.removeItem("User");
        localStorage.removeItem("Token");
        setUser(null);
    }, []); 

    return (
        <AuthContext.Provider 
            value= {{
                user,
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
                loginInfo,
                updateLoginInfo,
                loginUser,
                loginError,
                isLoginLoading,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
};





// A callback is:
// A function that you give to another function, so it can call it later.