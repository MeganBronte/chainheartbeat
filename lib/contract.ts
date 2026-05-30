export const CHAIN_HEARTBEAT_ADDRESS =
  "0xFaed9B9BE7765Fa1d4ef80a0420522C956D3CBDE" as const;

export const chainHeartbeatAbi = [
  {
    type: "function",
    name: "heartbeat",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "totalHeartbeats",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "userCount",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "lastHeartbeat",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getHeartbeat",
    stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [
      { name: "user", type: "address" },
      { name: "timestamp", type: "uint256" },
      { name: "blockNumber", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "HeartbeatSent",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
      { name: "blockNumber", type: "uint256", indexed: false },
      { name: "userTotalCount", type: "uint256", indexed: false },
    ],
  },
] as const;
