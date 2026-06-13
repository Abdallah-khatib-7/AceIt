import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handle = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  return size;
};

export const useIsMobile = () => {
  const { width } = useWindowSize();
  return width < 768;
};

export const useIsTablet = () => {
  const { width } = useWindowSize();
  return width < 1024;
};