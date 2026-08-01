import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { logActivity } from "../utils/activityLogger.js";
import { canAccessRepo } from "../utils/repoAccess.js";

export const createLabel = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const userId = req.userId;
  const { name, color } = req.body;

  if (!userId) return res.status(401).json({ msg: "Unauthorized" });
  if (!name) return res.status(400).json({ msg: "Label name is required" });

  try {
    const existing = await prisma.label.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name } },
    });
    if (existing) return res.status(409).json({ msg: "Label already exists" });

    const label = await prisma.label.create({
      data: { name, color: color || "0366d6", repositoryId: repoId },
    });
    return res.status(201).json({ msg: "Label created", label });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error creating label", error: errMsg });
  }
};

export const getLabels = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  try {
    if (!(await canAccessRepo(req, res, repoId))) return;
    const labels = await prisma.label.findMany({ where: { repositoryId: repoId }, orderBy: { name: "asc" } });
    return res.status(200).json({ msg: "Labels fetched", labels });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching labels", error: errMsg });
  }
};

export const deleteLabel = async (req: Request, res: Response) => {
  const labelId = String(req.params.labelId);
  try {
    await prisma.label.delete({ where: { id: labelId } });
    return res.status(200).json({ msg: "Label deleted" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error deleting label", error: errMsg });
  }
};

export const addIssueLabel = async (req: Request, res: Response) => {
  const { issueId, labelId } = req.body;
  try {
    await prisma.issueLabel.create({ data: { issueId, labelId } });
    return res.status(200).json({ msg: "Label added to issue" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error adding label", error: errMsg });
  }
};

export const removeIssueLabel = async (req: Request, res: Response) => {
  const { issueId, labelId } = req.body;
  try {
    await prisma.issueLabel.delete({ where: { issueId_labelId: { issueId, labelId } } });
    return res.status(200).json({ msg: "Label removed from issue" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error removing label", error: errMsg });
  }
};

export const assignIssue = async (req: Request, res: Response) => {
  const issueId = String(req.params.issueId);
  const { assigneeId } = req.body;
  try {
    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: { assigneeId: assigneeId || null },
    });
    return res.status(200).json({ msg: "Issue assigned", issue });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error assigning issue", error: errMsg });
  }
};

export const createMilestone = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const { title, description, dueDate } = req.body;
  if (!title) return res.status(400).json({ msg: "Milestone title is required" });

  try {
    const milestone = await prisma.milestone.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        repositoryId: repoId,
      },
    });
    return res.status(201).json({ msg: "Milestone created", milestone });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error creating milestone", error: errMsg });
  }
};

export const getMilestones = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  try {
    if (!(await canAccessRepo(req, res, repoId))) return;
    const milestones = await prisma.milestone.findMany({
      where: { repositoryId: repoId },
      include: { _count: { select: { issues: true } } },
      orderBy: { createdAt: "desc" },
    });
    const milestonesWithProgress = await Promise.all(
      milestones.map(async (m) => {
        const openCount = await prisma.issue.count({
          where: { milestoneId: m.id, status: "open" },
        });
        const closedCount = await prisma.issue.count({
          where: { milestoneId: m.id, status: "closed" },
        });
        return {
          ...m,
          openCount,
          closedCount,
          totalCount: m._count.issues,
        };
      }),
    );
    return res.status(200).json({ msg: "Milestones fetched", milestones: milestonesWithProgress });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching milestones", error: errMsg });
  }
};

export const deleteMilestone = async (req: Request, res: Response) => {
  const milestoneId = String(req.params.milestoneId);
  try {
    await prisma.milestone.delete({ where: { id: milestoneId } });
    return res.status(200).json({ msg: "Milestone deleted" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error deleting milestone", error: errMsg });
  }
};

export const createIssueComment = async (req: Request, res: Response) => {
  const issueId = String(req.params.issueId);
  const userId = req.userId;
  const { body } = req.body;

  if (!userId) return res.status(401).json({ msg: "Unauthorized" });
  if (!body) return res.status(400).json({ msg: "Comment body is required" });

  try {
    const comment = await prisma.issueComment.create({
      data: { issueId, authorId: userId, body },
      include: { author: { select: { id: true, username: true, profilePic: true } } },
    });
    await logActivity(userId, "ISSUE_COMMENT", { issueId, commentId: comment.id });
    return res.status(201).json({ msg: "Comment added", comment });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error adding comment", error: errMsg });
  }
};

export const getIssueComments = async (req: Request, res: Response) => {
  const issueId = String(req.params.issueId);
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: { repositoryId: true },
    });
    if (!issue) return res.status(404).json({ msg: "Issue not found" });
    if (!(await canAccessRepo(req, res, issue.repositoryId))) return;

    const comments = await prisma.issueComment.findMany({
      where: { issueId },
      include: { author: { select: { id: true, username: true, profilePic: true } } },
      orderBy: { createdAt: "asc" },
    });
    return res.status(200).json({ msg: "Comments fetched", comments });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching comments", error: errMsg });
  }
};
