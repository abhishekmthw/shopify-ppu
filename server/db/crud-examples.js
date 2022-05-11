import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  BatchWriteCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import ddb from "./ddb";

// get item by key
const getProduct = async ({ store, product }) => {
  const params = {
    TableName: "ddbcrud",
    Key: {
      pk: `STORE#${store}`,
      sk: `PRODUCT#${product}`,
    },
  };

  try {
    const data = await ddb.send(new GetCommand(params));
    if (data.Item) {
      return {
        status: 200,
        store,
        product,
        item: data.Item,
      };
    } else {
      return {
        status: 400,
        store,
        product,
        errorDetails: "item not found",
      };
    }
  } catch (error) {
    return {
      status: 500,
      store,
      product,
      errorDetails: "try catch error",
      error,
    };
  }
};

// create item / replace if it already exists
const putProduct = async ({ store, product, ...productDetails }) => {
  const params = {
    TableName: "ddbcrud",
    Item: {
      pk: `STORE#${store}`,
      sk: `PRODUCT#${product}`,
      ...productDetails,
    },
  };

  try {
    const data = await ddb.send(new PutCommand(params));
    return {
      status: 200,
      store,
      product,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      store,
      product,
      errorDetails: "try catch error",
      error,
    };
  }
};

// create item / update if it already exists
const updateProduct = async ({ store, product, color, tag }) => {
  const params = {
    TableName: "ddbcrud",
    Key: {
      pk: `STORE#${store}`,
      sk: `PRODUCT#${product}`,
    },
    UpdateExpression: "set color = :c, tag = :t",
    ExpressionAttributeValues: {
      ":c": color,
      ":t": tag,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = await ddb.send(new UpdateCommand(params));
    return {
      status: 200,
      store,
      product,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      store,
      product,
      errorDetails: "try catch error",
      error,
    };
  }
};

// delete item
const deleteProduct = async ({ store, product }) => {
  const params = {
    TableName: "ddbcrud",
    Key: {
      pk: `STORE#${store}`,
      sk: `PRODUCT#${product}`,
    },
  };

  try {
    const data = await ddb.send(new DeleteCommand(params));
    return {
      status: 200,
      store,
      product,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      store,
      product,
      errorDetails: "try catch error",
      error,
    };
  }
};

// query by key
const getProductsByStore = async ({ store }) => {
  const params = {
    TableName: "ddbcrud",
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": `STORE#${store}`,
      ":sk": `PRODUCT#`,
    },
  };

  try {
    const data = await ddb.send(new QueryCommand(params));
    return {
      status: 200,
      store,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      store,
      errorDetails: "try catch error",
      error,
    };
  }
};

// batch create / replace items
const addProducts = async (products) => {
  const MAX_WRITE = 25;
  try {
    const segments = products.reduce(
      (acc, _, i) =>
        i % MAX_WRITE ? acc : [...acc, products.slice(i, i + MAX_WRITE)],
      []
    );
    const commands = [];
    for (const segment of segments) {
      const requests = [];
      for (const { store, product, ...productDetails } of segment) {
        requests.push({
          PutRequest: {
            Item: {
              pk: `STORE#${store}`,
              sk: `PRODUCT#${product}`,
              ...productDetails,
            },
          },
        });
      }
      const params = {
        RequestItems: {
          ["ddbcrud"]: requests,
        },
      };

      commands.push(ddb.send(new BatchWriteCommand(params)));
    }
    const data = await Promise.all(commands);
    return {
      status: 200,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      errorDetails: "try catch error",
      error,
    };
  }
};

// batch get items
const getProducts = async (products) => {
  const MAX_READ = 100;
  try {
    const segments = products.reduce(
      (acc, _, i) =>
        i % MAX_READ ? acc : [...acc, products.slice(i, i + MAX_READ)],
      []
    );
    const commands = [];
    for (const segment of segments) {
      const keys = [];
      for (const { store, product } of segment) {
        keys.push({
          pk: `STORE#${store}`,
          sk: `PRODUCT#${product}`,
        });
      }
      const params = {
        RequestItems: {
          ["ddbcrud"]: {
            Keys: keys,
            ProjectionExpression: "pk, sk, color",
          },
        },
      };

      commands.push(ddb.send(new BatchGetCommand(params)));
    }
    const data = await Promise.all(commands);
    return {
      status: 200,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      errorDetails: "try catch error",
      error,
    };
  }
};

// batch delete items
const deleteProducts = async (products) => {
  const MAX_WRITE = 25;
  try {
    const segments = products.reduce(
      (acc, _, i) =>
        i % MAX_WRITE ? acc : [...acc, products.slice(i, i + MAX_WRITE)],
      []
    );
    const commands = [];
    for (const segment of segments) {
      const requests = [];
      for (const { store, product } of segment) {
        requests.push({
          DeleteRequest: {
            Key: {
              pk: `STORE#${store}`,
              sk: `PRODUCT#${product}`,
            },
          },
        });
      }
      const params = {
        RequestItems: {
          ["ddbcrud"]: requests,
        },
      };

      commands.push(ddb.send(new BatchWriteCommand(params)));
    }
    const data = await Promise.all(commands);
    return {
      status: 200,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      errorDetails: "try catch error",
      error,
    };
  }
};

// bulk update items
const updateProducts = async (products) => {
  try {
    const commands = [];
    for (const { store, product, color } of products) {
      const params = {
        TableName: "ddbcrud",
        Key: {
          pk: `STORE#${store}`,
          sk: `PRODUCT#${product}`,
        },
        UpdateExpression: "set color = :c",
        ExpressionAttributeValues: {
          ":c": color,
        },
        ReturnValues: "ALL_NEW",
      };
      commands.push(ddb.send(new UpdateCommand(params)));
    }
    const data = await Promise.all(commands);
    return {
      status: 200,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      errorDetails: "try catch error",
      error,
    };
  }
};

// query with pagination
const getProductsByStorePaginated = async ({ store, limit, startKey }) => {
  if (!startKey) startKey = null;
  const params = {
    TableName: "ddbcrud",
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": `STORE#${store}`,
      ":sk": `PRODUCT#`,
    },
    Limit: limit,
    ExclusiveStartKey: startKey,
  };

  try {
    const data = await ddb.send(new QueryCommand(params));
    return {
      status: 200,
      store,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      store,
      errorDetails: "try catch error",
      error,
    };
  }
};

export {
  getProduct,
  putProduct,
  updateProduct,
  deleteProduct,
  getProductsByStore,
  addProducts,
  getProducts,
  deleteProducts,
  updateProducts,
  getProductsByStorePaginated,
};
