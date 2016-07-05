/**
 * Function interface for transition behavior
 * @param message The message that caused the state transition.
 */
export interface Action {
    (message?: any, instance?: IInstance, history?: boolean): any;
}
/**
 * An enumeration used to dictate the behavior of instances of the [[PseudoState]] class.
 *
 * Use these constants as the `kind` parameter when creating new [[PseudoState]] instances to define their behavior (see the description of each member).
 */
export declare enum PseudoStateKind {
    /**
     * Enables a dynamic conditional branches; within a compound [[Transition]].
     *
     * All outbound transition guards from a [[Choice]] [[PseudoState]] are evaluated upon entering the [[PseudoState]]:
     * if a single [[Transition]] is found, it will be traversed;
     * if many are found, an arbitary one will be selected and traversed;
     * if none evaluate true, and there is no 'else transition' defined, the machine is deemed illformed and an exception will be thrown.
     */
    Choice = 0,
    /**
     * As per [[ShallowHistory]], but the history semantic cascades through all child regions irrespective of their history semantics.
     */
    DeepHistory = 1,
    /**
     * Defines the [[PseudoState]] that will be the initial staring point when entering its enclosing [[Region]].
     */
    Initial = 2,
    /**
     * Enables a static conditional branches; within a compound [[Transition]].
     * All outbound transition guards from a [[Junction]] [[PseudoState]] are evaluated upon entering the [[PseudoState]]:
     * if a single [[Transition]] is found, it will be traversed;
     * if many or none evaluate true, and there is no 'else transition' defined, the machine is deemed illformed and an exception will be thrown.
     */
    Junction = 3,
    /**
     * Ensures that re-entry of the enclosing [[Region]] will start at the last known active state configuration.
     *
     */
    ShallowHistory = 4,
    /**
     * Entering a terminate [[PseudoState]] implies that the execution of [[StateMachine]] is terminated and will not respond to any more messages.
     */
    Terminate = 5,
}
/**
 * An enumeration of that dictates the precise behavior of a [[Transition]] instance.
 *
 * Use these constants as the `kind` parameter when creating new [[Transition]] instances to define their behavior (see the description of each member).
 * @note Within the [[Transition]] constructor the `kind` parameter will be validated and adjusted as necessary.
 */
export declare enum TransitionKind {
    /**
     * The [[Transition]], if triggered, will exit the source [[Vertex]] and enter the target [[Vertex]] irrespective of the proximity of source and terget in terms of their enclosing [[Region]].
     */
    External = 0,
    /**
     * The [[Transition]], if triggered, occurs without exiting or entering the source [[State]];
     * it does not cause a state therefore no [[State]] exit or entry [[Action]]s will be invoked, only [[Transition]] [[Action]]s.
     */
    Internal = 1,
    /**
     * The [[Transition]], if triggered, will not exit the source [[State]] as the terget [[Vertex]] is a child of the source [[State]]. No exit [[Action]]s are invoked from the source [[State]], but [[Transition]] and entry [[Action]]s will be invoked as required.
     */
    Local = 2,
}
/**
 * Interface for the state machine instance; an object used as each instance of a state machine (as the classes in this library describe a state machine model). The contents of objects that implement this interface represents the Ac
 */
export interface IInstance {
    /**
     * Indicates that the state machine instance has reached a terminate pseudo state and therfore will no longer evaluate messages.
     */
    isTerminated: boolean;
    /**
     * Updates the last known state for a given region.
     * @param {Region} region The region to update the last known state for.
     * @param {State} state The last known state for the given region.
     */
    setCurrent(region: Region, state: State): void;
    /**
     * Returns the last known state for a given region.
     * @param {Region} region The region to update the last known state for.
     */
    getCurrent(region: Region): State;
}
/**
 * An abstract class used as the base for the Region and Vertex classes.
 * An element is a node within the tree structure that represents a composite state machine model.
 */
