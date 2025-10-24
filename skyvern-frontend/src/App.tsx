import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { router } from "./router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/QueryClient";

import { PostHogProvider } from "posthog-js/react";
import { LoggingContext, loggingStub } from "@/store/LoggingContext";
import { UserContext } from "@/store/UserContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const postHogOptions = {
  api_host: "https://app.posthog.com",
};

const getLogging = () => {
  return loggingStub;
};

const getUser = () => {
  return null;
};

function App() {
  return (
    <LoggingContext.Provider value={getLogging}>
      <UserContext.Provider value={getUser}>
        <PostHogProvider
          apiKey="phc_bVT2ugnZhMHRWqMvSRHPdeTjaPxQqT3QSsI3r5FlQR5"
          options={postHogOptions}
        >
          <QueryClientProvider client={queryClient}>
            <LanguageProvider>
              <ThemeProvider defaultTheme="dark">
                <RouterProvider router={router} />
              </ThemeProvider>
            </LanguageProvider>
          </QueryClientProvider>
        </PostHogProvider>
      </UserContext.Provider>
    </LoggingContext.Provider>
  );
}

export default App;
