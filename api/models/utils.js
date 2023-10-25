import mongoose from 'mongoose'

export const isValidObjectId = (_id) => {
// https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    return mongoose.isValidObjectId(_id)
}