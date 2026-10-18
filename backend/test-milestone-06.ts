const baseUrl = 'http://localhost:5000/api/v1';

async function runMilestone6Tests() {
  console.log('🧪 Starting Milestone 6 (Users & Addresses) Verification Tests...\n');
  let passCount = 0;
  const totalTests = 6;

  try {
    // 0. Setup: Log in as standard customer to get valid token
    console.log('[Setup] Logging in as user@ecommerce.com...');
    const loginRes = await fetch(`${baseUrl}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@ecommerce.com',
        password: 'User123456',
      }),
    });
    const loginJson = await loginRes.json();
    let authToken = loginJson.token;
    console.log('Auth token acquired successfully.\n');

    // ----------------------------------------------------
    // TC-M06-01: Get Me (GET /users/getMe)
    // ----------------------------------------------------
    console.log('[TC-M06-01] Testing GET /api/v1/users/getMe...');
    const getMeRes = await fetch(`${baseUrl}/users/getMe`, {
      headers: { token: authToken },
    });
    const getMeJson = await getMeRes.json();
    console.log('GetMe Status:', getMeRes.status);
    console.log('GetMe Payload:', JSON.stringify(getMeJson, null, 2));

    if (
      getMeRes.status === 200 &&
      getMeJson.data?.email === 'user@ecommerce.com' &&
      getMeJson.data?._id &&
      Array.isArray(getMeJson.data?.addresses)
    ) {
      console.log('✅ TC-M06-01 PASSED: Profile retrieved with addresses and dual ID.\n');
      passCount++;
    } else {
      throw new Error(`GetMe failed: ${JSON.stringify(getMeJson)}`);
    }

    // ----------------------------------------------------
    // TC-M06-02: Update Me (PUT /users/updateMe)
    // ----------------------------------------------------
    console.log('[TC-M06-02] Testing PUT /api/v1/users/updateMe...');
    const updateMeRes = await fetch(`${baseUrl}/users/updateMe`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: authToken,
      },
      body: JSON.stringify({
        name: 'Mohamed Fares Updated',
        phone: '+201099998888',
      }),
    });
    const updateMeJson = await updateMeRes.json();
    console.log('UpdateMe Status:', updateMeRes.status);

    if (
      updateMeRes.status === 200 &&
      updateMeJson.status === 'success' &&
      updateMeJson.data?.user?.name === 'Mohamed Fares Updated' &&
      updateMeJson.data?.user?.phone === '+201099998888'
    ) {
      console.log('✅ TC-M06-02 PASSED: User profile updated successfully.\n');
      passCount++;
    } else {
      throw new Error(`UpdateMe failed: ${JSON.stringify(updateMeJson)}`);
    }

    // ----------------------------------------------------
    // TC-M06-03: Change My Password (PUT /users/changeMyPassword)
    // ----------------------------------------------------
    console.log('[TC-M06-03] Testing PUT /api/v1/users/changeMyPassword...');
    // A: Wrong current password test
    const wrongCurrentRes = await fetch(`${baseUrl}/users/changeMyPassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: authToken,
      },
      body: JSON.stringify({
        currentPassword: 'WrongPassword999',
        password: 'NewUserPassword123!',
        rePassword: 'NewUserPassword123!',
      }),
    });
    const wrongCurrentJson = await wrongCurrentRes.json();
    if (
      wrongCurrentRes.status === 400 &&
      wrongCurrentJson.statusMsg === 'fail' &&
      wrongCurrentJson.errors?.msg
    ) {
      console.log('Subtest A: Wrong current password rejected with 400 and frontend-compatible error shape.');
    } else {
      throw new Error(`Wrong current password test failed: ${JSON.stringify(wrongCurrentJson)}`);
    }

    // B: Successful change password
    const changePassRes = await fetch(`${baseUrl}/users/changeMyPassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: authToken,
      },
      body: JSON.stringify({
        currentPassword: 'User123456',
        password: 'User123456', // keep same so future tests can also use it
        rePassword: 'User123456',
      }),
    });
    const changePassJson = await changePassRes.json();

    if (changePassRes.status === 200 && changePassJson.token && changePassJson.user?.id) {
      console.log('Subtest B: Password changed successfully, new token issued.');
      authToken = changePassJson.token; // Update token for subsequent tests
    } else {
      throw new Error(`Change password failed: ${JSON.stringify(changePassJson)}`);
    }

    console.log('✅ TC-M06-03 PASSED\n');
    passCount++;

    // ----------------------------------------------------
    // TC-M06-04: Add Address (POST /addresses)
    // ----------------------------------------------------
    console.log('[TC-M06-04] Testing POST /api/v1/addresses...');
    const addAddressRes = await fetch(`${baseUrl}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: authToken,
      },
      body: JSON.stringify({
        name: 'Work Office',
        details: '90 North Road, 5th Settlement, Building 14',
        phone: '+201055554444',
        city: 'New Cairo',
        postalCode: '11835',
        isDefault: false,
      }),
    });
    const addAddressJson = await addAddressRes.json();
    console.log('AddAddress Status:', addAddressRes.status);

    const addedAddress = addAddressJson.data?.find((a: any) => a.alias === 'Work Office');

    if (
      addAddressRes.status === 200 &&
      addAddressJson.status === 'success' &&
      addAddressJson.message === 'Address added successfully' &&
      addedAddress?.id &&
      addedAddress?._id
    ) {
      console.log(`Address added with ID: ${addedAddress.id}`);
      console.log('✅ TC-M06-04 PASSED\n');
      passCount++;
    } else {
      throw new Error(`AddAddress failed: ${JSON.stringify(addAddressJson)}`);
    }

    // ----------------------------------------------------
    // TC-M06-05: Get All Addresses & Specific Address
    // ----------------------------------------------------
    console.log('[TC-M06-05] Testing GET /api/v1/addresses & GET /addresses/:id...');
    // A: All addresses
    const allAddressesRes = await fetch(`${baseUrl}/addresses`, {
      headers: { token: authToken },
    });
    const allAddressesJson = await allAddressesRes.json();

    if (
      allAddressesRes.status === 200 &&
      allAddressesJson.status === 'success' &&
      allAddressesJson.results >= 2 &&
      Array.isArray(allAddressesJson.data)
    ) {
      console.log(`Subtest A: All addresses retrieved (count: ${allAddressesJson.results}).`);
    } else {
      throw new Error(`Get all addresses failed: ${JSON.stringify(allAddressesJson)}`);
    }

    // B: Specific address
    const specificAddressRes = await fetch(`${baseUrl}/addresses/${addedAddress.id}`, {
      headers: { token: authToken },
    });
    const specificAddressJson = await specificAddressRes.json();

    if (
      specificAddressRes.status === 200 &&
      specificAddressJson.status === 'success' &&
      specificAddressJson.data?.id === addedAddress.id &&
      specificAddressJson.data?.alias === 'Work Office'
    ) {
      console.log('Subtest B: Specific address retrieved successfully.');
    } else {
      throw new Error(`Get specific address failed: ${JSON.stringify(specificAddressJson)}`);
    }

    console.log('✅ TC-M06-05 PASSED\n');
    passCount++;

    // ----------------------------------------------------
    // TC-M06-06: Remove Address (DELETE /addresses/:id)
    // ----------------------------------------------------
    console.log('[TC-M06-06] Testing DELETE /api/v1/addresses/:id...');
    const deleteAddressRes = await fetch(`${baseUrl}/addresses/${addedAddress.id}`, {
      method: 'DELETE',
      headers: { token: authToken },
    });
    const deleteAddressJson = await deleteAddressRes.json();

    const stillExists = deleteAddressJson.data?.some((a: any) => a.id === addedAddress.id);

    if (
      deleteAddressRes.status === 200 &&
      deleteAddressJson.status === 'success' &&
      deleteAddressJson.message === 'Address removed successfully' &&
      !stillExists
    ) {
      console.log('Address removed cleanly from user account.');
      console.log('✅ TC-M06-06 PASSED\n');
      passCount++;
    } else {
      throw new Error(`Delete address failed: ${JSON.stringify(deleteAddressJson)}`);
    }

    console.log('========================================');
    console.log(`🎉 ALL ${passCount}/${totalTests} TESTS PASSED CLEANLY!`);
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ Milestone 6 test failed:', error);
    process.exit(1);
  }
}

runMilestone6Tests();
