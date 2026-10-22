import { http } from './http';

export function submitContact(payload) {
  return http.post('/contact', payload);
}
