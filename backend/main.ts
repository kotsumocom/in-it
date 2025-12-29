import { Hono } from "@hono/hono";
import { getUnitsTree } from "./services/units.ts";
import { getUserProgress, updateUserProgress } from "./services/progress.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello from in-it Hono Backend!");
});

app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Units API
app.get("/api/units", async (c) => {
  try {
    const units = await getUnitsTree();
    return c.json(units);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// Progress API
app.get("/api/progress/:userId", async (c) => {
  const userId = c.req.param("userId");
  try {
    const progress = await getUserProgress(userId);
    return c.json(progress);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.post("/api/progress", async (c) => {
  const body = await c.req.json();
  const { userId, unitId, status } = body;
  try {
    await updateUserProgress(userId, unitId, status);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

Deno.serve(app.fetch);
