import { useEffect, type ReactNode } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useAuthStore } from '../lib/stores/authStore';
import { PH_ADMIN_ROLE } from '../lib/constants';

interface Props {
  children: ReactNode;
  requirePlatformAdmin?: boolean;
  requireAppRole?: boolean;
  requireRoleKey?: string;
}

export default function ProtectedRoute({
  children,
  requirePlatformAdmin = false,
  requireAppRole = true,
  requireRoleKey,
}: Props) {
  const { user, tokens, loaded, appRoles, refreshMe } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loaded && tokens?.access) {
      void refreshMe();
    }
  }, [loaded, tokens?.access, refreshMe]);

  const isAuthenticated = !!tokens?.access && !!user;
  const lacksAppRole =
    isAuthenticated &&
    requireAppRole &&
    !user?.is_platform_admin &&
    (appRoles.length === 0 ||
      (!!requireRoleKey && !appRoles.includes(requireRoleKey)));

  useEffect(() => {
    if (loaded && isAuthenticated && lacksAppRole) {
      setLocation('/pending-approval');
    }
  }, [loaded, isAuthenticated, lacksAppRole, setLocation]);

  if (!loaded && tokens?.access) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-earth-500 text-sm">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (requirePlatformAdmin && !user?.is_platform_admin) {
    return <Redirect to="/" />;
  }

  if (lacksAppRole) {
    return <Redirect to="/pending-approval" />;
  }

  return <>{children}</>;
}

export function AdminOnlyRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAppRole requireRoleKey={PH_ADMIN_ROLE}>
      {children}
    </ProtectedRoute>
  );
}
