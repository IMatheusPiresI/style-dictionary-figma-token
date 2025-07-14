import StyleDictionary, { TransformedTokens } from 'style-dictionary';

type TokenValue = string | number | boolean | null;

type TokenNode = {
  $value?: TokenValue;
  [key: string]: TokenNode | TokenValue | undefined;
};

export class BuildTokensUseCase {
  private WEB_TOKEN_PATH: string;
  private MOBILE_TOKEN_PATH: string;

  constructor(webTokenPath: string, mobileTokenPath: string) {
    this.WEB_TOKEN_PATH = webTokenPath;
    this.MOBILE_TOKEN_PATH = mobileTokenPath;
    this.registerTransforms();
  }

  private registerTransforms() {
    StyleDictionary.registerTransform({
      name: 'name/cti/camel',
      type: 'name',
      transform: ({ path }: { path: string[] }) => {
        const [first, ...rest] = path;
        return [
          first.toLowerCase(),
          ...rest.map(word => word.charAt(0).toUpperCase() + word.slice(1)),
        ].join('');
      },
    });

    StyleDictionary.registerTransformGroup({
      name: 'custom/js',
      transforms: ['attribute/cti', 'name/cti/camel', 'color/hex', 'size/px', 'time/seconds'],
    });

    StyleDictionary.registerFormat({
      name: 'json/values-only',
      format: ({ dictionary }) => {
        function flatten(obj: TokenNode, prefix = '', result: Record<string, unknown> = {}) {
          for (const key in obj) {
            const value = obj[key];
            const newKey = prefix ? `${prefix}${capitalizeFirst(key)}` : key;

            if (typeof value === 'object' && value !== null && 'value' in value) {
              result[newKey] = parseValue(value.value as TokenValue);
            } else if (typeof value === 'object' && value !== null) {
              flatten(value, newKey, result);
            }
          }
          return result;
        }

        function capitalizeFirst(str: string) {
          return str.charAt(0).toUpperCase() + str.slice(1);
        }

        function parseValue(value: TokenValue) {
          if (typeof value === 'string' && !isNaN(Number(value))) {
            return Number(value);
          }
          return value;
        }

        const flatValues = flatten(dictionary.tokens);
        return JSON.stringify(flatValues, null, 2);
      },
    });
  }

  public async execute(): Promise<void> {
    const web = new StyleDictionary(this.WEB_TOKEN_PATH);
    const mobile = new StyleDictionary(this.MOBILE_TOKEN_PATH);

    const [mobileTokens, webTokens] = await Promise.all([
      mobile.buildAllPlatforms(),
      web.buildAllPlatforms(),
    ]);

    if (!mobileTokens) {
      throw new Error('Mobile tokens not found');
    }

    if (!webTokens) {
      throw new Error('Web tokens not found');
    }

    return;
  }
}
