(self.addEventListener("push", (e) => {
  const promises = [];

  const message = e.data?.json();
  const { title, body, url, timestamp } = message;

  promises.push(
    self.registration.showNotification(title, {
      body,
      icon: "/assets/apple-icon-180.png",
      image: "/assets/apple-icon-180.png",
      badge: "/assets/apple-icon-180.png",
      timestamp,
      data: {
        url
      }
    })
  );

  e.waitUntil(Promise.all(promises));
}),
  self.addEventListener("notificationclick", (e) => {
    const urlToOpen = new URL(self.location.origin).href;
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
  }));
