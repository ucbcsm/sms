"use server";

import api, { authApi } from "@/lib/fetcher";
import { Faculty, Role, User } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ALL_APPS } from "../data/apps";

/**
 * Represents a user session, which may include authentication tokens,
 * user information, and potential error details.
 *
 * @typedef {Session}
 * @property {string | null} accessToken - The access token for the session, or null if not available.
 * @property {string | null} refreshToken - The refresh token for the session, or null if not available.
 * @property {Record<string, any> | null} user - An object containing user information, or null if not available.
 * @property {string | null} error - An error message, or null if no error occurred.
 */
export type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  error: string | null;
  apps:any[]
} | null;

export async function isAuthenticated(accessToken: string | undefined) {
  if (!accessToken) return false; // Pas de token, pas authentifié.

  try {
    await authApi.get("/users/me/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return true; // ✅ token valide
  } catch (error: any) {
    if (error?.response?.status === 401) {
      return false; // ❌ token expiré ou invalide
    }
    throw error; // autre erreur → on la laisse remonter (problème serveur, etc.)
  }
}

/**
 * Retrieves the server session, including access and refresh tokens, and user information.
 *
 * @returns {Promise<Session>} A promise that resolves to a `Session` object containing the access token,
 * refresh token, user data, and error information. Returns `null` if the access token or user data is unavailable.
 *
 * @throws {Error} Throws an error if the server session retrieval fails.
 *
 * @example
 * ```typescript
 * const session = await getServerSession();
 * if (session) {
 *   console.log("User:", session.user);
 * } else {
 *   console.log("No session available");
 * }
 * ```
 */
export const getServerSession = async (): Promise<Session> => {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || null;
    const refreshToken = cookieStore.get("refreshToken")?.value || null;

    if (!accessToken || !refreshToken) {
      return null;
    }

    let user = null;
    let apps: any[] = [];
    try {
      const userResponse = await authApi.get("/users/me/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      user = userResponse.data;

      const allRolesResponse = await api.get(`/account/roles/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const allRoles = allRolesResponse.data as Role[];

      apps = await getUserApps({
        userRoles: user.roles,
        allRoles: allRoles,
        is_staff: user.is_staff,
        is_student: user.is_student,
        is_superuser: user.is_superuser,
        is_active: user.is_active,
      });

    
    } catch (error: any) {
      if (error?.response?.status === 401) {
        // Unauthorized, session is invalid
        return null;
      }
      throw error;
    }

    // if (!user) {
    //   return null;
    // }

    return {
      accessToken,
      refreshToken,
      user,
      error: null,
      apps,
    };
  } catch (error: any) {
    throw new Error(`${error.message} Failed to get server session`);
  }
};

/**
 * Authenticates a user by sending their credentials to the authentication API
 * and storing the resulting access and refresh tokens in cookies.
 *
 * @param credentials - An object containing the user's login credentials.
 * @param credentials.matricule - The user's matricule (identifier).
 * @param credentials.password - The user's password.
 *
 * @throws {Error} Throws an error if the login request fails (non-200 status).
 *
 * @remarks
 * This function uses the `use server` directive and is designed to run on the server side.
 * It interacts with the `next/headers` module to manage cookies and redirects the user
 * to the `/app` route upon successful login.
 *
 * @example
 * ```typescript
 * const credentials = { matricule: "12345", password: "securePassword" };
 * await login(credentials);
 * ```
 */
export const login = async (credentials: {
  matricule: string;
  password: string;
}) => {
  try {
    const Cookies = await cookies();

    const res = await authApi.post("/jwt/create", credentials);

    if (res.status !== 200) {
      throw new Error("Login failed");
    }

    const { access, refresh } = res.data as {
      access: string;
      refresh: string;
    };

    if (!access || !refresh) {
      throw new Error("Invalid login response");
    } else {
      const userResponse = await authApi.get("/users/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      const user = userResponse.data;

      if (user.is_active) {
        Cookies.set("accessToken", access);
        Cookies.set("refreshToken", refresh);
      } else {
        throw new Error("");
      }
    }
  } catch (error: any) {
    if (error?.status === 401) {
      throw new Error("Invalid credentials. Please try again.");
    }

    throw new Error("An error occurred during login. Please try again.");
  }
};

/**
 * Logs out the user by invalidating their session tokens and clearing cookies.
 *
 * @throws {Error} Throws an error if the logout process fails.
 *
 * @remarks
 * This function interacts with the `next/headers` module to manage cookies and
 * redirects the user to the `/auth/login` route upon successful logout.
 *
 * @example
 * ```typescript
 * await logout();
 * ```
 */
export const logout = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
      console.warn("Missing tokens during logout");
      throw new Error("Missing tokens");
    }

    // Invalidate tokens on the server
    await authApi.post(
      "/token/logout",
      {
        // refresh: refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Clear cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    // Redirect to login page
    // redirect("/auth/login");
  } catch (error: any) {
    console.error("Error during logout:", error.message || error);
    throw new Error("An error occurred during logout. Please try again.");
  }
};

/**
 * Resets the password for a user by sending a password reset email to the provided email address.
 *
 * @decorator `async`
 *
 * @param email - The email address of the user requesting the password reset.
 *
 * @throws {Error} Throws an error if the password reset request fails.
 *
 * @example
 * ```typescript
 * try {
 *   await resetPassword("user@example.com");
 *   console.log("Password reset email sent successfully.");
 * } catch (error) {
 *   console.error("Failed to send password reset email:", error);
 * }
 * ```
 */
export const resetPassword = async (email: string) => {
  try {
    const res = await authApi.post("/users/reset_password/", { email });
    console.log("Res: ", res);
  } catch (error: any) {
    console.error("Error during password reset:", error);
    // console.error("Error during password reset:", error.message || error);
    // throw new Error(
    //   "An error occurred while attempting to reset the password. Please try again."
    // );
  }
};

/**
 * Confirms the password reset process by sending the provided form data to the server.
 *
 * @param formData - An object containing the necessary data for password reset confirmation.
 * @param formData.new_password - The new password to be set.
 * @param formData.re_new_password - Confirmation of the new password.
 * @param formData.token - The token received for password reset verification.
 * @param formData.uid - The user ID associated with the password reset request.
 *
 * @throws {Error} Throws an error if the password reset confirmation fails.
 *
 * @example
 * ```typescript
 * await resetPasswordConfirm({
 *   new_password: "newPassword123",
 *   re_new_password: "newPassword123",
 *   token: "resetToken",
 *   uid: "userId",
 * });
 * ```
 */
export const resetPasswordConfirm = async (formData: {
  new_password: string;
  re_new_password: string;
  token: string;
  uid: string;
}) => {
  try {
    await authApi.post("/users/reset_password_confirm/", {
      uid: formData.uid,
      token: formData.token,
      new_password: formData.new_password,
      re_new_password: formData.re_new_password,
    });

    redirect("/auth/login");
  } catch (error: any) {
    console.error(
      "Error during password reset confirmation:",
      error.message || error
    );
    throw new Error(
      "An error occurred while confirming the password reset. Please try again."
    );
  }
};

export const getAsignedFaculty = async () => {
  const session = await getServerSession();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }

  try {
    const res = await api.get(`/account/faculty-from-user/`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    return res.data as Faculty;
  } catch (error: any) {
    if (
      error?.response?.status === 404 ||
      error?.response?.status === 503 ||
      error?.response?.status === 400
    ) {
      return null;
    }
    throw error;
  }
};

export const getUserApps = async (inputsData: {
  userRoles: Role[];
  allRoles: Role[];
  is_staff?: boolean;
  is_student?: boolean;
  is_superuser?: boolean;
  is_active: boolean;
}) => {
  return ALL_APPS.filter((app) => {
    if (!inputsData.is_active) return false;

    // Superuser has access to all apps
    if (inputsData.is_superuser && app.id !== "is_student") return true;

    // Check is_student for student app
    if (app.id === "is_student" && inputsData.is_student) return true;

    // Check is_staff for teacher app
    if (app.id === "is_teacher" && inputsData.is_staff) return true;

    // For other apps, check role-based access
    const userRoleNames = inputsData.userRoles.map((role) => role.name);
    const appRequiredRoleIds = app.roles || [];

    return appRequiredRoleIds.some((roleName) =>
      userRoleNames.includes(roleName)
    );
  });
};
