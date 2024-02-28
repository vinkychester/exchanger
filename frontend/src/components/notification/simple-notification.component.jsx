import React from 'react';
import Notification from 'rc-notification';

// import 'rc-notification/assets/index.css';

let notification = null;
Notification.newInstance({}, (n) => notification = n);

export const simpleNotification = (message, type) => {
  notification.notice({
    content: <span className={`message ${type}`}>{message}</span>,
    duration: 5,
  });
}