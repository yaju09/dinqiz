import "../styles/globals.css";
//global context provider
import { GlobalStateProvider } from "../components/utils/globalContext";

function MyApp({ Component, pageProps }) {
  return (
    <GlobalStateProvider>
      <Component {...pageProps} />;
    </GlobalStateProvider>
  );
}

export default MyApp;
