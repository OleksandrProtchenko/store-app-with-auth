import SidebarProfile from "@/components/Layout/SidebarProfile/SidebarProfile";
import SidebarMenu from "@/components/Layout/SidebarMenu/SidebarMenu";
import css from "./sidebarPage.module.css";
export default function SidebarPage() {
  return (
    <div className={css.sidebarContainer}>
      <SidebarProfile />
      <SidebarMenu />
    </div>
  );
}
