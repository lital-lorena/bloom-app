import { createContext, useContext,useState } from "react";

const UserContext = createContext()

export function UserProvider({children}) {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))

    const login = (userData, userToken) =>{
        setUser(userData)
        setToken(userToken)
        localStorage.setItem("token", userToken)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const updateUser = (partial) => {
        setUser((prev) => {
            if (!prev) return prev
            const next = { ...prev, ...partial }
            localStorage.setItem("user", JSON.stringify(next))
            return next
        })
    }

    const logout = () =>{
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }
   return(
    <UserContext.Provider value={{user,token,login,logout,updateUser}}>
    {children}
    </UserContext.Provider>
    )
}

export function useUser() {
        return useContext(UserContext)
        
    }
    
