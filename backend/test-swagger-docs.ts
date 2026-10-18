import assert from 'node:assert/strict';

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
    [key: string]: any;
  };
  paths: Record<string, Record<string, any>>;
  components?: {
    securitySchemes?: Record<string, any>;
    schemas?: Record<string, any>;
    [key: string]: any;
  };
  tags?: Array<{ name: string; description?: string }>;
  [key: string]: any;
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api/v1';
const ROOT_URL = BASE_URL.replace(/\/api\/v1\/?$/, '');

async function runSwaggerDocsTests() {
  console.log('🧪 Starting Milestone 5: Swagger (OpenAPI 3.0) Documentation Verification Tests...\n');
  console.log(`Base API URL: ${BASE_URL}`);
  console.log(`Docs URL:     ${BASE_URL}/docs`);
  console.log(`JSON URL:     ${BASE_URL}/docs-json\n`);

  let passCount = 0;
  const totalTests = 9;

  let spec: OpenAPISpec | null = null;

  try {
    // ----------------------------------------------------------------
    // Test Case 1: GET /api/v1/docs UI Endpoint & Assets
    // ----------------------------------------------------------------
    console.log('[TC-01] Testing Swagger UI endpoint availability and asset bundle injection...');
    const docsRes = await fetch(`${BASE_URL}/docs`, {
      headers: { Accept: 'text/html,application/xhtml+xml' },
    });
    assert.equal(docsRes.status, 200, `Expected HTTP 200 from ${BASE_URL}/docs, got ${docsRes.status}`);

    const docsContentType = docsRes.headers.get('content-type') || '';
    assert.ok(
      docsContentType.includes('text/html'),
      `Expected Content-Type to contain text/html, got "${docsContentType}"`,
    );

    const docsHtml = await docsRes.text();
    assert.ok(docsHtml.length > 500, `Expected HTML body length > 500, got ${docsHtml.length}`);
    assert.ok(
      docsHtml.includes('swagger-ui'),
      'Expected Swagger UI HTML to include "swagger-ui" container element or classes',
    );
    assert.ok(
      docsHtml.includes('swagger-ui-bundle.js'),
      'Expected Swagger UI HTML to include "swagger-ui-bundle.js" script bundle',
    );
    assert.ok(
      docsHtml.includes('swagger-ui-standalone-preset.js') || docsHtml.includes('swagger-ui.css'),
      'Expected Swagger UI HTML to reference CSS or standalone preset assets',
    );

    console.log(`  Subtest A: GET /api/v1/docs returned HTTP 200 with Content-Type: ${docsContentType}`);
    console.log(`  Subtest B: Swagger UI HTML payload verified (${docsHtml.length} bytes, includes swagger-ui-bundle.js).`);
    console.log('✅ TC-01 PASSED: Interactive Swagger UI endpoint is fully accessible.\n');
    passCount++;

    // ----------------------------------------------------------------
    // Test Case 2: GET /api/v1/docs-json OpenAPI 3.0 Specification
    // ----------------------------------------------------------------
    console.log('[TC-02] Testing OpenAPI JSON specification endpoint and OpenAPI 3.0 compatibility...');
    const jsonRes = await fetch(`${BASE_URL}/docs-json`, {
      headers: { Accept: 'application/json' },
    });
    assert.equal(jsonRes.status, 200, `Expected HTTP 200 from ${BASE_URL}/docs-json, got ${jsonRes.status}`);

    const jsonContentType = jsonRes.headers.get('content-type') || '';
    assert.ok(
      jsonContentType.includes('application/json'),
      `Expected Content-Type to contain application/json, got "${jsonContentType}"`,
    );

    const rawJson = await jsonRes.text();
    try {
      spec = JSON.parse(rawJson) as OpenAPISpec;
    } catch (err: any) {
      assert.fail(`Failed to parse OpenAPI JSON specification: ${err.message}`);
    }

    assert.ok(spec && typeof spec === 'object', 'Parsed spec must be an object');
    assert.ok(
      typeof spec.openapi === 'string' && spec.openapi.startsWith('3.0.'),
      `Expected OpenAPI version 3.0.x, got "${spec.openapi}"`,
    );
    assert.ok(spec.info && typeof spec.info === 'object', 'Spec must contain "info" object');
    assert.ok(spec.paths && typeof spec.paths === 'object', 'Spec must contain "paths" object');
    assert.ok(spec.components && typeof spec.components === 'object', 'Spec must contain "components" object');

    console.log(`  Subtest A: GET /api/v1/docs-json returned HTTP 200 with Content-Type: ${jsonContentType}`);
    console.log(`  Subtest B: OpenAPI version confirmed: ${spec.openapi}`);
    console.log(`  Subtest C: Top-level OpenAPI 3.0 root objects validated (info, paths, components).`);
    console.log('✅ TC-02 PASSED: Valid OpenAPI 3.0 JSON specification successfully served.\n');
    passCount++;

    // ----------------------------------------------------------------
    // Test Case 3: Document Info Validation
    // ----------------------------------------------------------------
    console.log('[TC-03] Validating Document Info metadata (Title, Version, Description)...');
    assert.equal(
      spec.info.title,
      'Clothing E-Commerce API',
      `Expected info.title to be 'Clothing E-Commerce API', got '${spec.info.title}'`,
    );
    assert.equal(
      spec.info.version,
      '1.0.0',
      `Expected info.version to be '1.0.0', got '${spec.info.version}'`,
    );
    assert.ok(
      typeof spec.info.description === 'string' && spec.info.description.trim().length > 0,
      'Expected info.description to be a non-empty string',
    );
    assert.ok(
      spec.info.description.toLowerCase().includes('clothing') ||
        spec.info.description.toLowerCase().includes('e-commerce') ||
        spec.info.description.toLowerCase().includes('13 modules'),
      `Expected info.description to describe Clothing E-Commerce system, got: "${spec.info.description}"`,
    );

    console.log(`  Subtest A: Title matches: "${spec.info.title}"`);
    console.log(`  Subtest B: Version matches: "${spec.info.version}"`);
    console.log(`  Subtest C: Description validated: "${spec.info.description}"`);
    console.log('✅ TC-03 PASSED: Document metadata conforms to project specifications.\n');
    passCount++;

    // ----------------------------------------------------------------
    // Test Case 4: Security Schemes Validation
    // ----------------------------------------------------------------
    console.log('[TC-04] Validating dual security schemes (Bearer and token header)...');
    const secSchemes = spec.components?.securitySchemes;
    assert.ok(secSchemes, 'spec.components.securitySchemes must be defined');

    // Scheme 1: 'bearer'
    const bearerScheme = secSchemes['bearer'];
    assert.ok(bearerScheme, 'Missing "bearer" security scheme in components.securitySchemes');
    assert.equal(
      bearerScheme.type,
      'http',
      `Expected bearer scheme type 'http', got '${bearerScheme.type}'`,
    );
    assert.equal(
      bearerScheme.scheme?.toLowerCase(),
      'bearer',
      `Expected bearer scheme 'bearer', got '${bearerScheme.scheme}'`,
    );
    assert.equal(
      bearerScheme.bearerFormat,
      'JWT',
      `Expected bearerFormat 'JWT', got '${bearerScheme.bearerFormat}'`,
    );

    // Scheme 2: 'token'
    const tokenScheme = secSchemes['token'];
    assert.ok(tokenScheme, 'Missing "token" security scheme in components.securitySchemes');
    assert.equal(
      tokenScheme.type,
      'apiKey',
      `Expected token scheme type 'apiKey', got '${tokenScheme.type}'`,
    );
    assert.equal(
      tokenScheme.name,
      'token',
      `Expected token scheme name 'token', got '${tokenScheme.name}'`,
    );
    assert.equal(
      tokenScheme.in,
      'header',
      `Expected token scheme location 'header', got '${tokenScheme.in}'`,
    );

    console.log('  Subtest A: "bearer" securityScheme confirmed (type: http, scheme: bearer, bearerFormat: JWT).');
    console.log('  Subtest B: "token" securityScheme confirmed (type: apiKey, name: token, in: header).');
    console.log('✅ TC-04 PASSED: Dual security schemes correctly defined in components.securitySchemes.\n');
    passCount++;

    // ----------------------------------------------------------------
    // Test Case 5: Tag Coverage across all 13 Modules
    // ----------------------------------------------------------------
    console.log('[TC-05] Validating Tag coverage across all 13 implemented modules...');
    const REQUIRED_TAGS = [
      'Auth',
      'Users',
      'Addresses',
      'Categories',
      'Subcategories',
      'Brands',
      'Products',
      'Cart',
      'Wishlist',
      'Reviews',
      'Coupons',
      'Orders',
      'Health',
    ];

    // Gather tag counts from all mapped operations
    const operationTagCounts: Record<string, number> = {};
    let totalOperationsCount = 0;

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
          totalOperationsCount++;
          const tags = Array.isArray(operation.tags) ? operation.tags : [];
          assert.ok(
            tags.length > 0,
            `Operation ${method.toUpperCase()} ${pathKey} is missing tags annotation`,
          );
          for (const tag of tags) {
            operationTagCounts[tag] = (operationTagCounts[tag] || 0) + 1;
          }
        }
      }
    }

    console.log(`  Mapped Operations Breakdown across ${Object.keys(spec.paths).length} path items:`);
    for (const requiredTag of REQUIRED_TAGS) {
      const count = operationTagCounts[requiredTag] || 0;
      assert.ok(
        count > 0,
        `Expected required module tag '${requiredTag}' to have at least 1 mapped operation, found 0`,
      );
      console.log(`    - ${requiredTag.padEnd(15)} : ${count} operation(s)`);
    }

    console.log(`  Subtest A: All 13 required module tags are present and populated.`);
    console.log(`  Subtest B: Total of ${totalOperationsCount} operations verified across all module tags.`);
    console.log('✅ TC-05 PASSED: Full tag coverage for all 13 modules verified.\n');
    passCount++;

    // ----------------------------------------------------------------
    // Test Case 6: Route Mapping across all 13 Modules with HTTP Methods
    // ----------------------------------------------------------------
    console.log('[TC-06] Validating route mappings and HTTP operations (GET, POST, PUT, DELETE)...');

    const methodDistribution: Record<string, number> = {
      GET: 0,
      POST: 0,
      PUT: 0,
      DELETE: 0,
    };

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
      for (const method of Object.keys(pathItem)) {
        const upperMethod = method.toUpperCase();
        if (upperMethod in methodDistribution) {
          methodDistribution[upperMethod]++;
        }
      }
    }

    assert.ok(methodDistribution.GET > 0, 'Specification must contain GET operations');
    assert.ok(methodDistribution.POST > 0, 'Specification must contain POST operations');
    assert.ok(methodDistribution.PUT > 0, 'Specification must contain PUT operations');
    assert.ok(methodDistribution.DELETE > 0, 'Specification must contain DELETE operations');

    console.log('  HTTP Method Distribution in spec:');
    console.log(`    GET:    ${methodDistribution.GET} operations`);
    console.log(`    POST:   ${methodDistribution.POST} operations`);
    console.log(`    PUT:    ${methodDistribution.PUT} operations`);
    console.log(`    DELETE: ${methodDistribution.DELETE} operations`);

    // Verify key landmark endpoints for each of the 13 modules
    const expectedEndpoints: Array<{ module: string; method: string; path: string }> = [
      { module: 'Health', method: 'get', path: '/api/v1/health' },
      { module: 'Auth', method: 'post', path: '/api/v1/auth/signup' },
      { module: 'Auth', method: 'post', path: '/api/v1/auth/signin' },
      { module: 'Auth', method: 'get', path: '/api/v1/auth/me' },
      { module: 'Users', method: 'get', path: '/api/v1/users/getMe' },
      { module: 'Users', method: 'put', path: '/api/v1/users/changeMyPassword' },
      { module: 'Addresses', method: 'get', path: '/api/v1/addresses' },
      { module: 'Addresses', method: 'post', path: '/api/v1/addresses' },
      { module: 'Categories', method: 'get', path: '/api/v1/categories' },
      { module: 'Categories', method: 'post', path: '/api/v1/categories' },
      { module: 'Subcategories', method: 'get', path: '/api/v1/subcategories' },
      { module: 'Subcategories', method: 'post', path: '/api/v1/subcategories' },
      { module: 'Brands', method: 'get', path: '/api/v1/brands' },
      { module: 'Brands', method: 'post', path: '/api/v1/brands' },
      { module: 'Products', method: 'get', path: '/api/v1/products' },
      { module: 'Products', method: 'post', path: '/api/v1/products' },
      { module: 'Products', method: 'get', path: '/api/v1/products/{id}/variants' },
      { module: 'Cart', method: 'get', path: '/api/v1/cart' },
      { module: 'Cart', method: 'post', path: '/api/v1/cart' },
      { module: 'Cart', method: 'delete', path: '/api/v1/cart' },
      { module: 'Wishlist', method: 'get', path: '/api/v1/wishlist' },
      { module: 'Wishlist', method: 'post', path: '/api/v1/wishlist' },
      { module: 'Reviews', method: 'get', path: '/api/v1/reviews' },
      { module: 'Reviews', method: 'post', path: '/api/v1/reviews' },
      { module: 'Coupons', method: 'get', path: '/api/v1/coupons' },
      { module: 'Coupons', method: 'post', path: '/api/v1/coupons' },
      { module: 'Orders', method: 'get', path: '/api/v1/orders' },
      { module: 'Orders', method: 'post', path: '/api/v1/orders/{cartId}' },
      { module: 'Orders', method: 'post', path: '/api/v1/orders/checkout-session/{cartId}' },
    ];

    for (const ep of expectedEndpoints) {
      const pathObj = spec.paths[ep.path];
      assert.ok(pathObj, `Missing expected path ${ep.path} for module ${ep.module}`);
      const opObj = pathObj[ep.method];
      assert.ok(
        opObj,
        `Missing expected operation ${ep.method.toUpperCase()} ${ep.path} for module ${ep.module}`,
      );
    }

    // Verify Orders module POST endpoints declare requestBody
    assert.ok(
      spec.paths['/api/v1/orders/{cartId}']?.post?.requestBody,
      "Expected paths['/api/v1/orders/{cartId}'].post.requestBody to be defined",
    );
    assert.ok(
      spec.paths['/api/v1/orders/checkout-session/{cartId}']?.post?.requestBody,
      "Expected paths['/api/v1/orders/checkout-session/{cartId}'].post.requestBody to be defined",
    );

    console.log(`  Subtest A: Verified GET, POST, PUT, DELETE distribution.`);
    console.log(`  Subtest B: Verified 29 landmark route operations across all 13 modules.`);
    console.log('✅ TC-06 PASSED: Route operations across all 13 modules mapped accurately.\n');
    passCount++;

    // ----------------------------------------------------------------
    // Test Case 7: Route Parameter & Query Mapping
    // ----------------------------------------------------------------
    console.log('[TC-07] Validating path parameters (:id, :cartId, etc.) and query parameters (:page, :limit, etc.)...');

    const discoveredPathParams = new Set<string>();
    const discoveredQueryParams = new Set<string>();

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (Array.isArray(operation.parameters)) {
          for (const param of operation.parameters) {
            if (param.in === 'path') {
              discoveredPathParams.add(param.name);
              assert.ok(
                param.name && typeof param.name === 'string',
                `Path param in ${method.toUpperCase()} ${pathKey} must have a name`,
              );
              assert.equal(
                param.required,
                true,
                `Path param '${param.name}' in ${method.toUpperCase()} ${pathKey} must have required: true`,
              );
            } else if (param.in === 'query') {
              discoveredQueryParams.add(param.name);
            }
          }
        }
      }
    }

    console.log(`  Discovered Path Parameters: ${Array.from(discoveredPathParams).join(', ')}`);
    console.log(`  Discovered Query Parameters: ${Array.from(discoveredQueryParams).join(', ')}`);

    // Verify critical path parameters
    const expectedPathParams = ['id', 'cartId', 'sessionId', 'userId'];
    for (const pp of expectedPathParams) {
      assert.ok(
        discoveredPathParams.has(pp),
        `Expected path parameter '${pp}' to be mapped in spec, but not found`,
      );
    }

    // Verify specific path parameter mappings on routes
    const cartIdOp = spec.paths['/api/v1/orders/{cartId}']?.post;
    assert.ok(cartIdOp, 'Expected POST /api/v1/orders/{cartId} to exist');
    const cartIdParam = cartIdOp.parameters?.find((p: any) => p.name === 'cartId' && p.in === 'path');
    assert.ok(cartIdParam, 'Expected cartId path parameter on POST /api/v1/orders/{cartId}');
    assert.ok(cartIdParam.description, 'cartId parameter should include description');

    const productIdOp = spec.paths['/api/v1/products/{id}']?.get;
    assert.ok(productIdOp, 'Expected GET /api/v1/products/{id} to exist');
    const idParam = productIdOp.parameters?.find((p: any) => p.name === 'id' && p.in === 'path');
    assert.ok(idParam, 'Expected id path parameter on GET /api/v1/products/{id}');

    // Verify critical query parameters
    const expectedQueryParams = ['page', 'limit', 'keyword', 'sort', 'category', 'brand'];
    for (const qp of expectedQueryParams) {
      assert.ok(
        discoveredQueryParams.has(qp),
        `Expected query parameter '${qp}' to be mapped in spec, but not found`,
      );
    }

    console.log(`  Subtest A: Path parameters validated: ${expectedPathParams.join(', ')}`);
    console.log(`  Subtest B: Query parameters validated: ${expectedQueryParams.join(', ')}`);
    console.log('✅ TC-07 PASSED: Route parameters and query parameters correctly bound and typed.\n');
    passCount++;

    // ----------------------------------------------------------------
    // Test Case 8: Protected Route Security Bindings
    // ----------------------------------------------------------------
    console.log('[TC-08] Validating protected route security bindings (Bearer and token) vs public routes...');

    let protectedOpCount = 0;
    let publicOpCount = 0;

    const sampleProtectedEndpoints: Array<{ method: string; path: string; label: string }> = [
      { method: 'get', path: '/api/v1/cart', label: 'Cart' },
      { method: 'post', path: '/api/v1/cart', label: 'Cart' },
      { method: 'get', path: '/api/v1/users/getMe', label: 'Users' },
      { method: 'put', path: '/api/v1/users/changeMyPassword', label: 'Users' },
      { method: 'get', path: '/api/v1/addresses', label: 'Addresses' },
      { method: 'post', path: '/api/v1/addresses', label: 'Addresses' },
      { method: 'post', path: '/api/v1/orders/{cartId}', label: 'Orders' },
      { method: 'get', path: '/api/v1/orders', label: 'Orders' },
      { method: 'post', path: '/api/v1/coupons', label: 'Coupons' },
      { method: 'post', path: '/api/v1/wishlist', label: 'Wishlist' },
      { method: 'post', path: '/api/v1/reviews', label: 'Reviews' },
      { method: 'post', path: '/api/v1/categories', label: 'Categories' },
    ];

    for (const ep of sampleProtectedEndpoints) {
      const op = spec.paths[ep.path]?.[ep.method];
      assert.ok(op, `Protected endpoint ${ep.method.toUpperCase()} ${ep.path} missing from spec`);
      assert.ok(
        Array.isArray(op.security) && op.security.length > 0,
        `Expected protected endpoint ${ep.method.toUpperCase()} ${ep.path} (${ep.label}) to declare security requirement`,
      );

      const hasBearer = op.security.some((s: any) => 'bearer' in s);
      const hasToken = op.security.some((s: any) => 'token' in s);
      assert.ok(
        hasBearer,
        `Protected endpoint ${ep.method.toUpperCase()} ${ep.path} must declare 'bearer' security requirement`,
      );
      assert.ok(
        hasToken,
        `Protected endpoint ${ep.method.toUpperCase()} ${ep.path} must declare 'token' security requirement`,
      );
    }

    // Verify public endpoints do not require security
    const samplePublicEndpoints: Array<{ method: string; path: string; label: string }> = [
      { method: 'get', path: '/api/v1/health', label: 'Health' },
      { method: 'post', path: '/api/v1/auth/signup', label: 'Auth Signup' },
      { method: 'post', path: '/api/v1/auth/signin', label: 'Auth Signin' },
      { method: 'post', path: '/api/v1/orders/verify-payment/{sessionId}', label: 'Orders Payment Webhook' },
    ];

    for (const pub of samplePublicEndpoints) {
      const op = spec.paths[pub.path]?.[pub.method];
      assert.ok(op, `Public endpoint ${pub.method.toUpperCase()} ${pub.path} missing from spec`);
      const hasSecurity = Array.isArray(op.security) && op.security.length > 0;
      assert.equal(
        hasSecurity,
        false,
        `Public endpoint ${pub.method.toUpperCase()} ${pub.path} (${pub.label}) must NOT declare security requirements`,
      );
    }

    // Tally all operations with security vs without security
    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
      for (const [method, op] of Object.entries(pathItem)) {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
          if (Array.isArray(op.security) && op.security.length > 0) {
            protectedOpCount++;
            // Whenever security is defined, both bearer and token must be supported
            const hasBearer = op.security.some((s: any) => 'bearer' in s);
            const hasToken = op.security.some((s: any) => 'token' in s);
            assert.ok(
              hasBearer && hasToken,
              `Operation ${method.toUpperCase()} ${pathKey} declared incomplete security schemes: ${JSON.stringify(op.security)}`,
            );
          } else {
            publicOpCount++;
          }
        }
      }
    }

    console.log(`  Subtest A: Sample protected endpoints verified with dual 'bearer' & 'token' security.`);
    console.log(`  Subtest B: Sample public endpoints verified without security requirement.`);
    console.log(`  Subtest C: Total audited operations: ${protectedOpCount} protected, ${publicOpCount} public.`);
    console.log('✅ TC-08 PASSED: Protected route security bindings and public route exemptions verified.\n');
    passCount++;

    // ----------------------------------------------------------------
    // Test Case 9: DTO Schema Definitions & Clothing Store Domain Examples
    // ----------------------------------------------------------------
    console.log('[TC-09] Validating DTO schema definitions, property descriptions, and clothing store domain examples...');
    const schemas = spec.components?.schemas;
    assert.ok(schemas && typeof schemas === 'object', 'components.schemas must be defined');

    const schemaNames = Object.keys(schemas);
    assert.ok(
      schemaNames.length >= 15,
      `Expected at least 15 DTO schemas in components.schemas, found ${schemaNames.length}`,
    );

    console.log(`  Total Schemas Registered: ${schemaNames.length}`);
    console.log(`  Registered Schemas: ${schemaNames.join(', ')}`);

    // Verify key DTOs across modules exist
    const expectedDtos = [
      'SignupDto',
      'SigninDto',
      'ForgotPasswordDto',
      'VerifyResetCodeDto',
      'ResetPasswordDto',
      'UpdateMeDto',
      'ChangePasswordDto',
      'CreateAddressDto',
      'CreateCategoryDto',
      'CreateSubcategoryDto',
      'CreateBrandDto',
      'CreateProductDto',
      'CreateVariantDto',
      'QueryProductsDto',
      'AddToCartDto',
      'UpdateCartQuantityDto',
      'ApplyCouponDto',
      'CreateCouponDto',
      'UpdateCouponDto',
      'AddToWishlistDto',
      'CreateReviewDto',
      'UpdateReviewDto',
      'CreateOrderDto',
      'ShippingAddressDto',
    ];

    for (const dto of expectedDtos) {
      assert.ok(schemas[dto], `Missing expected DTO schema: '${dto}' in components.schemas`);
      assert.equal(
        schemas[dto].type,
        'object',
        `Expected schema '${dto}' type to be 'object', got '${schemas[dto].type}'`,
      );
      assert.ok(
        schemas[dto].properties && typeof schemas[dto].properties === 'object',
        `Expected schema '${dto}' to define 'properties'`,
      );
    }

    // Verify Orders endpoints explicitly bind requestBody in OpenAPI spec
    assert.ok(
      spec.paths['/api/v1/orders/{cartId}']?.post?.requestBody,
      "Expected paths['/api/v1/orders/{cartId}'].post.requestBody to be defined",
    );
    assert.ok(
      spec.paths['/api/v1/orders/checkout-session/{cartId}']?.post?.requestBody,
      "Expected paths['/api/v1/orders/checkout-session/{cartId}'].post.requestBody to be defined",
    );

    // Validate Realistic Clothing Domain Examples:
    // 1. CreateProductDto: EGP prices, clothing title & description, categories
    const productSchema = schemas['CreateProductDto'];
    const pProps = productSchema.properties;
    assert.ok(pProps.price, 'CreateProductDto must contain "price" property');
    assert.ok(
      typeof pProps.price.description === 'string' &&
        (pProps.price.description.includes('EGP') || pProps.price.description.includes('Egyptian Pounds')),
      `Expected price description to reference EGP currency, got: "${pProps.price.description}"`,
    );
    assert.ok(
      typeof pProps.price.example === 'number' && pProps.price.example > 0,
      `Expected price example to be positive number in EGP, got: ${pProps.price.example}`,
    );
    assert.ok(pProps.priceAfterDiscount, 'CreateProductDto must contain "priceAfterDiscount" property');
    assert.ok(
      pProps.priceAfterDiscount.example <= pProps.price.example,
      'Expected priceAfterDiscount example to be <= price example',
    );
    assert.ok(
      typeof pProps.title.example === 'string' && pProps.title.example.toLowerCase().includes('shirt') ||
        pProps.title.example.toLowerCase().includes('cotton') ||
        pProps.title.example.toLowerCase().includes('crewneck') ||
        pProps.title.example.length > 5,
      `Expected title example to be realistic clothing item, got: "${pProps.title.example}"`,
    );

    // 2. CreateVariantDto: sizes (S, M, L, XL), colors (e.g. Navy Blue), clothing SKUs, priceAdjustment
    const variantSchema = schemas['CreateVariantDto'];
    const vProps = variantSchema.properties;
    assert.ok(vProps.sizeId, 'CreateVariantDto must contain "sizeId" property');
    assert.ok(
      typeof vProps.sizeId.description === 'string' &&
        (vProps.sizeId.description.includes('S, M, L, XL') || vProps.sizeId.description.includes('Size')),
      `Expected sizeId description to reference clothing sizes (S, M, L, XL), got: "${vProps.sizeId.description}"`,
    );
    assert.ok(vProps.colorId, 'CreateVariantDto must contain "colorId" property');
    assert.ok(
      typeof vProps.colorId.description === 'string' &&
        (vProps.colorId.description.includes('Color') || vProps.colorId.description.includes('Blue')),
      `Expected colorId description to reference clothing colors, got: "${vProps.colorId.description}"`,
    );
    assert.ok(vProps.sku, 'CreateVariantDto must contain "sku" property');
    assert.ok(
      typeof vProps.sku.example === 'string' && vProps.sku.example.length >= 3,
      `Expected realistic clothing SKU example, got: "${vProps.sku.example}"`,
    );

    // 3. CreateAddressDto: Egyptian address details (Cairo, Egyptian postalCode, phone)
    const addressSchema = schemas['CreateAddressDto'];
    const aProps = addressSchema.properties;
    assert.ok(aProps.details, 'CreateAddressDto must contain "details" property');
    assert.ok(
      typeof aProps.details.example === 'string' &&
        (aProps.details.example.includes('Street') || aProps.details.example.includes('Tahrir')),
      `Expected realistic street address example, got: "${aProps.details.example}"`,
    );
    assert.ok(aProps.city, 'CreateAddressDto must contain "city" property');
    assert.equal(
      aProps.city.example,
      'Cairo',
      `Expected city example to be 'Cairo', got: '${aProps.city.example}'`,
    );
    assert.ok(aProps.postalCode, 'CreateAddressDto must contain "postalCode" property');
    assert.equal(
      aProps.postalCode.example,
      '11511',
      `Expected Egyptian postal code example '11511', got: '${aProps.postalCode.example}'`,
    );

    // 4. Validate descriptions on DTO properties
    let totalPropsChecked = 0;
    let propsWithDescriptions = 0;
    for (const schemaName of expectedDtos) {
      const s = schemas[schemaName];
      for (const [propName, propDef] of Object.entries<any>(s.properties || {})) {
        totalPropsChecked++;
        if (propDef.description && typeof propDef.description === 'string' && propDef.description.trim().length > 0) {
          propsWithDescriptions++;
        }
      }
    }

    const descriptionCoverage = (propsWithDescriptions / totalPropsChecked) * 100;
    assert.ok(
      descriptionCoverage >= 90,
      `Expected >= 90% of DTO properties to have descriptions, got ${descriptionCoverage.toFixed(1)}% (${propsWithDescriptions}/${totalPropsChecked})`,
    );

    console.log(`  Subtest A: All ${expectedDtos.length} required DTO schemas verified.`);
    console.log(`  Subtest B: Realistic clothing store domain examples confirmed:`);
    console.log(`    - Product: "${pProps.title.example}", Base: ${pProps.price.example} EGP, Disc: ${pProps.priceAfterDiscount.example} EGP`);
    console.log(`    - Variant: SKU "${vProps.sku.example}", Sizes: ${vProps.sizeId.description}, Colors: ${vProps.colorId.description}`);
    console.log(`    - Address: "${aProps.details.example}", City: ${aProps.city.example}, Postal: ${aProps.postalCode.example}`);
    console.log(`  Subtest C: Property description coverage: ${descriptionCoverage.toFixed(1)}% (${propsWithDescriptions}/${totalPropsChecked} properties).`);
    console.log('✅ TC-09 PASSED: DTO schemas thoroughly validated with clothing store domain semantics.\n');
    passCount++;

    // ----------------------------------------------------------------
    // Final Summary
    // ----------------------------------------------------------------
    console.log('================================================================');
    console.log(`🎉 ALL ${passCount}/${totalTests} SWAGGER DOCUMENTATION TESTS PASSED CLEANLY!`);
    console.log('================================================================\n');

  } catch (error) {
    console.error('\n❌ Milestone 5 Swagger test failed:', error);
    process.exit(1);
  }
}

runSwaggerDocsTests();
