import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out." });
  
  // Clear the session cookie
  response.cookies.delete("voxchain_session");
  
  return response;
}
