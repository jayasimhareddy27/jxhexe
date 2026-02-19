const userPreferencesExtraction = { 
addressDetails: {
    id: 9,
    key: 'addressDetails',
    title: 'Address Details',
    arrayFieldKey: false,
    fields: ['street', 'city', 'state', 'zipCode', 'country', ],
    initial: {   street: '', city: '', state: '', zipCode: '', country: '' },
    prompt: `Extract address.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
  "street": "",
  "city": "",
  "state": "",
  "zipCode": "",
  "country": ""
}
Set null if missing.

Resume text:`
  },
  personalAttributes: {
    id: 10,
    key: 'personalAttributes',
    title: 'Personal Attributes',
    arrayFieldKey: false,
    fields: [ 'gender',  'dateOfBirth',  'nationality',  'maritalStatus',  'languages',  'disabilityStatus',  'criminalRecord',  'veteranStatus',  'raceEthnicity',  'healthRestrictions',  'emergencyContactName',  'emergencyContactPhone'],
    initial: {   gender: '',  dateOfBirth: '',  nationality: '',  maritalStatus: '',  languages: '',  disabilityStatus: '',  criminalRecord: '',  veteranStatus: '',  raceEthnicity: '',  healthRestrictions: '',  emergencyContactName: '',  emergencyContactPhone: ''
  },
  prompt: `Extract personal attributes.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  { 
    "gender": "",
    "dateOfBirth": "MM-DD-YYYY",
    "nationality": "",
    "maritalStatus": "",
    "languages": "",
    "disabilityStatus": "",
    "criminalRecord": "",
    "veteranStatus": "",
    "raceEthnicity": "",
    "healthRestrictions": "",
    "emergencyContactName": "",
    "emergencyContactPhone": ""
  }
  Use MM-DD-YYYY format for dateOfBirth. Use comma-separated string for languages. Set null if missing.
Resume text:`
  },
  workEligibility: {
  id: 11,
  key: 'workEligibility',
  title: 'Work Eligibility',
  arrayFieldKey: false,
  fields: [ 'workAuthorization',  'visaStatus',  'sponsorshipNeeded',  'relocationWillingness',  'rightToWorkInCountry',  'citizenshipStatus'
  ],
  initial: {  workAuthorization: '',  visaStatus: '',  sponsorshipNeeded: '',  relocationWillingness: '',  rightToWorkInCountry: '',  citizenshipStatus: ''
  },
  prompt: `Extract work eligibility information.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  {
    "workAuthorization": "",
    "visaStatus": "",
    "sponsorshipNeeded": "",
    "relocationWillingness": "",
    "rightToWorkInCountry": "",
    "citizenshipStatus": ""
  }
  Set null if missing.

  Resume text:`
  },
  jobPreferences: {
    id: 12,
    key: 'jobPreferences',
    title: 'Job Preferences',
    arrayFieldKey: false,
    fields: [  'preferredJobTitle',  'preferredLocation',  'desiredSalary',  'employmentType',  'availability',  'willingToTravel',  'remoteWorkPreference'],
    initial: { preferredJobTitle: '',  preferredLocation: '',  desiredSalary: '',  employmentType: '',  availability: '',  willingToTravel: '',  remoteWorkPreference: ''},
    prompt: `Extract job preferences.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  {
    "preferredJobTitle": "",
    "preferredLocation": "",
    "desiredSalary": "",
    "employmentType": "",
    "availability": "",
    "willingToTravel": "",
    "remoteWorkPreference": ""
  }
  Set null if missing.

  Resume text:`
  },

//array
  referrals: {
  id: 13,
  key: 'referrals',
  title: 'Referrals',
  arrayFieldKey: true,
  fields: ['referralName', 'referralContact', 'referralRelationship', 'referralNotes'],
  initial:   [{referralName: '',  referralContact: '',  referralRelationship: '',  referralNotes: ''}],
  prompt: `Extract referral information.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation or donot skip a field every field is important:
  [{
    "referralName": "",
    "referralContact": "",
    "referralRelationship": "",
    "referralNotes": ""
  }]
  Set null if missing.

  Resume text:`
  },
//Not Array
  hobbies: {
  id: 14,
  key: 'hobbies',
  title: 'Hobbies',
  arrayFieldKey: false,
  fields: ['hobbiesList'],
  initial: {"hobbiesList": ''},
  prompt: `Extract hobbies or interests.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  {
    "hobbiesList": ""
  }
  Use comma-separated string. Set null if missing.

  Resume text:`
  },    
};

export default userPreferencesExtraction;