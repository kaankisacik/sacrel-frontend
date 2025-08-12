import { defineStore } from "pinia";

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company?: string | null;
  address_1: string;
  address_2?: string | null;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  phone?: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    customer: null as Customer | null,
    addresses: [] as Address[],
    isLoading: false,
    error: null as string | null,
    isAuthenticated: false,
  }),

  getters: {
    fullName: (state) => {
      if (!state.customer) return "";
      return `${state.customer.first_name} ${state.customer.last_name}`.trim();
    },

    primaryAddress: (state) => {
      return state.addresses.length > 0 ? state.addresses[0] : null;
    },
  },

  actions: {
    async init() {
      // Check if customer is logged in using Medusa client
      if (process.client) {
        try {
          await this.getCustomer();
        } catch (error) {
          // Customer might not be authenticated
          this.logout();
        }
      }
    },

    async setToken(token: string) {
      if (import.meta.client) {
        localStorage.setItem("medusa_auth_token", token);
      }
    },

    async getToken() {
      if (import.meta.client) {
        return localStorage.getItem("medusa_auth_token");
      }
    },

    async clearToken() {
      if (import.meta.client) {
        localStorage.removeItem("medusa_auth_token");
      }
    },

    async login(email: string, password: string) {
      this.isLoading = true;
      this.error = null;
      console.log("Attempting to login with email:", email);

      try {
        const client = useMedusaClient();
        await client.auth
          .login("customer", "emailpass", {
            email: email,
            password: password,
          })
          .then((token) => {
            this.setToken(token as string);
          });

        console.log("Login token set successfully");

        // customer is now authenticated
        // all subsequent requests will use the token in the header
        try {
          const { customer } = await client.store.customer.retrieve(undefined, {
            Authorization: `Bearer ${this.getToken()}`,
          });

          if (!customer) {
            throw new Error("Müşteri bilgileri alınamadı");
          }

          console.log("Authenticated customer:", customer);

          this.customer = customer as Customer;
          this.isAuthenticated = true;

          await this.getAddresses();

          return { success: true };
        } catch (customerError: any) {
          // If customer doesn't exist, this might be an admin or other actor type
          // trying to login as customer. We should handle this gracefully.
          console.warn("Customer not found during login:", customerError);
          throw new Error("Bu hesap bir müşteri hesabı değil");
        }
      } catch (error: any) {
        this.error = error.message || "Giriş yapılamadı";
        console.error("Login error:", error);
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    async register(data: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      phone?: string;
    }) {
      this.isLoading = true;
      this.error = null;

      try {
        const client = useMedusaClient();

        // Step 1: Try to obtain registration JWT token
        try {
          const token = await client.auth.register("customer", "emailpass", {
            email: data.email,
            password: data.password,
          });

          console.log("Registration token obtained successfully");
          await this.setToken(token);

          console.log("Registration token set successfully");

          const { customer: createdCustomer } =
            await client.store.customer.create(
              data,
              {},
              {
                Authorization: `Bearer ${token}`,
              }
            );

          if (!createdCustomer) {
            throw new Error("Müşteri oluşturulamadı");
          }

          console.log("Customer created successfully:", createdCustomer);

          this.customer = createdCustomer as Customer;
          this.isAuthenticated = true;

          // Store authentication state in localStorage

          await this.login(data.email, data.password);
        } catch (error: any) {
          // Check if the error is about existing identity
          if (
            error?.response?.status === 401 ||
            error?.message?.includes("Identity with email already exists") ||
            error?.statusText === "Unauthorized"
          ) {
            // Step 2: If identity exists, try to login with the same credentials
            // This allows admin users or other actor types to also become customers
            try {
              const loginResponse = await client.auth.login(
                "customer",
                "emailpass",
                {
                  email: data.email,
                  password: data.password,
                }
              );

              if (typeof loginResponse !== "string") {
                // Handle multi-step authentication if needed
                throw new Error(
                  "Authentication requires additional steps which is not supported by this flow"
                );
              }
            } catch (loginError: any) {
              // If login fails, the existing identity has different credentials
              throw new Error(
                "Bu e-posta adresi zaten kullanımda ve şifre eşleşmiyor"
              );
            }
          } else {
            // For other registration errors, throw them
            throw error;
          }
        }

       
      } catch (error: any) {
        this.error = error.message || "Kayıt oluşturulamadı";
        console.error("Registration error:", error);
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.isLoading = true;

      try {
        const medusa = useMedusaClient();
        await medusa.auth.logout();
      } catch (error) {
        console.error("Logout error:", error);
      }

      this.customer = null;
      this.addresses = [];
      this.isAuthenticated = false;
      this.error = null;

      if (process.client) {
        localStorage.removeItem("medusa_auth_token");
      }

      this.isLoading = false;

      // Redirect to home page
      await navigateTo("/");
    },

    async getCustomer() {
      if (!this.isAuthenticated && !process.client) {
        return;
      }

      if (process.client && !localStorage.getItem("medusa_auth_token")) {
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const client = useMedusaClient();
        const { customer } = await client.store.customer.retrieve(undefined, {
          Authorization: `Bearer ${this.getToken()}`,
        });

        this.customer = customer as Customer;
        this.isAuthenticated = true;

        await this.getAddresses();
      } catch (error: any) {
        this.error = error.message || "Müşteri bilgileri getirilemedi";
        this.isAuthenticated = false;
        console.error("Get customer error:", error);

        if (process.client) {
          localStorage.removeItem("medusa_auth_token");
        }
      } finally {
        this.isLoading = false;
      }
    },

    async updateCustomer(data: {
      first_name?: string;
      last_name?: string;
      phone?: string;
    }) {
      if (!this.customer)
        return { success: false, error: "Müşteri bulunamadı" };

      this.isLoading = true;
      this.error = null;

      try {
        const client = useMedusaClient();
        const { customer } = await client.store.customer.update(
          data,
          undefined,
          {
            Authorization: `Bearer ${this.getToken()}`,
          }
        );

        this.customer = customer as Customer;

        return { success: true };
      } catch (error: any) {
        this.error = error.message || "Profil güncellenemedi";
        console.error("Update customer error:", error);
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    async getAddresses() {
      if (!this.customer) return;

      try {
        const client = useMedusaClient();
        const { addresses } = await client.store.customer.listAddress(
          undefined,
          {
            Authorization: `Bearer ${this.getToken()}`,
          }
        );

        this.addresses = (addresses || []) as Address[];
      } catch (error: any) {
        console.error("Get addresses error:", error);
      }
    },

    async addAddress(addressData: any) {
      if (!this.customer)
        return { success: false, error: "Müşteri bulunamadı" };

      this.isLoading = true;
      this.error = null;

      try {
        const client = useMedusaClient();
        await client.store.customer.createAddress(addressData, undefined, {
          Authorization: `Bearer ${this.getToken()}`,
        });

        await this.getAddresses();

        return { success: true };
      } catch (error: any) {
        this.error = error.message || "Adres eklenemedi";
        console.error("Add address error:", error);
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    async updateAddress(addressId: string, addressData: any) {
      if (!this.customer)
        return { success: false, error: "Müşteri bulunamadı" };

      this.isLoading = true;
      this.error = null;

      try {
        const client = useMedusaClient();
        await client.store.customer.updateAddress(
          addressId,
          addressData,
          undefined,
          {
            Authorization: `Bearer ${this.getToken()}`,
          }
        );

        await this.getAddresses();

        return { success: true };
      } catch (error: any) {
        this.error = error.message || "Adres güncellenemedi";
        console.error("Update address error:", error);
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    async deleteAddress(addressId: string) {
      if (!this.customer)
        return { success: false, error: "Müşteri bulunamadı" };

      this.isLoading = true;
      this.error = null;

      try {
        const client = useMedusaClient();
        await client.store.customer.deleteAddress(addressId, {
          Authorization: `Bearer ${this.getToken()}`,
        });

        await this.getAddresses();

        return { success: true };
      } catch (error: any) {
        this.error = error.message || "Adres silinemedi";
        console.error("Delete address error:", error);
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    async getOrders() {
      if (!this.customer) return { orders: [], success: false };

      try {
        const medusa = useMedusaClient();
        const { orders } = await medusa.store.order.list();
        return { orders: orders || [], success: true };
      } catch (error: any) {
        console.error("Get orders error:", error);
        return { orders: [], success: false, error: error.message };
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
