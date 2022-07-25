import { GraphQLTransform } from "@aws-amplify/graphql-transformer-core";
import { ModelTransformer } from "@aws-amplify/graphql-model-transformer";
import { ModelResourceIDs } from "graphql-transformer-common";
import RetainTransformer from "../index";

test("@retain directive can be used on types", () => {
  const schema = `
    type Todo @model @retain {
      id: ID!
      title: String!
      description: String
    }
  `;
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new RetainTransformer()],
  });
  expect(() => transformer.transform(schema)).not.toThrow();
});

test("@retain directive can not be used on fields", () => {
  const schema = `
    type Todo @model {
      id: ID!
      title: String!
      description: String @retain
    }
  `;
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new RetainTransformer()],
  });
  expect(() => transformer.transform(schema)).toThrowError(
    'Directive "retain" may not be used on FIELD_DEFINITION.'
  );
});

test("@retain directive must be used together with @model directive", () => {
  const schema = `
      type Todo @retain {
        id: ID!
        title: String!
        description: String
      }
    `;
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new RetainTransformer()],
  });
  expect(() => transformer.transform(schema)).toThrowError(
    "Types annotated with @retain must also be annotated with @model."
  );
});

const getDeletionPolicyOfSchemaTable = (
  schema: string,
  transformer: GraphQLTransform,
  schemaTypeName: string
) => {
  const tableName = ModelResourceIDs.ModelTableResourceID(schemaTypeName);
  const resources = transformer.transform(schema).stacks[schemaTypeName]
    .Resources;
  if (!resources) {
    throw new Error("Expected to have resources in the stack");
  }
  const table = resources[tableName];
  if (!table) {
    throw new Error(
      `Expected to have a table resource called ${tableName} in the stack`
    );
  }
  return table.DeletionPolicy;
};

test("Generated CloudFormation document contains the DeletionPolicy set to Retain", () => {
  const schema = `
    type Todo @model @retain {
      id: ID!
      title: String!
      description: String
    }
  `;
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new RetainTransformer()],
  });
  expect(getDeletionPolicyOfSchemaTable(schema, transformer, "Todo")).toEqual(
    "Retain"
  );
});
