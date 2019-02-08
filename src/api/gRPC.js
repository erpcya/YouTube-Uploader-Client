import Vue from 'vue'

const YouTubeFileUploaderPromiseClient = require('./grpc/protos/youtube-uploader_grpc_web_pb.js')
const { UploadFileData, ClientRequest } = require('./grpc/protos/youtube-uploader_pb.js');

// defines host gRPC
const GRPC_HOST = 'http://Impala:55989'
//const GRPC_HOST = 'http://0.0.0.0:8989';

Vue.prototype.$GRRPC_HOST = GRPC_HOST
Vue.prototype.$RequestService = new YouTubeFileUploaderPromiseClient(GRPC_HOST)
Vue.prototype.$fileData = new UploadFileData();
Vue.prototype.$request = new ClientRequest();
