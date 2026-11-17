// No credential files are read or written in local-only mode.
async function readMaskedConfig() { return { activeProvider: 'local', providers: {}, availableProviders: [], generationEnabled: false }; }
async function removed() { throw Object.assign(new Error('External generation and provider settings have been removed.'), { status: 410, statusCode: 410, code: 'LOCAL_ONLY' }); }
module.exports = { readConfig: readMaskedConfig, readMaskedConfig, writeConfig: removed, setActiveProvider: removed, updateProvider: removed, getActiveProviderCredentials: removed };
