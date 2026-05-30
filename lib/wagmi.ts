import { QueryClient } from "@tanstack/react-query";
import { Attribution } from "ox/erc8021";
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

// Fill this after base.dev returns the Builder Code, for example: bc_abcd1234.
export const BUILDER_CODE = "";

export const builderDataSuffix = (
  BUILDER_CODE
    ? Attribution.toDataSuffix({ codes: [BUILDER_CODE] })
    : "0x"
) as `0x${string}`;

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({ shimDisconnect: true }),
    injected({ target: "metaMask", shimDisconnect: true }),
    injected({ target: "okxWallet", shimDisconnect: true }),
    coinbaseWallet({
      appName: "ChainHeartbeat",
      preference: "all",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  dataSuffix: builderDataSuffix,
  ssr: true,
});

export const queryClient = new QueryClient();
