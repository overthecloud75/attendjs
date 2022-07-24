import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url, params, clickCount) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(url, {params});
            setData(res.data);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
        };
        fetchData();
    }, [url, clickCount]);
    return { data, loading, error };
};

export default useFetch;