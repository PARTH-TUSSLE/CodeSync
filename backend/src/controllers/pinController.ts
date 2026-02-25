import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const pinRepository = async (req: Request, res: Response) => {
    const repoId = String(req.params.repoId);
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ msg: "Unauthorized" });
    }

    try {
        const repository = await prisma.repository.findUnique({
            where: { id: repoId },
        });

        if (!repository) {
            return res.status(404).json({ msg: "Repository not found" });
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                pinnedRepos: { connect: { id: repoId } },
            },
        });

        return res.status(200).json({ msg: "Repository pinned successfully" });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ msg: "Error while pinning repository", error: errMsg });
    }
};

export const unpinRepository = async (req: Request, res: Response) => {
    const repoId = String(req.params.repoId);
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ msg: "Unauthorized" });
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                pinnedRepos: { disconnect: { id: repoId } },
            },
        });

        return res.status(200).json({ msg: "Repository unpinned successfully" });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ msg: "Error while unpinning repository", error: errMsg });
    }
};

export const getPinnedRepositories = async (req: Request, res: Response) => {
    const userId = String(req.params.userId);

    try {
        const userWithPinnedRepos = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                pinnedRepos: {
                    include: {
                        owner: { select: { id: true, username: true } },
                    },
                },
            },
        });

        if (!userWithPinnedRepos) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({
            msg: "Pinned repositories fetched successfully",
            pinnedRepos: userWithPinnedRepos.pinnedRepos,
        });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ msg: "Error while fetching pinned repositories", error: errMsg });
    }
};
