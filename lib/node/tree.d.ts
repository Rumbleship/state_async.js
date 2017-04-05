/** An abstract base class for any child node within a tree structure. */
export interface IChild {
    /** The parent node of this node. */
    parent: any;
}
/**
 * Returns the ancestry of the [[Node]] from the root [[Node]] to the [[Node]] provided.
 * @param TNode A common type shared by all [[Node]] instances within the tree.
 * @param node The [[Node]] to return the ancestry for.
 */
export declare function Ancestors<TNode extends IChild>(node: TNode): Array<TNode>;
/**
 * Returns the index of the lowest/least common ancestor of a pair of nodes within a Tree.
 * @param TNode A common type shared by all [[Node]] instances within the tree.
 * @param ancestry1 A [[Node]] within the tree.
 * @param ancestry2 A [[Node]] within the tree.
 * @returns The index of the lowest/least common ancestor or -1 if the nodes do not share any ancestry.
 */
export declare function LowestCommonAncestorIndex<TNode extends IChild>(ancestry1: Array<TNode>, ancestry2: Array<TNode>): number;
