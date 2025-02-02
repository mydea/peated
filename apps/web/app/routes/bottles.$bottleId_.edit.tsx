import type { LoaderFunction } from "@remix-run/node";
import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

import type { BottleInputSchema } from "@peated/shared/schemas";

import invariant from "tiny-invariant";
import BottleForm from "~/components/bottleForm";
import Spinner from "~/components/spinner";
import useApi from "~/hooks/useApi";
import type { Bottle } from "~/types";

type FormSchemaType = z.infer<typeof BottleInputSchema>;

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "Edit Bottle",
    },
  ];
};

export const loader: LoaderFunction = async ({ params, context }) => {
  invariant(params.bottleId);
  const bottle: Bottle = await context.api.get(`/bottles/${params.bottleId}`);

  return json({ bottle });
};

export default function EditBottle() {
  const api = useApi();
  const { bottle } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { bottleId } = useParams();
  const queryClient = useQueryClient();

  const saveBottle = useMutation({
    mutationFn: async (data: FormSchemaType) => {
      await api.put(`/bottles/${bottleId}`, {
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bottles", bottleId]);
    },
  });

  if (!bottle) return <Spinner />;

  return (
    <BottleForm
      onSubmit={async (data) => {
        await saveBottle.mutateAsync(data, {
          onSuccess: () => navigate(`/bottles/${bottleId}`),
        });
      }}
      initialData={bottle}
      title="Edit Bottle"
    />
  );
}
