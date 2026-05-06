import Image from "next/image";
import css from "./SidebarProfile.module.css";
import { IoMdSettings } from "react-icons/io";

export default function SidebarProfile() {
  return (
    <div className={css.sidebarProfileWrapper}>
      <div className={css.sidebarProfileImageWrapper}>
        <Image
          className={css.sidebarProfileImage}
          src="/user.jpg"
          alt="Profile Image"
          width={50}
          height={50}
        />
      </div>
      <button className={css.sidebarProfileBtnSettings} type="button">
        <IoMdSettings className={css.sidebarProfileSettingsIcon} />
      </button>
    </div>
  );
}
