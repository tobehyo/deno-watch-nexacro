const WATCH_PATH = "c:\\_projects\\nexacro\\17.1\\projects\\hellonexacro";
const WATCH_OPTION = { recursive: true };
const GENERATE_NEXACRO = [
  "C:\\Program Files (x86)\\nexacro\\17.1\\nexacrodeploy17.exe",
  "-P",
  "C:\\_projects\\nexacro\\17.1\\projects\\hellonexacro\\hellonexacro.xprj",
  "-O",
  "C:\\_projects\\nexacro\\17.1\\outputs\\hellonexacro",
  "-B",
  "C:\\Program Files (x86)\\nexacro\\17.1\\nexacro17lib",
];

export { GENERATE_NEXACRO, WATCH_OPTION, WATCH_PATH };
