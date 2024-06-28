import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { IoNotifications, IoNotificationsOffSharp } from "react-icons/io5";

import config from "../config";

import useAuth from "../hooks/useAuth";

import supabase from "../lib/supabase";
import {
  isPushNotificationsSupported,
  isDeviceNotificationsForAppDenied,
  urlBase64ToUint8Array,
} from "../lib/pwa/notifications";

type NotificationState = "unknown" | "enabled" | "disabled";

/**
 * @description
 * Upon component mount:
 * 1. Check if the browser supports device notifications
 * 2. Check if the user has granted permission to allow device notifications for this application
 * 3. Check if the user has enabled notifications by fetching the subscription endpoint
 * 4. If the user has not enabled notifications, display the notifications icon
 * 5. If the user has enabled notifications, display the notifications off icon
 */
function NotificationsIcon(): JSX.Element | null {
  const { user } = useAuth();

  const [notificationState, setNotificationState] =
    useState<NotificationState>("unknown");
  const [init, setInit] = useState<boolean>(false);
  const [semaphore, setSemaphore] = useState<boolean>(false);

  async function enableNotifications(user: User) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.VAPID_PUBLIC_KEY),
      });

      const { status, error } = await supabase.from("notifications").insert({
        user_id: user.id,
        endpoint: JSON.stringify(subscription),
      });

      if (error) {
        await subscription.unsubscribe();
        console.error("[ERROR] Error enabling notifications:", error);
        return;
      }

      if (status === 201) {
        setNotificationState("enabled");
      }
    } catch (error) {
      console.error("[ERROR] Error enabling notifications:", error);
      setNotificationState("unknown");
    }
  }

  async function disableNotifications() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      setNotificationState("disabled");
      return;
    }

    await supabase
      .from("notifications")
      .delete()
      .eq("endpoint", JSON.stringify(subscription))
      .single();

    const isUnsubscribed = await subscription?.unsubscribe();
    if (isUnsubscribed) {
      setNotificationState("disabled");
    }
  }

  useEffect(() => {
    async function initNotificationState(user: User) {
      setSemaphore(true);
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      // The user has not enabled notifications previously
      if (!subscription) setNotificationState("disabled");

      // The user has enabled notifications previously from the same device on a signed in account
      if (subscription) {
        const { status, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .eq("endpoint", JSON.stringify(subscription))
          .single();

        // 200 Status Code OK - Succesfully fetched notification associated with signed in user
        if (status === 200) setNotificationState("enabled");

        // 406 Status Code Not Acceptable - Could not find the subscription endpoint in the database
        if (status === 406) {
          const { status, error } = await supabase
            .from("notifications")
            .insert({
              user_id: user.id,
              endpoint: JSON.stringify(subscription),
            });

          // 201 Status Code Created - Succesfully inserted notification associated with signed in user
          if (status === 201) setNotificationState("enabled");

          // Could not insert notification associated with signed in user
          if (status !== 201 && error) {
            console.error(
              "[ERROR] Error associating user and notification with insert:",
              error
            );
            setNotificationState("unknown");
          }
        }

        // Something else went wrong fetching the notification associated with the signed in user
        if (status !== 406 && error) {
          console.error("[ERROR] Error fetching notification:", error);
          setNotificationState("unknown");
        }
      }

      setInit(true);
      setSemaphore(false);
    }

    if (user && !init && !semaphore) initNotificationState(user);
    if (!user) {
      setNotificationState("unknown");
      setInit(false);
    }
  }, [user, init, semaphore]);

  if (!user || notificationState === "unknown") {
    return (
      <IoNotifications
        size="1.25em"
        color="grey"
        onClick={() =>
          console.debug(
            "[DEBUG] Receiving notifications is in an unknown state due to no user authentication, no service worker, network error, app race condition, or disabled notifications in your browser/device settings. If you are using a browser and wish to receive notifications, if you dismissed the notification permission prompt, refresh the browser to get a prompt to enable notfications, or reset permissions in your browser settings and reload the application. If you are using a PWA on a mobile device, enable device notifications for the Noted app in your device settings then close and re-open this PWA, otherwise you may need to reinstall the PWA"
          )
        }
      />
    );
  }

  // The browser/device does not support notifications
  if (!isPushNotificationsSupported()) {
    return (
      <IoNotifications
        size="1.25em"
        color="grey"
        onClick={() =>
          console.debug(
            "[DEBUG] Push notifications not supported on this browser/device"
          )
        }
      />
    );
  }

  // The user has not granted their device permission to receive notifications for this application
  if (isDeviceNotificationsForAppDenied()) {
    return (
      <IoNotifications
        className="cursor-pointer"
        size="1.25em"
        color="grey"
        onClick={() =>
          console.debug(
            "[DEBUG] Notifications denied by the user. To get a prompt to enable notifications, refresh the browser if you dismissed the notification permission prompt, or reset permissions in your browser settings, and reload the application. If you are using a mobile device, enable device notifications for the Noted app in your device settings and close then re-open this PWA, otherwise you may need to reinstall the PWA."
          )
        }
      />
    );
  }

  // The Device Notification Subscription is in a "enabled" state - show the user the notification off icon for the option to unsubscribe
  if (notificationState === "enabled") {
    return (
      <IoNotificationsOffSharp
        className="cursor-pointer hover:text-secondary dark:hover:text-quaternary"
        size="1.25em"
        onClick={() => disableNotifications()}
      />
    );
  }

  // The Device Notification Subscription is in an "disabled" state - show the user the notification icon for the option to subscribe
  return (
    <IoNotifications
      className="cursor-pointer hover:text-secondary dark:hover:text-quaternary"
      size="1.25em"
      onClick={() => enableNotifications(user)}
    />
  );
}

export default NotificationsIcon;
