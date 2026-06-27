import { Outlet } from 'react-router-dom';
import { NetworkStatusBar } from '@/components/layout/NetworkStatusBar';

export const AppLayout = () => {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-surface">
      <NetworkStatusBar />
      <main className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
