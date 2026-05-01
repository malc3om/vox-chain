import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  // In a production app, you would store this nonce in a database or Redis
  // tied to an IP address or a temporary session cookie to prevent replay attacks.
  const nonce = crypto.randomBytes(32).toString("hex");
  const message = `VoxChain Authentication\n\nPlease sign this message to verify your wallet ownership.\n\nNonce: ${nonce}`;
  
  return NextResponse.json({ nonce, message });
}
