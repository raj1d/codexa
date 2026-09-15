/**
 * @codexa/shared
 *
 * Shared types, constants, and utilities used across
 * the CODEXA web frontend and API backend.
 */

// ── Enums ────────────────────────────────────────────

export enum FileType {
  PDF = "pdf",
  NOTES = "notes",
  PYQ = "pyq",
  LAB_MANUAL = "lab_manual",
}

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum SubmissionStatus {
  PENDING = "pending",
  RUNNING = "running",
  PASSED = "passed",
  FAILED = "failed",
}

export enum ResourceStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// ── Types ────────────────────────────────────────────

export interface Semester {
  id: string;
  number: number;
  name: string;
}

export interface Subject {
  id: string;
  semesterId: string;
  name: string;
  code: string;
}

export interface Unit {
  id: string;
  subjectId: string;
  number: number;
  name: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  fileType: FileType;
  fileUrl: string;
  semesterId: string;
  subjectId: string;
  unitId: string;
  uploaderId: string;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  githubUsername?: string;
  createdAt: string;
}

// ── Constants ────────────────────────────────────────

export const APP_NAME = "CODEXA" as const;

export const DSA_TOPICS = [
  "arrays",
  "strings",
  "linked-lists",
  "stacks",
  "queues",
  "trees",
  "graphs",
  "sorting",
  "searching",
  "dynamic-programming",
  "recursion",
  "hashing",
  "greedy",
  "backtracking",
  "bit-manipulation",
  "dbms",
  "os",
  "networks",
] as const;

export type DsaTopic = (typeof DSA_TOPICS)[number];

export const SUPPORTED_LANGUAGES = [
  "python",
  "cpp",
  "c",
  "java",
  "javascript",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
