import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const baseUrl = 'http://localhost:5000/api/v1';

async function runMilestone5Tests() {
  console.log('🧪 Starting Milestone 5 (Authentication Module) Verification Tests...\n');
  let passCount = 0;
  const totalTests = 6;

  try {
    // ----------------------------------------------------
    // TC-M05-01: User Signup & Validation
    // ----------------------------------------------------
    console.log('[TC-M05-01] Testing User Signup & Validations...');
    const testSignupEmail = `testuser_${Date.now()}@ecommerce.com`;

    // A: Successful signup
    const signupRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ahmed Mostafa',
        email: testSignupEmail,
        password: 'Password123!',
        rePassword: 'Password123!',
        phone: '+201099887766',
      }),
    });

    const signupJson = await signupRes.json();
    console.log('Signup Response Status:', signupRes.status);
    console.log('Signup Response Payload:', JSON.stringify(signupJson, null, 2));

    if (
      signupRes.status === 201 &&
      signupJson.message === 'success' &&
      signupJson.token &&
      signupJson.user?.id &&
      signupJson.user?._id &&
      signupJson.user?.email === testSignupEmail
    ) {
      console.log('Subtest A: Signup succeeded with valid token and user shape.');
    } else {
      throw new Error(`Signup failed: ${JSON.stringify(signupJson)}`);
    }

    // B: Password mismatch validation
    const mismatchRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Mismatch User',
        email: `mismatch_${Date.now()}@ecommerce.com`,
        password: 'Password123!',
        rePassword: 'DifferentPassword!',
        phone: '+201099887766',
      }),
    });
    const mismatchJson = await mismatchRes.json();
    if (mismatchRes.status === 400 && mismatchJson.statusMsg === 'fail') {
      console.log('Subtest B: Password mismatch correctly rejected with 400.');
    } else {
      throw new Error('Password mismatch validation failed!');
    }

    // C: Duplicate email rejection
    const dupRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate User',
        email: testSignupEmail,
        password: 'Password123!',
        rePassword: 'Password123!',
        phone: '+201099887766',
      }),
    });
    const dupJson = await dupRes.json();
    if (dupRes.status === 400 && dupJson.statusMsg === 'fail') {
      console.log('Subtest C: Duplicate email rejected with 400.');
    } else {
      throw new Error('Duplicate email validation failed!');
    }

    console.log('✅ TC-M05-01 PASSED\n');
    passCount++;

    // ----------------------------------------------------
    // TC-M05-02: User Signin
    // ----------------------------------------------------
    console.log('[TC-M05-02] Testing User Signin...');
    // A: Successful signin
    const signinRes = await fetch(`${baseUrl}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@ecommerce.com',
        password: 'User123456',
      }),
    });
    const signinJson = await signinRes.json();
    console.log('Signin Response Status:', signinRes.status);

    if (
      signinRes.status === 200 &&
      signinJson.message === 'success' &&
      signinJson.token &&
      signinJson.user?.email === 'user@ecommerce.com'
    ) {
      console.log('Subtest A: Signin successful with valid token.');
    } else {
      throw new Error(`Signin failed: ${JSON.stringify(signinJson)}`);
    }

    // B: Incorrect password
    const wrongPassRes = await fetch(`${baseUrl}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@ecommerce.com',
        password: 'WrongPassword999',
      }),
    });
    const wrongPassJson = await wrongPassRes.json();
    if (wrongPassRes.status === 401 && wrongPassJson.statusMsg === 'fail') {
      console.log('Subtest B: Wrong password rejected with 401 Unauthorized.');
    } else {
      throw new Error('Wrong password test failed!');
    }

    console.log('✅ TC-M05-02 PASSED\n');
    passCount++;

    // ----------------------------------------------------
    // TC-M05-03: Forgot Password (POST /auth/forgotPasswords)
    // ----------------------------------------------------
    console.log('[TC-M05-03] Testing Forgot Password lifecycle...');
    const forgotRes = await fetch(`${baseUrl}/auth/forgotPasswords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testSignupEmail,
      }),
    });
    const forgotJson = await forgotRes.json();
    console.log('Forgot Password Response:', JSON.stringify(forgotJson, null, 2));

    const dbUserAfterForgot = await prisma.user.findUnique({
      where: { email: testSignupEmail },
    });

    if (
      forgotRes.status === 200 &&
      forgotJson.statusMsg === 'success' &&
      forgotJson.message &&
      dbUserAfterForgot?.passwordResetCode &&
      dbUserAfterForgot?.passwordResetExpires
    ) {
      console.log(`Reset code stored in DB: ${dbUserAfterForgot.passwordResetCode}`);
      console.log('✅ TC-M05-03 PASSED\n');
      passCount++;
    } else {
      throw new Error(`Forgot password failed: ${JSON.stringify(forgotJson)}`);
    }

    // ----------------------------------------------------
    // TC-M05-04: Verify Reset Code (POST /auth/verifyResetCode)
    // ----------------------------------------------------
    console.log('[TC-M05-04] Testing Verify Reset Code...');
    // A: Valid reset code
    const validCode = dbUserAfterForgot.passwordResetCode!;
    const verifyRes = await fetch(`${baseUrl}/auth/verifyResetCode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resetCode: validCode,
      }),
    });
    const verifyJson = await verifyRes.json();
    console.log('Verify Response:', JSON.stringify(verifyJson, null, 2));

    const dbUserAfterVerify = await prisma.user.findUnique({
      where: { email: testSignupEmail },
    });

    if (
      verifyRes.status === 200 &&
      verifyJson.status === 'Success' && // Exactly capitalized 'Success' for frontend OtpValidationForm
      dbUserAfterVerify?.passwordResetVerified === true
    ) {
      console.log('Subtest A: Code verified and status "Success" returned.');
    } else {
      throw new Error(`Verify reset code failed: ${JSON.stringify(verifyJson)}`);
    }

    // B: Invalid reset code
    const invalidVerifyRes = await fetch(`${baseUrl}/auth/verifyResetCode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resetCode: '000000',
      }),
    });
    if (invalidVerifyRes.status === 400) {
      console.log('Subtest B: Invalid code correctly rejected with 400.');
    } else {
      throw new Error('Invalid code test failed!');
    }

    console.log('✅ TC-M05-04 PASSED\n');
    passCount++;

    // ----------------------------------------------------
    // TC-M05-05: Reset Password (PUT /auth/resetPassword)
    // ----------------------------------------------------
    console.log('[TC-M05-05] Testing Reset Password...');
    const newTestPassword = 'BrandNewPassword2026!';
    const resetPassRes = await fetch(`${baseUrl}/auth/resetPassword`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testSignupEmail,
        newPassword: newTestPassword,
      }),
    });
    const resetPassJson = await resetPassRes.json();
    console.log('Reset Password Response:', JSON.stringify(resetPassJson, null, 2));

    if (resetPassRes.status === 200 && resetPassJson.token) {
      console.log('Subtest A: Password reset succeeded with new JWT token.');
    } else {
      throw new Error(`Reset password failed: ${JSON.stringify(resetPassJson)}`);
    }

    // Verify user can now sign in with the new password
    const testNewLoginRes = await fetch(`${baseUrl}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testSignupEmail,
        password: newTestPassword,
      }),
    });
    if (testNewLoginRes.status === 200) {
      console.log('Subtest B: Logged in successfully with newly reset password.');
    } else {
      throw new Error('Login with new password failed!');
    }

    console.log('✅ TC-M05-05 PASSED\n');
    passCount++;

    // ----------------------------------------------------
    // TC-M05-06: JWT Guard Header Extraction (token vs Bearer)
    // ----------------------------------------------------
    console.log('[TC-M05-06] Testing JWT Guard & Token Extraction...');
    const userToken = signinJson.token;

    // A: Test with Next.js custom 'token' header
    const profileCustomHeaderRes = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        token: userToken,
      },
    });
    const profileCustomJson = await profileCustomHeaderRes.json();
    if (
      profileCustomHeaderRes.status === 200 &&
      profileCustomJson.user?.email === 'user@ecommerce.com'
    ) {
      console.log('Subtest A: Custom "token" header successfully authenticated.');
    } else {
      throw new Error(`Custom token header failed: ${JSON.stringify(profileCustomJson)}`);
    }

    // B: Test with standard Authorization: Bearer <token>
    const profileBearerRes = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    const profileBearerJson = await profileBearerRes.json();
    if (
      profileBearerRes.status === 200 &&
      profileBearerJson.user?.email === 'user@ecommerce.com'
    ) {
      console.log('Subtest B: Bearer token header successfully authenticated.');
    } else {
      throw new Error(`Bearer token header failed: ${JSON.stringify(profileBearerJson)}`);
    }

    // C: Test without token
    const noTokenRes = await fetch(`${baseUrl}/auth/me`);
    const noTokenJson = await noTokenRes.json();
    if (noTokenRes.status === 401 && noTokenJson.statusMsg === 'fail') {
      console.log('Subtest C: Missing token correctly rejected with 401.');
    } else {
      throw new Error('Missing token test failed!');
    }

    console.log('✅ TC-M05-06 PASSED\n');
    passCount++;

    console.log('========================================');
    console.log(`🎉 ALL ${passCount}/${totalTests} TESTS PASSED CLEANLY!`);
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ Milestone 5 test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMilestone5Tests();
