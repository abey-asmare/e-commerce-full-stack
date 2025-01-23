
import { useEffect, useState } from "react"
import {Navigate} from 'react-router-dom'
import { auth } from "@/lib/apiRequests"
import { useUserAuth } from "@/store/store";



function ProtectedRoute({children}) {

  const [isAuthenticated, setIsAuthenticated] = useState(null)
    const {isUserLoggedIn, setIsUserLoggedIn} = useUserAuth();
  

  useEffect(()=>{
    const login = async ()=> {
      const result  = await auth();
      setIsAuthenticated(result)
      setIsUserLoggedIn(result)
    }
    login();
    //**
    // refresh and access token will be requested to our api request,
    //but we will set it to true for now, while wrapping with this component, 
    // we can protect every other components  */
  }, [])



  if (isAuthenticated === null) return <div></div>

  return (
    isAuthenticated ? 
    <main>
      {children}
    </main>
    :
    <Navigate to='/login' />
  )
}

export default ProtectedRoute
