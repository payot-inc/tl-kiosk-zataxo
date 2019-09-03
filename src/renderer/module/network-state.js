/* eslint-disable */
import { of, Subject, merge } from 'rxjs';

const startStatus = of(navigator.onLine);
const onLineEvent = new Subject();

window.addEventListener('online', () => onLineEvent.next(true));
window.addEventListener('offline', () => onLineEvent.next(false));

export const networkStatusChange = merge(startStatus, onLineEvent).pipe();
