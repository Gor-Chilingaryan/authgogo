import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '@/features/navigation/components/navigation';

function Main() {
  return (
    <div>
      <header>
        <Navigation />
        
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export { Main };
