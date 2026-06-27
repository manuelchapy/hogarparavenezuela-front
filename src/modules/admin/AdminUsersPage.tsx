import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { CatalogSelect } from '@/components/ui/CatalogSelect';
import { AccountStatusBadge } from '@/components/ui/AccountStatusBadge';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { ACCOUNT_STATUS, type AccountStatus } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useCatalog } from '@/hooks/useCatalog';
import { approveUser, fetchAdminUsers, rejectUser } from '@/api/authApi';
import type { AuthUser } from '@/api/authTypes';
import type { UserRole } from '@/constants/roles';
import {
  rejectUserSchema,
  type RejectUserForm,
} from '@/modules/auth/schemas/authSchemas';
import { getAuthErrorMessage } from '@/services/authService';

export const AdminUsersPage = () => {
  const { getItems } = useCatalog();
  const accountStatuses = getItems(CATALOG_KEYS.ACCOUNT_STATUS);

  const [users, setUsers] = useState<AuthUser[]>([]);
  const [statusFilter, setStatusFilter] = useState<AccountStatus | ''>('');
  const [rolFilter, setRolFilter] = useState<UserRole | ''>('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AuthUser | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const rejectForm = useForm<RejectUserForm>({
    resolver: zodResolver(rejectUserSchema),
    defaultValues: { motivoRechazo: '' },
  });

  const load = useCallback(
    async (pageNum = 1, append = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAdminUsers({
          page: pageNum,
          limit: 20,
          ...(statusFilter ? { estadoCuenta: statusFilter } : {}),
          ...(rolFilter ? { rol: rolFilter } : {}),
        });
        setUsers((prev) => (append ? [...prev, ...data.items] : data.items));
        setPage(data.pagination.page);
        setHasNextPage(data.pagination.hasNextPage);
        setTotal(data.pagination.total);
      } catch (err) {
        setError(getAuthErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [statusFilter, rolFilter],
  );

  useEffect(() => {
    void load(1, false);
  }, [load]);

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await approveUser(userId);
      await load(1, false);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const submitReject = rejectForm.handleSubmit(async (data) => {
    if (!rejectTarget) return;
    setActionLoading(rejectTarget.id);
    try {
      await rejectUser(rejectTarget.id, data);
      setRejectTarget(null);
      rejectForm.reset();
      await load(1, false);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  });

  const emptyMessage =
    statusFilter === ACCOUNT_STATUS.PENDIENTE
      ? 'No hay solicitudes pendientes'
      : statusFilter
        ? `No hay usuarios con estado «${accountStatuses.find((s) => s.code === statusFilter)?.label ?? statusFilter}»`
        : 'No hay usuarios registrados';

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <Link to={ROUTES.DASHBOARD} className="text-sm font-medium text-primary-700">
          ← Inicio
        </Link>
        <h1 className="mt-2 text-xl font-bold text-text-primary">
          Administración de usuarios
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          {total} usuario{total !== 1 ? 's' : ''}
          {statusFilter
            ? ` · ${accountStatuses.find((s) => s.code === statusFilter)?.label ?? statusFilter}`
            : ' · Todos los estados'}
        </p>
      </header>

      <section className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <div className="flex flex-col gap-2">
          <span className="text-base font-medium text-text-primary">
            Estado de cuenta
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter('')}
              className={[
                'min-h-10 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors',
                statusFilter === ''
                  ? 'border-primary-700 bg-primary-700 text-white'
                  : 'border-slate-300 bg-white text-text-primary',
              ].join(' ')}
            >
              Todos
            </button>
            {accountStatuses.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() =>
                  setStatusFilter(item.code as AccountStatus)
                }
                className={[
                  'min-h-10 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors',
                  statusFilter === item.code
                    ? 'border-primary-700 bg-primary-700 text-white'
                    : 'border-slate-300 bg-white text-text-primary',
                ].join(' ')}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <CatalogSelect
          catalogKey={CATALOG_KEYS.ROLES}
          label="Filtrar por rol (opcional)"
          value={rolFilter}
          onChange={(v) => setRolFilter(v as UserRole | '')}
          name="filter-rol"
          placeholder="Todos los roles"
        />

        {error && (
          <p className="text-sm font-medium text-danger-500" role="alert">
            {error}
          </p>
        )}

        {isLoading && users.length === 0 ? (
          <p className="py-8 text-center text-base text-text-secondary">
            Cargando usuarios...
          </p>
        ) : users.length === 0 ? (
          <p className="py-8 text-center text-base text-text-secondary">
            {emptyMessage}
          </p>
        ) : (
          users.map((user) => (
            <article
              key={user.id}
              className="rounded-2xl border-2 border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-text-primary">
                    {user.nombreCompleto}
                  </p>
                  <p className="text-base text-text-secondary">{user.cedula}</p>
                </div>
                <AccountStatusBadge statusCode={user.estadoCuenta} />
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                {user.rol.replace(/_/g, ' ')} · {user.telefono}
              </p>
              {user.institucion && (
                <p className="mt-1 text-sm text-text-secondary">
                  {user.institucion}
                </p>
              )}
              {user.estadoCuenta === ACCOUNT_STATUS.RECHAZADO &&
                user.motivoRechazo && (
                  <p className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-text-secondary">
                    <span className="font-medium">Motivo de rechazo:</span>{' '}
                    {user.motivoRechazo}
                  </p>
                )}
              {user.estadoCuenta === ACCOUNT_STATUS.PENDIENTE && (
                <div className="mt-4 flex gap-2">
                  <Button
                    className="flex-1"
                    isLoading={actionLoading === user.id}
                    onClick={() => void handleApprove(user.id)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    disabled={Boolean(actionLoading)}
                    onClick={() => setRejectTarget(user)}
                  >
                    Rechazar
                  </Button>
                </div>
              )}
            </article>
          ))
        )}

        {hasNextPage && (
          <Button
            variant="ghost"
            className="w-full"
            isLoading={isLoading}
            onClick={() => void load(page + 1, true)}
          >
            Cargar más
          </Button>
        )}

        <Button variant="ghost" onClick={() => void load(1, false)}>
          Actualizar
        </Button>
      </section>

      <BottomSheet
        isOpen={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        title="Rechazar solicitud"
      >
        <form onSubmit={submitReject} className="flex flex-col gap-4">
          <Textarea
            label="Motivo del rechazo *"
            rows={4}
            error={rejectForm.formState.errors.motivoRechazo?.message}
            {...rejectForm.register('motivoRechazo')}
          />
          <Button type="submit" variant="danger" isLoading={Boolean(actionLoading)}>
            Confirmar rechazo
          </Button>
        </form>
      </BottomSheet>
    </div>
  );
};
