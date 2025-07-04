import * as React from "react";
import Link from "next/link";
import { ProfilePopoutMenu } from "./ProfilePopoutMenu";
import { IconType, IconLogIn } from "@/components/ui/icons";
import { MobileNavBar } from "./MobileNavBar";
import { Button } from "./Button";
import CreditsCard from "./CreditsCard";
import { ProfileDetails } from "@/lib/autogpt-server-api/types";
import { User } from "@supabase/supabase-js";
import AutoGPTServerAPIServerSide from "@/lib/autogpt-server-api/clientServer";
import { ThemeToggle } from "./ThemeToggle";
import { NavbarLink } from "./NavbarLink";

interface NavLink {
  name: string;
  href: string;
}

interface NavbarProps {
  user: User | null;
  isLoggedIn: boolean;
  links: NavLink[];
  menuItemGroups: {
    groupName?: string;
    items: {
      icon: IconType;
      text: string;
      href?: string;
      onClick?: () => void;
    }[];
  }[];
}

async function getProfileData(user: User | null) {
  const api = new AutoGPTServerAPIServerSide();
  const [profile, credits] = await Promise.all([
    api.getStoreProfile("navbar"),
    api.getUserCredit("navbar"),
  ]);

  return {
    profile,
    credits,
  };
}
export const Navbar = async ({
  user,
  isLoggedIn,
  links,
  menuItemGroups,
}: NavbarProps) => {
  let profile: ProfileDetails | null = null;
  let credits: { credits: number } = { credits: 0 };
  if (isLoggedIn) {
    const { profile: t_profile, credits: t_credits } =
      await getProfileData(user);
    profile = t_profile;
    credits = t_credits;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 hidden h-20 w-[1408px] items-center justify-between rounded-bl-2xl rounded-br-2xl border border-white/50 bg-white/5 py-3 pl-6 pr-3 backdrop-blur-[26px] dark:border-gray-700 dark:bg-gray-900 md:inline-flex">
        <div className="flex items-center space-x-10">
          {links.map((link) => (
            <NavbarLink key={link.name} name={link.name} href={link.href} />
          ))}
        </div>
        {/* Profile section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {profile && <CreditsCard credits={credits.credits} />}
              <ProfilePopoutMenu
                menuItemGroups={menuItemGroups}
                userName={profile?.username}
                userEmail={profile?.name}
                avatarSrc={profile?.avatar_url}
              />
            </div>
          ) : (
            <Link href="/login">
              <Button
                variant="default"
                size="sm"
                className="flex items-center justify-end space-x-2"
              >
                <IconLogIn className="h-5 w-5" />
                <span>Log In</span>
              </Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
      {/* Mobile Navbar - Adjust positioning */}
      <>
        {isLoggedIn ? (
          <div className="fixed right-4 top-4 z-50">
            <MobileNavBar
              userName={profile?.username}
              menuItemGroups={[
                {
                  groupName: "Navigation",
                  items: links.map((link) => ({
                    icon:
                      link.name === "Agent Store"
                        ? IconType.Marketplace
                        : link.name === "Library"
                          ? IconType.Library
                          : link.name === "Build"
                            ? IconType.Builder
                            : link.name === "Monitor"
                              ? IconType.Library
                              : IconType.LayoutDashboard,
                    text: link.name,
                    href: link.href,
                  })),
                },
                ...menuItemGroups,
              ]}
              userEmail={profile?.name}
              avatarSrc={profile?.avatar_url}
            />
          </div>
        ) : (
          <Link
            href="/login"
            className="fixed right-4 top-4 z-50 mt-4 inline-flex h-8 items-center justify-end rounded-lg pr-4 md:hidden"
          >
            <Button
              variant="default"
              size="sm"
              className="flex items-center space-x-2"
            >
              <IconLogIn className="h-5 w-5" />
              <span>Log In</span>
            </Button>
          </Link>
        )}
      </>
    </>
  );
};
