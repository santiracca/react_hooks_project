import { useReducer, useCallback } from "react";
const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...httpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return {
        loading: false,
        error: action.errorMessage,
      };
    case "CLEAR":
      return httpState;
    default:
      return httpState;
  }
};

const useHttp = () => {
  const [responseState, httpDispatch] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null,
  });

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      httpDispatch({ type: "SEND", identifier: reqIdentifier });
      fetch(url, {
        method: method,
        body: body,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          httpDispatch({ type: "RESPONSE", responseData, extra: reqExtra });
        })
        .catch((err) => {
          console.log(err);

          httpDispatch({ type: "ERROR", errorMessage: "SOMETHING WENT WRONG" });
        });
    },
    []
  );

  const clearRequest = useCallback(() => {
    httpDispatch({ type: "CLEAR" });
  }, []);
  return {
    isLoading: responseState.loading,
    data: responseState.data,
    error: responseState.error,
    sendRequest,
    clearRequest,
    reqExtra: responseState.extra,
    reqIdentifier: responseState.identifier,
  };
};

export default useHttp;
