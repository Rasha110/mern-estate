import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState(currentUser?.avatar || "");
  const [file, setFile] = useState(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePerc, setFilePerc] = useState(0);

  const uploadImage = async (file) => {
    setFileUploadError(false);
    setFileUploadSuccess(false);
    setFilePerc(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mern-estate");

    try {
      console.log("Uploading image...");
      setFilePerc(30); // Simulate progress

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

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleFileChange} />
        <img
          onClick={() => fileRef.current.click()}
          src={image}
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
            ''
          )}
        </p>
        <input type="text" placeholder="username" id="username" className="border p-3 rounded-lg" />
        <input type="text" placeholder="email" id="email" className="border p-3 rounded-lg" />
        <input type="text" placeholder="password" id="password" className="border p-3 rounded-lg" />
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
