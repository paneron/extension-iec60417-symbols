import { makeExtension } from '@riboseinc/paneron-extension-kit';

export default makeExtension({
  mainView: () => import('./RepoView'),
  name: "IEC 60417 Symbol Registry",
  requiredHostAppVersion: "^1.0.0-beta1",
  datasetMigrations: {},
  datasetInitializer: () => import('./migrations/initial'),
});
