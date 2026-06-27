import { Outlet } from 'react-router-dom';
import { AppMobileFooter } from '@/components/layout/MobileActionFooter';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppTopBar } from '@/components/layout/AppTopBar';
import { NetworkStatusBar } from '@/components/layout/NetworkStatusBar';

export const AppShell = () => (
  <div className="flex h-dvh w-full overflow-hidden bg-surface">
    <div className="hidden lg:flex">
      <AppSidebar />
    </div>
    <div className="flex min-w-0 flex-1 flex-col">
      <AppTopBar />
      <NetworkStatusBar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>
      <AppMobileFooter />
    </div>
  </div>
);