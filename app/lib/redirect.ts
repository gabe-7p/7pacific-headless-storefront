import { redirect } from 'react-router';

export const redirectIfHandleIsLocalized = (
  request: Request,
  { handle, data }: { handle: string; data: { handle: string } }
) => {
  if (handle !== data.handle) {
    const url = new URL(request.url);
    url.pathname = url.pathname.replace(handle, data.handle);
    throw redirect(url.toString());
  }
};
