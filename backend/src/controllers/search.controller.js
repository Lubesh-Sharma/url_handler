import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { connectDB } from "../db/index.js";
import { OpenAIEmbeddings } from "@langchain/openai";
// import { Movie } from '../models/movies.js';
dotenv.config();
const uri = process.env.MONGODB_URL || "mongodb://localhost:4000";
const client = new MongoClient(uri);

let db;
let collection;

async function connectToDb() {
  try {
    await client.connect();
    db = client.db("opensoft");
    collection = db.collection("movies");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
}

async function autoSearch(query, genres) {
  try {
    // set namespace for search
    const agg = [
      {
        $search: {
          text: {
            query: query,
            path: "title",
            fuzzy: { maxEdits: 2, prefixLength: 2, maxExpansions: 10 },
          },
          highlight: {
            path: "title",
          },
        },
      },
      {
        $project: {
          title: 1,
          _id: 1,
          year: 1,
          poster: 1,
          rated: 1,
          cast: 1,
          imdb: 1,
          directors: 1,
          languages: 1,
          released: 1,
          genres: 1,
          fullplot: 1,
          subscriptionType: 1,
          score: { $meta: "searchScore" },
          // highlight: { $meta: "searchHighlights" },
        },
      },
      {
        $limit: 5,
      },
    ];

   // If genres array is not empty, add $match stage after $search stage
   if (genres.length > 0) {
    agg.push({
      $match: {
        genres: { $in: genres },
      },
    });
  }

    const result = await collection.aggregate(agg).toArray();
    // print results
    return result;
  } catch (error) {
    console.log(error);
  }
}

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  dimensions: 1536,
});

async function findSimilarDocuments(embedding, genres) {
  try {
    // Flatten the embedding array.
    const flattenedEmbedding = [].concat(...embedding);
    // Query for similar documents.
    const agg = [
      {
        $vectorSearch: {
          queryVector: flattenedEmbedding,
          path: "plot_embedding",
          numCandidates: 100,
          limit: 5,
          index: "vector_index",
        },
      },
      {
        $project: {
          title: 1,
          _id: 1,
          year: 1,
          poster: 1,
          rated: 1,
          cast: 1,
          imdb: 1,
          directors: 1,
          languages: 1,
          released: 1,
          genres: 1,
          subscriptionType: 1,
          fullplot: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    // If genres array is not empty, add $match stage after $search stage
    if (genres.length > 0) {
      agg.push({
        $match: {
          genres: { $in: genres },
        },
      });
    }

    const documents = await collection.aggregate(agg).toArray();
    return documents;
  } finally {
    await client.close();
  }
}

async function semanticSearch(query, genres) {
  try {
    const embedding = await embeddings.embedDocuments([query]);
    const documents = await findSimilarDocuments(embedding,genres);
    return documents;
  } catch (err) {
    console.error("Error in semantic search :",err);
  }
}

export const searchMe = async (req, res) => {
  try {
    await connectToDb();
    const arg = req.params.userInput;
    const genres=req.body;
    console.log("arg--> ",arg);
    const autoSearchResult = await autoSearch(arg,genres);
    const semanticSearchResult = await semanticSearch(arg,genres);
    const mergedResult = [...autoSearchResult, ...semanticSearchResult];
    console.log("mergedResult-->",mergedResult);  
    res.status(200).send(mergedResult);
    // res.status(200).send(autoSearchResult);
  } catch (error) {
    console.log(error);
  }
};
