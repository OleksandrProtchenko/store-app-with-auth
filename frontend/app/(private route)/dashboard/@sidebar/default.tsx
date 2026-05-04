import SidebarProfile from "@/components/SidebarProfile/SidebarProfile";
import SidebarMenu from "@/components/SidebarMenu/SidebarMenu";
import css from "./sidebarPage.module.css";
export default function SidebarPage() {
  return (
    <div className={css.sidebarContainer}>
      <SidebarProfile />
      <SidebarMenu />
    </div>
  );
}
