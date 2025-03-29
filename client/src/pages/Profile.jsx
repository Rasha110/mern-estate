import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess,signOutUserStart,signOutUserFailure,signOutUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../api/controllers/user.controller";
import { Navigate } from "react-router-dom";
import {Link} from 'react-router-dom'
function Profile() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const fileRef = useRef(null);
  const { currentUser,loading,error } = useSelector((state) => state.user);

  

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    dispatch(updateUserSuccess(storedUser)); // ✅ Update Redux state from localStorage
  }
}, [dispatch]);
  if (!currentUser) {
    return <div>Loading..</div>;
  }
 
  
  
  const [image, setImage] = useState(currentUser?.avatar || "");
  const [file, setFile] = useState(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePerc, setFilePerc] = useState(0);
const [updateSuccess,setUpdateSuccess]=useState(false)
  // Initialize formData with currentUser values
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
  });
 

  // Handles file upload
  const uploadImage = async (file) => {
    setFileUploadError(false);
    setFileUploadSuccess(false);
    setFilePerc(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mern-estate");

    try {
      console.log("Uploading image...");
      setFilePerc(30); 

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dpgxclwry/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      setFilePerc(50);
      const data = await response.json();
      console.log("Full API Response:", data);

      if (data.secure_url) {
        console.log("Uploaded Image URL:", data.secure_url);
        setImage(data.secure_url);
        setFileUploadSuccess(true);
        setFilePerc(100);
      } else {
        console.error("Upload failed: No secure_url in response");
        setFileUploadError(true);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setFileUploadError(true);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadImage(selectedFile);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
  
    if (!currentUser || !currentUser._id) {
      console.error("Error: currentUser or _id is undefined");
      return;
    }
  
    try {
      dispatch(updateUserStart());
  
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`, // Send token if required
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message || "Update failed"));
        return;
      }
  
      dispatch(updateUserSuccess(data));
      localStorage.setItem("user", JSON.stringify(data));
      //setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  
    
  const handleDeleteUser=async()=>{
    if (!currentUser || !currentUser._id) {
      console.error("Error: currentUser or _id is undefined");
      return;
    }
    try{
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data=await res.json();
      if (data.success===false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data))
      localStorage.removeItem("user");
    }
    catch(error){
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignOut=async()=>{
    try{
      dispatch(signOutUserStart());
const res=await fetch('/api/auth/signout');
if (!res.ok) {
  const errorText = await res.text(); // Read response as text
  console.error("Signout failed:", errorText); 
  dispatch(signOutUserFailure("Signout failed. Server response: " + errorText));
  return;}
const data=await res.json();
if (data.success===false){
  dispatch(deleteUserFailure(data.message));
  return;
}
    dispatch(deleteUserSuccess())
  localStorage.removeItem("user");

  // ✅ Redirect after account deletion
  window.location.href = "/login"; 
}
    catch(err){
dispatch(deleteUserFailure(err.message))
    }
  }
  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleFileChange} />
        <img
          onClick={() => fileRef.current.click()}
          src={image || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error: Image Upload Failed </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading... ${filePerc}%`}</span>
          ) : fileUploadSuccess ? (
            <span className="text-green-700">Image Uploaded Successfully </span>
          ) : (
            ""
          )}
        </p>

        {/* Input fields with controlled value */}
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
       
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...': 'Update'}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated Successfully!' : ''}</p>
    </div>
  );
}

export default Profile;
