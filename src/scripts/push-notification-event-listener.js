self.addEventListener("push", (e) => {
  const message = e.data?.json();
  self.registration.showNotification("Noted", {
    body: message.body,
    icon: "/assets/apple-icon-180.png",
    image: "/assets/apple-icon-180.png",
    badge: "/assets/apple-icon-180.png",
    data: { url: message.url },
  });
}),
  self.addEventListener("notificationclick", (e) => {
    const urlToOpen = new URL(e.notification.data.url, self.location.origin)
      .href;
    const promiseChain = self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        let matchingClient;
        for (const windowClient of windowClients) {
          if (windowClient.url === urlToOpen) {
            matchingClient = windowClient;
            break;
          }
        }
        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return self.clients.openWindow(urlToOpen);
        }
      });
    e.waitUntil(promiseChain);
  });
