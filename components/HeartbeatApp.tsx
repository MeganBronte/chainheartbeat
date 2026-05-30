"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  HeartPulse,
  Loader2,
  Radio,
  Sparkles,
} from "lucide-react";
import {
  useAccount,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import { CHAIN_HEARTBEAT_ADDRESS, chainHeartbeatAbi } from "@/lib/contract";
import { builderDataSuffix } from "@/lib/wagmi";
import { WalletPanel } from "./WalletPanel";

function formatNumber(value?: bigint) {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0n));
}

function formatTime(value?: bigint) {
  if (!value) return "No pulse yet";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(Number(value) * 1000);
}

function shortHash(hash?: `0x${string}`) {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function HeartbeatApp({ view }: { view: "home" | "pulse" }) {
  const [instantReward, setInstantReward] = useState(0);
  const { address, chainId, isConnected } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { writeContract, data: hash, isPending: isWriting, error: writeError } = useWriteContract();

  const totalQuery = useReadContract({
    address: CHAIN_HEARTBEAT_ADDRESS,
    abi: chainHeartbeatAbi,
    functionName: "totalHeartbeats",
    chainId: base.id,
    query: { refetchInterval: 12_000 },
  });

  const userCountQuery = useReadContract({
    address: CHAIN_HEARTBEAT_ADDRESS,
    abi: chainHeartbeatAbi,
    functionName: "userCount",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: Boolean(address), refetchInterval: 12_000 },
  });

  const lastHeartbeatQuery = useReadContract({
    address: CHAIN_HEARTBEAT_ADDRESS,
    abi: chainHeartbeatAbi,
    functionName: "lastHeartbeat",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: Boolean(address), refetchInterval: 12_000 },
  });

  const receipt = useWaitForTransactionReceipt({
    hash,
    chainId: base.id,
  });

  useEffect(() => {
    if (!receipt.isSuccess) return;
    totalQuery.refetch();
    userCountQuery.refetch();
    lastHeartbeatQuery.refetch();
  }, [receipt.isSuccess, totalQuery, userCountQuery, lastHeartbeatQuery]);

  const wrongNetwork = isConnected && chainId !== base.id;
  const ctaLabel = useMemo(() => {
    if (!isConnected) return "Connect Wallet First";
    if (wrongNetwork) return "Switch to Base";
    if (isWriting || receipt.isLoading) return "Recording...";
    return "Send Heartbeat";
  }, [isConnected, isWriting, receipt.isLoading, wrongNetwork]);

  const onHeartbeat = () => {
    if (!isConnected) return;
    if (wrongNetwork) {
      switchChain({ chainId: base.id });
      return;
    }
    setInstantReward((value) => value + 1);
    writeContract({
      address: CHAIN_HEARTBEAT_ADDRESS,
      abi: chainHeartbeatAbi,
      functionName: "heartbeat",
      chainId: base.id,
      dataSuffix: builderDataSuffix,
    });
  };

  const userCount = userCountQuery.data ?? 0n;
  const optimisticCount = userCount + BigInt(instantReward);

  return (
    <main className="appShell">
      <header className="topBar">
        <Link className="brandMark" href="/" aria-label="ChainHeartbeat home">
          <span className="brandIcon">
            <HeartPulse size={19} aria-hidden />
          </span>
          <span>ChainHeartbeat</span>
        </Link>
        <WalletPanel />
      </header>

      <nav className="tabBar" aria-label="Primary">
        <Link className={view === "home" ? "tab active" : "tab"} href="/">
          <HeartPulse size={16} aria-hidden />
          Heartbeat
        </Link>
        <Link className={view === "pulse" ? "tab active" : "tab"} href="/pulse">
          <Activity size={16} aria-hidden />
          Pulse Log
        </Link>
      </nav>

      {view === "home" ? (
        <section className="homeGrid">
          <div className="heroCopy">
            <p className="eyebrow">World Heartbeat on Base</p>
            <h1>Record your presence onchain.</h1>
            <p className="lead">
              Send unlimited heartbeats to create a permanent life trace on Base. No token
              purchase, no platform fee, only network gas.
            </p>

            <div className="rewardStrip" aria-live="polite">
              <Sparkles size={18} aria-hidden />
              <span>Instant reward preview</span>
              <strong>+{instantReward || 1} Presence Point</strong>
            </div>

            <button
              className="primaryAction"
              type="button"
              disabled={(isWriting || receipt.isLoading || isSwitching) && isConnected}
              onClick={onHeartbeat}
            >
              {isWriting || receipt.isLoading || isSwitching ? (
                <Loader2 className="spin" size={20} aria-hidden />
              ) : (
                <HeartPulse size={20} aria-hidden />
              )}
              {ctaLabel}
            </button>

            <div className="statusLine">
              {receipt.isSuccess && hash ? (
                <a href={`https://basescan.org/tx/${hash}`} target="_blank" rel="noreferrer">
                  Recorded: {shortHash(hash)}
                  <ExternalLink size={14} aria-hidden />
                </a>
              ) : writeError ? (
                <span>{writeError.message}</span>
              ) : (
                <span>Each heartbeat permanently appends one record to the contract.</span>
              )}
            </div>
          </div>

          <div className="heroVisual" aria-label="ChainHeartbeat illustration">
            <Image
              src="/chain-heartbeat-hero.png"
              alt="A hand-drawn person carrying a large red heart"
              fill
              priority
              sizes="(max-width: 768px) 92vw, 42vw"
            />
          </div>
        </section>
      ) : (
        <section className="pulseGrid">
          <div className="pulsePanel">
            <p className="eyebrow">Live Contract Pulse</p>
            <h1>Your heartbeat trail</h1>
            <p className="lead">
              Every click calls the deployed ChainHeartbeat contract. The count can grow forever.
            </p>
            <button className="primaryAction compact" type="button" onClick={onHeartbeat}>
              <HeartPulse size={20} aria-hidden />
              {ctaLabel}
            </button>
          </div>

          <div className="metricsGrid">
            <article className="metricCard">
              <Radio size={19} aria-hidden />
              <span>Total Heartbeats</span>
              <strong>{formatNumber(totalQuery.data)}</strong>
            </article>
            <article className="metricCard">
              <HeartPulse size={19} aria-hidden />
              <span>Your Presence Points</span>
              <strong>{formatNumber(optimisticCount)}</strong>
            </article>
            <article className="metricCard">
              <Clock3 size={19} aria-hidden />
              <span>Last Heartbeat</span>
              <strong>{formatTime(lastHeartbeatQuery.data)}</strong>
            </article>
            <article className="metricCard">
              <CircleDollarSign size={19} aria-hidden />
              <span>App Fee</span>
              <strong>$0</strong>
            </article>
          </div>

          <div className="contractBand">
            <span>Contract</span>
            <a
              href={`https://basescan.org/address/${CHAIN_HEARTBEAT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
            >
              {CHAIN_HEARTBEAT_ADDRESS.slice(0, 12)}...{CHAIN_HEARTBEAT_ADDRESS.slice(-10)}
              <ArrowRight size={16} aria-hidden />
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
