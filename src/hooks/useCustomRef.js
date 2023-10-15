import { useRef } from "react";

function useCustomRef() {
  const ref = useRef(null);
  const focus = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  return [ref, focus];
}

export default useCustomRef;
