import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

export const WelcomePage = () => {
  const { isAuthenticated, isActive } = useAuth();

  if (isAuthenticated && isActive) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="flex h-dvh w-full flex-col bg-primary-800">
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-200">
            República Bolivariana de Venezuela
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white">
            Hogar para Venezuela
          </h1>
          <p className="mt-2 text-lg font-medium text-primary-100">
            Trazabilidad de NNA — Sismo Central
          </p>
        </header>

        <section className="mt-8 rounded-2xl bg-white p-5 shadow-xl">
          <h2 className="text-lg font-bold text-text-primary">Nuestra misión</h2>
          <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed text-text-secondary">
            <p>
              Esta plataforma existe para proteger a niños, niñas y adolescentes
              (NNA) en situaciones de emergencia, garantizando que cada rescate
              quede registrado, sea trazable y cumpla con la Ley Orgánica para la
              Protección de Niños, Niñas y Adolescentes (LOPNNA).
            </p>
            <p>
              Permite a equipos de campo —rescatistas, protección civil y personal
              médico— documentar hallazgos en tiempo real, incluso sin conexión,
              y entregar la custodia del NNA al Consejo de Protección (CPNNA) con
              actas y evidencia verificable.
            </p>
            <p>
              Cada ficha, fotografía, traslado y cierre legal forma parte de una
              cadena de custodia que facilita la reunificación familiar y previene
              la desaparición institucional en el caos de un desastre.
            </p>
          </div>
        </section>

        <div className="mt-6">
          <LopnnaLegalNotice variant="compact" />
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 border-t border-primary-900/30 bg-primary-800 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link to={ROUTES.LOGIN_OPERATIVO} className="block">
          <Button className="w-full" variant="primary">
            Acceso operativo
          </Button>
        </Link>
        <p className="text-center text-sm text-primary-200">
          Rescatistas, protección civil y personal médico
        </p>

        <Link to={ROUTES.LOGIN_ADMIN} className="block">
          <Button className="w-full" variant="secondary">
            Acceso administrador
          </Button>
        </Link>
        <p className="text-center text-sm text-primary-200">
          Administración del sistema y aprobación de solicitudes
        </p>
      </div>
    </div>
  );
};
