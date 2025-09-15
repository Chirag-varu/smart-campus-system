import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({

  author: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  publisher: {
    type: String,
    required: true,
    trim: true
  },
  publishingYear: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,   // ensures no two books have the same ISBN
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  
}, {
  timestamps: true // adds createdAt & updatedAt automatically
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
