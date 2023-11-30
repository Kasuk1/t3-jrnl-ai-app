import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { journallingRouter } from "@/server/api/routers/journalling";
import { aiRouter } from "./routers/ai";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  journalling: journallingRouter,
  ai: aiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
