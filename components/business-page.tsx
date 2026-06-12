"use client";

import { useState } from "react";
import { CheckCircle2, Plus, RefreshCw, Search, UserCog } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { roleLabels, type Role } from "@/lib/types";
import type { BusinessPageConfig } from "@/lib/page-content";

type BusinessPageProps = {
  page: BusinessPageConfig;
};

export function BusinessPage({ page }: BusinessPageProps) {
  const [role, setRole] = useState<Role>("admin");

  return (
    <main className="app-shell">
      <AppSidebar role={role} onRoleChange={setRole} />

      <section className="workspace">
        <header className="topbar">
          <div className="search-box">
            <Search size={17} />
            <input
              placeholder={`Search ${page.title.toLowerCase()}`}
              suppressHydrationWarning
            />
          </div>

          <div className="topbar-actions">
            <button className="button secondary" type="button">
              <RefreshCw size={16} />
              Sync
            </button>
            <div className="role-chip">
              <UserCog size={16} />
              {roleLabels[role]}
            </div>
          </div>
        </header>

        <div className="notice-line" role="status">
          <CheckCircle2 size={17} />
          {page.notice}
        </div>

        <section className="business-page">
          <div className="section-title-row">
            <div>
              <p className="overline">{page.overline}</p>
              <h1>{page.title}</h1>
              <p className="page-description">{page.description}</p>
            </div>
            <button className="button primary" type="button">
              <Plus size={16} />
              {page.actionLabel}
            </button>
          </div>

          <div className="metric-grid">
            {page.metrics.map((metric) => (
              <article className="metric-card compact" key={metric.label}>
                <div>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.detail}</small>
                </div>
              </article>
            ))}
          </div>

          <div className="business-grid">
            <section className="table-card">
              <div className="section-heading">{page.primaryPanelTitle}</div>
              <div className="business-list">
                {page.rows.map((row) => (
                  <div className="business-row" key={`${row.primary}-${row.meta}`}>
                    <div>
                      <strong>{row.primary}</strong>
                      <span>{row.secondary}</span>
                    </div>
                    <div className="row-meta">
                      <span>{row.meta}</span>
                      <span className={`status-pill ${row.tone ?? ""}`}>
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="table-card">
              <div className="section-heading">{page.workflowTitle}</div>
              <div className="workflow-list">
                {page.workflow.map((item) => (
                  <div className="workflow-item" key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}
