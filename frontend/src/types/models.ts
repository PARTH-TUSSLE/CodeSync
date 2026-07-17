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
  ownerId: string;
  owner?: { id: string; username: string };
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
  | "PULL_REQUEST";

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
