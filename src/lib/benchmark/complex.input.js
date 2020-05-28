import { Schema } from '@devtin/schema-validator'

// defining the schema
export const AddressSchema = new Schema({
  state: {
    type: String,
    default: 'Florida'
  },
  line1: String,
  line2: {
    type: String,
    required: false,
  },
  zip: {
    type: Number,
    required: false
  }
}, {
  name: 'AddressSchema',
  description: 'Some stupid description'
})

export const UserSchema = new Schema({
  name: String,
  birthday: Date,
  // using an already defined schema in another schema's property
  address: {
    type: AddressSchema,
    required: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  phone: {
    home: {
      type: String,
      minlength: 8
    },
    mobile: {
      type: String,
      minlength: 11
    }
  }
})
