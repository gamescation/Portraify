import Pusher from 'pusher-js/react-native';
import { REACT_APP_PUSHER_API_KEY } from '@env';

const pusher = new Pusher(REACT_APP_PUSHER_API_KEY, {
    cluster: 'mt1',
    encrypted: true
  });
  

export async function subscribe(channelName:string, handler: (data:any) => void) {
  const channel = pusher.subscribe(channelName);
  channel.bind('queued', (data) => {
      console.log("Queued data: ", data);
      handler(data);
  });

  channel.bind('complete', (data) => {
    console.log("Completed: ", data);
    handler(data);
  });

  channel.bind('upscaled', (data) => {
    console.log("Upscaled: ", data);
    handler(data);
  })
}

export async function unsubscribe(channelName: string) {
  return pusher.unsubscribe(channelName);
}