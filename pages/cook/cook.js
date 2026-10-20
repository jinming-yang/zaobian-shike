const { createCookEntryPage } = require('../../utils/cook-page')

// Preserve existing cooking links; the real page opens alongside its own images.
Page(createCookEntryPage())
