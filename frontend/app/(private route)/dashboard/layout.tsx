import SidebarPage from "./@sidebar/default";
import css from "./layout.module.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={css.dashboardWrapper}>
      <aside className={css.aside}>
        <SidebarPage />
      </aside>
      <section className={css.dashboardContainer}>{children}</section>
    </div>
  );
}
