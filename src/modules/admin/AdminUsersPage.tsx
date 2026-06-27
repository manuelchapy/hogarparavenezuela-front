import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageHeader } from '@/components/layout/PageHeader';
import { AlertBanner } from '@/components/ui/AlertBanner';
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
  const { t } = useTranslation();
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

  const statusLabel =
    accountStatuses.find((s) => s.code === statusFilter)?.label ?? statusFilter;

  const emptyMessage =
    statusFilter === ACCOUNT_STATUS.PENDIENTE
      ? t('admin.emptyPending')
      : statusFilter
        ? t('admin.emptyByStatus', { status: statusLabel })
        : t('admin.emptyDefault');

  const filterBtnClass = (active: boolean) =>
    [
      'min-h-12 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors',
      active
        ? 'border-primary-700 bg-primary-700 text-text-on-primary shadow-[var(--shadow-card)]'
        : 'border-border-default bg-surface-elevated text-text-primary hover:bg-surface',
    ].join(' ');

  return (
    <PageFrame
      header={
        <PageHeader
          backTo={ROUTES.DASHBOARD}
          backLabel={t('admin.backHome')}
          title={t('admin.title')}
          subtitle={`${t('admin.userCount', { count: total })}${statusFilter ? ` · ${statusLabel}` : ` · ${t('admin.allStatuses')}`}`}
        />
      }
      scrollClassName="page-section"
    >
        <div className="flex flex-col gap-2">
          <span className="text-base font-medium text-text-primary">
            {t('admin.accountStatusFilter')}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter('')}
              className={filterBtnClass(statusFilter === '')}
            >
              {t('admin.allFilter')}
            </button>
            {accountStatuses.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setStatusFilter(item.code as AccountStatus)}
                className={filterBtnClass(statusFilter === item.code)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <CatalogSelect
          catalogKey={CATALOG_KEYS.ROLES}
          label={t('admin.filterByRole')}
          value={rolFilter}
          onChange={(v) => setRolFilter(v as UserRole | '')}
          name="filter-rol"
          placeholder={t('admin.allRoles')}
        />

        {error && <AlertBanner tone="error">{error}</AlertBanner>}

        {isLoading && users.length === 0 ? (
          <p className="py-8 text-center text-base text-text-muted">
            {t('admin.loadingUsers')}
          </p>
        ) : users.length === 0 ? (
          <p className="py-8 text-center text-base text-text-muted">
            {emptyMessage}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <article key={user.id} className="surface-card !p-4">
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
                  <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-sm text-text-secondary">
                    <span className="font-medium">{t('admin.rejectReason')}</span>{' '}
                    {user.motivoRechazo}
                  </p>
                )}
              {user.estadoCuenta === ACCOUNT_STATUS.PENDIENTE && (
                <div className="mt-4 flex gap-2">
                  <Button
                    className="flex-1"
                    variant="accent"
                    isLoading={actionLoading === user.id}
                    onClick={() => void handleApprove(user.id)}
                  >
                    {t('admin.approve')}
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    disabled={Boolean(actionLoading)}
                    onClick={() => setRejectTarget(user)}
                  >
                    {t('admin.reject')}
                  </Button>
                </div>
              )}
            </article>
          ))}
          </div>
        )}

        {hasNextPage && (
          <Button
            variant="ghost"
            className="w-full"
            isLoading={isLoading}
            onClick={() => void load(page + 1, true)}
          >
            {t('common.loadMore')}
          </Button>
        )}

        <Button variant="ghost" onClick={() => void load(1, false)}>
          {t('admin.refresh')}
        </Button>

      <BottomSheet
        isOpen={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        title={t('admin.rejectSheetTitle')}
      >
        <form onSubmit={submitReject} className="flex flex-col gap-4">
          <Textarea
            label={t('admin.rejectReasonLabel')}
            rows={4}
            error={rejectForm.formState.errors.motivoRechazo?.message}
            {...rejectForm.register('motivoRechazo')}
          />
          <Button type="submit" variant="danger" isLoading={Boolean(actionLoading)}>
            {t('admin.confirmReject')}
          </Button>
        </form>
      </BottomSheet>
    </PageFrame>
  );
};
