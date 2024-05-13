import mongoose from "mongoose";

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    runtime: {
        type: Number,
        required: true
    },
    released: {
        type: Date,
        required: true
    },
    poster: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcomicbook.com%2Fmovie%2Fdatabase%2F&psig=AOvVaw1EhRvGf1DVdPwXTDJR1vXD&ust=1711678016116000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJCa8dLvlYUDFQAAAAAdAAAAABAE"
    },
    plot: {
        type: String,
        required: true
    },
    fullplot: {
        type: String,
        required: true
    },
    lastupdated: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: "movie"
    },
    directors: {
        type: [String],
        required: true
    },
    imdb: {
        rating: {
            type: Number,
            required: true
        },
        votes: {
            type: Number,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    },
    cast: {
        type: [String],
        required: true
    },
    countries: {
        type: [String],
        required: true
    },
    genres: {
        type: [String],
        required: true
    },
    tomatoes: {
        viewer: {
            rating: {
                type: Number,
            },
            numReviews: {
                type: Number,
            }
        },
        lastUpdated: {
            type: Date,
        }
    },
    num_mflix_comments: {
        type: Number,
        required: true
    },
    plot_embedding: {
        type: [Number], // Array of floating-point numbers
        default: [] // Default value is an empty array
    },
    subscriptionType: { 
        type: String,
        enum: ['Free','Standard', 'Premium'],
        default: 'Free',
    },
});

export const Movie = mongoose.model("Movie", movieSchema);
