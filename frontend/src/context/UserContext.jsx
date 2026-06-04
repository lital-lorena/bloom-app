import { createContext, useContext,useState } from "react";

const UserContext = createContext()

export function UserProvider({children}) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem("token"))

    const login = (userData, userToken) =>{
        setUser(userData)
        setToken(userToken)
        localStorage.setItem("token", userToken)
    }

    const logout = () =>{
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
    }
   return(
    <UserContext.Provider value={{user,token,login,logout}}>
    {children}
    </UserContext.Provider>
    )
}

export function useUser() {
        return useContext(UserContext)
        
    }
    
