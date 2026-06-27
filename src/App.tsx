import { AppRouter } from '@/router/AppRouter';
import { AppBootstrap } from '@/components/bootstrap/AppBootstrap';

export const App = () => {
  return (
    <>
      <AppBootstrap />
      <AppRouter />
    </>
  );
};
