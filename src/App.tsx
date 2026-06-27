import { AppRouter } from '@/router/AppRouter';
import { CatalogBootstrap } from '@/components/CatalogBootstrap';
import { GeoBootstrap } from '@/components/GeoBootstrap';
import { AuthBootstrap } from '@/components/AuthBootstrap';

export const App = () => {
  return (
    <>
      <AuthBootstrap />
      <CatalogBootstrap />
      <GeoBootstrap />
      <AppRouter />
    </>
  );
};
