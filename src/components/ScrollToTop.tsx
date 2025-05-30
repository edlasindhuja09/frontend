// components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Delay scroll to top so animation can complete
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 350); // match animation duration slightly

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
