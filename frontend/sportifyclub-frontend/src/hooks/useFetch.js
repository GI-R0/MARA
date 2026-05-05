import { useState, useEffect } from "react";
import API from "../api/axiosConfig";

export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    API.get(url)
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.msg || "Error al cargar datos");
          setData([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
};
