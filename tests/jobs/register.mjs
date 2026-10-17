// node --import ./tests/jobs/register.mjs --test tests/jobs/  (npm run test:jobs)
import { register } from "node:module";

register("./ts-hooks.mjs", import.meta.url);
