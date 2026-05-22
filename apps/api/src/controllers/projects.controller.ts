import { Request, Response } from "express";
import { dbMaster } from "@builder/db";

// BUG-15 fix: Normalize status string to consistent Title Case
// Handles any casing: "planning" -> "Planning", "UNDER CONSTRUCTION" -> "Under Construction"
const STATUS_MAP: Record<string, string> = {
  "planning": "Planning",
  "approvals pending": "Approvals Pending",
  "under construction": "Under Construction",
  "completed": "Completed",
  "handover": "Handover",
};
function normalizeStatus(raw?: string): string {
  if (!raw) return "Planning";
  const lower = raw.trim().toLowerCase();
  return STATUS_MAP[lower] || (raw.charAt(0).toUpperCase() + raw.slice(1));
}

// Fetch projects for the active tenant
export async function getProjects(req: Request, res: Response) {
  try {
    const tenantId = req.tenantId; // e.g. "shg-001"
    
    let projects;
    if (tenantId === "master") {
      // Super Admin gets all projects across the platform
      projects = await dbMaster.project.findMany();
    } else {
      // Tenant is isolated to their own projects
      projects = await dbMaster.project.findMany({
        where: { tenantId }
      });
    }
    
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch project listings." });
  }
}

// Create a project (Master operation)
export async function createProject(req: Request, res: Response) {
  try {
    const { name, location, rera, budget, spent, startDate, endDate, status } = req.body;
    const tenantId = req.tenantId === "master" ? req.body.tenantId || "shg-001" : req.tenantId;

    if (!name || !location) {
      return res.status(400).json({ error: "Name and location are required." });
    }

    const project = await dbMaster.project.create({
      data: {
        name,
        location,
        rera,
        budget: Number(budget || 0),
        spent: Number(spent || 0),
        // BUG-15 fix: store normalized status
        status: normalizeStatus(status),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        tenantId
      }
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({ error: "Failed to create project." });
  }
}

// Update project (Master/Tenant scope)
export async function updateProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const project = await dbMaster.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    if (req.tenantId !== "master" && project.tenantId !== req.tenantId) {
      return res.status(403).json({ error: "Access forbidden. Project tenant mismatch." });
    }

    // BUG-15 fix: Normalize status before saving
    if (updates.status !== undefined) updates.status = normalizeStatus(updates.status);
    // Convert numeric fields
    if (updates.budget !== undefined) updates.budget = Number(updates.budget);
    if (updates.spent !== undefined) updates.spent = Number(updates.spent);
    if (updates.startDate) updates.startDate = new Date(updates.startDate);
    if (updates.endDate) updates.endDate = new Date(updates.endDate);

    const updated = await dbMaster.project.update({
      where: { id },
      data: updates
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update project details." });
  }
}

// Retrieve active milestones and site diaries from the Tenant isolated database schema
export async function getMilestones(req: Request, res: Response) {
  try {
    const milestones = await req.db.milestone.findMany({
      orderBy: { targetDate: "asc" }
    });
    return res.json(milestones);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch milestones." });
  }
}

export async function createMilestone(req: Request, res: Response) {
  try {
    const { name, targetDate, progress } = req.body;
    if (!name || !targetDate) {
      return res.status(400).json({ error: "Name and target date are required." });
    }

    const milestone = await req.db.milestone.create({
      data: {
        name,
        targetDate: new Date(targetDate),
        progress: Number(progress || 0)
      }
    });

    return res.status(201).json(milestone);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create construction milestone." });
  }
}
