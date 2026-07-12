import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import DashboardLayout from "../../components/DashboardLayout.tsx";
import ReferralCode from "../../islands/ReferralCode.tsx";

interface ReferralData {
  user: State["user"];
}

export const handler: Handlers<ReferralData, State> = {
  GET(_req, ctx) {
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    return ctx.render({
      user: ctx.state.user,
    });
  },
};

export default function ReferralPage({ data }: PageProps<ReferralData>) {
  const { user } = data;

  return (
    <DashboardLayout activeSection="referral" user={user}>
      <h1 class="text-2xl font-bold text-gray-900 mb-8">招征E��ーポン</h1>
      <div class="bg-white border border-gray-200 p-6">
        <ReferralCode
          code={user?.mentor_profile?.referral_code || "--------"}
          baseUrl={Deno.env.get("APP_URL") || "https://init.dev"}
        />
      </div>
    </DashboardLayout>
  );
}
