Sending Push Notifications using Firebase Cloud Message (FCM) with Supabase - https://supabase.com/docs/guides/functions/examples/push-notifications

Supabase Edge Functions
- https://supabase.com/docs/guides/functions
- Edge Functions are developing using Deno
    - Deno Installation - https://deno.com/
    - Setting up Deno environment with your Editor - https://deno.land/manual/getting_started/setup_your_environmenthttps://deno.land/manual/getting_started/setup_your_environment
    - Download the Deno extension for VSCode - https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno

Solution to enable Brave Push Notifications - https://github.com/pusher/push-notifications-web/issues/65
Check your MacOS permissions - Select the main Apple menu, go to System Settings > Notifications. Scroll through the list, locate the troublesome application, select it, and toggle on Allow Notifications.

Web Push npm package - https://www.npmjs.com/package/web-push

Sources:
https://dev.to/u4aew/how-to-set-up-push-notifications-in-safari-on-ios-ki9
https://gist.github.com/inyee786/2755de492d2510328327aa33d30b8b2e
https://alik.page/2019/06/deploy-spa-application-to-kubernetes/
https://www.bocoup.com/blog/full-stack-web-push-api-guide
https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers

Examples:
https://push.fancy-app.site/
https://github.com/u4aew/react-pwa-push-notifications
https://www.npmjs.com/package/react-pwa-push-notifications?activeTab=readme#usage

Architecture:

User #1
    - Creates a Note (Supabase Insert Operation)
    - Webhook is trigger to Edge Function
    - Edge Function
        1. Gets all users that is subscribed to User #1 and their subscription URLs
            - Subscription URLs are servers maintained by the browser company
        2. Sends a Push Notification to all users that are subscribed to User #1
            - On fail, find the subscription URL and remove it from the database

User #2
    - Can go to a person's profile page and subscribe to their notifications and add their subscription URL to the database
    - Can unsubscribe from a person's profile page and remove their subscription URL from the database

All Users
    - Registers a service worker to receive push notifications