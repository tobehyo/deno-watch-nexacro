const WATCH_PATH = "c:\\_projects\\nexacro\\17.1\\projects\\hellonexacro";
const WATCH_OPTION = { recursive: true };
const GENERATE_NEXACRO = [
    "C:\\Program Files (x86)\\nexacro\\17.1\\nexacrodeploy17.exe", 
    "-P", "C:\\_projects\\nexacro\\17.1\\projects\\hellonexacro\\hellonexacro.xprj", 
    "-O", "C:\\_projects\\nexacro\\17.1\\outputs\\hellonexacro",
    "-B", "C:\\Program Files (x86)\\nexacro\\17.1\\nexacro17lib"
];
console.log("Deno is running...");
const watcher = Deno.watchFs(WATCH_PATH, WATCH_OPTION);
const options = {regenerate: false};
let timeoutID:number;

for await (const event of watcher) {
    //console.log(event);
    try {
        await Deno.stat(`${WATCH_PATH}\\all`);
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

async function runNexacroDeploy (event:Deno.FsEvent) {
   
    //console.log("event", timeoutID);
    const path = event.paths[0];
    const kind = event.kind;
    if(timeoutID) clearTimeout(timeoutID);
    
    timeoutID = setTimeout(
        async () => {
            if(path.indexOf("$")<0 && kind == "modify") {
                const generateAll = path.search(/.*?\.xml|.*?\.xadl|.*?\.xcss|.*?\.png|.*?\.jpg/gi);
                if(options.regenerate) GENERATE_NEXACRO.push("-REGENERATE");
                if(!options.regenerate && generateAll!=0) GENERATE_NEXACRO.push("-FILE", `${path}`);
                const p = Deno.run({
                    cmd: GENERATE_NEXACRO
                });
                const s = await p.status();
                if(s.success) p.close();
            }
    }
    , 1000);

}