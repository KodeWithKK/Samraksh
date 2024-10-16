import { useAppContext } from "@/context/app-provider";
import { useState } from "react";

const VideoUpload = () => {
  const { fetchCustomUploadFileList } = useAppContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await response.json();
        await fetchCustomUploadFileList();
        setUploadMessage("Upload successful");
      } else {
        await response.json();
        setUploadMessage("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("Something went wrong while uploading the file.");
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-brand-500 rounded-md px-2.5 py-1 text-gray-100"
      >
        Upload
      </button>
      <p>{uploadMessage}</p>
    </div>
  );
};

export default VideoUpload;
