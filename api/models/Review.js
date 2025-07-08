import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  serviceRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Solicitud',
    required: true,
    unique: true, // One review per service request
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Static method to calculate average rating for a technician
ReviewSchema.statics.calcAverageRatings = async function(technicianId) {
  const stats = await this.aggregate([
    {
      $match: { technician: technicianId }
    },
    {
      $group: {
        _id: '$technician',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await mongoose.model('User').findByIdAndUpdate(technicianId, {
      averageRating: stats[0] ? stats[0].avgRating : 0,
      numReviews: stats[0] ? stats[0].nRating : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call calcAverageRatings after save
ReviewSchema.post('save', async function() {
  await this.constructor.calcAverageRatings(this.technician);
});

// Call calcAverageRatings after remove
ReviewSchema.post('remove', async function() {
  await this.constructor.calcAverageRatings(this.technician);
});

export default mongoose.model('Review', ReviewSchema);