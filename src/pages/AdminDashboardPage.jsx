import React, { useState, useEffect } from "react";
import MkdSDK from "../utils/MkdSDK";
import LogoutButton from "../components/LogOutButton";
const AdminDashboardPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(videos)
  const fetchVideos = async (page) => {
    try {
      const sdk = new MkdSDK();
      const response = await sdk.callRestAPI(
        { page, limit: 10 },
        "PAGINATE" 
      );

      if (response.success) {
        setVideos(response.data);
      } else {
        console.error("Error fetching videos:", response.message);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center items-center text-7xl h-screen text-gray-700 ">
        <LogoutButton />
        <ul>
          {videos.map((video) => (
            <li key={video.id}>{video.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </>
  );
};

export default AdminDashboardPage;
