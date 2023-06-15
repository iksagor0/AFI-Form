// DATA
const formData = {
  eligibilityStatus: "",
};

// const successRedirection = "https://afi.org/";
const successRedirection = "../--Model/thank-you.html";

// Forms
const multiStepForm = [
  "multi__step_1",
  "multi__step_2",
  "multi__step_3",
  "multi__step_4",
];
const defaultForms = ["radio_select", ...multiStepForm];
let formList = defaultForms;

// *********************************************
//       FORM SUBMISSION AND STEP HANDLING
// *********************************************
const nextBtn = document.querySelector("#next_btn");
const backBtn = document.querySelector("#back_btn");

let stepCount = 0;
let maxStep = formList.length - 1;

// ***** NEXT FUNCTIONALITY *****
nextBtn.addEventListener("click", () => {
  const isSelectEligibility = eligibilityValidation();

  if (stepCount === 0) {
    if (!Boolean(isSelectEligibility)) return false;
  }

  //   If additional form has in arrayList
  if (stepCount === formList.indexOf("military_information")) {
    if (!militaryFormValidation()) return false;
  }

  if (stepCount === formList.indexOf("parent_information")) {
    if (!parentFormValidation()) return false;
  }

  if (stepCount === formList.indexOf("child_information")) {
    if (!childFormValidation()) return false;
  }

  if (stepCount === formList.indexOf("multi__step_1")) {
    if (!multiStep1Validation()) return false;
  }
  if (stepCount === formList.indexOf("multi__step_2")) {
    if (!multiStep2Validation()) return false;
  }
  if (stepCount === formList.indexOf("multi__step_3")) {
    if (!multiStep3Validation()) return false;
  }

  if (stepCount === formList.indexOf("multi__step_4")) {
    const isAllFine = multiStep4Validation();

    if (isAllFine) {
      document.querySelector("#currentInsuranceCompany").value = "";
      // Go to Thank You Page
      window.location.href = successRedirection;
    }
  }

  console.log(formData);

  // Step Increment
  stepCount >= maxStep ? stepCount : stepCount++;

  // Show Form
  showActiveForm(stepCount);
});

// Back
backBtn.addEventListener("click", () => {
  // Step Decrement
  stepCount <= 0 ? stepCount : stepCount--;

  showActiveForm(stepCount);
});

// ********** Military Information ***********
function militaryFormValidation() {
  const militaryFirstName = document.querySelector("#militaryFirstName");
  const militaryLastName = document.querySelector("#militaryLastName");
  const branchOfService = document.querySelector("#branchOfService");
  const militaryStatus = document.querySelector("#militaryStatus");
  const militaryRank = document.querySelector("#militaryRank");

  const validationFields = [
    alphabeticOnly(militaryFirstName),
    isValueEmpty(militaryFirstName),
    alphabeticOnly(militaryLastName),
    isValueEmpty(militaryLastName),
    isValueEmpty(branchOfService),
    isValueEmpty(militaryStatus),
    isValueEmpty(militaryRank),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.policyHolderFirstName = militaryFirstName?.value;
    formData.policyHolderLastName = militaryLastName?.value;
    formData.branchOfService = branchOfService?.value;
    formData.militaryStatus = militaryStatus?.value;
    formData.militaryRank = militaryRank?.value;

    // Set Name in Multi-step form field
    document.querySelector("#policyHolderFirstName").value =
      formData.policyHolderFirstName;

    document.querySelector("#policyHolderLastName").value =
      formData.policyHolderLastName;
  }

  return isValidate;
}

// ********** Parent's Information ***********
function parentFormValidation() {
  const parentFirstName = document.querySelector("#parentFirstName");
  const parentLastName = document.querySelector("#parentLastName");

  const validationFields = [
    alphabeticOnly(parentFirstName),
    alphabeticOnly(parentLastName),
    isValueEmpty(parentFirstName),
    isValueEmpty(parentLastName),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.parentFirstName = parentFirstName?.value;
    formData.parentLastName = parentLastName?.value;
  }

  return isValidate;
}

// ********** Child's Information ***********
function childFormValidation() {
  const childFirstName = document.querySelector("#childFirstName");
  const childLastName = document.querySelector("#childLastName");

  const validationFields = [
    alphabeticOnly(childFirstName),
    alphabeticOnly(childLastName),
    isValueEmpty(childFirstName),
    isValueEmpty(childLastName),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.childFirstName = childFirstName?.value;
    formData.childLastName = childLastName?.value;
  }

  return isValidate;
}

// ********** MULTI-STEP 1 Validation ***********
function multiStep1Validation() {
  const policyHolderFirstName = document.querySelector(
    "#policyHolderFirstName"
  );
  const policyHolderLastName = document.querySelector("#policyHolderLastName");
  const policyHolderEmail = document.querySelector("#policyHolderEmail");
  const policyHolderPhoneType = document.querySelector(
    "#policyHolderPhoneType"
  );
  const policyHolderPhoneNumber = document.querySelector(
    "#policyHolderPhoneNumber"
  );

  const validationFields = [
    alphabeticOnly(policyHolderFirstName),
    alphabeticOnly(policyHolderLastName),
    isValueEmpty(policyHolderFirstName),
    emailValidation(policyHolderEmail),
    isValueEmpty(policyHolderEmail),
    isValueEmpty(policyHolderPhoneType),
    phoneValidation(policyHolderPhoneNumber),
    isValueEmpty(policyHolderPhoneNumber),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.policyHolderFirstName = policyHolderFirstName?.value;
    formData.policyHolderLastName = policyHolderLastName?.value;
    formData.policyHolderEmail = policyHolderEmail?.value;
    formData.policyHolderPhoneType = policyHolderPhoneType?.value;
    formData.policyHolderPhoneNumber = policyHolderPhoneNumber?.value.replace(
      /\D/g,
      ""
    );
  }

  return isValidate;
}

