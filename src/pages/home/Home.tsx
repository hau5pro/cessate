import { useInitUserSettings } from '@features/userSettings/useInitUserSettings';

function HomePage() {
  useInitUserSettings();

  return <div>Home</div>;
}

export default HomePage;
