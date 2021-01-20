import { GENERATE_NEXACRO, WATCH_OPTION, WATCH_PATH } from "./const.ts";
console.log("Deno is running...");
const watcher = Deno.watchFs(WATCH_PATH, WATCH_OPTION);
const options = { regenerate: false };
let timeoutID: number;

for await (const event of watcher) {
  //console.log(event);
  try {
    await Deno.stat(`${WATCH_PATH}\\regenerate.all`);
    options.regenerate = true;
  } catch (error) {
    if (error && error.name === "NotFound") {
      options.regenerate = false;
    } else {
      throw error;
    }
  }
  runNexacroDeploy(event);
}

async function runNexacroDeploy(event: Deno.FsEvent) {
  //console.log("event", timeoutID);
  const path = event.paths[0];
  const kind = event.kind;
  if (timeoutID) clearTimeout(timeoutID);

  timeoutID = setTimeout(
    async () => {
      if (path.indexOf("$") < 0 && kind == "modify") {
        const generateAll = path.search(
          /.*?\.xml|.*?\.xadl|.*?\.xcss|.*?\.png|.*?\.jpg/gi,
        );
        if (options.regenerate) GENERATE_NEXACRO.push("-REGENERATE");
        if (!options.regenerate && generateAll != 0) {
          GENERATE_NEXACRO.push("-FILE", `${path}`);
        }
        const p = Deno.run({
          cmd: GENERATE_NEXACRO,
        });
        const s = await p.status();
        if (s.success) p.close();
      }
    },
    1000,
  );
}