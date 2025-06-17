import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme } = useNextTheme();
  // Selalu mengembalikan tema gelap dan fungsi setTheme yang kosong
  return { 
    theme: 'dark',
    setTheme: () => {} 
  };
}