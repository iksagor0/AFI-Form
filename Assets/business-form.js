// Forms
const businessFormSteps = [
  "policyholder_form",
  "business_information",
  "policy_coverage_options",
  "coverage_history_form",
];

// *********************************************
//       FORM SUBMISSION AND STEP HANDLING
// *********************************************

let businessStep = 0;
let businessMaxStep = formList.length - 1;

const businessNextBtn = document.querySelector("#businessNextBtn");
const businessBackBtn = document.querySelector("#businessBackBtn");

// ***** NEXT FUNCTIONALITY *****
pressEnterToSubmit(businessNextBtn);

businessNextBtn?.addEventListener("click", async () => {
  if (businessStep === 0) {
    const isSelectEligibility = eligibilityValidation(businessFormSteps);
    if (!Boolean(isSelectEligibility)) return false;

    businessMaxStep = formList.length - 1;
    militaryFormFunc();
  }

  //   If additional form has in arrayList
  if (businessStep === formList.indexOf("military_information")) {
    if (!militaryValidation()) return false;
  }

  if (businessStep === formList.indexOf("parent_information")) {
    if (!validateForm("parent_information")) return false;
  }

  if (businessStep === formList.indexOf("child_information")) {
    if (!validateForm("child_information")) return false;
  }

  if (businessStep === formList.indexOf("policyholder_form")) {
    if (!policyholderValidation(businessStep)) return false;

    // Save Data
    const resData = saveBusiness("policyholder_form");
    if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;
  }

  if (businessStep === formList.indexOf("business_information")) {
    if (!validateForm("business_information")) return false;

    // Save Data
    const resData = saveBusiness("business_information");
    if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;
  }

  if (businessStep === formList.indexOf("policy_coverage_options")) {
    if (!policyCoverageOptions()) return false;
    coverageHistoryFunc();

    // Save Data
    const resData = saveBusiness("policy_coverage_options");
    if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;
  }

  if (businessStep === formList.indexOf("coverage_history_form")) {
    const isAllFine = validateForm("coverage_history_form");

    if (isAllFine) {
      // alert("DONE");
      // Save Data
      const resData = saveBusiness("coverage_history_form", "submit");
      if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;

      // Go to Thank You Page
      //   window.location.href = businessSuccessRedirection;
      alert("Thank You");
    }
  }

  // Step Increment
  businessStep >= businessMaxStep ? businessStep : businessStep++;

  // Show Form
  showActiveForm(businessStep, businessBackBtn);
});

// Back
businessBackBtn?.addEventListener("click", () => {
  // Step Decrement
  businessStep <= 0 ? businessStep : businessStep--;

  showActiveForm(businessStep, businessBackBtn);
});

function saveBusiness(form, action = "send") {
  const resData = saveData(
    "/sc-api/forms/save-business",
    formData,
    businessNextBtn,
    form,
    action
  );

  return resData;
}
// *********************************************
//              FORM VALIDATION
// *********************************************
/*
 *
 * Note: Most of the form validate by using common validation functions from formCommon.js file.
 *
 */

// ********** MULTI-STEP 3 Validation ***********
function policyCoverageOptions() {
  const typeOfInsurance = document.getElementsByName("typeOfInsurance");

  formData[typeOfInsurance[0].name] = [];

  typeOfInsurance.forEach((item) => {
    if (item?.checked) {
      formData[typeOfInsurance[0].name].push(item?.value);
    }
  });

  const isValidate = formData[typeOfInsurance[0].name].length > 0;

  if (!isValidate) {
    // Error Message if value = null
    eligibilityErrorMessage(false, ".multi__step_3 .field_message");
  }

  return isValidate;
}
