import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api/v1';
const ROOT_URL = BASE_URL.replace(/\/api\/v1\/?$/, '');

interface SuiteResult {
  suite: string;
  assertionsPassed: number;
  totalAssertions: number;
  failures: string[];
  metrics?: Record<string, any>;
}

const results: SuiteResult[] = [];

function createSuite(name: string) {
  const result: SuiteResult = {
    suite: name,
    assertionsPassed: 0,
    totalAssertions: 0,
    failures: [],
  };
  results.push(result);
  return {
    failures: result.failures,
    assert(condition: any, message: string) {
      result.totalAssertions++;
      try {
        assert.ok(condition, message);
        result.assertionsPassed++;
      } catch (err: any) {
        result.failures.push(message + ': ' + err.message);
        console.error(`  ❌ [FAIL] ${message}: ${err.message}`);
      }
    },
    assertEqual(actual: any, expected: any, message: string) {
      result.totalAssertions++;
      try {
        assert.strictEqual(actual, expected, message);
        result.assertionsPassed++;
      } catch (err: any) {
        result.failures.push(message + `: expected ${expected}, got ${actual}`);
        console.error(`  ❌ [FAIL] ${message}: expected ${expected}, got ${actual}`);
      }
    },
    setMetrics(metrics: Record<string, any>) {
      result.metrics = metrics;
    },
  };
}