export declare abstract class Element {
    /**
     * The symbol used to separate element names within a fully qualified name.
     * Change this static member to create different styles of qualified name generated by the toString method.
     */
    static namespaceSeparator: string;
    /**
     * The name of the element.
     */
    name: string;
    /**
     * The fully qualified name of the element.
     */
    qualifiedName: string;
    /**
     * Creates a new instance of the element class.
     * @param {string} name The name of the element.
     */
    constructor(name: string, parent: Element);
    /**
     * Returns a the element name as a fully qualified namespace.
     * @returns The fully qualified name of the element.
     */
    toString(): string;
}
/**
 * An element within a state machine model that is a container of Vertices.
 *
 * Regions are implicitly inserted into composite state machines as a container for vertices.
 * They only need to be explicitly defined if orthogonal states are required.
 *
 * Region extends the Element class and inherits its public interface.
 */
export declare class Region extends Element {
    /**
     * The name given to regions that are are created automatically when a state is passed as a vertex's parent.
     * Regions are automatically inserted into state machine models as the composite structure is built; they are named using this static member.
     * Update this static member to use a different name for default regions.
     */
    static defaultName: string;
    /**
     * The parent state of this region.
     */
    state: State;
    /**
     * The set of vertices that are children of the region.
     */
    vertices: Vertex[];
    /**
     * Creates a new instance of the Region class.
     * @param {string} name The name of the region.
     * @param {State} state The parent state that this region will be a child of.
     */
    constructor(name: string, state: State);
    /**
     * Removes the state from the state machine model
     */
    remove(): void;
    /**
     * Returns the root element within the state machine model.
     */
    getRoot(): StateMachine;
    /**
     * Accepts an instance of a visitor and calls the visitRegion method on it.
     * @param {Visitor<TArg1>} visitor The visitor instance.
     * @param {TArg1} arg1 An optional argument to pass into the visitor.
     * @param {any} arg2 An optional argument to pass into the visitor.
     * @param {any} arg3 An optional argument to pass into the visitor.
     */
    accept<TArg1>(visitor: Visitor<TArg1>, arg1?: TArg1, arg2?: any, arg3?: any): any;
}
/**
 * An abstract element within a state machine model that can be the source or target of a transition (states and pseudo states).
 *
 * Vertex extends the Element class and inherits its public interface.
 */
export declare abstract class Vertex extends Element {
    private static parent(parent);
    /**
     * The parent region of this vertex.
     */
    region: Region;
    /**
     * The set of transitions originating from this vertex.
     */
    outgoing: Transition[];
    /**
     * The set of transitions targeting this vertex.
     */
    incoming: Transition[];
    /**
     * Creates a new instance of the Vertex class.
     * @param {string} name The name of the vertex.
     * @param {Region | State} parent The parent region or state.
     */
    constructor(name: string, parent: Region | State);
    /**
     * Returns the ancestry of a Vertex, form the root state machine to this vertex.
     */
    ancestry(): Array<Vertex>;
    /**
     * Returns the root element within the state machine model.
     */
    getRoot(): StateMachine;
    /**
     * Removes the vertex from the state machine model
     */
    remove(): void;
    /**
     * Creates a new transition from this vertex.
     * Newly created transitions are completion transitions; they will be evaluated after a vertex has been entered if it is deemed to be complete.
     * Transitions can be converted to be event triggered by adding a guard condition via the transitions `where` method.
     * @param {Vertex} target The destination of the transition; omit for internal transitions.
     * @param {TransitionKind} kind The kind the transition; use this to set Local or External (the default if omitted) transition semantics.
     */
    to(target?: Vertex, kind?: TransitionKind): Transition;
    /**
     * Accepts an instance of a visitor.
     * @param {Visitor<TArg>} visitor The visitor instance.
     * @param {TArg} arg An optional argument to pass into the visitor.
     */
    abstract accept<TArg1>(visitor: Visitor<TArg1>, arg1?: TArg1, arg2?: any, arg3?: any): any;
}
/**
 * An element within a state machine model that represents an transitory Vertex within the state machine model.
 *
 * Pseudo states are required in all state machine models; at the very least, an `Initial` pseudo state is the default stating state when the parent region is entered.
 * Other types of pseudo state are available; typically for defining history semantics or to facilitate more complex transitions.
 * A `Terminate` pseudo state kind is also available to immediately terminate processing within the entire state machine instance.
 *
 * PseudoState extends the Vertex class and inherits its public interface.
 */
