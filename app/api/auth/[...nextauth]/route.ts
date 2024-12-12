import { authOptions } from "./lib/authOptions";
import NextAuth from "next-auth";

// Initialize Prisma client

// Export NextAuth handler function
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };  // Export the handler for GET and POST methods
