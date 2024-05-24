import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useParams } from 'react-router-dom';

const QrDisplayer = () => {
  const qrRef = useRef(null);
  const { web_id } = useParams();

  useEffect(() => {
    const generateQRCode = async (url) => {
      try {
        await QRCode.toCanvas(qrRef.current, url, {
          width: 300, // Fixed size
          height: 300, // Fixed size
        });
      } catch (error) {
        console.error("Failed to generate QR code", error);
      }
    };

    const url = `${window.location.origin}/linkly/${web_id}`;
    console.log("WebId is", web_id);

    generateQRCode(url);
  }, [web_id]);

  const downloadQRCode = () => {
    const canvas = qrRef.current;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png';
    link.click();
  };

  const displayUrl = `${window.location.origin}/linkly/${web_id}`;

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-8">
      <div className="flex flex-col items-center">
        <canvas ref={qrRef}></canvas>
        <div className="mt-4 text-center">
          {/* <p>{displayUrl}</p> */}
        </div>
      </div>
      <button 
        onClick={downloadQRCode} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Download QR
      </button>
    </div>
  );
};

export default QrDisplayer;
