"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import clsx from "clsx";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Gauge,
  Layers3,
  ListChecks,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCog
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { platformLayers, platformStats } from "@/lib/platform-stack";
import type { PlatformLayer } from "@/lib/platform-stack";
import { roleLabels, type Role } from "@/lib/types";

const statusTone = {
  Live: "paid",
  Ready: "",
  Hardened: "fulfilled",
  Queued: "pending"
} satisfies Record<PlatformLayer["status"], string>;

export function PlatformStackPage() {
  const [role, setRole] = useState<Role>("admin");
  const [selectedLayerId, setSelectedLayerId] = useState(platformLayers[0].id);
  const selectedLayer = useMemo(
    () =>
      platformLayers.find((layer) => layer.id === selectedLayerId) ??
      platformLayers[0],
    [selectedLayerId]
  );
  const selectedHrefIsExternal = selectedLayer.actionHref.startsWith("http");

  return (
    <main className="app-shell">
      <AppSidebar role={role} onRoleChange={setRole} />

      <section className="workspace platform-workspace">
        <header className="topbar">
          <div className="search-box">
            <Search size={17} />
            <input
              placeholder="Search platform stack"
              suppressHydrationWarning
            />
          </div>

          <div className="topbar-actions">
            <button
              className="button secondary"
              onClick={() => setSelectedLayerId("monitoring-alerts")}
              type="button"
            >
              <RefreshCw size={16} />
              Review signals
            </button>
            <div className="role-chip">
              <UserCog size={16} />
              {roleLabels[role]}
            </div>
          </div>
        </header>

        <div className="notice-line" role="status">
          <CheckCircle2 size={17} />
          Every platform capability is mapped to a working NexaCart surface,
          API guard, documentation path, or production workflow.
        </div>

        <section className="platform-page">
          <div className="section-title-row platform-title-row">
            <div>
              <p className="overline">Platform stack</p>
              <h1>NexaCart implementation center</h1>
              <p className="page-description">
                The ecommerce foundation is implemented as product workflows,
                route handlers, database-ready storage, permissions, release
                checks, observability signals, and scale-ready operations.
              </p>
            </div>
            <button
              className="button primary"
              onClick={() => setSelectedLayerId("security")}
              type="button"
            >
              <ShieldCheck size={16} />
              Inspect security
            </button>
          </div>

          <div className="metric-grid">
            {platformStats.map((metric) => (
              <article className="metric-card compact" key={metric.label}>
                <div>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.detail}</small>
                </div>
              </article>
            ))}
          </div>

          <div className="platform-grid">
            <section className="table-card platform-layer-card">
              <div className="section-heading">
                <Layers3 size={18} />
                Implemented capabilities
              </div>

              <div
                className="platform-layer-list"
                aria-label="NexaCart platform capabilities"
              >
                {platformLayers.map((layer) => (
                  <button
                    aria-pressed={selectedLayer.id === layer.id}
                    className={clsx(
                      "platform-layer-button",
                      selectedLayer.id === layer.id && "active"
                    )}
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    type="button"
                  >
                    <span className="platform-layer-main">
                      <strong>{layer.label}</strong>
                      <small>{layer.metric}</small>
                    </span>
                    <span
                      className={clsx("status-pill", statusTone[layer.status])}
                    >
                      {layer.status}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <aside className="table-card platform-detail-card">
              <div className="platform-detail-top">
                <div>
                  <span className="detail-label">Selected layer</span>
                  <h2>{selectedLayer.label}</h2>
                </div>
                <span
                  className={clsx(
                    "status-pill",
                    statusTone[selectedLayer.status]
                  )}
                >
                  {selectedLayer.status}
                </span>
              </div>

              <p>{selectedLayer.summary}</p>

              <dl className="platform-definition-grid">
                <div>
                  <dt>Owner</dt>
                  <dd>{selectedLayer.owner}</dd>
                </div>
                <div>
                  <dt>Signal</dt>
                  <dd>{selectedLayer.metric}</dd>
                </div>
              </dl>

              <div className="section-heading">
                <Gauge size={18} />
                Implemented controls
              </div>
              <ul className="control-list">
                {selectedLayer.controls.map((control) => (
                  <li key={control}>
                    <CheckCircle2 size={16} />
                    {control}
                  </li>
                ))}
              </ul>

              <div className="section-heading">
                <FileText size={18} />
                Proof in the app
              </div>
              <ul className="evidence-list">
                {selectedLayer.evidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              {selectedHrefIsExternal ? (
                <a
                  className="button secondary platform-action-link"
                  href={selectedLayer.actionHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ArrowUpRight size={16} />
                  {selectedLayer.actionLabel}
                </a>
              ) : (
                <Link
                  className="button secondary platform-action-link"
                  href={selectedLayer.actionHref as Route}
                >
                  <ArrowUpRight size={16} />
                  {selectedLayer.actionLabel}
                </Link>
              )}
            </aside>
          </div>

          <section className="table-card platform-matrix">
            <div className="section-heading">
              <ListChecks size={18} />
              Capability implementation map
            </div>
            <table>
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Signal</th>
                  <th>Surface</th>
                </tr>
              </thead>
              <tbody>
                {platformLayers.map((layer) => (
                  <tr key={layer.id}>
                    <td>{layer.label}</td>
                    <td>{layer.owner}</td>
                    <td>
                      <span
                        className={clsx("status-pill", statusTone[layer.status])}
                      >
                        {layer.status}
                      </span>
                    </td>
                    <td>{layer.metric}</td>
                    <td>{layer.actionLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              className="platform-mobile-matrix"
              aria-label="Capability implementation map"
            >
              {platformLayers.map((layer) => (
                <article className="platform-mobile-row" key={layer.id}>
                  <div className="platform-mobile-row-head">
                    <strong>{layer.label}</strong>
                    <span
                      className={clsx("status-pill", statusTone[layer.status])}
                    >
                      {layer.status}
                    </span>
                  </div>
                  <div className="platform-mobile-meta">
                    <span>
                      <small>Owner</small>
                      {layer.owner}
                    </span>
                    <span>
                      <small>Signal</small>
                      {layer.metric}
                    </span>
                  </div>
                  <div className="platform-mobile-surface">
                    <small>Surface</small>
                    {layer.actionLabel}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