export declare class PseudoState extends Vertex {
    /**
     * The kind of the pseudo state which determines its use and behavior.
     */
    kind: PseudoStateKind;
    /**
     * Creates a new instance of the PseudoState class.
     * @param {string} name The name of the pseudo state.
     * @param {Region | State} parent The parent element that this pseudo state will be a child of.
     * @param {PseudoStateKind} kind Determines the behavior of the PseudoState.
     */
    constructor(name: string, parent: Region | State, kind?: PseudoStateKind);
    /**
     * Tests a pseudo state to determine if it is a history pseudo state.
     * History pseudo states are of kind: Initial, ShallowHisory, or DeepHistory.
     */
    isHistory(): boolean;
    /**
     * Tests a pseudo state to determine if it is an initial pseudo state.
     * Initial pseudo states are of kind: Initial, ShallowHisory, or DeepHistory.
     */
    isInitial(): boolean;
    /**
     * Accepts an instance of a visitor and calls the visitPseudoState method on it.
     * @param {Visitor<TArg1>} visitor The visitor instance.
     * @param {TArg1} arg1 An optional argument to pass into the visitor.
     * @param {any} arg2 An optional argument to pass into the visitor.
     * @param {any} arg3 An optional argument to pass into the visitor.
     */
    accept<TArg1>(visitor: Visitor<TArg1>, arg1?: TArg1, arg2?: any, arg3?: any): any;
}
/**
 * An element within a state machine model that represents an invariant condition within the life of the state machine instance.
 *
 * States are one of the fundamental building blocks of the state machine model.
 * Behavior can be defined for both state entry and state exit.
 *
 * State extends the Vertex class and inherits its public interface.
 */
export declare class State extends Vertex {
    exitBehavior: Action[];
    entryBehavior: Action[];
    /**
     * The set of regions under this state.
     */
    regions: Region[];
    /**
     * Creates a new instance of the State class.
     * @param {string} name The name of the state.
     * @param {Region | State} parent The parent state that owns the state.
     */
    constructor(name: string, parent: Region | State);
    /**
     * Returns the default region for the state.
     * Note, this will create the default region if it does not already exist.
     */
    defaultRegion(): Region;
    /**
     * Tests the state to see if it is a final state;
     * a final state is one that has no outbound transitions.
     */
    isFinal(): boolean;
    /**
     * Tests the state to see if it is a simple state;
     * a simple state is one that has no child regions.
     */
    isSimple(): boolean;
    /**
     * Tests the state to see if it is a composite state;
     * a composite state is one that has one or more child regions.
     */
    isComposite(): boolean;
    /**
     * Tests the state to see if it is an orthogonal state;
     * an orthogonal state is one that has two or more child regions.
     */
    isOrthogonal(): boolean;
    /**
     * Removes the state from the state machine model
     */
    remove(): void;
    /**
     * Adds behavior to a state that is executed each time the state is exited.
     * @param {Action} exitAction The action to add to the state's exit behavior.
     */
    exit(exitAction: Action): this;
    /**
     * Adds behavior to a state that is executed each time the state is entered.
     * @param {Action} entryAction The action to add to the state's entry behavior.
     */
    entry(entryAction: Action): this;
    /**
     * Accepts an instance of a visitor and calls the visitState method on it.
     * @param {Visitor<TArg1>} visitor The visitor instance.
     * @param {TArg1} arg1 An optional argument to pass into the visitor.
     * @param {any} arg2 An optional argument to pass into the visitor.
     * @param {any} arg3 An optional argument to pass into the visitor.
     */
    accept<TArg1>(visitor: Visitor<TArg1>, arg1?: TArg1, arg2?: any, arg3?: any): any;
}
/**
 * An element within a state machine model that represents completion of the life of the containing Region within the state machine instance.
 *
 * A final state cannot have outbound transitions.
 *
 * FinalState extends the State class and inherits its public interface.
 */
