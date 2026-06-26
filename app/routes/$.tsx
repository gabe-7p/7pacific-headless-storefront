import type { Route } from './+types/$';

export async function loader({ request }: Route.LoaderArgs) {
  throw new Response(`${new URL(request.url).pathname} not found. So Sad :(`, {
    status: 404,
  });
}

const CatchAllPage = () => {
  return null;
};

export default CatchAllPage;
