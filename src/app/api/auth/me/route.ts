import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
    console.warn("WARNING: JWT_SECRET environment variable is not set in production. Using fallback secret for build.");
  }
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "voxchain-super-secret-development-key-32-chars!"
  );
};

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("voxchain_session")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify the JWT
    const { payload } = await jwtVerify(token, getJwtSecret());

    return NextResponse.json({
      authenticated: true,
      address: payload.sub,
      role: payload.role,
      exp: payload.exp,
    });
  } catch {
    // If token is invalid or expired
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