export declare class FinalState extends State {
    /**
     * Creates a new instance of the FinalState class.
     * @param {string} name The name of the final state.
     * @param {Region | State} parent The parent element that owns the final state.
     */
    constructor(name: string, parent: Region | State);
    /**
     * Accepts an instance of a visitor and calls the visitFinalState method on it.
     * @param {Visitor<TArg>} visitor The visitor instance.
     * @param {TArg} arg An optional argument to pass into the visitor.
     */
    accept<TArg1>(visitor: Visitor<TArg1>, arg1?: TArg1, arg2?: any, arg3?: any): any;
}
/**
 * An element within a state machine model that represents the root of the state machine model.
 *
 * StateMachine extends the State class and inherits its public interface.
 */
export declare class StateMachine extends State {
    clean: boolean;
    onInitialise: Array<Action>;
    /**
     * Creates a new instance of the StateMachine class.
     * @param {string} name The name of the state machine.
     */
    constructor(name: string);
    /**
     * Returns the root element within the state machine model.
     * Note that if this state machine is embeded within another state machine, the ultimate root element will be returned.
     */
    getRoot(): StateMachine;
    /**
     * Accepts an instance of a visitor and calls the visitStateMachine method on it.
     * @param {Visitor<TArg1>} visitor The visitor instance.
     * @param {TArg1} arg1 An optional argument to pass into the visitor.
     * @param {any} arg2 An optional argument to pass into the visitor.
     * @param {any} arg3 An optional argument to pass into the visitor.
     */
    accept<TArg1>(visitor: Visitor<TArg1>, arg1?: TArg1, arg2?: any, arg3?: any): any;
}
/**
 * A transition between vertices (states or pseudo states) that may be traversed in response to a message.
 *
 * Transitions come in a variety of types:
 * internal transitions respond to messages but do not cause a state transition, they only have behavior;
 * local transitions are contained within a single region therefore the source vertex is exited, the transition traversed, and the target state entered;
 * external transitions are more complex in nature as they cross region boundaries, all elements up to but not not including the common ancestor are exited and entered.
 *
 * Entering a composite state will cause the entry of the child regions within the composite state; this in turn may trigger more transitions.
 */
export declare class Transition {
    static TrueGuard: () => boolean;
    static FalseGuard: () => boolean;
    guard: (message?: any, instance?: IInstance) => boolean;
    transitionBehavior: Action[];
    onTraverse: Array<Action>;
    /**
     * The source of the transition.
     */
    source: Vertex;
    /**
     * The target of the transition.
     */
    target: Vertex;
    /**
     * The kind of the transition which determines its behavior.
     */
    kind: TransitionKind;
    /**
     * Creates a new instance of the Transition class.
     * @param {Vertex} source The source of the transition.
     * @param {Vertex} source The target of the transition; this is an optional parameter, omitting it will create an Internal transition.
     * @param {TransitionKind} kind The kind the transition; use this to set Local or External (the default if omitted) transition semantics.
     */
    constructor(source: Vertex, target?: Vertex, kind?: TransitionKind);
    /**
     * Turns a transition into an else transition.
     *
     * Else transitions can be used at `Junction` or `Choice` pseudo states if no other transition guards evaluate true, an Else transition if present will be traversed.
     */
    else(): this;
    /**
     * Defines the guard condition for the transition.
     * @param {Guard} guard The guard condition that must evaluate true for the transition to be traversed.
     */
    when(guard: (message?: any, instance?: IInstance) => boolean): this;
    /**
     * Add behavior to a transition.
     * @param {Action} transitionAction The action to add to the transitions traversal behavior.
     */
    effect(transitionAction: Action): this;
    /**
     * Removes the transition from the state machine model
     */
    remove(): void;
    /**
     * Accepts an instance of a visitor and calls the visitTransition method on it.
     * @param {Visitor<TArg1>} visitor The visitor instance.
     * @param {TArg1} arg1 An optional argument to pass into the visitor.
     * @param {any} arg2 An optional argument to pass into the visitor.
     * @param {any} arg3 An optional argument to pass into the visitor.
     */
    accept<TArg1>(visitor: Visitor<TArg1>, arg1?: TArg1, arg2?: any, arg3?: any): any;
    /**
     * Returns a the transition name.
     */
    toString(): string;
}
/**
 * Default working implementation of a state machine instance class.
 *
 * Implements the `IInstance` interface.
 * It is possible to create other custom instance classes to manage state machine state in other ways (e.g. as serialisable JSON); just implement the same members and methods as this class.
 */
