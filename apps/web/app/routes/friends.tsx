import type { V2_MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

import Layout from "~/components/layout";
import QueryBoundary from "~/components/queryBoundary";
import Tabs from "~/components/tabs";

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "Friends",
    },
  ];
};

export default function Friends() {
  return (
    <Layout>
      <Tabs fullWidth border>
        <Tabs.Item as={Link} to="/friends" controlled>
          Following
        </Tabs.Item>
        <Tabs.Item as={Link} to="/friends/followers" controlled>
          Followers
        </Tabs.Item>
      </Tabs>
      <QueryBoundary>
        <Outlet />
      </QueryBoundary>
    </Layout>
  );
}
