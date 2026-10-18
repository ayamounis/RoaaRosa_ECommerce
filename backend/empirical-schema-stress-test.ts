import assert from 'node:assert/strict';

interface OpenAPISpec {
  openapi: string;
  info: any;
  paths: Record<string, Record<string, any>>;
  components?: {
    schemas?: Record<string, any>;
    securitySchemes?: Record<string, any>;
    [key: string]: any;
  };
  tags?: Array<{ name: string; description?: string }>;
}

async function runEmpiricalStressTest() {
  console.log('🔍 ================================================================');
  console.log('🔍 EMPIRICAL CHALLENGER: Deep DTO & Schema Stress Test Suite');
  console.log('🔍 ================================================================\n');

  const DOCS_JSON_URL = 'http://localhost:5000/api/v1/docs-json';
  const res = await fetch(DOCS_JSON_URL);
  assert.equal(res.status, 200, `Expected 200 from ${DOCS_JSON_URL}, got ${res.status}`);
  const spec: OpenAPISpec = await res.json();

  const schemas = spec.components?.schemas || {};
  const schemaNames = Object.keys(schemas);
  console.log(`[STATUS] Total Schemas in components.schemas: ${schemaNames.length}`);
  console.log(`[STATUS] Total Path Items in paths: ${Object.keys(spec.paths).length}`);

  let totalAssertions = 0;
  function check(desc: string, cond: boolean, msg?: string) {
    totalAssertions++;
    if (!cond) {
      console.error(`❌ FAILED: ${desc} - ${msg || ''}`);
      assert.ok(cond, `${desc}: ${msg || ''}`);
    }
  }

  // ====================================================================
  // TEST 1: Extract all $ref pointers across entire OpenAPI Spec
  // ====================================================================
  console.log('\n--- TEST 1: $ref Pointer Extraction & Target Validation ---');
  const allRefs: Array<{ path: string; ref: string }> = [];

  function findRefs(obj: any, currentPath: string) {
    if (!obj || typeof obj !== 'object') return;
    if (obj.$ref && typeof obj.$ref === 'string') {
      allRefs.push({ path: currentPath, ref: obj.$ref });
    }
    for (const [k, v] of Object.entries(obj)) {
      findRefs(v, `${currentPath}.${k}`);
    }
  }

  findRefs(spec, 'root');
  console.log(`  Discovered ${allRefs.length} total $ref pointer(s) across entire specification.`);

  const brokenRefs: Array<{ path: string; ref: string }> = [];
  const referencedSchemas = new Set<string>();

  for (const item of allRefs) {
    if (item.ref.startsWith('#/components/schemas/')) {
      const targetName = item.ref.replace('#/components/schemas/', '');
      referencedSchemas.add(targetName);
      if (!schemas[targetName]) {
        brokenRefs.push(item);
      }
    } else {
      console.warn(`  Non-standard $ref found: ${item.ref} at ${item.path}`);
    }
  }

  check('Zero Broken $refs', brokenRefs.length === 0, `Found broken $refs: ${JSON.stringify(brokenRefs)}`);
  console.log(`✅ TEST 1 PASSED: Zero broken $ref pointers found. All ${allRefs.length} $refs resolve cleanly.`);

  // ====================================================================
  // TEST 2: Schema Reference Graph & Cycle / Circular Reference Detection
  // ====================================================================
  console.log('\n--- TEST 2: Schema Reference Graph & Circular Reference Detection ---');
  // Build adjacency list for schemas referencing other schemas
  const schemaGraph: Record<string, string[]> = {};
  for (const sName of schemaNames) {
    schemaGraph[sName] = [];
    const schemaObj = schemas[sName];
    const localRefs: Array<{ path: string; ref: string }> = [];
    findRefs(schemaObj, sName);
    for (const r of allRefs.filter(x => x.path.startsWith(`root.components.schemas.${sName}`))) {
      if (r.ref.startsWith('#/components/schemas/')) {
        const dep = r.ref.replace('#/components/schemas/', '');
        if (!schemaGraph[sName].includes(dep)) {
          schemaGraph[sName].push(dep);
        }
      }
    }
  }

  // Detect cycles using DFS (white/gray/black 3-color graph traversal)
  const color: Record<string, 'white' | 'gray' | 'black'> = {};
  for (const s of schemaNames) color[s] = 'white';
  const cyclesFound: string[][] = [];

  function dfs(node: string, currentPath: string[]) {
    color[node] = 'gray';
    currentPath.push(node);

    for (const neighbor of schemaGraph[node] || []) {
      if (color[neighbor] === 'gray') {
        const cycleStartIndex = currentPath.indexOf(neighbor);
        cyclesFound.push(currentPath.slice(cycleStartIndex).concat(neighbor));
      } else if (color[neighbor] === 'white') {
        dfs(neighbor, currentPath);
      }
    }

    currentPath.pop();
    color[node] = 'black';
  }

  for (const s of schemaNames) {
    if (color[s] === 'white') {
      dfs(s, []);
    }
  }

  check('Zero Circular References', cyclesFound.length === 0, `Cycles detected: ${JSON.stringify(cyclesFound)}`);
  console.log(`✅ TEST 2 PASSED: Reference graph is a DAG with zero circular references.`);

  // ====================================================================
  // TEST 3: Model Utilization / Unreferenced Model Analysis
  // ====================================================================
  console.log('\n--- TEST 3: Schema Usage & Orphan Analysis ---');
  // Also check if schemas are referenced in paths (parameters or requestBodies)
  const pathReferencedSchemas = new Set<string>();
  for (const item of allRefs) {
    if (item.path.startsWith('root.paths.') && item.ref.startsWith('#/components/schemas/')) {
      pathReferencedSchemas.add(item.ref.replace('#/components/schemas/', ''));
    }
  }

  // Expand transitively
  const reachableSchemas = new Set<string>(pathReferencedSchemas);
  let changed = true;
  while (changed) {
    changed = false;
    for (const s of Array.from(reachableSchemas)) {
      for (const dep of schemaGraph[s] || []) {
        if (!reachableSchemas.has(dep)) {
          reachableSchemas.add(dep);
          changed = true;
        }
      }
    }
  }

  console.log(`  Schemas directly referenced in paths: ${pathReferencedSchemas.size} (${Array.from(pathReferencedSchemas).join(', ')})`);
  console.log(`  Schemas reachable transitively: ${reachableSchemas.size}`);

  const unreferencedSchemas = schemaNames.filter(s => !reachableSchemas.has(s));
  console.log(`  Unreferenced schemas count: ${unreferencedSchemas.length}`);
  if (unreferencedSchemas.length > 0) {
    console.log(`  Note on unreferenced schemas: [${unreferencedSchemas.join(', ')}]`);
  }

  // ====================================================================
  // TEST 4: Property Types, Constraints, and Required/Optional Field Consistency
  // ====================================================================
  console.log('\n--- TEST 4: DTO Property Types, Required/Optional Consistency ---');
  const validDataTypes = new Set(['string', 'number', 'integer', 'boolean', 'array', 'object']);
  let totalPropertiesChecked = 0;
  let totalRequiredProperties = 0;
  let totalOptionalProperties = 0;

  for (const [sName, sObj] of Object.entries(schemas)) {
    check(`Schema ${sName} is object type`, sObj.type === 'object', `got ${sObj.type}`);
    const props = sObj.properties || {};
    const requiredArr: string[] = Array.isArray(sObj.required) ? sObj.required : [];

    // Verify all required entries actually exist in properties
    for (const reqProp of requiredArr) {
      check(
        `Required property '${reqProp}' in schema '${sName}' exists in properties`,
        reqProp in props,
        `Property '${reqProp}' is listed as required but not defined in properties`,
      );
    }

    for (const [pName, pDef] of Object.entries<any>(props)) {
      totalPropertiesChecked++;
      const isRequired = requiredArr.includes(pName);
      if (isRequired) totalRequiredProperties++;
      else totalOptionalProperties++;

      // Type checking
      if (pDef.type) {
        check(
          `Property '${pName}' in '${sName}' has valid OpenAPI type`,
          validDataTypes.has(pDef.type),
          `Invalid type '${pDef.type}'`,
        );
      } else if (pDef.$ref) {
        check(
          `Property '${pName}' in '${sName}' has valid $ref`,
          pDef.$ref.startsWith('#/components/schemas/'),
          `Invalid $ref '${pDef.$ref}'`,
        );
      } else if (pDef.allOf || pDef.anyOf || pDef.oneOf) {
        // Compound schema
      } else {
        check(`Property '${pName}' in '${sName}' has type or $ref`, false, 'Missing type or $ref');
      }

      // Check description
      check(
        `Property '${pName}' in '${sName}' has description`,
        typeof pDef.description === 'string' && pDef.description.trim().length > 0,
        `Empty or missing description`,
      );

      // Check array items
      if (pDef.type === 'array') {
        check(
          `Array property '${pName}' in '${sName}' defines items`,
          pDef.items && typeof pDef.items === 'object',
          'Missing items specification',
        );
      }
    }
  }

  console.log(`  Properties audited: ${totalPropertiesChecked} (${totalRequiredProperties} required, ${totalOptionalProperties} optional)`);
  console.log(`✅ TEST 4 PASSED: All property types and required/optional specifications conform to OpenAPI 3.0.`);

  // ====================================================================
  // TEST 5: Clothing Store Domain Specifics & Egyptian Semantics
  // ====================================================================
  console.log('\n--- TEST 5: Clothing Store Domain Semantics & Egyptian Examples ---');

  // A. Product Catalog Semantics
  const prodSchema = schemas['CreateProductDto'];
  check('CreateProductDto exists', !!prodSchema);
  const pProps = prodSchema.properties;
  check('Product title mentions clothing', /shirt|jacket|hoodie|cotton|pants|crewneck/i.test(pProps.title.example), `Got: ${pProps.title.example}`);
  check('Product price is positive number', typeof pProps.price.example === 'number' && pProps.price.example > 0);
  check('Product price description mentions EGP', /EGP|Egyptian/i.test(pProps.price.description));
  check('Product priceAfterDiscount <= price', pProps.priceAfterDiscount.example <= pProps.price.example);
  check('Product priceAfterDiscount description mentions EGP', /EGP|Egyptian/i.test(pProps.priceAfterDiscount.description));

  // B. Product Variant Semantics (Sizes: S, M, L, XL; Colors)
  const varSchema = schemas['CreateVariantDto'];
  check('CreateVariantDto exists', !!varSchema);
  const vProps = varSchema.properties;
  check('Variant SKU is clothing SKU format', typeof vProps.sku.example === 'string' && vProps.sku.example.length >= 3);
  check('Variant sizeId description mentions clothing sizes S, M, L, XL', /S,\s*M,\s*L,\s*XL/i.test(vProps.sizeId.description), `Got: ${vProps.sizeId.description}`);
  check('Variant colorId description mentions clothing colors', /color|blue|black|navy/i.test(vProps.colorId.description), `Got: ${vProps.colorId.description}`);

  // D. Address Semantics (Egyptian address, Cairo, postal code)
  const addrSchema = schemas['CreateAddressDto'];
  check('CreateAddressDto exists', !!addrSchema);
  const aProps = addrSchema.properties;
  check('Address city is Cairo', aProps.city.example === 'Cairo');
  check('Address postalCode is Egyptian format 11511', aProps.postalCode.example === '11511');
  check('Address street details has realistic street', /Street|Tahrir|Road/i.test(aProps.details.example));
  check('Address phone is Egyptian phone format (+201x or 01x)', /^(\+201|01)[0125][0-9]{8}$/.test(aProps.phone.example), `Got: ${aProps.phone.example}`);

  // D. Coupon Semantics (Percentages, EGP fixed amounts, UPPERCASE codes)
  const couponSchema = schemas['CreateCouponDto'];
  check('CreateCouponDto exists', !!couponSchema);
  const cProps = couponSchema.properties;
  check('Coupon code is uppercase alphanumeric', /^[A-Z0-9_-]+$/.test(cProps.code.example), `Got: ${cProps.code.example}`);
  check('Coupon discountValue is positive number', typeof cProps.discountValue.example === 'number' && cProps.discountValue.example > 0);
  check('Coupon discountType is enum of PERCENTAGE / FIXED', Array.isArray(cProps.discountType.enum) && cProps.discountType.enum.includes('PERCENTAGE'));

  // E. Cart & Orders Semantics
  const cartSchema = schemas['AddToCartDto'];
  check('AddToCartDto exists', !!cartSchema);
  const cartProps = cartSchema.properties;
  check('AddToCartDto quantity default is 1', cartProps.quantity.default === 1 && cartProps.quantity.example >= 1);

  const cartQtySchema = schemas['UpdateCartQuantityDto'];
  check('UpdateCartQuantityDto exists', !!cartQtySchema);
  check('UpdateCartQuantityDto count is positive integer', cartQtySchema.properties.count.example > 0);

  // F. Reviews Semantics
  const reviewSchema = schemas['CreateReviewDto'];
  check('CreateReviewDto exists', !!reviewSchema);
  const rProps = reviewSchema.properties;
  check('Review rating is between 1 and 5', rProps.rating.example >= 1 && rProps.rating.example <= 5);
  check('Review comment describes clothing quality', /quality|fabric|fit|soft|cotton|shirt/i.test(rProps.title.example), `Got: ${rProps.title.example}`);

  console.log(`✅ TEST 5 PASSED: Clothing store domain semantics, sizes, colors, EGP currency, and Egyptian addresses validated.`);

  // ====================================================================
  // TEST 6: 13-Module Controller & Tag Mapping Completeness
  // ====================================================================
  console.log('\n--- TEST 6: 13-Module Controller & Tag Completeness ---');
  const REQUIRED_MODULES = [
    'Auth', 'Users', 'Addresses', 'Categories', 'Subcategories',
    'Brands', 'Products', 'Cart', 'Wishlist', 'Reviews',
    'Coupons', 'Orders', 'Health'
  ];

  const foundModules = new Set<string>();
  for (const [p, pObj] of Object.entries(spec.paths)) {
    for (const [m, op] of Object.entries(pObj)) {
      if (['get', 'post', 'put', 'delete', 'patch'].includes(m.toLowerCase())) {
        for (const t of op.tags || []) {
          foundModules.add(t);
        }
      }
    }
  }

  for (const reqMod of REQUIRED_MODULES) {
    check(`Module '${reqMod}' is present in mapped operations`, foundModules.has(reqMod));
  }
  console.log(`✅ TEST 6 PASSED: All 13 modules active with mapped endpoints.`);

  // ====================================================================
  // TEST 7: Orders Module DTO Schemas & RequestBody Audit
  // ====================================================================
  console.log('\n--- TEST 7: Orders Module DTO & RequestBody Audit ---');
  const cashOrderOp = spec.paths['/api/v1/orders/{cartId}']?.post;
  check('POST /api/v1/orders/{cartId} exists', !!cashOrderOp);
  const hasCashOrderBody = !!cashOrderOp?.requestBody;
  console.log(`  POST /api/v1/orders/{cartId} requestBody present: ${hasCashOrderBody}`);

  const checkoutOp = spec.paths['/api/v1/orders/checkout-session/{cartId}']?.post;
  check('POST /api/v1/orders/checkout-session/{cartId} exists', !!checkoutOp);
  const hasCheckoutBody = !!checkoutOp?.requestBody;
  console.log(`  POST /api/v1/orders/checkout-session/{cartId} requestBody present: ${hasCheckoutBody}`);

  const hasCreateOrderDto = !!schemas['CreateOrderDto'];
  console.log(`  CreateOrderDto registered in components.schemas: ${hasCreateOrderDto}`);

  const hasShippingAddressDto = !!schemas['ShippingAddressDto'];
  console.log(`  ShippingAddressDto registered in components.schemas: ${hasShippingAddressDto}`);

  // ====================================================================
  // Summary
  // ====================================================================
  console.log('\n================================================================');
  console.log(`Audited: ${totalAssertions} assertions checked.`);
  if (!hasCashOrderBody || !hasCheckoutBody || !hasCreateOrderDto || !hasShippingAddressDto) {
    console.error('⚠️ DEFECT DETECTED: Orders module requestBody and DTO schemas are missing from OpenAPI spec!');
  }
  console.log('================================================================\n');
}

runEmpiricalStressTest().catch(err => {
  console.error('Empirical stress test failed:', err);
  process.exit(1);
});
