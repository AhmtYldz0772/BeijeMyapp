import React from "react";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
