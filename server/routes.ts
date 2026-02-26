import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(httpServer, app) {
  app.get(api.matches.leaderboard.path, async (req, res) => {
    const data = await storage.getLeaderboard();
    res.json(data);
  });
  
  app.post(api.matches.create.path, async (req, res) => {
    const match = await storage.createMatch(req.body);
    res.status(201).json(match);
  });
  return httpServer;
}
