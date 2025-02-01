import { useState, useEffect, createContext, Children} from 'react';
import axios from 'axios';
import { BACKEND_URL } from './config';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState();
    const [jsonwebtoken, setJsonwebtoken] = useState(localStorage.getItem('token'));

    useEffect(() =>{
        async function fetchUser(token) {
            try{
                //this gets the user data from the login api from the experss server using the token provided from local storage passed in form the 'token' parameter
                const res = await axios.get(`${BACKEND_URL}/api/auth`, {headers: {Authorization: `Bearer ${token}`}})
                console.log(res);
                return res.data.user;
            } catch(err){
                // if the token is invaild then remove it from local storage and set the jsonwebtoken to null
                localStorage.removeItem('token');
                setJsonwebtoken(null)
                return null            
            }
        }

        async function getUser(){
            //this gets the json web token from local storage
            let token = localStorage.getItem('token')
            // if a token exist in local storage then run the the 'fetchUser' function, and pass the 'token' variable as a argument to the function
            if(token){
                let fetchedUser = await fetchUser(token);
                //once the 'fetchUser' function has run succsuflly set the useState user to 'fetchedUser' so as long as the token exist the user exist and I have access to their data.
                setUser(fetchedUser)
            } else{
                //if something went wrong then set both user and jsonwebtoken useStates to null
                setJsonwebtoken(null)
                setUser(null)
            }          
        }
        getUser()
    }, [])

    function logOut(){
        localStorage.removeItem('token')
        setJsonwebtoken(null)
        setUser(null)
        setTimeout(() =>{
            window.location.reload();
          }, 1000)
    }

    return(
        <AuthContext.Provider value={{user, setUser, jsonwebtoken, setJsonwebtoken, logOut}}>
            {children}
        </AuthContext.Provider>
    )
}