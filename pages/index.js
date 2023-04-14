import React, { useState } from 'react';
import axios from 'axios';
import download from "downloadjs";

function YoutubeDownloader() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);

  const [iframeKey, setIframeKey] = useState(0);
  const ytd = 'https://yt-download.org/api/button/mp4?url=';
  
  const API_KEY ='AIzaSyD0dq0LLe3snHDihx-QRISvp5QSPIoBOtw';

  const getVideoIdFromUrl = (url) => {
    // parse video ID from URL
    const regex = /(?:\/|v=)([\w-]{11})(?:\?|&|$)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const videoId = getVideoIdFromUrl(videoUrl);
  
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${API_KEY}`);
    setVideoInfo(response.data.items[0]);

    setVideoUrl(ytd+videoUrl);
    setIframeKey((prevKey) => prevKey + 1);
  
   
 
  }

  const Dounws = (event) => {
  //  downloadVideo(urls);
  event.preventDefault();
  down2();
  }

  const down2 =  async(url) =>{
    try {
      console.log(url)
      const response = await axios.get(
        `https://www.yt-download.org/api/single/mp4?url=${videoUrl}`
      );
      const downloadUrl = response.data.split('"')[1];
      console.log(response.data);
      download(downloadUrl);
    } catch (error) {
      console.error(error);
    }
  }

 

  const downloadVideo = async (urls) => {
 
      const videoId = getVideoIdFromUrl(urls);

      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${API_KEY}`);
      const videoDuration = response.data.items[0].contentDetails.duration;
      const durationRegex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
      const matches = durationRegex.exec(videoDuration);
      const hours = parseInt(matches[1]) || 0;
      const minutes = parseInt(matches[2]) || 0;
      const seconds = parseInt(matches[3]) || 0;
      const totalSeconds = hours * 60 * 60 + minutes * 60 + seconds;
  
      
  const blob = await axios.get(`https://www.yt-download.org/api/button/mp4?url=${videoUrl}`).then((response) =>
  
  new Blob([response.data]));
    // const blob = await fetch(`https://www.yt-download.org/api/single/mp4?url=` + {videoUrl}).then((response) => response.blob());
     
     const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = `${videoInfo.snippet.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, (totalSeconds + 5) * 1000); // set timeout to allow enough time for download to complete
    
   

  
  
  };
  return (
    
    <div className='grid grid-cols-1 place-items-center w-full bg-gray-500 h-full'>
          
      <a className='text-red-500 font-500'>Download Youtube Video</a>
     
      <form>
        <input className='border-solid border-sky-500 text-gray-900 border-2 rounded-md w-72 text-sm h-10' type="text"  onChange={(event) => setVideoUrl(event.target.value)} />
        <div className='grid grid-cols-1 place-items-center'>
        <button
        onClick={handleSubmit}
        className='mt-2 bg-red-500 rounded-md hover:bg-red-600 text-white w-24 h-10' type="submit">Download</button>
        </div>
        
      </form>
      {videoInfo && (
         <div className='grid grid-cols-1 place-items-center w-full bg-gray-500 h-full'>
          <h2>{videoInfo.snippet.title}</h2>
          <img className='rounded-lg drop-shadow-xl' src={videoInfo.snippet.thumbnails.medium.url} />
          <p>{videoInfo.contentDetails.duration}</p>

       </div>
      )}


<iframe className='bg-gray-500 rounded-md' key={iframeKey} id="buttonApi" src={videoUrl}
width="100%" height="400" color='#f5f5f5'  allowtransparency="true" scrolling="no" ></iframe>


    </div>
  );
}

export default YoutubeDownloader;
