
# GPT Translation Tool

GPT Translation Tool is a Node.js-based application that uses OpenAI's GPT API to translate text and structured files. 

## Features

- **Multi-Language Support**: Translate text into multiple languages defined in your configuration.
- **File Format Preservation**: Supports `.txt`, `.json`, `.xml`, and `.xhtml` file formats, preserving their structure and tags.
- **Context-Aware Translations**: Leverages OpenAI's GPT API for translations with contextual understanding.
- **Rate Limit Compliance**: Adheres to OpenAI's request per minute (RPM).
- **Customizable**: Configure languages, directories, and GPT models via an environment file.

---

## Requirements

- **Node.js**: v18.0.0 or later
- **npm**: v8.0.0 or later
- OpenAI API Key

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   cd your-repository-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```

4. Add the required environment variables to the `.env` file (see [Configuration](#configuration)).

---

## Configuration

### Environment Variables
Create a `.env` file with the following variables:

```plaintext
# OpenAI Configuration
APIKEY=your-openai-api-key
GPTMODEL=gpt-4o-mini

# Rate Limit Configurations
RPM=500               # Requests per minute
TPM=200000            # Tokens per minute

# Directory Configurations
INPUTDIR=IN           # Directory containing input files for translation
OUTPUTDIR=OUT         # Directory for translated files

# Target Languages
LANGUAGES=fr,nl       # Comma-separated list of ISO 639-1 language codes
```

---

## Usage

1. Place the input files in the `INPUTDIR` directory. Files should follow this naming convention:
   ```
   filename_original-language.extension
   ```
   Example: `document_en.txt`, `data_en.json`, `data_en.xhtml`

2. Run the application:
   ```bash
   npm start
   ```

3. Translated files will appear in the `OUTPUTDIR` directory, named as:
   ```
   filename_target-language.extension
   ```
   Example: `document_fr.txt`, `data_nl.json`, `data_nl.xhtml`

---

## Supported File Formats

The tool supports the following file formats:

- **Plain Text (`.txt`)**: Translates the entire file content.
- **JSON (`.json`)**: Translates the values while preserving keys.
- **XML/HTML (`.xml`, `.xhtml`)**: Translates textual content while preserving tags and attributes.

---

## Example Workflow

### Input: `IN/greetings_en.json`
```json
{
  "hello": "Hello, world!",
  "welcome": "Welcome to GPT Translation Tool!"
}
```

### Output: `OUT/greetings_fr.json`
```json
{
  "hello": "Bonjour, le monde!",
  "welcome": "Bienvenue à l'outil de traduction GPT!"
}
```

---

## Development

### Scripts
- **Start the application**:
  ```bash
  npm start
  ```

### Directory Structure
```
project-root/
├── IN/                # Input files for translation
├── OUT/               # Output directory for translated files
├── .env               # Environment configuration file
├── index.js           # Main script
├── package.json       # Node.js dependencies and scripts
└── README.md          # Project documentation
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the **LGPL-3.0-or-later** license. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [OpenAI](https://openai.com/) for providing the GPT model.
- [OpenAI](https://openai.com/) for the code review.
- [OpenAI](https://openai.com/) for the README : - )
- The open-source community for inspiring development.
