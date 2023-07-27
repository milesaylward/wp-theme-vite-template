import fs from 'fs';
import { resolve as resolvePath, dirname } from 'path';

import { Plugin } from 'vite';

export const CopyFilePlugin = ({
  sourceFileName,
  absolutePathToDestination,
}: {
  sourceFileName: string;
  absolutePathToDestination: string;
}): Plugin => ({
  name: 'copy-file-plugin',
  writeBundle: async (options: any, bundle) => {
    const fileToCopy = Object.values(bundle).find(({ name }) => name === sourceFileName);
    if (!fileToCopy) return;

    const sourcePath = resolvePath(options.dir, fileToCopy.fileName);

    await fs.promises.mkdir(dirname(absolutePathToDestination), { recursive: true });
    await fs.promises.copyFile(sourcePath, `${absolutePathToDestination}/${fileToCopy.fileName.replace('assets/', '')}`);
  },
});