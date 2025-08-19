export const useAuth = () => {
  const medusa = useMedusaClient();

  //setToken
  const setToken = async (token: string) => {
    await medusa.client.setToken(token);

    // Store token in localStorage for persistence
    if (import.meta.client) {
      localStorage.setItem("medusa_auth_token", token);
    }
  };

  //removeToken
  const removeToken = async () => {
    await medusa.client.clearToken();

    // Remove from localStorage
    if (import.meta.client) {
      localStorage.removeItem("medusa_auth_token");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await medusa.auth.login("customer", "emailpass", {
        email,
        password,
      });

      if (typeof response !== "string") {
        alert("Authentication requires additional steps");
        // replace with the redirect logic of your application
        window.location.href = response.location;
        return;
      }

      setToken(response);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData: { email: string; password: string }) => {
    try {
      const response = await medusa.auth.register(
        "customer",
        "emailpass",
        userData
      );

      setToken(response);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // POST /auth/customer/{auth_provider}/reset-password
  const resetPassword = async (
    email: string,
    authProvider: string = "emailpass"
  ): Promise<void> => {
    try {
      await medusa.auth.resetPassword("customer", authProvider, {
        identifier: email,
      });
    } catch (error) {
      console.error("Reset password failed:", error);
      throw error;
    }
  };

  // POST /auth/token/refresh
  const refreshToken = async () => {
    try {
      const response = await medusa.auth.refresh();
      setToken(response);
      return response;
    } catch (error) {
      console.error("Token refresh failed:", error);
      await removeToken();
      throw error;
    }
  };

  // POST /auth/customer/{auth_provider}/update
  const updateAuth = async (
    updateData: {
      password: string;
    },
    token: string,
    authProvider: string = "emailpass"
  ) => {
    try {
      await medusa.auth.updateProvider(
        "customer",
        authProvider,
        updateData,
        token
      );
    } catch (error) {
      console.error("Auth update failed:", error);
      throw error;
    }
  };

  // POST /auth/customer/{auth_provider}/callback
  const handleCallback = async (
    callbackData: Record<string, any>,
    authProvider: string = "emailpass"
  ): Promise<string> => {
    try {
      const response = await medusa.auth.callback(
        "customer",
        authProvider,
        callbackData
      );
      return response;
    } catch (error) {
      console.error("Callback handling failed:", error);
      throw error;
    }
  };

  // DELETE /auth/session
  const logout = async (): Promise<void> => {
    try {
      await medusa.auth.logout();
      await removeToken();
    } catch (error) {
      console.error("Logout failed:", error);
      await removeToken();
      throw error;
    }
  };

  if (import.meta.client) {
    const storedToken = localStorage.getItem("medusa_auth_token");
    if (storedToken) {
      medusa.client.setToken(storedToken);
    }
  }

  return {
    login,
    register,
    resetPassword,
    refreshToken,
    updateAuth,
    handleCallback,
    logout,
  };
};
