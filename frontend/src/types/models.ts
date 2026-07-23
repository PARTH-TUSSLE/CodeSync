export interface User {
  id: string;
  username: string;
  email: string;
  bio: string[];
  profilePic: string | null;
  followers?: User[];
  following?: User[];
  starredRepos?: string[];
  pinnedRepos?: string[];
  createdAt?: string;
}

export interface Repository {
  id: string;
  name: string;
  description?: string | null;
  content: string[];
  visibility: boolean;
  defaultBranch: string;
  ownerId: string;
  owner?: { id: string; username: string };
  starCount?: number;
  pinCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type IssueStatus = "open" | "closed";

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  repositoryId: string;
  authorId: string;
  assigneeId?: string;
  milestoneId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType =
  | "COMMIT"
  | "PUSH"
  | "REPO_CREATED"
  | "ISSUE_CREATED"
  | "ISSUE_CLOSED"
  | "STARRED_REPO"
  | "PULL_REQUEST"
  | "PR_MERGED"
  | "PR_COMMENT"
  | "ISSUE_COMMENT"
  | "FORK";

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Contribution {
  date: string;
  count: number;
}

export interface Branch {
  id: string;
  name: string;
  isDefault: boolean;
  commitCount?: number;
  latestCommit?: { id: string; message: string; createdAt: string } | null;
  createdAt: string;
}

export interface Commit {
  id: string;
  message: string;
  author?: { id: string; username: string };
  branch?: string;
  parentCommitId?: string | null;
  filesCount?: number;
  createdAt: string;
}

export interface CommitFile {
  id: string;
  filename: string;
  size: number;
  additions: number;
  deletions: number;
  content?: string;
}

export interface CommitDetail extends Commit {
  files: CommitFile[];
}

export type FileTreeEntry = {
  name: string;
  type: "file" | "dir";
  path: string;
  size?: number;
  children?: FileTreeEntry[];
};

export interface FileContent {
  filename: string;
  content: string;
  size: number;
  language: string | null;
}

export interface DiffFile {
  filename: string;
  status: "added" | "deleted" | "modified";
  additions: number;
  deletions: number;
  diff: string;
}

export interface CommitDiff {
  commit: { id: string; message: string; createdAt: string };
  files: DiffFile[];
}

export type PullRequestStatus = "open" | "merged" | "closed";

export interface PullRequest {
  id: string;
  title: string;
  description?: string;
  status: PullRequestStatus;
  sourceBranch: string;
  targetBranch: string;
  author?: { id: string; username: string };
  repositoryId: string;
  createdAt: string;
  updatedAt: string;
}

export type ReviewStatus = "approved" | "changes_requested" | "comment";

export interface PRReview {
  id: string;
  pullRequestId: string;
  userId: string;
  user?: { username: string };
  body?: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface PRComment {
  id: string;
  pullRequestId: string;
  userId: string;
  user?: { username: string };
  body: string;
  filePath?: string | null;
  lineNumber?: number | null;
  createdAt: string;
}

export interface IssueComment {
  id: string;
  issueId: string;
  authorId: string;
  author?: { username: string; profilePic?: string };
  body: string;
  createdAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  createdAt: string;
}

export interface ApiError {
  msg: string;
  error?: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  username?: string;
  email?: string;
  password: string;
}

export interface UpdateProfileInput {
  username?: string;
  bio?: string;
  profilePic?: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface CreateRepoInput {
  name: string;
  description?: string;
  visibility?: boolean;
}

export interface CreateIssueInput {
  title: string;
  description: string;
  status: IssueStatus;
  repoID: string;
  creatorID: string;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  status?: IssueStatus;
}
