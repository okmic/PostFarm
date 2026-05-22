'use client'
import { useState } from 'react';
import { Logo } from './components/Logo/Logo';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <></>
      )}
      
      <div id='head' className={`main-content ${!isLoading ? 'content-visible' : ''}`}>
          <div className="container">
              <Logo size='xl' />
          </div>
       </div>
    </>
  );
}