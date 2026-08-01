import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { logActivity } from "../utils/activityLogger.js";
import { canAccessRepo } from "../utils/repoAccess.js";

export const createPullRequest = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const userId = req.userId;
  const { title, description, sourceBranch, targetBranch } = req.body;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  if (!title || !sourceBranch || !targetBranch) {
    return res.status(400).json({ msg: "Fields title, sourceBranch, targetBranch are required" });
  }

  try {
    const repo = await prisma.repository.findUnique({ where: { id: repoId } });
    if (!repo) {
      return res.status(404).json({ msg: "Repository not found" });
    }

    const source = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: sourceBranch } },
    });
    if (!source) {
      return res.status(404).json({ msg: `Source branch '${sourceBranch}' not found` });
    }

    const target = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: targetBranch } },
    });
    if (!target) {
      return res.status(404).json({ msg: `Target branch '${targetBranch}' not found` });
    }

    const existingOpen = await prisma.pullRequest.findFirst({
      where: {
        repositoryId: repoId,
        sourceBranchId: source.id,
        targetBranchId: target.id,
        status: "open",
      },
    });
    if (existingOpen) {
      return res.status(409).json({
        msg: "An open pull request already exists for these branches",
        existingPrId: existingOpen.id,
      });
    }

    const pr = await prisma.pullRequest.create({
      data: {
        title,
        description: description || null,
        status: "open",
        sourceBranchId: source.id,
        targetBranchId: target.id,
        repositoryId: repoId,
        authorId: userId,
      },
    });

    await logActivity(userId, "PULL_REQUEST", {
      prId: pr.id,
      prTitle: pr.title,
      repoId,
      sourceBranch: sourceBranch,
      targetBranch: targetBranch,
    });

    return res.status(201).json({
      msg: "Pull request created successfully",
      pullRequest: {
        id: pr.id,
        title: pr.title,
        description: pr.description,
        status: pr.status,
        sourceBranch: sourceBranch,
        targetBranch: targetBranch,
        createdAt: pr.createdAt,
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error creating pull request", error: errMsg });
  }
};

export const getPullRequests = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const statusFilter = req.query.status as string | undefined;
  const page = Math.max(1, parseInt(String(req.query.page)) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit)) || 30));
  const skip = (page - 1) * limit;

  try {
    if (!(await canAccessRepo(req, res, repoId))) return;

    const where: Record<string, unknown> = { repositoryId: repoId };
    if (statusFilter && ["open", "merged", "closed"].includes(statusFilter)) {
      where.status = statusFilter;
    }

    const [prs, total] = await Promise.all([
      prisma.pullRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true } },
          sourceBranch: { select: { name: true } },
          targetBranch: { select: { name: true } },
          _count: { select: { comments: true, reviewers: true } },
        },
      }),
      prisma.pullRequest.count({ where }),
    ]);

    return res.status(200).json({
      msg: "Pull requests fetched successfully",
      pullRequests: prs.map((pr) => ({
        id: pr.id,
        title: pr.title,
        status: pr.status,
        sourceBranch: pr.sourceBranch.name,
        targetBranch: pr.targetBranch.name,
        author: pr.author,
        commentCount: pr._count.comments,
        reviewCount: pr._count.reviewers,
        createdAt: pr.createdAt,
        updatedAt: pr.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching pull requests", error: errMsg });
  }
};

export const getPullRequestById = async (req: Request, res: Response) => {
  const prId = String(req.params.prId);

  try {
    const pr = await prisma.pullRequest.findUnique({
      where: { id: prId },
      include: {
        author: { select: { id: true, username: true, profilePic: true } },
        sourceBranch: { select: { name: true } },
        targetBranch: { select: { name: true } },
        reviewers: {
          include: { user: { select: { id: true, username: true } } },
        },
        comments: {
          include: { user: { select: { id: true, username: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!pr) {
      return res.status(404).json({ msg: "Pull request not found" });
    }
    if (!(await canAccessRepo(req, res, pr.repositoryId))) return;

    return res.status(200).json({
      msg: "Pull request fetched successfully",
      pullRequest: {
        id: pr.id,
        title: pr.title,
        description: pr.description,
        status: pr.status,
        sourceBranch: pr.sourceBranch.name,
        targetBranch: pr.targetBranch.name,
        author: pr.author,
        reviewers: pr.reviewers,
        comments: pr.comments,
        createdAt: pr.createdAt,
        updatedAt: pr.updatedAt,
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching pull request", error: errMsg });
  }
};

export const updatePullRequest = async (req: Request, res: Response) => {
  const prId = String(req.params.prId);
  const userId = req.userId;
  const { title, description, status } = req.body;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const pr = await prisma.pullRequest.findUnique({ where: { id: prId } });
    if (!pr) {
      return res.status(404).json({ msg: "Pull request not found" });
    }
    if (pr.authorId !== userId) {
      return res.status(403).json({ msg: "Forbidden: only the author can update this PR" });
    }

    const updated = await prisma.pullRequest.update({
      where: { id: prId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
      },
    });

    if (status === "closed" && pr.status !== "closed") {
      await logActivity(userId, "PULL_REQUEST", {
        prId: updated.id,
        prTitle: updated.title,
        action: "closed",
      });
    }

    return res.status(200).json({
      msg: "Pull request updated",
      pullRequest: updated,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error updating pull request", error: errMsg });
  }
};

export const mergePullRequest = async (req: Request, res: Response) => {
  const prId = String(req.params.prId);
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const pr = await prisma.pullRequest.findUnique({
      where: { id: prId },
      include: {
        sourceBranch: true,
        targetBranch: true,
      },
    });
    if (!pr) {
      return res.status(404).json({ msg: "Pull request not found" });
    }
    if (pr.status !== "open") {
      return res.status(400).json({ msg: "Pull request is not open" });
    }

    const repo = await prisma.repository.findUnique({ where: { id: pr.repositoryId } });
    if (!repo) {
      return res.status(404).json({ msg: "Repository not found" });
    }

    const latestSourceCommit = await prisma.commit.findFirst({
      where: { branchId: pr.sourceBranchId },
      orderBy: { createdAt: "desc" },
      include: { files: true },
    });

    if (latestSourceCommit) {
      const mergeCommit = await prisma.commit.create({
        data: {
          message: `Merge pull request #${pr.id.slice(0, 7)}: ${pr.title}`,
          branchId: pr.targetBranchId,
          repositoryId: pr.repositoryId,
          authorId: userId,
          parentCommitId: latestSourceCommit.id,
        },
      });

      for (const file of latestSourceCommit.files) {
        await prisma.commitFile.create({
          data: {
            commitId: mergeCommit.id,
            filename: file.filename,
            s3Key: file.s3Key,
            content: file.content,
            size: file.size,
            additions: file.additions,
            deletions: file.deletions,
          },
        });
      }
    }

    const updatedPr = await prisma.pullRequest.update({
      where: { id: prId },
      data: { status: "merged" },
    });

    await logActivity(userId, "PR_MERGED", {
      prId: updatedPr.id,
      prTitle: updatedPr.title,
      repoId: pr.repositoryId,
      sourceBranch: pr.sourceBranch.name,
      targetBranch: pr.targetBranch.name,
    });

    return res.status(200).json({
      msg: "Pull request merged successfully",
      pullRequest: updatedPr,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error merging pull request", error: errMsg });
  }
};

export const createPRComment = async (req: Request, res: Response) => {
  const prId = String(req.params.prId);
  const userId = req.userId;
  const { body, filePath, lineNumber } = req.body;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  if (!body) {
    return res.status(400).json({ msg: "Comment body is required" });
  }

  try {
    const pr = await prisma.pullRequest.findUnique({ where: { id: prId } });
    if (!pr) {
      return res.status(404).json({ msg: "Pull request not found" });
    }

    const comment = await prisma.pRComment.create({
      data: {
        pullRequestId: prId,
        userId,
        body,
        filePath: filePath || null,
        lineNumber: lineNumber || null,
      },
      include: { user: { select: { id: true, username: true } } },
    });

    await logActivity(userId, "PR_COMMENT", {
      prId,
      commentId: comment.id,
    });

    return res.status(201).json({
      msg: "Comment added",
      comment,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error adding comment", error: errMsg });
  }
};

export const createPRReview = async (req: Request, res: Response) => {
  const prId = String(req.params.prId);
  const userId = req.userId;
  const { body, status } = req.body;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  if (!status || !["approved", "changes_requested", "comment"].includes(status)) {
    return res.status(400).json({ msg: "Review status must be approved, changes_requested, or comment" });
  }

  try {
    const pr = await prisma.pullRequest.findUnique({ where: { id: prId } });
    if (!pr) {
      return res.status(404).json({ msg: "Pull request not found" });
    }

    const review = await prisma.pRReview.create({
      data: {
        pullRequestId: prId,
        userId,
        body: body || null,
        status,
      },
      include: { user: { select: { id: true, username: true } } },
    });

    return res.status(201).json({
      msg: "Review submitted",
      review,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error submitting review", error: errMsg });
  }
};
