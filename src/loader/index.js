import Loader from './core.js'
import nameExports from './nameExports.js';
import amd from './amd.js';
const loader = new Loader();
amd(loader);
nameExports(loader);

export default loader;
