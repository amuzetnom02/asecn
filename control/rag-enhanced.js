// rag-agent.js — ASECN Recursive Autonomy Grid (RAG v1.5)
const fs = require('fs');
const path = require('path');
const { SimpleDirectoryReader, VectorStoreIndex, ServiceContext } = require('llama_index');
const { LlamaCPP } = require('llama_index.llms.llama_cpp');
const logger = require('../8_utilities/logger');

// ===== CONFIG =====
const CONFIG = {
    MODEL_PATH: 'path/to/your/model.gguf',
    CTX_SIZE: 4096,
    THREADS: 8,
    PROJECT_DIR: 'c:/_worxpace/asecn',
    LOG_PATH: 'control/rag-log.json',
    ENABLE_AUTONOMOUS_LOOP: false,
    LOOP_INTERVAL_MS: 1000 * 60 * 15, // 15 min cycle
    DEFAULT_QUERY: 'Summarize all error handling strategies in this repo.'
};

// ===== INIT LLM =====
const llm = new LlamaCPP({
    model_path: CONFIG.MODEL_PATH,
    n_ctx: CONFIG.CTX_SIZE,
    n_threads: CONFIG.THREADS
});

// ===== INDEX INITIALIZER =====
async function initializeIndex() {
    try {
        logger.info('RAG', '🔍 Scanning project directory for RAG index...');
        const documents = await new SimpleDirectoryReader(CONFIG.PROJECT_DIR).load_data();
        const index = await VectorStoreIndex.from_documents(documents, ServiceContext.from_defaults({ llm }));
        logger.info('RAG', '✅ Index built successfully.');
        return index;
    } catch (err) {
        logger.error('RAG', '❌ Failed to initialize vector index.', {}, err);
        throw err;
    }
}

// ===== QUERY RUNNER =====
async function queryCodebase(index, query) {
    try {
        logger.info('RAG', `📥 Querying: "${query}"`);
        const queryEngine = index.as_query_engine();
        const response = await queryEngine.query(query);

        const log = {
            timestamp: new Date().toISOString(),
            query,
            response: response.toString().trim()
        };

        // biome-ignore lint/style/useTemplate: <explanation>
        fs.appendFileSync(CONFIG.LOG_PATH, JSON.stringify(log, null, 2) + ',\n');
        logger.info('RAG', '📤 Response logged.');
        return response.toString();
    } catch (err) {
        logger.error('RAG', '💥 Query execution failed.', { query }, err);
        throw err;
    }
}

// ===== AUTONOMOUS EXECUTOR =====
async function runRAG(query = CONFIG.DEFAULT_QUERY) {
    try {
        const index = await initializeIndex();
        const response = await queryCodebase(index, query);
        console.log('\n🧠 RAG Response:\n', response);
    } catch (err) {
        console.error('🚨 RAG Script Error:', err);
    }
}

// ===== OPTIONAL AUTONOMOUS LOOP =====
if (CONFIG.ENABLE_AUTONOMOUS_LOOP) {
    setInterval(() => runRAG(), CONFIG.LOOP_INTERVAL_MS);
} else {
    runRAG(); // Manual single execution
}
