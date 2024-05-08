import { useCallback } from "react";
import { useState } from "react";
const useInput = () => {
  const [value, setvalue] = useState("");
  const onChange = useCallback((e) => {
    setvalue(e.target.value);
  }, []);

  return [value, onChange, setvalue];
};

export default useInput;
