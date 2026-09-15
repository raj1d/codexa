"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  ExternalLink,
  FileText,
  User,
  Calendar,
  Layers,
  ArrowLeft,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface PendingResource {
  id: string;
  title: string;
  description?: string;
  fileType: string;
  fileUrl: string;
  createdAt: string;
  unit: {
    number: number;
    name: string;
    subject: {
      name: string;
      code: string;
      semester: { number: number };
    };
  };
  uploader: {
    id: string;
    name: string;
    email: string;
    githubUsername?: string;
  };
}

export default function ModerationPage() {
  const { data: session } = useSession();
  const [pendingList, setPendingList] = React.useState<PendingResource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionMessage, setActionMessage] = React.useState<string | null>(null);

  const loadPending = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/study-hub/resources/pending`, {
        headers: {
          Authorization: `Bearer ${(session as any)?.token || ""}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPendingList(data);
      }
    } catch (err) {
      console.error("Failed to load pending resources:", err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  React.useEffect(() => {
    loadPending();
  }, [loadPending]);

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`${API_URL}/study-hub/resources/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any)?.token || ""}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setActionMessage(
          `Resource ${status === "APPROVED" ? "approved & indexed in Meilisearch" : "rejected"}.`,
        );
        setPendingList((prev) => prev.filter((item) => item.id !== id));
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-4">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/study-hub"
            className="flex items-center gap-2 font-mono text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>&larr; Back to Study Hub</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-accent-phosphor">
            <span className="h-2 w-2 rounded-full bg-accent-phosphor animate-pulse" />
            <span>MODERATION.QUEUE</span>
          </div>
        </div>

        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-accent-signal mb-1">
            <span>$ admin review --queue=study-materials</span>
          </div>
          <h1 className="heading-1 text-3xl text-text-primary">
            Content Review & Moderation Queue
          </h1>
          <p className="font-body text-sm text-text-muted mt-1">
            Review contributor submissions for curriculum accuracy, license compliance, and quality before indexing.
          </p>
        </div>

        {actionMessage && (
          <div className="p-3 rounded bg-accent-phosphor/10 border border-accent-phosphor/30 text-accent-phosphor text-xs font-mono">
            {actionMessage}
          </div>
        )}

        {/* List of Pending Items */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-40 rounded-lg bg-bg-surface border border-[rgba(255,255,255,0.08)] animate-pulse"
              />
            ))}
          </div>
        ) : pendingList.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pendingList.map((item) => (
              <Card
                key={item.id}
                className="p-6 bg-bg-surface border border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded border border-accent-amber/30 text-accent-amber bg-accent-amber/5">
                      {item.fileType}
                    </span>
                    <span className="text-text-muted">
                      GTU {item.unit.subject.code} &bull; Sem {item.unit.subject.semester.number} &bull; Unit {item.unit.number} ({item.unit.name})
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-text-primary">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="font-body text-xs text-text-muted line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 font-mono text-xs text-text-dim pt-2">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {item.uploader.name} ({item.uploader.email})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-signal hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Inspect File
                    </a>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleUpdateStatus(item.id, "APPROVED")}
                    className="text-xs"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Approve & Index
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUpdateStatus(item.id, "REJECTED")}
                    className="text-xs"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-bg-surface p-12 border border-[rgba(255,255,255,0.08)] text-center flex flex-col items-center gap-3">
            <CheckCircle className="h-8 w-8 text-accent-phosphor" />
            <h3 className="heading-3 text-text-primary">
              Moderation Queue is Clear
            </h3>
            <p className="font-mono text-xs text-text-muted">
              All contributor submissions have been reviewed and processed.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
