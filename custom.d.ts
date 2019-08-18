declare module "react-color";
declare module "rndm";
declare module "scrollmagic";
declare module "quill";
declare module "TweenLite";
declare module "TweenMax";
declare module "quill";

/*
 |--------------------------------------------------------------------------------
 | PeerJS
 |--------------------------------------------------------------------------------
 */

declare class Peer {
  public prototype: any;
  /**
   * The brokering ID of this peer
   */
  public id: string;
  /**
   * A hash of all connections associated with this peer, keyed by the remote peer's ID.
   */
  public connections: any;
  /**
   * false if there is an active connection to the PeerServer.
   */
  public disconnected: boolean;
  /**
   * true if this peer and all of its connections can no longer be used.
   */
  public destroyed: boolean;

  /**
   * A peer can connect to other peers and listen for connections.
   * @param id Other peers can connect to this peer using the provided ID.
   *     If no ID is given, one will be generated by the brokering server.
   * @param options for specifying details about PeerServer
   */
  constructor(id?: string, options?: Peer.PeerJSOption);

  /**
   * A peer can connect to other peers and listen for connections.
   * @param options for specifying details about PeerServer
   */
  constructor(options: Peer.PeerJSOption);

  /**
   *
   * @param id The brokering ID of the remote peer (their peer.id).
   * @param options for specifying details about Peer Connection
   */
  public connect(id: string, options?: Peer.PeerConnectOption): Peer.DataConnection;
  /**
   * Connects to the remote peer specified by id and returns a data connection.
   * @param id The brokering ID of the remote peer (their peer.id).
   * @param stream The caller's media stream
   * @param options Metadata associated with the connection, passed in by whoever initiated the connection.
   */
  public call(id: string, stream: any, options?: Peer.CallOption): Peer.MediaConnection;
  /**
   * Calls the remote peer specified by id and returns a media connection.
   * @param event Event name
   * @param cb Callback Function
   */
  public on(event: string, cb: () => void): void;
  /**
   * Emitted when a connection to the PeerServer is established.
   * @param event Event name
   * @param cb id is the brokering ID of the peer
   */
  public on(event: "open", cb: (id: string) => void): void;
  /**
   * Emitted when a new data connection is established from a remote peer.
   * @param event Event name
   * @param cb Callback Function
   */
  public on(event: "connection", cb: (dataConnection: Peer.DataConnection) => void): void;
  /**
   * Emitted when a remote peer attempts to call you.
   * @param event Event name
   * @param cb Callback Function
   */
  public on(event: "call", cb: (mediaConnection: Peer.MediaConnection) => void): void;
  /**
   * Emitted when the peer is destroyed and can no longer accept or create any new connections.
   * @param event Event name
   * @param cb Callback Function
   */
  public on(event: "close", cb: () => void): void;
  /**
   * Emitted when the peer is disconnected from the signalling server
   * @param event Event name
   * @param cb Callback Function
   */
  public on(event: "disconnected", cb: () => void): void;
  /**
   * Errors on the peer are almost always fatal and will destroy the peer.
   * @param event Event name
   * @param cb Callback Function
   */
  public on(event: "error", cb: (err: any) => void): void;
  /**
   * Remove event listeners.(EventEmitter3)
   * @param {String} event The event we want to remove.
   * @param {Function} fn The listener that we need to find.
   * @param {Boolean} once Only remove once listeners.
   */
  public off(event: string, fn: Function, once?: boolean): void;
  /**
   * Close the connection to the server, leaving all existing data and media connections intact.
   */
  public disconnect(): void;
  /**
   * Attempt to reconnect to the server with the peer's old ID
   */
  public reconnect(): void;
  /**
   * Close the connection to the server and terminate all existing connections.
   */
  public destroy(): void;

  /**
   * Retrieve a data/media connection for this peer.
   * @param peerId
   * @param connectionId
   */
  public getConnection(peerId: string, connectionId: string): Peer.MediaConnection | Peer.DataConnection | null;

  /**
   * Get a list of available peer IDs
   * @param callback
   */
  public listAllPeers(callback: (peerIds: string[]) => void): void;
}

declare namespace Peer {
  interface PeerJSOption {
    key?: string;
    host?: string;
    port?: number;
    path?: string;
    secure?: boolean;
    config?: any;
    debug?: number;
  }

  interface PeerConnectOption {
    label?: string;
    metadata?: any;
    serialization?: string;
    reliable?: boolean;
  }

  interface CallOption {
    metadata?: any;
    sdpTransform?: Function;
  }

  interface AnswerOption {
    sdpTransform?: Function;
  }

  interface DataConnection {
    dataChannel: any;
    label: string;
    metadata: any;
    open: boolean;
    peerConnection: any;
    peer: string;
    reliable: boolean;
    serialization: string;
    type: string;
    bufferSize: number;
    send(data: any): void;
    close(): void;
    on(event: string, cb: () => void): void;
    on(event: "data", cb: (data: any) => void): void;
    on(event: "open", cb: () => void): void;
    on(event: "close", cb: () => void): void;
    on(event: "error", cb: (err: any) => void): void;
    off(event: string, fn: Function, once?: boolean): void;
  }

  interface MediaConnection {
    open: boolean;
    metadata: any;
    peerConnection: any;
    peer: string;
    type: string;
    answer(stream?: any, options?: any): void;
    close(): void;
    on(event: string, cb: () => void): void;
    on(event: "stream", cb: (stream: any) => void): void;
    on(event: "close", cb: () => void): void;
    on(event: "error", cb: (err: any) => void): void;
    off(event: string, fn: Function, once?: boolean): void;
  }

  interface utilSupportsObj {
    audioVideo: boolean;
    data: boolean;
    binary: boolean;
    reliable: boolean;
  }

  interface util {
    browser: string;
    supports: utilSupportsObj;
  }
}
