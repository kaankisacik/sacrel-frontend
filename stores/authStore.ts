import { defineStore } from "pinia";
export const useAuthStore = defineStore("authStore", () => {
  const isUserAuthenticated = ref(false);
  const auth = useAuth();
  const customer = useCustomer();

  async function login(email: string, password: string) {
    try {
      await auth.login(email, password);
      isUserAuthenticated.value = true;
    } catch (err) {
      if ((err as any).message.includes("Unauthorized")) {
        throw new Error("Lütfen aynı giriş bilgilerini kullanarak kayıt olun.");
      }
      isUserAuthenticated.value = false;
    }
  }

  async function register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    metadata?: Record<string, any>;
  }) {
    const customerData = {
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
      metadata: userData.metadata,
    };
    try {
      await auth.register({
        email: userData.email,
        password: userData.password,
      });

      await customer.createCustomer(customerData);

      isUserAuthenticated.value = true;
    } catch (error) {
      if (error) {
        console.error("Registration failed:", error);
        if (
          (error as any).message.includes("Identity with email already exists")
        ) {
          try {
            await auth.login(userData.email, userData.password);

            await customer.createCustomer(customerData);
          } catch (error) {
            console.error("Login after registration failed:", error);
            if (
              (error as any).message.includes(
                "Request already authenticated as a customer."
              )
            ) {
              // throw new Error("Kullanıcı zaten kayıtlı. Lütfen giriş yapın.");
              navigateTo("/");
            }
            if ((error as any).message.includes("Invalid email or password")) {
              throw new Error(
                "Daha önce kayıt olurken kullandığınız e-posta adresi veya şifre yanlış."
              );
            }
          }
        }
        throw error;
      }
    }
  }

  function logout() {
    try {
      console.log("Logging out user...");

      auth
        .logout()
        .then(() => {
          console.log("User logged out successfully.");
        })
        .catch((error) => {
          console.error("Error during logout:", error);
        });
      isUserAuthenticated.value = false;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function checkUserAuthenticated() {
    customer
      .getCustomer()
      .then((storeCustomerResponse) => {
        isUserAuthenticated.value = true;
      })
      .catch(() => {
        auth
          .refreshToken()
          .then(() => {
            isUserAuthenticated.value = true;
          })
          .catch(() => {
            isUserAuthenticated.value = false;
          });
      });
  }

  ///[nuxt] `setInterval` should not be used on the server.
  // Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted`
  // lifecycle hook, or ensure you only call it in the browser by checking `false`.

  // To use lifecycle hooks like onMounted, call this function inside your component's setup()


  onNuxtReady(() => {
    checkUserAuthenticated();
    // Check user authentication every 60 seconds
    setInterval(() => {
      checkUserAuthenticated();
    }, 60000);
  });

  return {
    login,
    register,
    logout,
    isUserAuthenticated,
  };
});
