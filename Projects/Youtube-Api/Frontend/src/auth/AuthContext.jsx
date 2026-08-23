import { createContext, useContext, useMemo, useState } from "react";
import {
  getToken,
  getStoredUser,
  storeSession,
  clearSession,
} from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    getToken() ? getStoredUser() : null
  );

  const value = useMemo(
    () => ({
      user,
      isAuthed: Boolean(user),
      login: (data) => {
        storeSession(data);
        setUser({
          _id: data._id,
          channelName: data.channelName,
          email: data.email,
          phone: data.phone,
          logoUrl: data.logoUrl,
          logoId: data.logoId,
          subscribers: data.subscribers,
          subscribedChannels: data.subscribedChannels,
        });
      },
      logout: () => {
        clearSession();
        setUser(null);
      },
      refreshUser: (patch) =>
        setUser((u) => {
          const next = { ...u, ...patch };
          localStorage.setItem("opentube_user", JSON.stringify(next));
          return next;
        }),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
