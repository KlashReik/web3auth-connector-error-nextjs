import { useState, useEffect, PropsWithChildren } from "react";
import { Web3Auth } from "@web3auth/modal";
import {
  ConnectButton,
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { createClient, WagmiConfig, configureChains } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import {
  walletConnectWallet,
  rainbowWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { rainbowWeb3AuthConnector } from "../utils/RainbowWeb3authConnector";

const { chains, provider } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: "7wSu45FYTMHUO4HJkHjQwX4HFkb7k9Ui" }),
    alchemyProvider({ apiKey: "fGXusgBUDC-OPy6XI8IFRvu1i7sbWsYj" }),
    publicProvider(),
  ]
);
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [metaMaskWallet({ chains }), rainbowWeb3AuthConnector({ chains })],
  },
]);
const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

export const ClientOnly: React.FC<PropsWithChildren> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const web3auth = new Web3Auth({
      clientId: "YOUR_WEB3AUTH_CLIENT_ID", // Get your Client ID from Web3Auth Dashboard
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x1", // Please use 0x5 for Goerli Testnet
      },
    });
  }, []);

  if (!hasMounted) return null;

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <div
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "sans-serif",
            }}
          >
            <ConnectButton />
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
};

export default ClientOnly;
