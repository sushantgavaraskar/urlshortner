#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing ESLint errors...');

// Fix unescaped entities in JSX files
const jsxFiles = [
  'client/src/app/auth/forgot-password/page.js',
  'client/src/app/auth/signin/page.js',
  'client/src/app/page.js'
];

jsxFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix unescaped apostrophes and quotes
    content = content.replace(/(?<!&)'(?=\w)/g, "&apos;");
    content = content.replace(/(?<!&)"(?=\w)/g, "&quot;");
    
    // Fix specific patterns
    content = content.replace(/We've/g, "We&apos;ve");
    content = content.replace(/don't/g, "don&apos;t");
    content = content.replace(/we'll/g, "we&apos;ll");
    content = content.replace(/you'll/g, "you&apos;ll");
    content = content.replace(/you're/g, "you&apos;re");
    content = content.replace(/we're/g, "we&apos;re");
    content = content.replace(/it's/g, "it&apos;s");
    content = content.replace(/that's/g, "that&apos;s");
    content = content.replace(/here's/g, "here&apos;s");
    content = content.replace(/there's/g, "there&apos;s");
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
  }
});

// Fix React hook dependencies
const useApiFile = 'client/src/hooks/useApi.js';
if (fs.existsSync(useApiFile)) {
  let content = fs.readFileSync(useApiFile, 'utf8');
  
  // Fix useCallback dependencies
  content = content.replace(
    /const createUrl = useCallback\(async \(data\) => \{\s+return callApi\(urlApi\.createUrl, data\);\s+\}, \[callApi\]\);/g,
    `const createUrl = useCallback(async (data) => {
    return callApi(urlApi.createUrl, data);
  }, [callApi, urlApi.createUrl]);`
  );
  
  content = content.replace(
    /const getUserUrls = useCallback\(async \(userId, params\) => \{\s+return callApi\(urlApi\.getUserUrls, userId, params\);\s+\}, \[callApi\]\);/g,
    `const getUserUrls = useCallback(async (userId, params) => {
    return callApi(urlApi.getUserUrls, userId, params);
  }, [callApi, urlApi.getUserUrls]);`
  );
  
  content = content.replace(
    /const searchUrls = useCallback\(async \(userId, query, params\) => \{\s+return callApi\(urlApi\.searchUrls, userId, query, params\);\s+\}, \[callApi\]\);/g,
    `const searchUrls = useCallback(async (userId, query, params) => {
    return callApi(urlApi.searchUrls, userId, query, params);
  }, [callApi, urlApi.searchUrls]);`
  );
  
  content = content.replace(
    /const deleteUrl = useCallback\(async \(urlId, userId\) => \{\s+return callApi\(urlApi\.deleteUrl, urlId, userId\);\s+\}, \[callApi\]\);/g,
    `const deleteUrl = useCallback(async (urlId, userId) => {
    return callApi(urlApi.deleteUrl, urlId, userId);
  }, [callApi, urlApi.deleteUrl]);`
  );
  
  content = content.replace(
    /const updateUrl = useCallback\(async \(urlId, data\) => \{\s+return callApi\(urlApi\.updateUrl, urlId, data\);\s+\}, \[callApi\]\);/g,
    `const updateUrl = useCallback(async (urlId, data) => {
    return callApi(urlApi.updateUrl, urlId, data);
  }, [callApi, urlApi.updateUrl]);`
  );
  
  content = content.replace(
    /const getUrlStats = useCallback\(async \(urlId, userId\) => \{\s+return callApi\(urlApi\.getUrlStats, urlId, userId\);\s+\}, \[callApi\]\);/g,
    `const getUrlStats = useCallback(async (urlId, userId) => {
    return callApi(urlApi.getUrlStats, urlId, userId);
  }, [callApi, urlApi.getUrlStats]);`
  );
  
  // Fix default export
  content = content.replace(
    /export default \{\s+useApi,\s+useUrlApi,\s+useAnalyticsApi\s+\};/g,
    `const apiHooks = {
  useApi,
  useUrlApi,
  useAnalyticsApi
};

export default apiHooks;`
  );
  
  fs.writeFileSync(useApiFile, content);
  console.log(`✅ Fixed: ${useApiFile}`);
}

// Fix anonymous default exports in api.js
const apiFile = 'client/src/utils/api.js';
if (fs.existsSync(apiFile)) {
  let content = fs.readFileSync(apiFile, 'utf8');
  
  // Fix default export
  content = content.replace(
    /export default \{\s+urlApi,\s+analyticsApi,\s+testApi,\s+systemApi,\s+getShortUrl,\s+apiUtils,\s+\};/g,
    `const apiUtils = {
  urlApi,
  analyticsApi,
  testApi,
  systemApi,
  getShortUrl,
  apiUtils,
};

export default apiUtils;`
  );
  
  fs.writeFileSync(apiFile, content);
  console.log(`✅ Fixed: ${apiFile}`);
}

console.log('🎉 ESLint errors fixed! You can now deploy to Vercel.');
console.log('📝 Next steps:');
console.log('1. Run: cd client && npm run build');
console.log('2. If build succeeds, deploy to Vercel');
console.log('3. Follow the DEPLOYMENT_GUIDE.md for complete setup'); 