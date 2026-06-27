import { Outlet } from 'react-router-dom';
import { NnaListPanel } from '@/modules/nna/components/NnaListPanel';

export const NnaWorkspaceLayout = () => (
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden xl:flex-row">
    <div className="hidden h-full min-h-0 w-[min(400px,32vw)] shrink-0 border-r border-border-subtle xl:flex xl:flex-col">
      <NnaListPanel />
    </div>
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Outlet />
    </div>
  </div>
);
