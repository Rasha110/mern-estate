import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { updateUserStart, updateUserFailure, updateUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../api/controllers/user.controller";

function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  const [image, setImage] = useState(currentUser?.avatar || "");
  const [file, setFile] = useState(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePerc, setFilePerc] = useState(0);

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
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value, 
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentUser || !currentUser._id) {
      console.error("Missing User ID. Cannot proceed.");
      return;
    }
  
    try {
      dispatch(updateUserStart());
      const updateData = {
        username: formData.username,
        email: formData.email,
       
        avatar: image,
      };
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         
        }
        ,
        body: JSON.stringify({...formData,avatar:image}),
      });
  
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message || "Update failed"));
        return;
      }
  
      dispatch(updateUserSuccess(data));
    } catch (error) {
      console.error("Caught error:", error);
      dispatch(updateUserFailure(error.message));
    }
  };
  
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
            <span className="text-red-700">Error: Image Upload Failed ❌</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading... ${filePerc}%`}</span>
          ) : fileUploadSuccess ? (
            <span className="text-green-700">Image Uploaded Successfully ✅</span>
          ) : (
            ""
          )}
        </p>

        {/* Input fields with controlled value */}
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Email"
          value={formData.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
