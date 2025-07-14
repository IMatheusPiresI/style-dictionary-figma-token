import fs from 'fs';
import path from 'path';

export class ConvertFigmaTokensToDictionaryFormatUseCase {
  public async execute(): Promise<void> {
    const outputJsonPath = 'src/style-dictionary/tokens/figma-tokens-formatted.json';
    const rawData = fs.readFileSync('src/style-dictionary/tokens/tokens.json', 'utf-8');

    const figmaTokensJson = JSON.parse(rawData);

    if (!figmaTokensJson?.global || !figmaTokensJson?.Primitivies) {
      throw new Error('O JSON precisa conter as chaves "global" e "Primitivies".');
    }

    const primitives = { ...figmaTokensJson.Primitivies };
    const global = { ...figmaTokensJson.global['Tokens Empresa&Core/Light'] };

    const normalizedTokens = {
      ...primitives,
      ...global,
    };

    const outputDir = path.dirname(outputJsonPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputJsonPath, JSON.stringify(normalizedTokens, null, 2), 'utf-8');
  }
}
