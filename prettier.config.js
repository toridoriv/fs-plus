import { prettierConfig } from "@toridoriv/eslint-config";

prettierConfig.objectWrap = "collapse";

prettierConfig.jsdocIgnoreNewLineDescriptionsForConsistentColumns = true;
prettierConfig.jsdocAllowDescriptionOnNewLinesForTags = ["module"];
prettierConfig.jsdocLinesBetweenExampleTagAndCode = 0;
prettierConfig.jsdocFormatExamples = true;
prettierConfig.jsdocIndentUnformattedExamples = true;

export default prettierConfig;
