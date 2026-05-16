import {
  ConfigPlugin,
  createRunOncePlugin,
  withAndroidManifest,
  withProjectBuildGradle,
} from '@expo/config-plugins';

export interface WithUmengProps {
  /** The Umeng AppKey, also written as `UMENG_APPKEY` meta-data into AndroidManifest. */
  appKey: string;
  /** Channel name reported to Umeng. Defaults to `Umeng`. */
  channel?: string;
}

const PLUGIN_NAME = '@minqian/react-native-umeng';
const PLUGIN_VERSION = '0.1.0';
const ALIYUN_MAVEN = 'https://maven.aliyun.com/repository/public';

function setMetaData(
  application: any,
  name: string,
  value: string,
): void {
  application['meta-data'] = application['meta-data'] ?? [];
  const existing = application['meta-data'].find(
    (m: any) => m.$ && m.$['android:name'] === name,
  );
  if (existing) {
    existing.$['android:value'] = value;
  } else {
    application['meta-data'].push({
      $: {
        'android:name': name,
        'android:value': value,
      },
    });
  }
}

function withUmengAndroidManifest(
  config: any,
  props: WithUmengProps,
): any {
  return withAndroidManifest(config, (c: any) => {
    const manifest = c.modResults.manifest;
    manifest.application = manifest.application ?? [{}];
    const app = manifest.application[0];
    setMetaData(app, 'UMENG_APPKEY', props.appKey);
    setMetaData(app, 'UMENG_CHANNEL', props.channel ?? 'Umeng');
    return c;
  });
}

/**
 * Insert the aliyun Maven mirror at the top of `allprojects { repositories { } }`
 * in the root `build.gradle` so the Umeng artifacts resolve in mainland China.
 */
function withUmengMavenRepo(config: any): any {
  return withProjectBuildGradle(config, (c: any) => {
    if (c.modResults.language !== 'groovy') {
      return c;
    }
    let contents: string = c.modResults.contents;
    if (contents.includes(ALIYUN_MAVEN)) {
      return c;
    }
    const repoBlock = `        maven { url '${ALIYUN_MAVEN}' }`;
    // Try to inject into allprojects { repositories { ... } }
    const allProjects = /allprojects\s*\{[\s\S]*?repositories\s*\{/m;
    if (allProjects.test(contents)) {
      contents = contents.replace(allProjects, (m) => `${m}\n${repoBlock}`);
    } else {
      // No allprojects.repositories block? Append one.
      contents += `\nallprojects {\n    repositories {\n${repoBlock}\n    }\n}\n`;
    }
    c.modResults.contents = contents;
    return c;
  });
}

const withUmeng: ConfigPlugin<WithUmengProps> = (config, props) => {
  if (!props?.appKey) {
    throw new Error(`[${PLUGIN_NAME}] "appKey" prop is required`);
  }
  config = withUmengAndroidManifest(config, props);
  config = withUmengMavenRepo(config);
  return config;
};

export { withUmeng };
export default createRunOncePlugin(withUmeng, PLUGIN_NAME, PLUGIN_VERSION);
