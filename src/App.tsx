import { useEffect, useState } from "react";

import api from "@/api";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.getData();
      setData(response.data);
    } 

    fetchData();
  }, []);

  return (
    <div>
      <h1>Wepback Module Federation Remote App</h1>
      <div>
        {JSON.stringify(data, null, 2)}
      </div>
    </div>
  );
};

export default App;