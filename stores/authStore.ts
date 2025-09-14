import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", () => {
  const isUserAuthenticated = ref(false);
  const isCheckingAuth = ref(false);
  const authService = useAuth();
  const customerService = useCustomer();

  async function login(email: string, password: string) {
    try {
      await authService.login(email, password);
      isUserAuthenticated.value = true;
    } catch (err) {
      if ((err as any).message.includes("Unauthorized")) {
        throw new Error("Lütfen aynı giriş bilgilerini kullanarak kayıt olun.");
      }
      isUserAuthenticated.value = false;
      throw err;
    }
  }

  async function register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    metadata?: Record<string, any>;
  }) {
    const customerData = {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
      metadata: userData.metadata,
    };

    console.log("Registering user with data:", userData, customerData);

    try {
      console.log("Attempting to register user...");
      await authService.register({
        email: userData.email,
        password: userData.password,
      });
      console.log("User registered successfully, creating customer...");
      await customerService.createCustomer(customerData);
      console.log("Customer created successfully.");
      isUserAuthenticated.value = true;
    } catch (error) {
      console.log("Registration failed:", error);

      if (
        (error as any).message.includes("Identity with email already exists")
      ) {
        try {
          await authService.login(userData.email, userData.password);
          await customerService.createCustomer(customerData);
          isUserAuthenticated.value = true;
        } catch (loginError) {
          console.error("Login after registration failed:", loginError);
          if (
            (loginError as any).message.includes(
              "Request already authenticated as a customer."
            )
          ) {
            isUserAuthenticated.value = true;
            return navigateTo("/");
          }
          if (
            (loginError as any).message.includes("Invalid email or password")
          ) {
            throw new Error(
              "Daha önce kayıt olurken kullandığınız e-posta adresi veya şifre yanlış."
            );
          }
          throw loginError;
        }
      } else {
        throw error;
      }
    }
  }

  function logout() {
    try {
      console.log("Logging out user...");
      authService
        .logout()
        .then(() => {
          console.log("User logged out successfully.");
          isUserAuthenticated.value = false;
          // Clear any stored tokens
          if (process.client) {
            localStorage.removeItem("medusa_auth_token");
          }
        })
        .catch((error) => {
          console.error("Error during logout:", error);
          // Even if logout fails, clear local state
          isUserAuthenticated.value = false;
          if (process.client) {
            localStorage.removeItem("medusa_auth_token");
          }
        });
    } catch (error) {
      console.error("Logout failed:", error);
      isUserAuthenticated.value = false;
    }
  }

  async function checkUserAuthenticated(): Promise<boolean> {
    if (isCheckingAuth.value) {
      return isUserAuthenticated.value;
    }

    isCheckingAuth.value = true;

    try {
      // First try to get customer
      await customerService.getCustomer();
      isUserAuthenticated.value = true;
      console.log("User is authenticated.");
    } catch (error) {
      console.log("User is not authenticated. Trying to refresh token...");

      try {
        // Try to refresh token
        await authService.refreshToken();

        // Try to get customer again after refresh
        await customerService.getCustomer();
        isUserAuthenticated.value = true;
        console.log("Token refreshed successfully.");
      } catch (refreshError) {
        // If token refresh fails, clear everything
        console.error("Token refresh failed, user is not authenticated.");
        isUserAuthenticated.value = false;

        if (process.client) {
          localStorage.removeItem("medusa_auth_token");
        }
      }
    } finally {
      isCheckingAuth.value = false;
    }

    return isUserAuthenticated.value;
  }

  // Initialize auth check when store is created
  if (process.client) {
    onNuxtReady(() => {
      checkUserAuthenticated();

      // Check user authentication every 5 minutes instead of 5 seconds
      setInterval(() => {
        if (!isCheckingAuth.value) {
          checkUserAuthenticated();
        }
      }, 300000); // 5 minutes
    });
  }

  return {
    login,
    register,
    logout,
    checkUserAuthenticated,
    isUserAuthenticated,
    isCheckingAuth,
  };
});
