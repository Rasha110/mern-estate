import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet ,Navigate} from 'react-router-dom'
import { signInFailure,signInStart,signInSuccess,updateUserFailure,updateUserStart,updateUserSuccess
 } from '../redux/user/userSlice';

function PrivateRoute() {
    const {currentUser}=useSelector((state)=>state.user)
return currentUser ? <Outlet/>:<Navigate to='/sign-in'/>;
}

export default PrivateRoute 
