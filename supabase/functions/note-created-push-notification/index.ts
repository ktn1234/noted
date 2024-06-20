// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
/// <reference lib="deno.ns" />
/// <reference types="https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

// @deno-types="npm:@types/web-push@3.6.3"
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.43.4";

interface Note {
  id: string;
  text: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: Note;
  schema: "public";
}

Deno.serve(async (req) => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
    "SUPABASE_SERVICE_ROLE_KEY",
  ) as string;
  const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") as string;
  const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") as string;
  const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") as string;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const payload: WebhookPayload = await req.json();
  const { record: { text, user_id } } = payload;

  const { data: user, error: userQueryError } = await supabase.from("profiles")
    .select(
      "username",
    ).eq("user_id", user_id)
    .single();

  if (userQueryError) {
    console.error(
      `[ERROR] Failed to fetch user for user_id ${user_id}`,
      userQueryError,
    );
    return new Response(
      JSON.stringify(userQueryError),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const { data: subscribers, subscriptionsQueryError } = await supabase.from(
    "subscriptions",
  )
    .select(
      "subscriber_user_id",
    ).eq("user_id", user_id);

  if (subscriptionsQueryError) {
    console.error(
      `[ERROR] Failed to fetch subscribers for user_id ${user_id}`,
      subscriptionsQueryError,
    );
    return new Response(
      JSON.stringify(subscriptionsQueryError),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  for (let i = 0; i < subscribers.length; ++i) {
    const subscriberUserId = subscribers[i].subscriber_user_id;
    const { data: appNotifications, error } = await supabase.from(
      "notifications",
    )
      .select(
        "endpoint",
      ).eq("user_id", subscriberUserId);

    if (error) {
      console.error(
        `[ERROR] Failed to fetch app notifications for subscriberUserId ${subscriberUserId}`,
        error,
      );
      continue;
    }

    for (let j = 0; j < appNotifications.length; ++j) {
      const endpoint = appNotifications[j].endpoint as string;

      const data = {
        title: `${user.username} just made a note`,
        body: text,
        url: "https://noted-eight-bay.vercel.app/",
        timestamp: Date.now(),
      };

      try {
        await webpush.sendNotification(
          JSON.parse(endpoint),
          // JSON.stringify(data), // TODO: Comment back in when https://github.com/web-push-libs/web-push/issues/904 gets fixed
        );
      } catch (err: unknown) {
        const error = err as Error;
        console.error(
          `[ERROR] Failed to send push notification to ${endpoint}`,
        );
        console.error("[ERROR]", error);

        console.debug(
          "Deleting app notification subscription for endpoint:",
          endpoint,
        );
        // Delete the app notification subscription since it's invalid
        const { error: appNotificationDeletionError } = await supabase
          .from("notifications")
          .delete()
          .eq("endpoint", endpoint);

        if (appNotificationDeletionError) {
          console.error(
            `[ERROR] Failed to delete app notification for endpoint ${endpoint}`,
            error,
          );
        }
      }
    }
  }

  return new Response(
    JSON.stringify({ message: "Push notification(s) sent" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/push' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
