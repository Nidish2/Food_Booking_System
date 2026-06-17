import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme } = useTheme();
  return (
    <>
      <AppRoutes />
      <Toaster position="bottom-right" richColors theme={theme as 'light' | 'dark' | 'system'} />
    </>
  );
}
