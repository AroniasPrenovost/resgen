import Image from "next/image";
import React, { useState, useEffect } from 'react';

export const SimplerLoader = () => {

  const prefix = 'Importing and updating resume content';
  const [loadingText, setLoadingText] = useState(prefix);
  const loadingStates = ['', '.', '..', '...'];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingStates.length;
      let text = prefix + loadingStates[index];
      setLoadingText(text);
    }, 650);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-row items-center w-full">
      <div className="w-10 h-10 relative animate-spin">
        <Image
          alt="Logo"
          src="/transcript.png"
          fill
        />
      </div>
      <p className="text-sm text-muted-foreground pl-2" style={{
        color: '#636e72',
      }}>
      {loadingText}
      </p>
    </div>
  );
};
