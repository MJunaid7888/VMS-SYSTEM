"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

// Higher-order component to protect routes and handle authentication
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    requireAuth?: boolean;
    allowedRoles?: string[];
    redirectTo?: string;
  } = {}
) {
  const {
    requireAuth = true,
    allowedRoles = [],
    redirectTo = "/login",
  } = options;

  return function AuthenticatedComponent(props: P) {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Don't redirect while loading
      if (isLoading) return;

      // If authentication is required but user is not logged in
      if (requireAuth && (!user || !token)) {
        console.warn("Authentication required, redirecting to login");
        router.push(redirectTo);
        return;
      }

      // If specific roles are required, check user role
      if (
        allowedRoles.length > 0 &&
        user &&
        !allowedRoles.includes(user.role)
      ) {
        console.warn(
          `Access denied. Required roles: ${allowedRoles.join(
            ", "
          )}, User role: ${user.role}`
        );
        router.push("/unauthorized");
        return;
      }
    }, [user, token, isLoading, router]);

    // Show loading while checking authentication
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Don't render component if authentication checks fail
    if (requireAuth && (!user || !token)) {
      return null;
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Hook to check authentication status and handle token expiration
export function useAuthGuard(
  options: {
    requireAuth?: boolean;
    allowedRoles?: string[];
    redirectTo?: string;
  } = {}
) {
  const {
    requireAuth = true,
    allowedRoles = [],
    redirectTo = "/login",
  } = options;

  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If authentication is required but user is not logged in
    if (requireAuth && (!user || !token)) {
      console.warn("Authentication required, redirecting to login");
      router.push(redirectTo);
      return;
    }

    // If specific roles are required, check user role
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      console.warn(
        `Access denied. Required roles: ${allowedRoles.join(
          ", "
        )}, User role: ${user.role}`
      );
      router.push("/unauthorized");
      return;
    }
  }, [user, token, isLoading, router, requireAuth, allowedRoles, redirectTo]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!(user && token),
    hasRequiredRole:
      allowedRoles.length === 0 || (user && allowedRoles.includes(user.role)),
  };
}
