import { useState, useEffect } from "react";
import axios from "axios";

export const useManagementData = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllForms = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://mft-zwy7.onrender.com/api/data/forms", {
        withCredentials: true,
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setForms(data);
      setFilteredForms(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllForms();
  }, []);

  return { forms, filteredForms, setFilteredForms, loading, error, fetchAllForms };
};