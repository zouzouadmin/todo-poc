const { withGradleProperties } = require("expo/config-plugins");

const PROPS = {
  "org.gradle.jvmargs":
    "-Xmx4096m -XX:MaxMetaspaceSize=768m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8",
  "org.gradle.daemon": "false",
  "org.gradle.parallel": "false",
  "org.gradle.configureondemand": "false",
  "org.gradle.workers.max": "2",
};

module.exports = function withGradleMemory(config) {
  return withGradleProperties(config, (cfg) => {
    for (const [key, value] of Object.entries(PROPS)) {
      const index = cfg.modResults.findIndex(
        (item) => item.type === "property" && item.key === key,
      );
      const entry = { type: "property", key, value };
      if (index >= 0) {
        cfg.modResults[index] = entry;
      } else {
        cfg.modResults.push(entry);
      }
    }
    return cfg;
  });
};
