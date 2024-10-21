import Image from "next/image";
import React, { useState, useEffect } from 'react';

export const SimplerLoader = () => {

  const prefix = 'Analyzing and improving resume content';
  const [loadingText, setLoadingText] = useState(prefix);
  const loadingStates = ['', '.', '..', '...'];
  // let count = 0;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      // count = count + 1;
      index = (index + 1) % loadingStates.length;
      // let text = (count < 9 ? prefix : 'Improving resume content') + loadingStates[index];
      let text = prefix + loadingStates[index];
      setLoadingText(text);
    }, 650);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-row items-center w-full">
    {/*
      <div className="w-10 h-10 relative animate-spin">
        <Image
          alt="Logo"
          src="/transcript.png"
          fill
        />
      </div>
      */}
      <p className="text-sm text-muted-foreground pl-0" style={{
        color: '#636e72',
        textWrap: 'nowrap',
      }}>
      {loadingText}
      </p>
    </div>
  );
};
