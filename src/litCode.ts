import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK, LIT_RPC } from "@lit-protocol/constants";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LitRelay, GoogleProvider, getProviderFromUrl } from "@lit-protocol/lit-auth-client";
import { IRelayPKP } from "@lit-protocol/types";
import * as ethers from "ethers";

export const litGoogleOAuth = async () => {
  try {
    console.log("🔄 Connecting to the Lit network...");
    const litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected to the Lit network");

    console.log("🔄 Initializing LitAuthClient and GoogleProvider...");
    const litRelay = new LitRelay({
        // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
        relayApiKey: "<Your Lit Relay Server API Key>",
    });

    const googleProvider = new GoogleProvider({
      relay: litRelay,
      litNodeClient
    })
    console.log("✅ Initialized LitAuthClient and GoogleProvider");

    if (getProviderFromUrl() !== "google") {
      console.log("🔄 Signing in with Google...");
      googleProvider.signIn();
      console.log("✅ Signed in with Google");
    } else {
      console.log("🔄 Google Sign-in Valid, authenticating...")
    }

    const authMethod = await googleProvider.authenticate();
    console.log("✅ Authenticated with Google");

    console.log("Trying to fetch PKPs with fetchPKPs...");
    const fetchedPKPs = await googleProvider.fetchPKPs(authMethod);
    console.log("✅ Fetched PKPs");
    console.log(fetchedPKPs);

    /*
    If you need to mint a PKP:
    const pkp = await googleProvider.mintPKPThroughRelayer(authMethod);
    console.log("✅ Minted PKP");
    console.log(pkp);
    */

    /*
    const litContracts = new LitContracts({
      signer: new ethers.Wallet(ethers.Wallet.createRandom().privateKey, new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)),
      network: LIT_NETWORK.DatilDev,
      rpc: LIT_RPC.CHRONICLE_YELLOWSTONE
    });

    console.log("🔄 Connecting to Lit Contracts...");
    await litContracts.connect();
    console.log("✅ Connected to Lit Contracts");

    let pkps: IRelayPKP[] = [];
    try {
        const pkpPermissions = litContracts.pkpPermissionsContract;
        const tokenIds = await pkpPermissions.read.getTokenIdsForAuthMethod(
          authMethod.authMethodType,
          await googleProvider.getAuthMethodId(authMethod)
        );
        for (const tokenId of tokenIds) {
          const pubkey = await pkpPermissions.read.getPubkey(tokenId);
          if (pubkey) {
            const ethAddress = ethers.utils.computeAddress(pubkey);
            pkps.push({
              tokenId: tokenId.toString(),
              publicKey: pubkey,
              ethAddress: ethAddress,
            });
          }
        }
    } catch (error) {
      console.error("Failed to fetch PKPs from contract:", error);
    }
    console.log(pkps);
    */

  } catch (error) {
    console.error("Failed to connect to Lit Network:", error);
  }
};