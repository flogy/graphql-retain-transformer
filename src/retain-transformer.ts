import {
  InvalidDirectiveError,
  TransformerPluginBase,
} from "@aws-amplify/graphql-transformer-core";
import { DirectiveNode, ObjectTypeDefinitionNode } from "graphql";
import { ModelResourceIDs } from "graphql-transformer-common";
import {
  TransformerContextProvider,
  TransformerSchemaVisitStepContextProvider,
  TransformerPluginProvider,
} from "@aws-amplify/graphql-transformer-interfaces";
import { Table, CfnTable } from "@aws-cdk/aws-dynamodb";
import { DynamoDbDataSource } from "@aws-cdk/aws-appsync";
import { IConstruct, CfnDeletionPolicy } from "@aws-cdk/core";

export class RetainTransformer extends TransformerPluginBase {
  private readonly retainObjects: Map<
    ObjectTypeDefinitionNode,
    string
  > = new Map();

  constructor() {
    super("RetainTransformer", "directive @retain on OBJECT");
  }

  public object = (
    definition: ObjectTypeDefinitionNode,
    directive: DirectiveNode,
    acc: TransformerSchemaVisitStepContextProvider
  ) => {
    this.validateObject(definition);

    const tableName = ModelResourceIDs.ModelTableResourceID(
      definition.name.value
    );
    this.retainObjects.set(definition, tableName);
  };

  public generateResolvers = (context: TransformerContextProvider): void => {
    this.retainObjects.forEach((fieldName, directive) => {
      const ddbTable = this.getTable(context, directive) as Table;
      (ddbTable["table"] as CfnTable).cfnOptions.deletionPolicy =
        CfnDeletionPolicy.RETAIN;
    });
  };

  private validateObject = (definition: ObjectTypeDefinitionNode) => {
    const modelDirective = (definition.directives || []).find(
      (directive) => directive.name.value === "model"
    );
    if (!modelDirective) {
      throw new InvalidDirectiveError(
        "Types annotated with @retain must also be annotated with @model."
      );
    }
  };

  private getTable = (
    context: TransformerContextProvider,
    definition: ObjectTypeDefinitionNode
  ): IConstruct => {
    const ddbDataSource = context.dataSources.get(
      definition
    ) as DynamoDbDataSource;
    const tableName = ModelResourceIDs.ModelTableResourceID(
      definition.name.value
    );
    const table = ddbDataSource.ds.stack.node.findChild(tableName);
    return table;
  };
}
