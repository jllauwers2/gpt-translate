// Import necessary modules
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import "dotenv/config";

// Initialize OpenAI client with API key from .env
const openai = new OpenAI({
  apiKey: process.env.APIKEY,
});

// Extract configurations from environment variables
const MODEL = process.env.GPTMODEL;
const INPUT_DIR = process.env.INPUTDIR;
const OUTPUT_DIR = process.env.OUTPUTDIR;
const LANGUAGES = process.env.LANGUAGES.split(",");
const RPM = parseInt(process.env.RPM, 10) || 500;

// Helper function to throttle API calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to validate directories
function validateDirectories(inputDir, outputDir) {
  // Check and create input directory if missing
  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory "${inputDir}" does not exist.`);
    process.exit(1); // Exit the script if input directory is missing
  }

  // Check and create output directory if missing
  if (!fs.existsSync(outputDir)) {
    console.log(
      `Output directory "${outputDir}" does not exist. Creating it...`
    );
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

// Function to translate text with source language and context
async function translateText(text, targetLanguage, sourceLanguage) {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: `Translate the following text from ${sourceLanguage} to ${targetLanguage}, preserving the context and original formatting. If a word or element cannot be translated, leave it as is. Do not ask further questions.
Text: "${text}"`,
        },
      ],
    });

    if (response && response.choices && response.choices[0]) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error("Invalid response from OpenAI API");
    }
  } catch (error) {
    console.error(
      `Error during translation from ${sourceLanguage} to ${targetLanguage}:`,
      error
    );
    throw error;
  }
}

// Function to handle file translation
async function translateFile(filePath, targetLanguages, outputDir) {
  const fileName = path.basename(filePath);
  const fileExtension = path.extname(fileName);
  const baseNameWithLang = fileName.replace(fileExtension, "");
  const baseName = baseNameWithLang.substring(
    0,
    baseNameWithLang.lastIndexOf("_")
  );

  // Extract source language from filename
  const sourceLanguage = baseNameWithLang.split("_").pop();

  // Read file content
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error(`Failed to read file ${filePath}:`, err);
    return;
  }

  // Parse file based on its format
  let parsedContent;
  if (fileExtension == ".json") {
    try {
      parsedContent = JSON.parse(content); // Parse JSON
    } catch (err) {
      console.error(`Failed to parse ${filePath} as JSON:`, err);
      return;
    }
  } else {
    parsedContent = content; // Treat XML/XHTML or plain text as a raw string
  }

  // Translate for each target language
  for (const targetLanguage of targetLanguages) {
    let translatedContent;

    try {
      if (fileExtension == ".json") {
        // JSON Translation
        translatedContent = {};
        for (const [key, value] of Object.entries(parsedContent)) {
          const translatedValue = await translateText(
            value,
            targetLanguage,
            sourceLanguage
          );
          translatedContent[key] = translatedValue.replace(/^"|"$/g, ""); // Remove extra quotes
          await delay(60000 / RPM); // Throttle requests
        }
      } else if ([".xml", ".xhtml"].includes(fileExtension)) {
        // XML/XHTML Translation
        translatedContent = await translateText(
          parsedContent,
          targetLanguage,
          sourceLanguage
        );
        await delay(60000 / RPM); // Throttle requests
      } else {
        // Plain Text Translation
        translatedContent = await translateText(
          parsedContent,
          targetLanguage,
          sourceLanguage
        );
        await delay(60000 / RPM); // Throttle requests
      }

      // Determine output file name
      const outputFileName = `${baseName}_${targetLanguage}${fileExtension}`;
      const targetFilePath = path.join(outputDir, outputFileName);

      // Write translated file
      const outputContent =
        fileExtension == ".json"
          ? JSON.stringify(translatedContent, null, 2)
          : translatedContent; // Ensure XML/XHTML remains a string
      fs.writeFileSync(targetFilePath, outputContent, "utf8");
      console.log(`Translated file written to: ${targetFilePath}`);
    } catch (err) {
      console.error(
        `Failed to translate or write file for ${targetLanguage}:`,
        err
      );
    }
  }
}

// Main function to handle directory translation
async function translateDirectory(inputDir, outputDir, targetLanguages) {
  // Validate input and output directories
  validateDirectories(inputDir, outputDir);

  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    const filePath = path.join(inputDir, file);
    if (fs.lstatSync(filePath).isFile()) {
      await translateFile(filePath, targetLanguages, outputDir);
    }
  }
}

// Run the script
(async () => {
  try {
    console.log("Starting translation process...");
    validateDirectories(INPUT_DIR, OUTPUT_DIR);
    await translateDirectory(INPUT_DIR, OUTPUT_DIR, LANGUAGES);
    console.log("Translation process completed successfully.");
  } catch (error) {
    console.error("Error during translation process:", error);
  }
})();