export declare class StateMachineInstance implements IInstance {
    private last;
    /**
     * The name of the state machine instance.
     */
    name: string;
    /**
     * Indicates that the state manchine instance reached was terminated by reaching a Terminate pseudo state.
     */
    isTerminated: boolean;
    /**
     * Creates a new instance of the state machine instance class.
     * @param {string} name The optional name of the state machine instance.
     */
    constructor(name?: string);
    setCurrent(region: Region, state: State): void;
    getCurrent(region: Region): State;
    /**
     * Returns the name of the state machine instance.
     */
    toString(): string;
}
/**
 * Implementation of a visitor pattern.
 */
export declare abstract class Visitor<TArg1> {
    /**
     * Visits an element within a state machine model.
     * @param {Element} element the element being visited.
     * @param {TArg1} arg1 An optional parameter passed into the accept method.
     * @param {any} arg2 An optional parameter passed into the accept method.
     * @param {any} arg3 An optional parameter passed into the accept method.
     */
    visitElement(element: Element, arg1?: TArg1, arg2?: any, arg3?: any): any;
    /**
     * Visits a region within a state machine model.
     * @param {Region} region The region being visited.
     * @param {TArg1} arg1 An optional parameter passed into the accept method.
     * @param {any} arg2 An optional parameter passed into the accept method.
     * @param {any} arg3 An optional parameter passed into the accept method.
     */
    visitRegion(region: Region, arg1?: TArg1, arg2?: any, arg3?: any): any;
    /**
     * Visits a vertex within a state machine model.
     * @param {Vertex} vertex The vertex being visited.
     * @param {TArg1} arg1 An optional parameter passed into the accept method.
     * @param {any} arg2 An optional parameter passed into the accept method.
     * @param {any} arg3 An optional parameter passed into the accept method.
     */
    visitVertex(vertex: Vertex, arg1?: TArg1, arg2?: any, arg3?: any): any;
    /**
     * @param {PseudoState} pseudoState The pseudo state being visited.
     * @param {TArg1} arg1 An optional parameter passed into the accept method.
     * @param {any} arg2 An optional parameter passed into the accept method.
     * @param {any} arg3 An optional parameter passed into the accept method.
     */
    visitPseudoState(pseudoState: PseudoState, arg1?: TArg1, arg2?: any, arg3?: any): any;
    /**
     * Visits a state within a state machine model.
     * @param {State} state The state being visited.
     * @param {TArg1} arg1 An optional parameter passed into the accept method.
     * @param {any} arg2 An optional parameter passed into the accept method.
     * @param {any} arg3 An optional parameter passed into the accept method.
     */
    visitState(state: State, arg1?: TArg1, arg2?: any, arg3?: any): any;
    /**
     * Visits a final state within a state machine model.
     * @param {FinalState} finalState The final state being visited.
     * @param {TArg1} arg1 An optional parameter passed into the accept method.
     * @param {any} arg2 An optional parameter passed into the accept method.
     * @param {any} arg3 An optional parameter passed into the accept method.
     */
    visitFinalState(finalState: FinalState, arg1?: TArg1, arg2?: any, arg3?: any): any;
    /**
     * Visits a state machine within a state machine model.
     * @param {StateMachine} state machine The state machine being visited.
     * @param {TArg1} arg1 An optional parameter passed into the accept method.
     * @param {any} arg2 An optional parameter passed into the accept method.
     * @param {any} arg3 An optional parameter passed into the accept method.
     */
    visitStateMachine(model: StateMachine, arg1?: TArg1, arg2?: any, arg3?: any): any;
    /**
     * Visits a transition within a state machine model.
     * @param {Transition} transition The transition being visited.
     * @param {TArg1} arg1 An optional parameter passed into the accept method.
     * @param {any} arg2 An optional parameter passed into the accept method.
     * @param {any} arg3 An optional parameter passed into the accept method.
     */
    visitTransition(transition: Transition, arg1?: TArg1, arg2?: any, arg3?: any): any;
}
/**
 * The methods that state.js may use from a console implementation. Create objects that ahdere to this interface for custom logging, warnings and error handling.
 */
