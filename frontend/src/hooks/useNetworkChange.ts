import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { walletStore } from "@/stores";
import { EthereumMethod } from "@/types/ethereum";
import { ErrorType } from "@/types/error";

export const useNetworkChange = (showError: (error: ErrorType) => void) => {
  const navigate = useNavigate();
  const currentChainId = useRef<string | null>(null);

  const handleNetworkChange = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return;

    try {
      const newChainId = await window.ethereum.request({
        method: "eth_chainId" as EthereumMethod,
      });

      // Check if network is Sepolia (chainId: 0xaa36a7)
      if (newChainId !== "0xaa36a7") {
        showError(ErrorType.NETWORK);
      }

      if (
        typeof newChainId === "string" &&
        currentChainId.current &&
        newChainId !== currentChainId.current
      ) {
        await walletStore.disconnect();
        navigate("/", { replace: true });

        window.location.reload();
      }

      currentChainId.current = newChainId as string;
    } catch (error) {
      console.error("Failed to handle network change:", error);
    }
  }, [navigate, showError]);

  useEffect(() => {
    // Initial check
    handleNetworkChange();

    // Poll for changes
    const interval = setInterval(handleNetworkChange, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [handleNetworkChange]);
};
