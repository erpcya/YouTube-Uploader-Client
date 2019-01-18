<template>
  <el-table
    :data="tableData.filter(data => !search || data.filename.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column
      label="Title"
      prop="title">
    </el-table-column>
    <el-table-column
      label="Keywords"
      prop="keywords">
    </el-table-column>
    <el-table-column
      label="File Name"
      prop="basename">
    </el-table-column>
    <el-table-column
      label="Updated"
      prop="lastmod">
    </el-table-column>
    <el-table-column
      label="Size"
      prop="size">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="Type to search"/>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="info"
          plain
          @click="loadList(scope.row.filename, true)">Parent</el-button>
        <el-button
          size="mini"
          type="primary"
          plain
          v-show="scope.row.type == 'directory'"
          @click="loadList(scope.row.filename)">Open</el-button>
          <el-button
            size="mini"
            type="success"
            plain
            v-show="scope.row.type != 'directory'"
            @click="handlePublish(scope.$index, scope.row)">Publish</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  var GRPC_HOST = 'http://0.0.0.0:8989';
  export default {
    props: ['tableData'],
    data() {
      return {
        search: ''
      }
    },
    created: function() {
      this.loadList();
    },
    methods: {
      handlePublish(index, row) {
        console.log(index, row);
        const grpc_promise = require('grpc-promise');
        const {UploadFileData, UploadReply} = require('./grpc/protos/youtube-uploader_pb.js');
        const {YouTubeFileUploaderClient, YouTubeFileUploaderPromiseClient} = require('./grpc/protos/youtube-uploader_grpc_web_pb.js');
        var requestService = new YouTubeFileUploaderPromiseClient(GRPC_HOST);
        grpc_promise.promisifyAll(requestService);
        var fileData = new UploadFileData();
        fileData.setFilename(row.filename);
        fileData.setBasename(row.basename);
        fileData.setLastmod(row.lastmod);
        fileData.setSize(row.size);
        fileData.setType(row.type);
        fileData.setMime(row.mime);
        fileData.setTitle(row.title);
        fileData.setDescription(row.description);
        fileData.setKeywords(row.keywords);
        //
        var callList = requestService.requestUpload(fileData)
          .then(res => {
          console.log('Request response = ', res);
          //
        })
        .catch(err => console.error(err));
      },
      loadList(fileName, isParent) {
        console.log("Hola: " + process.env.GRPC_HOST);
        if(fileName) {
          console.log("File Name " + fileName);
          if(isParent) {
            console.log("Before: " + fileName);
            fileName = fileName.substring(0, fileName.lastIndexOf("/"));
            fileName = fileName.substring(0, fileName.lastIndexOf("/"));
            console.log("After: " + fileName);
          }
        }
        const grpc_promise = require('grpc-promise');
        const {ClientRequest, FileList} = require('./grpc/protos/youtube-uploader_pb.js');
        const {YouTubeFileUploaderClient, YouTubeFileUploaderPromiseClient} = require('./grpc/protos/youtube-uploader_grpc_web_pb.js');
        var requestService = new YouTubeFileUploaderPromiseClient(GRPC_HOST);
        grpc_promise.promisifyAll(requestService);
        var request = new ClientRequest();
        request.setClientname("Web App");
        request.setFilename(fileName);
        //
        var callList = requestService.requestFileList(request)
          .then(res => {
          console.log('Client: Simple Message Received = ', res);
          this.setRowValues(res);
        })
        .catch(err => console.error(err));
      },
      setRowValues(receiveList) {
        this.clearArray();
        var i = 0;
        for(i = 0; i < receiveList.getFilelistList().length; i++) {
          if(this.isValidFile(receiveList.getFilelistList()[i].getFilename())
            || receiveList.getFilelistList()[i].getType() == 'directory') {
            this.tableData.push({
              filename: receiveList.getFilelistList()[i].getFilename(),
              basename: receiveList.getFilelistList()[i].getBasename(),
              lastmod: receiveList.getFilelistList()[i].getLastmod(),
              size: receiveList.getFilelistList()[i].getSize(),
              type: receiveList.getFilelistList()[i].getType(),
              mime: receiveList.getFilelistList()[i].getMime(),
              title: (receiveList.getFilelistList()[i].getType() != 'directory'
                  ? receiveList.getFilelistList()[i].getTitle()
                  : 'Directory'),
              description: receiveList.getFilelistList()[i].getDescription(),
              keywords: receiveList.getFilelistList()[i].getKeywords()
            });
          }
        }
      },
      isValidFile(fileName) {
        return fileName.includes(".flv")
          || fileName.includes(".mov")
          || fileName.includes(".mpeg")
          || fileName.includes(".webm")
      },
      clearArray() {
        this.tableData.splice(0, this.tableData.length);
      }
    },
  }
</script>
