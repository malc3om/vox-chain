import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import * as ed25519 from "@noble/ed25519";

// Using jose for JWTs as it's Edge compatible (Next.js Edge Runtime)
const getJwtSecret = () => {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
    console.warn("WARNING: JWT_SECRET environment variable is not set in production. Using fallback secret for build.");
  }
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "voxchain-super-secret-development-key-32-chars!"
  );
};

export async function POST(request: NextRequest) {
  try {
    const { address, signature, message } = await request.json();

    if (!address || !signature || !message) {
      return NextResponse.json(
        { error: "Missing required authentication fields." },
        { status: 400 }
      );
    }

    // ── Cryptographic Signature Verification ──
    // Using @noble/ed25519 to verify the Lace wallet signature
    let isValid = false;
    
    // Allow demo signatures in non-production environments
    if (process.env.NODE_ENV !== "production" && 
       (signature.startsWith('mock_signature_') || signature.startsWith('demo_signature_'))) {
      isValid = true;
    } else {
      try {
        // Clean up hex strings if they contain 0x prefix
        const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;
        const cleanSignature = signature.startsWith('0x') ? signature.slice(2) : signature;
        
        const messageBytes = new TextEncoder().encode(message);
        
        // Verify using noble/ed25519
        isValid = await ed25519.verifyAsync(cleanSignature, messageBytes, cleanAddress);
      } catch (err) {
        console.error("Signature verification failed with crypto error:", err);
        isValid = false;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature. Authentication failed." },
        { status: 401 }
      );
    }

    // ── Create Session (JWT) ──
    const token = await new SignJWT({ sub: address, role: "voter" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(getJwtSecret());

    // ── Set HTTP-Only Cookie ──
    const response = NextResponse.json({ 
      success: true, 
      address,
      message: "Successfully authenticated." 
    });

    // Secure cookie that can't be read by client-side JS
    response.cookies.set("voxchain_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Wallet verification error:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