// ********** MULTI-STEP 2 Validation ***********
function multiStep2Validation() {
  const businessName = document.querySelector("#businessName");
  const businessWebsite = document.querySelector("#businessWebsite");
  const businessType = document.querySelector("#businessType");
  const businessTaxId = document.querySelector("#businessTaxId");
  const businessPhysicalAddress = document.querySelector(
    "#businessPhysicalAddress"
  );
  const city = document.querySelector("#city");
  const state = document.querySelector("#state");
  const zip = document.querySelector("#zip");

  const validationFields = [
    isValueEmpty(businessName),
    isValueEmpty(businessType),
    isValueEmpty(businessPhysicalAddress),
    isValueEmpty(city),
    isValueEmpty(state),
    minValue(zip, 5, "Please enter a valid Zip code"),
    isValueEmpty(zip),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.businessName = businessName?.value;
    formData.businessWebsite = businessWebsite?.value;
    formData.businessType = businessType?.value;
    formData.businessTaxId = businessTaxId?.value;
    formData.city = city?.value;
    formData.state = state?.value;
    formData.zip = zip?.value;
  }

  return isValidate;
}

// ********** MULTI-STEP 3 Validation ***********
function multiStep3Validation() {
  const typeOfInsurance = document.getElementsByName("typeOfInsurance");

  formData.policyCoverage = [];

  typeOfInsurance.forEach((item) => {
    if (item?.checked) {
      formData.policyCoverage.push(item?.value);
    }
  });

  const isValidate = formData.policyCoverage.length > 0;

  if (!isValidate) {
    // Error Message if value = null
    eligibilityErrorMessage(false, ".multi__step_3 .field_message");
  }

  return isValidate;
}

// ********** MULTI-STEP 4 Validation ***********
function multiStep4Validation() {
  const currentInsuranceCompany = document.querySelector(
    "#currentInsuranceCompany"
  );
  const insuranceCompany = document.querySelector("#insuranceCompany");
  const policyRenewalDate = document.querySelector("#policyRenewalDate");

  formData.currentInsuranceCompany = currentInsuranceCompany?.value;
  formData.insuranceCompany = insuranceCompany?.value;
  formData.policyRenewalDate = policyRenewalDate?.value;

  let validationFields = true;

  // if currentInsuranceCompany = "Other" then Insurance Company value id required
  if (currentInsuranceCompany?.value === "Other") {
    validationFields = isValueEmpty(insuranceCompany);
  }

  return validationFields;
}

const dateField = document.querySelector("#policyRenewalDate");
dateField.addEventListener("input", (e) => {
  let value = e.target.value
    .replace(/\D/g, "")
    .match(/(\d{0,2})(\d{0,2})(\d{0,4})/);

  let [fullData, MM, DD, YYYY] = value;

  // Month Validation
  if (MM.length === 1 && Number(MM) > 1) value[1] = 0 + MM[0];
  else if (MM.length === 2 && Number(MM) <= 0) value[1] = MM[0];
  else if (MM.length === 2 && Number(MM) > 12) value[1] = MM[0];

  // Date Validation
  if (DD.length === 1 && Number(DD) > 3) value[2] = 0 + DD[0];
  else if (DD.length === 2 && Number(DD) <= 0) value[2] = DD[0];
  else if (DD.length === 2 && Number(DD) > 31) value[2] = DD[0];
  else if (DD.length === 2 && Number(MM) == 2 && Number(DD) > 29)
    value[2] = DD[0];
  else if ([4, 6, 9, 11].includes(Number(MM)) && Number(DD) > 30)
    value[2] = DD[0];

  // Year validation
  const thisYear = new Date().getFullYear();
  const maxYear = String(thisYear + 2);

  if (Number(YYYY) <= 1) value[3] = "";
  else if (YYYY.length === 1 && Number(YYYY) > 2) value[3] = "";
  else if (YYYY.length === 2 && Number(YYYY) > 20) value[3] = YYYY[0];
  else if (YYYY.length === 2 && Number(YYYY) < 20) value[3] = YYYY[0];
  else if (YYYY.length === 3 && Number(YYYY) > Number(maxYear.slice(0, 3)))
    value[3] = YYYY.slice(0, 2);
  else if (YYYY.length === 3 && Number(YYYY) > Number(maxYear.slice(0, 3)))
    value[3] = YYYY.slice(0, 2);
  else if (YYYY.length === 4 && Number(YYYY) > Number(maxYear))
    value[3] = YYYY.slice(0, 3);

  // Result
  e.target.value = !value[2]
    ? value[1]
    : value[1] + "/" + value[2] + (value[3] ? "/" + value[3] : "");
});

// *********************************************
//            FETCH DATA FROM JSON
// *********************************************
// Post/Save Data
// function saveData(postURL, data) {
//   fetch(postURL, {
//     method: "POST",
//     body: data,
//   })
//     .then((res) => res.json())
//     .then((resData) => console.log(resData))
//     .catch((err) => console.error(err));
// }

// const URL = "https://jsonplaceholder.typicode.com/posts";
// // saveData(URL, formData);
