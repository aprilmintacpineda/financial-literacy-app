import {
  type DeleteQueryNode,
  type KyselyPlugin,
  type PluginTransformQueryArgs,
  type PluginTransformResultArgs,
  type QueryResult,
  type RootOperationNode,
  type UnknownRow,
} from 'kysely';

export class RequireWhereOnDeletePlugin implements KyselyPlugin {
  transformResult (
    args: PluginTransformResultArgs,
  ): Promise<QueryResult<UnknownRow>> {
    return Promise.resolve(args.result);
  }

  transformQuery (args: PluginTransformQueryArgs): RootOperationNode {
    const { node } = args;

    if (node.kind === 'DeleteQueryNode') {
      const deleteNode = node as DeleteQueryNode;

      if (!deleteNode.where) {
        throw new Error(
          'Unsafe DELETE detected: all DELETE queries must have a WHERE clause.',
        );
      }
    }

    return node;
  }
}
