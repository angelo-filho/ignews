import { List } from "phosphor-react";
import { ActiveLink } from "../ActiveLink";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";
import Image from "next/image";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button>
              <List size={24} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content asChild sideOffset={16}>
            <nav className={styles.mobileMenu}>
              <ActiveLink activeClassName={styles.active} href="/">
                <a>Home</a>
              </ActiveLink>
              <ActiveLink activeClassName={styles.active} href="/posts">
                <a>Posts</a>
              </ActiveLink>
            </nav>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <Image src="/images/logo.svg" alt="ig.news" width={110} height={51} />

        <div className={styles.rightContent}>
          <nav>
            <ActiveLink activeClassName={styles.active} href="/">
              <a>Home</a>
            </ActiveLink>
            <ActiveLink activeClassName={styles.active} href="/posts">
              <a>Posts</a>
            </ActiveLink>
          </nav>

          <SignInButton />
        </div>
      </div>
    </header>
  );
}
