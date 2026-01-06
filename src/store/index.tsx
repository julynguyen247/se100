import { fetchAccountAPI } from "@/services/api";
import { create } from "zustand";

interface AppStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  setUser: (v: IUser | null) => void;
  user: IUser | null;
  fetchUser: (id: number) => Promise<void>;
}

const AuthStore = create<AppStore>()((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (v: boolean) => set(() => ({ isAuthenticated: v })),
  user: null,
  setUser: (v: IUser | null) => set(() => ({ user: v })),
  fetchUser: async () => {
    const res = await fetchAccountAPI();
    if (res.data) {
      set({
        user: res.data.user,
        isAuthenticated: true,
      });
    }
  },
}));
export default AuthStore;
