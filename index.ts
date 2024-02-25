import { fileURLToPath } from "url";
import path from "path";
import readline from "readline"; // Import readline module
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";

// model name
const MODEL_NAME = "mistral-7b-instruct-v0.1.Q5_K_M.gguf";

// get the models directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDirectory = path.join(__dirname, "../models");
const modelsPath = path.join(modelsDirectory, MODEL_NAME);

const model = new LlamaModel({
    modelPath: modelsPath
});

const context = new LlamaContext({model});
const session = new LlamaChatSession({context});

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askPrompt() {
    rl.question("Enter your prompt: ", async function(prompt) {
        console.log("Human: " + prompt);
        
        const response = await session.prompt(prompt);
        console.log("Llama: " + response);

        // Call askPrompt recursively to continue the conversation
        askPrompt();
    });
}

// Start the conversation
askPrompt();

// Handling Ctrl + C to terminate the program
rl.on("SIGINT", function() {
    console.log("\nConversation ended.");
    rl.close();
});
