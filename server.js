const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017"; 
const client = new MongoClient(uri);
//Establishing asynchronous connection to the database
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

connectToDatabase();

const db = client.db("questionsDB");
const collection = db.collection("questions");
//Here we are setting getting the search query through req.query.q and also its page and we have set the maximum number as 8
app.get("/search", async (req, res) => {
    const query = req.query.q || ""; 
    const type = req.query.type; 
    const page = parseInt(req.query.page) || 1; 
    const resultsPerPage = 8; 

    try {
        let searchCriteria = { title: { $regex: `^${query}`, $options: "i" } };

        if (type) {
            searchCriteria.type = type;
        }

        const skip = (page - 1) * resultsPerPage;

        const results = await collection
            .find(searchCriteria)
            .skip(skip)
            .limit(resultsPerPage)
            .toArray();

        const totalResults = await collection.countDocuments(searchCriteria);

        res.json({
            results,
            totalResults,
            totalPages: Math.ceil(totalResults / resultsPerPage),
            currentPage: page,
        });
    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).send("Error fetching questions");
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
