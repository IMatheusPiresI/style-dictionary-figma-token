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
        function extractValues(obj: TokenNode): TokenValue | Record<string, unknown> {
          if ('$value' in obj && typeof obj.$value !== 'undefined') {
            return obj.$value;
          }

          const result: Record<string, unknown> = {};

          for (const key in obj) {
            if (key === '$value') continue;
            const val = obj[key];
            if (typeof val === 'object' && val !== null) {
              result[key] = extractValues(val as TokenNode);
            }
          }

          return result;
        }

        const valuesOnly = extractValues(dictionary.tokens);
        return JSON.stringify(valuesOnly, null, 2);
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
