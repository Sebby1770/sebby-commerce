"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  CheckCircle2,
  Gauge,
  Layers3,
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
          Every layer from the stack map is represented as a working NexaCart
          operating surface.
        </div>

        <section className="platform-page">
          <div className="section-title-row platform-title-row">
            <div>
              <p className="overline">Platform stack</p>
              <h1>NexaCart operating stack</h1>
              <p className="page-description">
                A cleaner, clickable version of the full ecommerce foundation:
                product design, architecture, frontend, APIs, data, auth,
                hosting, delivery, security, reliability, testing, and scale.
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
            <section className="table-card platform-stack-card">
              <div className="section-heading">
                <Layers3 size={18} />
                Reference stack
              </div>

              <div className="stack-visual" aria-label="NexaCart platform stack">
                {platformLayers.map((layer) => (
                  <button
                    aria-pressed={selectedLayer.id === layer.id}
                    className={clsx(
                      "stack-layer",
                      `stack-${layer.color}`,
                      selectedLayer.id === layer.id && "active"
                    )}
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    type="button"
                  >
                    <span>{layer.label}</span>
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
            </aside>
          </div>

          <section className="table-card platform-matrix">
            <div className="section-heading">Layer ownership matrix</div>
            <table>
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Signal</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="platform-mobile-matrix" aria-label="Layer ownership">
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
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
