import {
  type KyselyPlugin,
  type PluginTransformQueryArgs,
  type PluginTransformResultArgs,
  type QueryResult,
  type RootOperationNode,
  type UnknownRow,
  type UpdateQueryNode,
} from 'kysely';

export class RequireWhereOnUpdatePlugin implements KyselyPlugin {
  transformResult (
    args: PluginTransformResultArgs,
  ): Promise<QueryResult<UnknownRow>> {
    return Promise.resolve(args.result);
  }

  transformQuery (args: PluginTransformQueryArgs): RootOperationNode {
    const { node } = args;

    if (node.kind === 'UpdateQueryNode') {
      const updateNode = node as UpdateQueryNode;

      if (!updateNode.where) {
        throw new Error(
          'Unsafe UPDATE detected: all UPDATE queries must have a WHERE clause.',
        );
      }
    }

    return node;
  }
}
