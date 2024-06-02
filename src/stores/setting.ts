import { create } from "zustand";

type SettingState = {
    collapsed: boolean;
    headerHeight: string;
    siderWidth: string;
};

type SettingAction = {
    setCollapsed: (collapsed: boolean) => void;
};

export const useSettingStore = create<SettingState & SettingAction>((set) => ({
    collapsed: false,
    setCollapsed: (collapsed) =>
        set({
            collapsed,
        }),
    headerHeight: "48px",
    siderWidth: "220px",
}));
