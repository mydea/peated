import { type MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const sitemap: SitemapFunction = () => ({
  exclude: true,
});

export const meta: MetaFunction = () => {
  return [
    {
      title: "Badges",
    },
  ];
};

export default function AdminBadgesLayout() {
  return <Outlet />;
}
