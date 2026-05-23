import { createContext, useContext } from "react";
import type { User } from "./UseContextPage";

export const DashboardContext = createContext<User | undefined>(undefined);

export function useUserContext() {
    const user = useContext(DashboardContext);

    if(user === undefined) {
        throw new Error("useuserContext must be used with a DashboardContext");
    }

    return user;
}