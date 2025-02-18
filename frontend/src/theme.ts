import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "dark.900",
        color: "white",
      },
    },
  },
  colors: {
    dark: {
      1000: "#000",
      900: "#111827",
      800: "#1F2937",
      700: "#374151",
      600: "#4B5563",
      500: "#6B7280",
      400: "#9CA3AF",
      300: "#D1D5DB",
      200: "#E5E7EB",
      100: "#F3F4F6",
    },
    yellow: {
      500: "#F59E0B",
      400: "#FBBF24",
      300: "#FCD34D",
      200: "#FDE68A",
      100: "#FEF3C7",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
      },
      variants: {
        primary: {
          bg: "blue.500",
          color: "white",
          _hover: {
            bg: "blue.600",
          },
        },
        secondary: {
          bg: "dark.700",
          color: "white",
          _hover: {
            bg: "dark.600",
          },
        },
      },
    },
  },
});