export interface IConsole {
    /**
     * Outputs a log message.
     * @param {any} message The object to log.
     */
    log(message?: any, ...optionalParams: any[]): void;
    /**
     * Outputs a warnnig warning.
     * @param {any} message The object to log.
     */
    warn(message?: any, ...optionalParams: any[]): void;
    /**
     * Outputs an error message.
     * @param {any} message The object to log.
     */
    error(message?: any, ...optionalParams: any[]): void;
}
/**
 * Determines if a vertex is currently active; that it has been entered but not yet exited.
 * @param {Vertex} vertex The vertex to test.
 * @param {IInstance} instance The instance of the state machine model.
 */
export declare function isActive(vertex: Vertex, instance: IInstance): boolean;
/**
 * Tests an element within a state machine instance to see if its lifecycle is complete.
 * @param {Region | State} element The element to test.
 * @param {IInstance} instance The instance of the state machine model to test for completeness.
 */
export declare function isComplete(element: Region | State, instance: IInstance): boolean;
/**
 * The function used for to generate random numbers; may be overriden for testing purposes.
 */
export declare let random: (max: number) => number;
/**
 * Initialises a state machine and/or state machine model.
 *
 * Passing just the state machine model will initialise the model, passing the model and instance will initialse the instance and if necessary, the model.
 * @param {StateMachine} model The state machine model. If autoInitialiseModel is true (or no instance is specified) and the model has changed, the model will be initialised.
 * @param {IInstance} instance The optional state machine instance to initialise.
 * @param {boolean} autoInitialiseModel Defaulting to true, this will cause the model to be initialised prior to initialising the instance if the model has changed.
 */
export declare function initialise(model: StateMachine, instance?: IInstance, autoInitialiseModel?: boolean): void;
/**
 * Passes a message to a state machine for evaluation; messages trigger state transitions.
 * @param {StateMachine} model The state machine model. If autoInitialiseModel is true (or no instance is specified) and the model has changed, the model will be initialised.
 * @param {IInstance} instance The instance of the state machine model to evaluate the message against.
 * @param {boolean} autoInitialiseModel Defaulting to true, this will cause the model to be initialised prior to initialising the instance if the model has changed.
 */
export declare function evaluate(model: StateMachine, instance: IInstance, message: any, autoInitialiseModel?: boolean): boolean;
/**
 * The object used for log, warning and error messages
 */
export declare let console: IConsole;
/**
 * Flag to trigger internal transitions to trigger completion events for state they are in
 */
export declare let internalTransitionsTriggerCompletion: Boolean;
/**
 * Validates a state machine model for correctness (see the constraints defined within the UML Superstructure specification).
 * @param {StateMachine} model The state machine model to validate.
 */
export declare function validate(model: StateMachine): void;
