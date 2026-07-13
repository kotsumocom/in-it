/**
 * API routes skeleton.
 *
 * Add your API endpoints here.
 */
import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.ts";
import { userRepository } from "../db/memory.ts";

export const apiRoutes = new Hono();

// Health check (public)
apiRoutes.get("/health", (c) => c.json({ status: "ok" }));

// Protected routes
apiRoutes.use("/users/*", requireAuth);

apiRoutes.get("/users", async (c) => {
  const users = await userRepository.list();
  return c.json(users);
});

apiRoutes.get("/users/:id", async (c) => {
  const user = await userRepository.getById(c.req.param("id"));
  if (!user) return c.json({ error: "Not found" }, 404);
  return c.json(user);
});

// TODO: Add more routes for your application
// apiRoutes.post("/users", async (c) => { ... });
// apiRoutes.put("/users/:id", async (c) => { ... });
// apiRoutes.delete("/users/:id", async (c) => { ... });
