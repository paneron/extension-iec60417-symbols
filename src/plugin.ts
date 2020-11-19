import { makeExtension } from '@riboseinc/paneron-extension-kit';

export default makeExtension({
  repoView: () => import('./RepoView'),
  name: "IEC 60417 Symbols Registry",
});
