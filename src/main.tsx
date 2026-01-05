import "./styles/global.css";
import ReactDOM from "react-dom/client";
import { App as AntdApp, ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import { AppProvider } from "./components/context/app.context";
import App from "./App";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <AntdApp>
    <AppProvider>
      <ConfigProvider locale={enUS}>
        <App />
      </ConfigProvider>
    </AppProvider>
  </AntdApp>
);
