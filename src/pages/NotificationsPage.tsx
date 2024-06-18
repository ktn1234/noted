function NotificationsPage() {
  return (
    <main className="p-3 md:p-5">
      <h1 className="text-2xl text-center">Notfications</h1>
      <h2 className="text-xl mt-5 text-center">Q&A</h2>
      <section className="mt-5 text-center">
        <h3 className="text-lg mt-5">
          <strong>Why am I not getting notifications?</strong>
        </h3>
        <ul>
          <li>
            <a
              className="hover:underline hover:text-tertiary dark:hover:text-secondary underline"
              target="_blank"
              href="https://documentation.onesignal.com/docs/notifications-not-shown-web-push"
            >
              OneSignal's Troubleshooting Guide
            </a>
          </li>
          <li className="mt-2">
            <strong>iOS Devices:</strong> <br />
            Push notifications are only supported on iOS 16.4 or later. Read
            more here{" "}
            <a
              className="hover:underline hover:text-tertiary dark:hover:text-secondary underline"
              target="_blank"
              href="https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers"
            >
              (https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers)
            </a>
          </li>
          <li className="mt-2">
            <strong>Android Devices:</strong> <br /> I have not tested this on
            Android devices. Please let me know if you have any issues.
          </li>
          <li className="mt-2">
            <strong>Brave Browser:</strong>
            <ul>
              <li>
                Settings &gt; Privacy and security &gt; Enable Use Google
                services for push messaging
              </li>
              <li>
                Settings &gt; Privacy and security &gt; Site and Shields
                Settings &gt; Notifications &gt; Allow this site to send you
                notifications
              </li>
            </ul>
          </li>
          <li className="mt-2">
            <strong>MacOS Devices:</strong>
            <ul>
              <li>
                System Settings &gt; Notifications &gt; Under Application
                Notifications, select the browser you are using and enable
                notifications
              </li>
              <li>Disable Do Not Disturb</li>
            </ul>
          </li>
          <li className="mt-2">
            <strong>Windows 11 Devices:</strong>
            <ul>
              <li>
                System Settings &gt; Notifications &gt; Enable notifications
              </li>
              <li>
                System Settings &gt; Notifications &gt; Disable Do Not Disturb
              </li>
              <li>
                System Settings &gt; Notifications &gt; Under Notifications from
                apps and other senders, select the browser you are using and
                enable notifications
              </li>
            </ul>
          </li>
        </ul>
      </section>
      <section className="text-center">
        <h3 className="text-lg mt-5 ">
          <strong>
            Known bugs in iOS Devices as of{" "}
            <time dateTime="2024-06-18">June 18th, 2024</time>
          </strong>
        </h3>
        <ul>
          <li>
            If you have denied device notifications for the PWA, and re-launch
            the PWA, the bell icon will appear as if you can enable
            notifications. However, when you click on the bell icon, it will not
            prompt you to enable device notifications, and bell icon will appear
            grey since you have previously disabled device notifications due to
            PWA on iOS devices not retaining device notification state.
            <br />
            <br />
            If you have previously allowed device notifications for the PWA
            while using the app, then denied device notifications for the PWA in
            your iOS settings, and re-launch the PWA, the bell icon with a slash
            will appear to disable notifications. Clicking on the icon will
            still dissociate the device notification from the PWA, but then the
            bell icon will appear as if you can enable notifications. However,
            when you click on the bell icon, it will not prompt you to enable
            device notifications, and bell icon will appear grey since you have
            previously disabled device notifications due to PWA on iOS devices
            not retaining device notification state.
            <br />
            <br />
            Read more here{" "}
            <a
              className="hover:underline hover:text-tertiary dark:hover:text-secondary underline"
              target="_blank"
              href="https://stackoverflow.com/questions/78620401/weird-behavior-while-checking-web-push-notifications-permissions-on-safari"
            >
              (https://stackoverflow.com/questions/78620401/weird-behavior-while-checking-web-push-notifications-permissions-on-safari)
            </a>{" "}
            <a
              className="hover:underline hover:text-tertiary dark:hover:text-secondary underline"
              target="_blank"
              href="https://stackoverflow.com/questions/76590928/pwa-on-ios-notification-permission-return-default-whatever-we-chose"
            >
              (https://stackoverflow.com/questions/76590928/pwa-on-ios-notification-permission-return-default-whatever-we-chose)
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}

export default NotificationsPage;
