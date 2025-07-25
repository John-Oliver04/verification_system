// models/Beneficiary.js
import mongoose from 'mongoose';

const BeneficiarySchema = new mongoose.Schema({

  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  extensionName: { type: String },

  birthdate: { type: Date, required: true },

  projectLocation: {
    barangay: { type: String },
    cityMunicipality: { type: String },
    province: { type: String },
    district: { type: String },
  },

  typeOfID: { type: String },
  idNumber: { type: String },
  contactNumber: { type: String },

  typeOfBeneficiary: { type: String }, // e.g. (a), (b), etc.
  occupation: { type: String },

  sex: { type: String, enum: ['Male', 'Female'] },
  civilStatus: { type: String, enum: ['S', 'M', 'D', 'SP', 'W'] },

  age: { type: Number },
  averageMonthlyIncome: { type: Number },
  dependent: { type: String }, // Name of micro-insurance beneficiary

  notes: { type: String },

  stat: { 
    type: String, 
    enum: ['Verified','Rejected', 'Pending'],
    default: 'Pending' // Automatically default to "Pending"
   },

  findings: { 
    type: String, 
    enum: ['Qualified','Not_Qualified', 'Duplicate', 'Suspected_Duplicate'],
    default: null // Optional: explicitly set to null
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Beneficiary || mongoose.model('Beneficiary', BeneficiarySchema);
