const MongoClient = require("mongodb").MongoClient;
// const uri = "mongodb+srv://admin:Gifted2020@cluster0-gjwrl.mongodb.net/test?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017/gifted";

class BaseDB {
  constructor(dbName, collectionName) {
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.client = new MongoClient(uri, { useNewUrlParser: true });
  }

  async updateOne(filter, update, options) {
    await this.client.connect();
    const collection = this.client
      .db(this.dbName)
      .collection(this.collectionName);
    await collection.updateOne(filter, update, options);
    this.client.close();
  }

  async findOneAndUpdate(filter, update, options) {
    await this.client.connect();
    const collection = this.client
      .db(this.dbName)
      .collection(this.collectionName);
    await collection.findOneAndUpdate(filter, update, options);
    this.client.close();
  }

  async findOne(filter) {
    await this.client.connect();
    const collection = this.client
      .db(this.dbName)
      .collection(this.collectionName);
    const data = await collection.findOne(filter);
    this.client.close();
    return data;
  }
  async deleteOne(filter) {
    await this.client.connect();
    const collection = this.client
      .db(this.dbName)
      .collection(this.collectionName);
    const data = await collection.deleteOne(filter);
    this.client.close();
    return data;
  }

  async insertOne(filter) {
    try {
      await this.client.connect();
      const collection = this.client
        .db(this.dbName)
        .collection(this.collectionName);
      await collection.insertOne(filter);
      this.client.close();
    } catch (e) {
      console.error(e);
    }
  }

  async find(query, projection, sort) {
    await this.client.connect();
    const collection = this.client
      .db(this.dbName)
      .collection(this.collectionName);
    const queryResult = projection
      ? collection.find(query, { projection })
      : collection.find(query);
    this.client.close();
    return sort ? queryResult.sort(sort).toArray() : queryResult.toArray();
  }
}

module.exports = BaseDB;
