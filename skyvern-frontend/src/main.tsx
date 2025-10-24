import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// i18n設定をインポート（即座に初期化開始）
import "./i18n/config";

/**
 * グローバルローディング UI
 *
 * i18n の初期リソースロード中に表示
 * en/common は静的バンドルなので、通常は一瞬のみ表示
 */
// eslint-disable-next-line react-refresh/only-export-components
const GlobalLoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/*
      Suspense でi18nの初期化を待機
      - en/common は静的バンドルなので即座に利用可能
      - 他言語は動的ロードするが、Suspenseが自動的に待機
    */}
    <Suspense fallback={<GlobalLoadingFallback />}>
      <App />
    </Suspense>
  </React.StrictMode>,
);
