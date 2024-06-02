import { create } from "zustand";
import { UserModel } from "@/api";

type UserState = {
    user?: UserModel;
};

type UserAction = {
    setUser: (user: UserModel) => void;
};

export const useUserStore = create<UserState & UserAction>((set) => ({
    setUser: (user) => set({ user }),
}));
