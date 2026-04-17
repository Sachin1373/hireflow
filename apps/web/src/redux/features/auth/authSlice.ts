import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


type User = {
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isSessionRestored: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isSessionRestored: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isSessionRestored = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isSessionRestored = true;
    },
    setSessionRestored: (state, action: PayloadAction<boolean>) => {
      state.isSessionRestored = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isSessionRestored = true;
    },
  },
});

export const { setCredentials, logout, setAccessToken, setUser, setSessionRestored } = authSlice.actions;
export default authSlice.reducer;