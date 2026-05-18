import { useEffect, type ReactNode } from 'react';
import { Redirect } from 'wouter';
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

  useEffect(() => {
    if (!loaded && tokens?.access) {
      void refreshMe();
    }
  }, [loaded, tokens?.access, refreshMe]);

  if (!loaded && tokens?.access) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-earth-500 text-sm">Loading…</div>
      </div>
    );
  }

  if (!tokens?.access || !user) {
    return <Redirect to="/login" />;
  }

  if (requirePlatformAdmin && !user.is_platform_admin) {
    return <Redirect to="/" />;
  }

  if (requireAppRole && !user.is_platform_admin) {
    if (appRoles.length === 0) {
      return <Redirect to="/pending-approval" />;
    }
    if (requireRoleKey && !appRoles.includes(requireRoleKey)) {
      return <Redirect to="/pending-approval" />;
    }
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
