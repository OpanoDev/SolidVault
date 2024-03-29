import { Platform, StubPlatform } from "@padloc/core/src/platform";
import { NodeCryptoProvider } from "../crypto/node";

export class NodePlatform extends StubPlatform implements Platform {
    crypto = new NodeCryptoProvider();
}
