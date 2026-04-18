import { useEffect, type ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, type RootState } from "@/redux/store";
import { StyledEngineProvider } from "@mui/material/styles";
import { theme } from "@/Theme";
import { refreshAccessToken, fetchMe } from "@/redux/features/auth/authAPI";
import { setAccessToken, setUser, setSessionRestored } from "@/redux/features/auth/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  children: ReactNode;
};

function AuthInitializer({ children }: Props) {
  const dispatch = useDispatch();
  const { isSessionRestored } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { accessToken } = await refreshAccessToken();
        dispatch(setAccessToken(accessToken));

        const { user } = await fetchMe();
        dispatch(setUser(user));

      } catch (error) {
        console.error("Session restoration failed:", error);
      } finally {
        dispatch(setSessionRestored(true));
      }
    };

    initAuth();
  }, [dispatch]);

  if (!isSessionRestored) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}

export function AppProviders({ children }: Props) {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthInitializer>{children}</AuthInitializer>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}