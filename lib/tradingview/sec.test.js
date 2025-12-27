import { createClient } from 'sec-edgar-toolkit';

const client = createClient({
    userAgent: "YourApp/1.0 (your.email@example.com)"
});

// Find company and get filings
const company = await client.companies.lookup(1090872);
const filings = await company.filings.formTypes(["10-K"]).recent(5).fetch();

// Extract items from filing
const filing = filings[0];
const items = await filing.extractItems(); // Get all items
const riskFactors = await filing.getItem("1A"); // Get specific item