async function runAdversarialVerification() {
  console.log('========================================================================');
  console.log('🛡️ EMPIRICAL CHALLENGER ADVERSARIAL VERIFICATION SUITE');
  console.log('   Target: Clothing E-Commerce Backend OpenAPI 3.0 & Swagger UI');
  console.log(`   Base API URL: ${BASE_URL}`);
  console.log('========================================================================\n');

  // ====================================================================
  // SUITE 1: Swagger UI Live Endpoints & Static Asset Integrity
  // ====================================================================
  const s1 = createSuite('Suite 1: Swagger UI & Asset Integrity');
  console.log('--- Running Suite 1: Swagger UI & Asset Integrity ---');

  // Test 1.1: GET /api/v1/docs without trailing slash
  const docsRes = await fetch(`${BASE_URL}/docs`);
  s1.assertEqual(docsRes.status, 200, 'GET /api/v1/docs returns HTTP 200');
  const docsContentType = docsRes.headers.get('content-type') || '';
  s1.assert(docsContentType.includes('text/html'), `Content-Type includes text/html (${docsContentType})`);
  const htmlBody = await docsRes.text();
  s1.assert(htmlBody.length > 500, `Swagger UI HTML body non-trivial (size: ${htmlBody.length} bytes)`);

  // Test 1.2: GET /api/v1/docs/ with trailing slash
  const docsTrailingRes = await fetch(`${BASE_URL}/docs/`);
  s1.assertEqual(docsTrailingRes.status, 200, 'GET /api/v1/docs/ returns HTTP 200');

  // Test 1.3: Asset Links Extraction & Verification
  // Extract CSS, JS, Favicon links from Swagger UI HTML
  const assetRegex = /(?:href|src)=["']([^"']+\.(?:css|js|png|ico))["']/gi;
  const assetUrls = new Set<string>();
  let match;
  while ((match = assetRegex.exec(htmlBody)) !== null) {
    const rawUrl = match[1];
    let resolvedUrl = rawUrl;
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      resolvedUrl = rawUrl;
    } else if (rawUrl.startsWith('/')) {
      resolvedUrl = `${ROOT_URL}${rawUrl}`;
    } else {
      resolvedUrl = `${BASE_URL}/docs/${rawUrl}`;
    }
    assetUrls.add(resolvedUrl);
  }

  console.log(`  Discovered ${assetUrls.size} sub-assets in Swagger UI HTML:`);
  for (const url of assetUrls) {
    const assetRes = await fetch(url);
    s1.assertEqual(
      assetRes.status,
      200,
      `Sub-asset accessible: ${url.replace(ROOT_URL, '')} (HTTP ${assetRes.status})`,
    );
    const assetBytes = (await assetRes.arrayBuffer()).byteLength;
    s1.assert(assetBytes > 100, `Sub-asset non-empty payload (${assetBytes} bytes) for ${url}`);
    console.log(`    ✓ [HTTP 200] ${url.replace(ROOT_URL, '')} (${assetBytes} bytes)`);
  }

  // Test 1.4: Concurrency & Stress Load Benchmark on Swagger UI (30 concurrent requests)
  console.log('  Benchmarking Swagger UI endpoint under concurrency (30 parallel requests)...');
  const t0 = performance.now();
  const uiRequests = Array.from({ length: 30 }, () => fetch(`${BASE_URL}/docs`));
  const uiResponses = await Promise.all(uiRequests);
  const t1 = performance.now();
  const totalUiTimeMs = t1 - t0;
  const avgUiTimeMs = totalUiTimeMs / 30;

  const allUi200 = uiResponses.every((r) => r.status === 200);
  s1.assert(allUi200, 'All 30 concurrent Swagger UI requests returned HTTP 200');
  s1.assert(avgUiTimeMs < 100, `Average UI latency < 100ms (measured: ${avgUiTimeMs.toFixed(2)}ms)`);
  s1.setMetrics({
    concurrentRequests: 30,
    totalTimeMs: totalUiTimeMs.toFixed(2),
    avgLatencyMs: avgUiTimeMs.toFixed(2),
  });
  console.log(`    ✓ 30 parallel requests completed in ${totalUiTimeMs.toFixed(1)}ms (avg: ${avgUiTimeMs.toFixed(1)}ms/req)`);

  // ====================================================================
  // SUITE 2: OpenAPI 3.0 Strict Specification & Graph Integrity
  // ====================================================================
  const s2 = createSuite('Suite 2: OpenAPI 3.0 Strict Spec & Graph Integrity');
  console.log('\n--- Running Suite 2: OpenAPI 3.0 Strict Spec & Graph Integrity ---');

  const jsonRes = await fetch(`${BASE_URL}/docs-json`);
  s2.assertEqual(jsonRes.status, 200, 'GET /api/v1/docs-json returns HTTP 200');
  const rawJson = await jsonRes.text();
  let spec: any = null;
  try {
    spec = JSON.parse(rawJson);
    s2.assert(true, 'OpenAPI specification is valid JSON');
  } catch (e: any) {
    s2.assert(false, `OpenAPI specification JSON parse error: ${e.message}`);
  }

  // Version & Info
  s2.assert(typeof spec.openapi === 'string' && spec.openapi.startsWith('3.0'), `OpenAPI version is 3.0.x (found: ${spec.openapi})`);
  s2.assertEqual(spec.info?.title, 'Clothing E-Commerce API', 'info.title is "Clothing E-Commerce API"');
  s2.assertEqual(spec.info?.version, '1.0.0', 'info.version is "1.0.0"');
  s2.assert(typeof spec.info?.description === 'string' && spec.info.description.length > 10, 'info.description is descriptive');

  // Security Schemes
  const secSchemes = spec.components?.securitySchemes || {};
  s2.assert(secSchemes['bearer'], 'securityScheme "bearer" registered');
  s2.assertEqual(secSchemes['bearer']?.type, 'http', 'bearer scheme type is "http"');
  s2.assertEqual(secSchemes['bearer']?.scheme, 'bearer', 'bearer scheme is "bearer"');
  s2.assertEqual(secSchemes['bearer']?.bearerFormat, 'JWT', 'bearerFormat is "JWT"');
  s2.assert(secSchemes['token'], 'securityScheme "token" registered');
  s2.assertEqual(secSchemes['token']?.type, 'apiKey', 'token scheme type is "apiKey"');
  s2.assertEqual(secSchemes['token']?.name, 'token', 'token header name is "token"');
  s2.assertEqual(secSchemes['token']?.in, 'header', 'token location is "header"');

  // Tag Coverage across all 13 modules
  const expectedTags = [
    'Auth', 'Users', 'Addresses', 'Categories', 'Subcategories',
    'Brands', 'Products', 'Cart', 'Wishlist', 'Reviews',
    'Coupons', 'Orders', 'Health',
  ];
  const foundTags = new Set<string>();
  const danglingRefs: string[] = [];
  const invalidPathParams: string[] = [];
  let totalOps = 0;

  // Helper to recursively collect and validate $ref
  function inspectRefs(node: any, pathContext: string) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((item, idx) => inspectRefs(item, `${pathContext}[${idx}]`));
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === '$ref' && typeof value === 'string') {
        if (value.startsWith('#/components/schemas/')) {
          const schemaKey = value.replace('#/components/schemas/', '');
          if (!spec.components?.schemas?.[schemaKey]) {
            danglingRefs.push(`Dangling ref "${value}" at ${pathContext}`);
          }
        } else if (value.startsWith('#/components/securitySchemes/')) {
          const schemeKey = value.replace('#/components/securitySchemes/', '');
          if (!spec.components?.securitySchemes?.[schemeKey]) {
            danglingRefs.push(`Dangling securityScheme ref "${value}" at ${pathContext}`);
          }
        } else {
          danglingRefs.push(`Unsupported or external ref format: "${value}" at ${pathContext}`);
        }
      } else {
        inspectRefs(value, `${pathContext}.${key}`);
      }
    }
  }

  // Inspect all paths, operations, parameters, responses
  for (const [routePath, pathObj] of Object.entries<any>(spec.paths || {})) {
    // Check path template params e.g. /products/{id}/variants
    const pathParamMatches = Array.from(routePath.matchAll(/\{([a-zA-Z0-9_]+)\}/g)).map((m) => m[1]);

    for (const [method, op] of Object.entries<any>(pathObj)) {
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) continue;
      totalOps++;

      // Tag validation
      const tags: string[] = op.tags || [];
      tags.forEach((t) => foundTags.add(t));
      if (tags.length === 0) {
        s2.assert(false, `Operation ${method.toUpperCase()} ${routePath} has no tags`);
      }

      // Path parameters validation
      const opParams: any[] = op.parameters || [];
      const declaredPathParams = new Set(
        opParams.filter((p) => p.in === 'path').map((p) => p.name),
      );

      for (const requiredParam of pathParamMatches) {
        if (!declaredPathParams.has(requiredParam)) {
          invalidPathParams.push(
            `Missing declared path parameter "${requiredParam}" for ${method.toUpperCase()} ${routePath}`,
          );
        }
      }

      // Check required: true on all path parameters
      for (const p of opParams) {
        if (p.in === 'path') {
          if (p.required !== true) {
            invalidPathParams.push(
              `Path parameter "${p.name}" in ${method.toUpperCase()} ${routePath} must have required: true`,
            );
          }
        }
      }

      // Response status code checks
      const responses = op.responses || {};
      const statusCodes = Object.keys(responses);
      if (statusCodes.length === 0) {
        s2.assert(false, `Operation ${method.toUpperCase()} ${routePath} has no responses defined`);
      }

      // Inspect refs inside operation
      inspectRefs(op, `${routePath}.${method}`);
    }
  }

  // Inspect refs inside components
  inspectRefs(spec.components, 'components');

  // Verify all 13 tags found
  for (const expTag of expectedTags) {
    s2.assert(foundTags.has(expTag), `Module tag "${expTag}" is present with mapped operations`);
  }
  s2.assertEqual(invalidPathParams.length, 0, `No path parameter mismatches (found ${invalidPathParams.length})`);
  s2.assertEqual(danglingRefs.length, 0, `Zero dangling $ref pointers (found ${danglingRefs.length})`);
  s2.assert(totalOps >= 60, `Operation count >= 60 (found ${totalOps} operations across 13 modules)`);

  // Concurrency & Stress Load Benchmark on Swagger JSON (30 concurrent requests)
  console.log('  Benchmarking Swagger JSON endpoint under concurrency (30 parallel requests)...');
  const tj0 = performance.now();
  const jsonRequests = Array.from({ length: 30 }, () => fetch(`${BASE_URL}/docs-json`));
  const jsonResponses = await Promise.all(jsonRequests);
  const tj1 = performance.now();
  const totalJsonTimeMs = tj1 - tj0;
  const avgJsonTimeMs = totalJsonTimeMs / 30;

  const allJson200 = jsonResponses.every((r) => r.status === 200);
  s2.assert(allJson200, 'All 30 concurrent Swagger JSON requests returned HTTP 200');
  s2.assert(avgJsonTimeMs < 100, `Average JSON latency < 100ms (measured: ${avgJsonTimeMs.toFixed(2)}ms)`);
  s2.setMetrics({
    concurrentRequests: 30,
    totalTimeMs: totalJsonTimeMs.toFixed(2),
    avgLatencyMs: avgJsonTimeMs.toFixed(2),
  });
  console.log(`    ✓ 30 parallel requests completed in ${totalJsonTimeMs.toFixed(1)}ms (avg: ${avgJsonTimeMs.toFixed(1)}ms/req)`);

  // ====================================================================
  // SUITE 3: Dual Authentication Live Probing & Spec Consistency
  // ====================================================================
  const s3 = createSuite('Suite 3: Dual Auth Live Probing & Spec Parity');
  console.log('\n--- Running Suite 3: Dual Auth Live Probing & Spec Parity ---');

  // 1. Create a fresh user for authentication tests
  const ts = Date.now();
  const userPayload = {
    name: 'Challenger Test User',
    email: `challenger_${ts}@adversarial-test.com`,
    password: 'Password123!',
    rePassword: 'Password123!',
    phone: '01099887766',
  };

  const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userPayload),
  });
  s3.assertEqual(signupRes.status, 201, 'POST /api/v1/auth/signup returns HTTP 201');
  const signupJson = await signupRes.json();
  const validToken = signupJson.token;
  s3.assert(validToken && typeof validToken === 'string', 'Received valid JWT token from signup');

  // 2. Probe Protected Endpoint: GET /api/v1/users/getMe with Bearer header
  const bearerRes = await fetch(`${BASE_URL}/users/getMe`, {
    headers: { Authorization: `Bearer ${validToken}` },
  });
  s3.assertEqual(bearerRes.status, 200, 'Protected route accepts "Authorization: Bearer <token>"');
  const bearerBody = await bearerRes.json();
  s3.assertEqual(bearerBody.data?.email, userPayload.email, 'User profile returned with matching email via Bearer auth');

  // 3. Probe Protected Endpoint: GET /api/v1/users/getMe with custom "token" header
  const tokenHeaderRes = await fetch(`${BASE_URL}/users/getMe`, {
    headers: { token: validToken },
  });
  s3.assertEqual(tokenHeaderRes.status, 200, 'Protected route accepts custom "token: <token>" header');
  const tokenHeaderBody = await tokenHeaderRes.json();
  s3.assertEqual(tokenHeaderBody.data?.email, userPayload.email, 'User profile returned with matching email via token header');

  // 4. Adversarial Probing: Invalid Bearer token
  const invalidBearerRes = await fetch(`${BASE_URL}/users/getMe`, {
    headers: { Authorization: 'Bearer invalid.jwt.token.string' },
  });
  s3.assertEqual(invalidBearerRes.status, 401, 'Invalid Bearer token rejected with HTTP 401');

  // 5. Adversarial Probing: Invalid custom token header
  const invalidTokenRes = await fetch(`${BASE_URL}/users/getMe`, {
    headers: { token: 'invalid.jwt.token.string' },
  });
  s3.assertEqual(invalidTokenRes.status, 401, 'Invalid custom token header rejected with HTTP 401');

  // 6. Adversarial Probing: Missing token
  const noAuthRes = await fetch(`${BASE_URL}/users/getMe`);
  s3.assertEqual(noAuthRes.status, 401, 'Omitted token rejected with HTTP 401');

  // 7. Adversarial Probing: Malformed auth header
  const malformedAuthRes = await fetch(`${BASE_URL}/users/getMe`, {
    headers: { Authorization: 'Basic someBasicAuthString' },
  });
  s3.assertEqual(malformedAuthRes.status, 401, 'Malformed Basic authorization rejected with HTTP 401');

  // 8. Public Endpoint Probing: GET /api/v1/health with no auth
  const healthRes = await fetch(`${BASE_URL}/health`);
  s3.assertEqual(healthRes.status, 200, 'Public endpoint GET /api/v1/health accessible without auth (HTTP 200)');

  // 9. Cross-check Spec Security vs Public/Protected Controllers
  const healthSpecOp = spec.paths['/api/v1/health']?.get;
  s3.assert(!healthSpecOp?.security || healthSpecOp.security.length === 0, 'OpenAPI spec correctly declares no security on /api/v1/health');

  const getMeSpecOp = spec.paths['/api/v1/users/getMe']?.get;
  s3.assert(getMeSpecOp?.security?.length > 0, 'OpenAPI spec declares security on /api/v1/users/getMe');
  const hasBearerSpec = getMeSpecOp?.security?.some((s: any) => 'bearer' in s);
  const hasTokenSpec = getMeSpecOp?.security?.some((s: any) => 'token' in s);
  s3.assert(hasBearerSpec, 'Spec declares Bearer security on /api/v1/users/getMe');
  s3.assert(hasTokenSpec, 'Spec declares token header security on /api/v1/users/getMe');

  // ====================================================================
  // SUITE 4: Physical Controller vs OpenAPI Spec Parity Audit
  // ====================================================================
  const s4 = createSuite('Suite 4: Controller vs OpenAPI Spec Parity Audit');
  console.log('\n--- Running Suite 4: Controller vs OpenAPI Spec Parity Audit ---');

  const srcDir = path.resolve(__dirname, 'src');
  const controllerFiles: string[] = [];

  function findControllers(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        findControllers(fullPath);
      } else if (ent.isFile() && ent.name.endsWith('.controller.ts')) {
        controllerFiles.push(fullPath);
      }
    }
  }
  findControllers(srcDir);
  console.log(`  Discovered ${controllerFiles.length} controller source files in src/`);
  s4.assert(controllerFiles.length >= 13, `At least 13 controller files discovered (found ${controllerFiles.length})`);

  let codeRouteCount = 0;
  const specPathSet = new Set(Object.keys(spec.paths || {}));

  for (const cPath of controllerFiles) {
    const content = fs.readFileSync(cPath, 'utf-8');
    const relName = path.relative(srcDir, cPath);

    // Extract controller base path
    const controllerMatch = content.match(/@Controller\s*\(\s*['"`]([^'"`]*)['"`]\s*\)/);
    const basePath = controllerMatch ? controllerMatch[1] : '';

    // Extract route methods: @Get, @Post, @Put, @Delete, @Patch
    const routeRegex = /@(Get|Post|Put|Delete|Patch)\s*\(\s*(?:['"`]([^'"`]*)['"`])?\s*\)/g;
    let rMatch;
    while ((rMatch = routeRegex.exec(content)) !== null) {
      codeRouteCount++;
      const method = rMatch[1].toLowerCase();
      const subPath = rMatch[2] || '';
      // Build expected path in OpenAPI (global prefix /api/v1/ + basePath + subPath)
      let combined = ['api/v1', basePath, subPath]
        .filter((part) => part && part.length > 0)
        .join('/')
        .replace(/\/+/g, '/');
      if (!combined.startsWith('/')) combined = '/' + combined;

      // Transform express :param syntax to openapi {param} syntax
      const openApiPath = combined.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');

      // Verify that this route exists in the spec
      const pathInSpec = spec.paths[openApiPath];
      if (!pathInSpec) {
        s4.assert(
          false,
          `Controller ${relName} defines route ${method.toUpperCase()} ${openApiPath} but missing from OpenAPI spec!`,
        );
      } else {
        const opInSpec = pathInSpec[method];
        if (!opInSpec) {
          s4.assert(
            false,
            `Controller ${relName} defines ${method.toUpperCase()} ${openApiPath} but method is missing from OpenAPI spec!`,
          );
        } else {
          s4.assert(true, `Route parity: ${method.toUpperCase()} ${openApiPath} present in spec`);
        }
      }
    }
  }

  console.log(`  Audited ${codeRouteCount} physical controller route handlers against OpenAPI spec.`);
  s4.assertEqual(
    s4.failures.length,
    0,
    `Zero missing controller routes in OpenAPI spec (total audited: ${codeRouteCount})`,
  );

  // ====================================================================
  // SUMMARY & RESULTS AGGREGATION
  // ====================================================================
  console.log('\n========================================================================');
  console.log('📊 CHALLENGER ADVERSARIAL SUITE SUMMARY REPORT');
  console.log('========================================================================');

  let totalAssertions = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const res of results) {
    totalAssertions += res.totalAssertions;
    totalPassed += res.assertionsPassed;
    totalFailed += res.failures.length;

    const status = res.failures.length === 0 ? '✅ PASS' : '❌ FAIL';
    console.log(`[${status}] ${res.suite}: ${res.assertionsPassed}/${res.totalAssertions} passed`);
    if (res.metrics) {
      console.log(`         Metrics: ${JSON.stringify(res.metrics)}`);
    }
    if (res.failures.length > 0) {
      for (const f of res.failures) {
        console.log(`         - Failure: ${f}`);
      }
    }
  }

  console.log('------------------------------------------------------------------------');
  console.log(`Overall: ${totalPassed}/${totalAssertions} assertions passed (${totalFailed} failures).`);
  console.log('========================================================================\n');

  if (totalFailed > 0) {
    console.error(`💥 Adversarial verification finished with ${totalFailed} failure(s).`);
    process.exit(1);
  } else {
    console.log('🏆 ALL ADVERSARIAL VERIFICATION SUITES PASSED FLAWLESSLY WITH 100% SUCCESS!');
    process.exit(0);
  }
}

runAdversarialVerification().catch((err) => {
  console.error('Fatal unhandled error during verification:', err);
  process.exit(1);
});
