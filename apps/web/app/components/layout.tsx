import type { ReactNode } from "react";

// import { AppFooter } from "./appFooter";
// import AppHeader from "./appHeader";
// import Footer from "./footer";
// import Header from "./header";

import { AppFooter } from "./appFooter";
import AppHeader from "./appHeader";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({
  children,
  header,
  footer,
  rightSidebar,
  splash,
}: {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  rightSidebar?: ReactNode;
  splash?: boolean;
  onSave?: any;
}) {
  if (splash) {
    return (
      <main className="mx-auto flex h-screen max-w-xl items-center justify-center p-4 lg:p-8">
        <div className="flex-1">{children}</div>
      </main>
    );
  }

  return (
    <>
      {header !== undefined ? (
        header
      ) : (
        <Header mobileOnly>
          <AppHeader />
        </Header>
      )}

      <Sidebar />

      <div className="flex">
        <main className="max-w-6xl flex-1 lg:pl-64">
          <div className="mx-auto lg:p-8">{children}</div>
        </main>

        {rightSidebar ? (
          <div className="hidden lg:z-50 lg:w-64 lg:flex-col xl:flex">
            {rightSidebar}
          </div>
        ) : null}
      </div>

      {footer !== undefined ? (
        footer
      ) : (
        <Footer mobileOnly>
          <AppFooter />
        </Footer>
      )}
    </>
  );
}
