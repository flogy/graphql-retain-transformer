import {
  Transformer,
  gql,
  TransformerContext,
  InvalidDirectiveError,
} from "graphql-transformer-core";
import { DirectiveNode, ObjectTypeDefinitionNode } from "graphql";
import { ModelResourceIDs } from "graphql-transformer-common";
import { DeletionPolicy } from "cloudform-types";

export class RetainTransformer extends Transformer {
  constructor() {
    super(
      "RetainTransformer",
      gql`
        directive @retain on OBJECT
      `
    );
  }

  public object = (
    definition: ObjectTypeDefinitionNode,
    directive: DirectiveNode,
    ctx: TransformerContext
  ) => {
    this.validateObject(definition);

    const tableName = ModelResourceIDs.ModelTableResourceID(
      definition.name.value
    );
    const table = ctx.getResource(tableName);
    table.DeletionPolicy = DeletionPolicy.Retain;
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
}
