/**
 * @fileoverview gRPC-Web generated client stub for uploader
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.uploader = require('./youtube-uploader_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.uploader.YouTubeFileUploaderClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.uploader.YouTubeFileUploaderPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!proto.uploader.YouTubeFileUploaderClient} The delegate callback based client
   */
  this.delegateClient_ = new proto.uploader.YouTubeFileUploaderClient(
      hostname, credentials, options);

};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.uploader.UploadFileData,
 *   !proto.uploader.UploadReply>}
 */
const methodInfo_YouTubeFileUploader_requestUpload = new grpc.web.AbstractClientBase.MethodInfo(
  proto.uploader.UploadReply,
  /** @param {!proto.uploader.UploadFileData} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.uploader.UploadReply.deserializeBinary
);


/**
 * @param {!proto.uploader.UploadFileData} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.uploader.UploadReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.uploader.UploadReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.uploader.YouTubeFileUploaderClient.prototype.requestUpload =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/uploader.YouTubeFileUploader/requestUpload',
      request,
      metadata,
      methodInfo_YouTubeFileUploader_requestUpload,
      callback);
};


/**
 * @param {!proto.uploader.UploadFileData} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.uploader.UploadReply>}
 *     The XHR Node Readable Stream
 */
proto.uploader.YouTubeFileUploaderPromiseClient.prototype.requestUpload =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.requestUpload(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.uploader.ClientRequest,
 *   !proto.uploader.FileList>}
 */
const methodInfo_YouTubeFileUploader_requestFileList = new grpc.web.AbstractClientBase.MethodInfo(
  proto.uploader.FileList,
  /** @param {!proto.uploader.ClientRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.uploader.FileList.deserializeBinary
);


/**
 * @param {!proto.uploader.ClientRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.uploader.FileList)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.uploader.FileList>|undefined}
 *     The XHR Node Readable Stream
 */
proto.uploader.YouTubeFileUploaderClient.prototype.requestFileList =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/uploader.YouTubeFileUploader/requestFileList',
      request,
      metadata,
      methodInfo_YouTubeFileUploader_requestFileList,
      callback);
};


/**
 * @param {!proto.uploader.ClientRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.uploader.FileList>}
 *     The XHR Node Readable Stream
 */
proto.uploader.YouTubeFileUploaderPromiseClient.prototype.requestFileList =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.requestFileList(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


module.exports = proto.uploader;

