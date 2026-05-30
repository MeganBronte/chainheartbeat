"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, LogOut, Wallet } from "lucide-react";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";

function shortAddress(address?: `0x${string}`) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function connectorLabel(connector: Connector) {
  const id = connector.id.toLowerCase();
  const name = connector.name.toLowerCase();

  if (id.includes("coinbase") || name.includes("coinbase")) return "Coinbase Wallet";
  if (id.includes("okx") || name.includes("okx")) return "OKX Wallet";
  if (id.includes("metamask") || name.includes("metamask")) return "MetaMask";
  if (id.includes("injected")) return "Browser Wallet";
  return connector.name;
}

function connectorKey(connector: Connector) {
  return `${connector.id}:${connector.name}`;
}

function isBaseOrCoinbaseBrowser() {
  if (typeof window === "undefined") return false;
  const ethereum = (window as Window & {
    ethereum?: {
      isCoinbaseWallet?: boolean;
      selectedProvider?: { isCoinbaseWallet?: boolean };
    };
  }).ethereum;
  const userAgent = window.navigator.userAgent.toLowerCase();

  return Boolean(
    ethereum?.isCoinbaseWallet ||
      ethereum?.selectedProvider?.isCoinbaseWallet ||
      userAgent.includes("coinbase") ||
      userAgent.includes("baseapp"),
  );
}

export function WalletPanel() {
  const [open, setOpen] = useState(false);
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending, variables, error } = useConnect({
    mutation: {
      onError(connectError) {
        console.error(connectError);
      },
    },
  });
  const { disconnect } = useDisconnect();

  const uniqueConnectors = useMemo(() => {
    const seen = new Set<string>();
    return connectors.filter((item) => {
      const label = connectorLabel(item);
      if (seen.has(label)) return false;
      seen.add(label);
      return true;
    });
  }, [connectors]);

  useEffect(() => {
    if (isConnected || !isBaseOrCoinbaseBrowser()) return;
    if (window.localStorage.getItem("chainheartbeat:manual-disconnect") === "true") return;

    const injectedConnector = connectors.find((item) => item.id.includes("injected"));
    if (injectedConnector) connect({ connector: injectedConnector });
  }, [connect, connectors, isConnected]);

  return (
    <div className="walletShell">
      <button className="walletButton" type="button" onClick={() => setOpen((value) => !value)}>
        <Wallet size={18} aria-hidden />
        <span>{isConnected ? shortAddress(address) : "Connect Wallet"}</span>
        <ChevronDown size={16} aria-hidden />
      </button>

      {open ? (
        <div className="walletMenu">
          {isConnected ? (
            <>
              <div className="walletStatus">
                <Check size={16} aria-hidden />
                <span>{connector ? connectorLabel(connector) : "Connected"}</span>
              </div>
              <button
                className="walletOption danger"
                type="button"
                onClick={() => {
                  window.localStorage.setItem("chainheartbeat:manual-disconnect", "true");
                  disconnect();
                  setOpen(false);
                }}
              >
                <LogOut size={16} aria-hidden />
                Disconnect
              </button>
            </>
          ) : (
            uniqueConnectors.map((item) => (
              <button
                className="walletOption"
                type="button"
                key={connectorKey(item)}
                disabled={isPending}
                onClick={() => {
                  window.localStorage.removeItem("chainheartbeat:manual-disconnect");
                  connect({ connector: item });
                }}
              >
                <Wallet size={16} aria-hidden />
                {variables?.connector &&
                "id" in variables.connector &&
                variables.connector.id === item.id &&
                isPending
                  ? "Connecting..."
                  : connectorLabel(item)}
              </button>
            ))
          )}
          {error ? (
            <p className="walletError">
              Wallet provider not found. Open this page inside that wallet browser or enable the
              wallet extension, then try again.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
